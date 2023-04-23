function dateFormat(inputDate, format) {
    //parse the input date
    const date = new Date(inputDate);

    //extract the parts of the date
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();    

    //replace the month
    format = format.replace("MM", month.toString().padStart(2,"0"));        

    //replace the year
    if (format.indexOf("yyyy") > -1) {
        format = format.replace("yyyy", year.toString());
    } else if (format.indexOf("yy") > -1) {
        format = format.replace("yy", year.toString().substr(2,2));
    }

    //replace the day
    format = format.replace("dd", day.toString().padStart(2,"0"));

    return format;
}

function dateSorter(a, b) {
    if (a == null) return 1;
    if (b == null) return -1;

    var a_year = a.substring(a.length - 4);
    var b_year = b.substring(b.length - 4);
    if (a_year != b_year) return a_year - b_year;

    var a_month = a.substring(3, 5);
    var b_month = b.substring(3, 5);
    if (a_month != b_month) return a_month - b_month;

    var a_day = a.substring(0, 2);
    var b_day = b.substring(0, 2);
    if (a_day != b_day) return a_day - b_day;
}