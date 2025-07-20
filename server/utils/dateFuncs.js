
const getToday = () => {

    let now = new Date();
    let todayUtcMidnight = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
    0, 0, 0, 0
    ));
    return todayUtcMidnight;
}



const convertDate=(isoDate)=>{

         const date = new Date(isoDate);
         const day = String(date.getUTCDate()).padStart(2, '0');
         const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
         const year = date.getUTCFullYear();
         const formatted = `${day}/${month}/${year}`;
         return formatted;
}

module.exports = { getToday , convertDate };