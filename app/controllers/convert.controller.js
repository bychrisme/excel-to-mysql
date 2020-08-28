import Excel from 'exceljs';
import { parseDate, getSqlType  } from '../utils/helpers';
import fs from 'fs';
import mysql from 'mysql2'
import dbConfig from "../config/db.config";
import { createTable, insertData, dropTable} from '../utils/query';

// let connection = mysql.createConnection(dbConfig);
let connection = mysql.createConnection(dbConfig);

// convert function
exports.index = (req, res) => {
    const {files} = req;
    const uploads_folder = process.env.UPLOAD_PATH;
    const data = [];
    const table_type = [];
    const array_accept = ["xlsx", "xls"];
    let col_number = 0;

    // there i'm try to create directory where file will be save after uploading
    if (!fs.existsSync(uploads_folder)){
        console.log("create ", uploads_folder, "folder")
        const folders = uploads_folder.split("/")
        let folder_to_create = "";
        console.log(folders)
        for(let i =1; i<folders.length - 1; i++){
            const folder = folders[i];
            if(folder !== "" || folder !== "."){
                folder_to_create = folder_to_create + folder + "/";
            }
            console.log(folder_to_create)
            if (!fs.existsSync(folder_to_create))fs.mkdirSync(folder_to_create);
        }
    }

    if (!files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    const myFile = files.file;
    const current_extension = myFile.name.split('.')[1]
    if (!array_accept.includes(current_extension)) {
        return res.status(500).send({ msg: "file not supported, it must be XLSX or XLS" })
    }
    const filePath = uploads_folder+myFile.name
    myFile.mv(`${uploads_folder}${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ 
                msg: "Error occured",
                error: err
            });
        }
        console.log("file is uploaded correctly !!!")
    });

    let name = myFile.name.split('.')[0];
    let sheet = 0;

    if(req.body.sheet) sheet = req.body.sheet;
    if(req.body.name) name = req.body.name;
    let workbook = new Excel.Workbook();
    console.log("");
    console.log("start reading >>>>>>");
    try{
        workbook.xlsx.readFile(filePath).then(function () {
            let worksheet = workbook.worksheets[sheet];
            worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
                const line = [];
                row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
                    if(rowNumber === 1){
                        line.push(cell.value);
                        table_type.push("int");
                        col_number++;
                    }else{
                        if(colNumber <= col_number){
                            const col_index = colNumber -1;
                            let val = cell.value;
                            const current_type = (typeof cell.value === 'string' ? 'varchar' : typeof cell.value);
                            if(typeof val === 'object') {
                                if(val){
                                    if(val.hyperlink){
                                        val = val.text;
                                    }else{
                                        val = parseDate(val);
                                    }
                                }
                            }
                            line.push(val);
                            table_type[col_index] = getSqlType(table_type[col_index], val);
    
                        }
                    }
                });
                
                data.push(line);
            });
            
            console.log("file was read successfull >>>>>>");

            const query_drop = dropTable(name);
            const query_create = createTable(name, data[0], table_type);
            const query_insert = insertData(name, data);

            console.log("creating table", name, "...");
            /*connection.promise().query(query_drop)
            .then(()=>{
                console.log("table are droped if exist");
                connection.promise().query(query_create);
            })
            .then(()=>{
                console.log("table created ...");
                connection.promise().query(query_insert);
            })
            .then(()=>{
                console.log("data insert on table ...");
            })
            .catch(err => {
                console.log("error =>", err.message)
            });*/
            
            connection.promise().query(query_insert)
            .then(()=>{
                console.log("data insert on table ...");
            })
            .catch(err => {
                console.log("error =>", err.message)
            });
            
            // connection.end();
    
            return res.send({
                message: `you are on the converter url !!!`,
                data_type: table_type,
                data: data,
                count: data.length,
                table_name: name
            });
        });
    } catch(e){
        res.send({
            message: e
        });
    }
};
