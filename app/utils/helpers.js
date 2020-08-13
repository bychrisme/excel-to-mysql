const parseDate = (d) => {
    const date_info = new Date(d);
    let date = new Date(date_info);
    const mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    const fullDate = [date.getFullYear(), mnth, day].join("-");
    const fullHours = [hours, minutes, seconds].join(":");
    const new_date = fullDate +" "+ fullHours;

    return new_date;
}

const parseTwoDigits = (nbr) => {
    return nbr < 10 ? nbr = '0'+nbr : nbr;
}

const getSqlType = (actual_type, value) => {
    let type = "varchar";
    if(typeof value === "string"){
        const isDate = value.split(":");
        if(isDate.length > 1){
            type = "datetime";
        }
    }else if(actual_type === "varchar" && typeof value === "string"){
        type = "varchar";
    }else if(actual_type === "varchar" && typeof value === "number"){
        // (Number.isInteger(value) && actual_type === "int") ? type = "int" : type = "decimal";
        type = "varchar";
    }else if(actual_type === "int" && typeof value === "string"){
        value.toLowerCase === "null" ? type = "int" : type = "varchar";
    }else if(actual_type === "int" && typeof value === "number"){
        (Number.isInteger(value) && actual_type === "int") ? type = "int" : type = "decimal";
        (Number.isInteger(value) && value > 1000000) ? type = "bigint" : type = "int";
    }else if(actual_type === "decimal" && typeof value === "number"){
        type = "decimal";
    }else if(actual_type === "decimal" && typeof value === "string"){
        value.toLowerCase === "null" ? type = "decimal" : type = "varchar";
    }else if(actual_type === "bigint"){
        type = "bigint";
    }else{
        type = "varchar";
    }

    return type;
}

export {
    parseDate,
    parseTwoDigits,
    getSqlType
};