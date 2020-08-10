import Excel from 'exceljs';
import { parseDate } from '../utils/helpers';
// import * as dotenv from 'dotenv';
// dotenv.config();

// convert function
exports.index = (req, res) => {
    const uploads_folder = process.env.UPLOAD_PATH;
    // const file_name = "invoicing_party.xlsx";
    const file_name = "work_orders.xlsx";
    const filePath = uploads_folder+file_name
    const data = [];
    const table_type = [];
    let col_number = 0

    var workbook = new Excel.Workbook();
    try{
        workbook.xlsx.readFile(filePath).then(function () {
            var worksheet = workbook.worksheets[0];
            worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
                const line = [];
                row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
                    if(rowNumber === 1){
                        line.push(cell.value);
                        table_type.push(typeof cell.value);
                        col_number++;
                    }else{
                        if(colNumber <= col_number){
                            const col_index = colNumber -1;
                            let val = cell.value;
                            const current_type = typeof cell.value;
                            if(typeof val === 'object') {
                                if(val) val = parseDate(val);
                            }
                            line.push(val);
                            if(current_type === "string"){
                                table_type[col_index] = current_type;
                            }else if(current_type === "number"){
                                (Number.isInteger(val) && (table_type[col_index] === "int" || table_type[col_index] === "string")) ? table_type[col_index] = "int" : table_type[col_index] = "decimal"; 
                            }else if(current_type === "object"){
                                val ? table_type[col_index] = "datetime" : table_type[col_index] = "string";
                            }
    
                        }
                    }
                });
                // console.log(line)
                // console.log(table_type)
                data.push(line);
            });
    
            res.send({
                message: `you are on the converter url !!!`,
                data_type: table_type,
                data: data,
                count: data.length
            });
        });
    } catch(e){
        res.send({
            message: e
        });
    }
};