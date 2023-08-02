import Excel from 'exceljs';
import { parseDate, getSqlType  } from '../utils/helpers';
import fs from 'fs';
import mysql from 'mysql2'
import dbConfig from "../config/db.config";
import { createTable, insertData, dropTable} from '../utils/query';

// let connection = mysql.createConnection(dbConfig);
let connection = mysql.createConnection(dbConfig);

// convert function
exports.index = async (req, res) => {
    try{
        const {files} = req;
        const uploads_folder = process.env.UPLOAD_PATH;
        const data = [[]];
        const table_type = [];
        const array_accept = ["xlsx", "xls"];
        let col_number = 0;
        let header = []

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
            await workbook.xlsx.readFile(filePath).then(function () {
                let worksheet = workbook.worksheets[sheet];
                let i=0;
                let j=0;
            
                console.log("start reading >>>>>>2");
                data[j]= [];
                worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
                    const line = []; 
                    i++;
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
                    
                    data[j].push(line);
                    if (i==1000) {
                        i=0;
                        j++;
                        data[j]=[];
                    }
                });

                header=data[0][0];


                console.log("table ", name);
                console.log("nombre de boucle ", data.length);
                
                // const taille = data.length;
                // data.forEach((element,index) => {
                //     let timer =   setTimeout(function(){
                //         console.log(index);
                //         if (index>0) {
                //             element = [...[header], ...element];
                //         }
                //         const query_insert = insertData(name, element);

                //         // console.log("query =>", query_insert)
                        
                //                 connection.promise().query(query_insert)
                //                 .then(()=>{

                //                     console.log("data insert on table ...");
                //                     clearTimeout(timer);
                //                     console.log("timout cleared after data insert on table ...");

                //                 })
                //                 .catch(err => {
                //                     console.log("error =>", err.message);
                //                     arrError.push(err.message)
                //                 }); 

                //                 if(index === taille - 1){
                //                     console.log("--- All data insert successfully");
                //                     // if(arrError.length > 0){
                //                     //     return res.status(500).send({ 
                //                     //         msg: "Error occured",
                //                     //         error: arrError
                //                     //     });
                //                     // }
                            
                //                     // return res.send({
                //                     //     message: `you are on the converter url !!!`,
                //                     //     data_type: table_type,
                //                     //     data: data,
                //                     //     count: data.length,
                //                     //     table_name: name
                //                     // });
                //                 }
                //     },index * 5000)
                // });

                // if(arrError.length > 0){
                //     return res.status(500).send({ 
                //         msg: "Error occured",
                //         error: arrError
                //     });
                // }else{
                //     console.log("---");
                // }

                // connection.end();

                
            });

            const taille = data.length;
            const arrError = []

            const someAsyncOperation = (element, index) => {
                if (index>0) {
                    element = [...[header], ...element];
                }
                const query_insert = insertData(name, element);
                
                connection.promise().query(query_insert)
                .then(()=>{

                    console.log("data insert on table ...");
                    console.log("timout cleared after data insert on table ...");

                    if(index === taille - 1){
                        console.log("--- All data insert successfully");
                    }

                })
                .catch(err => {
                    console.log("error =>", err.message);
                    arrError.push(err.message)
                }); 
            }


            const doWhileAsync = async () => {
                let index = 0;
                
                do {
                    console.log("---", arrError);
                    await someAsyncOperation(data[index],index);
                    index++;
                } while (index < taille);
            };

            await doWhileAsync();
            
            
            console.log("---", arrError);
            return res.send({
                message: `you are on the converter url !!!`,
                data_type: table_type,
                data: data,
                count: data.length,
                table_name: name,
                error: arrError
            });

        } catch(e){
            console.log("error catch :", e)
            res.status(500).send({
                error2: e
            });
        }
    }catch(e){
        res.status(500).send({
            error: e
        });
    }
};