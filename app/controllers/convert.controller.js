import Excel from 'exceljs';
import { ExcelDateToJsDate } from '../utils/helpers';
// import * as dotenv from 'dotenv';
// dotenv.config();

// convert function
exports.index = (req, res) => {
    const uploads_folder = process.env.UPLOAD_PATH;
    const file_name = "invoicing_party.xlsx";
    const filePath = uploads_folder+file_name

    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(filePath).then(function () {
    var worksheet = workbook.worksheets[0];
        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            console.log("Current Row:" + rowNumber);
            row.eachCell({ includeEmpty: false }, function (cell) {
                console.log("Cell Value = " + cell.value, typeof cell.value);
            });
        });
    });

    res.send({
        message: `you are on the converter url !!!`
    });
};