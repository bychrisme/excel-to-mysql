const dropTable = (table_name) => {
    return `
        DROP TABLE IF EXISTS ${table_name};
    `;
}

const createTable = (table_name, attribute, type) => {
    let parameters = "";
    const nbr = type.length - 1;
    attribute.forEach((element, i) => {
        let value = "";
        let comma = "";
        if(type[i] === "varchar") value = "(255)";
        if(type[i] === "int") value = "(11)";
        if(i < nbr) comma = ", ";
        parameters = parameters + element + " " + type[i].toUpperCase() + " "+ value + comma;
    });
    return `
        CREATE TABLE ${table_name} (${parameters});
    `;
}

const insertData = (table_name, data) => {
    const array_columm = data[0];
    data.shift();
    let columm = "";
    let values = "";
    const nbr_columm = array_columm.length - 1;
    const nbr_values= data.length - 1;
    array_columm.forEach((element, i) => {
        let comma = "";
        if(i < nbr_columm) comma = ", ";
        columm = columm + element + comma;
    });
    data.forEach((element, i) => {
        let commaData = "";
        let one_value = ""
        const nbr = element.length - 1;
        element.forEach((elt, index) => {
            let commaValue = "";
            if(index < nbr) commaValue = ", ";
            if(typeof elt === "string" && elt.toLowerCase() !== "null") elt = `"${elt}"`
            one_value = one_value + elt + commaValue;
        })
        if(i < nbr_values) commaData = ", ";
        values = values + '('+one_value+')' + commaData;

    });
    return `
        INSERT INTO ${table_name} (${columm}) VALUES ${values};
    `;
}

export {
    createTable,
    insertData,
    dropTable
}