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

export {
    parseDate,
    parseTwoDigits
};