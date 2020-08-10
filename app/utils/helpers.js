const parseDate = (date_info) => {
 
    return `${date_info.getFullYear()}-${parseTwoDigits(date_info.getMonth())}-${parseTwoDigits(date_info.getMonth())} ${parseTwoDigits(date_info.getHours())}:${parseTwoDigits(date_info.getMinutes())}:${parseTwoDigits(date_info.getSeconds())}`;
}

const parseTwoDigits = (nbr) => {
    return nbr < 10 ? nbr = '0'+nbr : nbr;
}

export {
    parseDate,
    parseTwoDigits
};