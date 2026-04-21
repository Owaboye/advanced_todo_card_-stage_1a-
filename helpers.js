 export function getTimeRemaining(duedate){
        const currentDate = new Date();
        const dateDiff = duedate - currentDate

        const minutes = Math.floor(dateDiff / (1000 * 60));
        const hours = Math.floor(dateDiff / (1000 * 60 * 60));
        const days = Math.floor(dateDiff / (1000 * 60 * 60 * 24));

        if (Math.abs(dateDiff) < 60000) {
            return "Due now!";
        }
       
        if (dateDiff < 0) {
            const overdueMinutes = Math.abs(minutes);

            if (overdueMinutes < 60) {
                
                return `Overdue by ${overdueMinutes} minute${minutes === 1 ? "" : "s"} `;
            }

            const overdueHours = Math.floor(overdueMinutes / 60);

            if (overdueHours < 24) {
                
                return `Overdue by ${overdueHours} hour${hours === 1 ? "" : "s"}`;
            }

            const overdueDays = Math.floor(overdueHours / 24);
           
            return `Overdue by ${overdueDays} day${days === 1 ? "" : "s"}`;
        }

        if (minutes < 60 ){
             return `Due in ${minutes} minute${minutes === 1 ? "" : "s"}`;
        }

        if (hours < 24 ){
            return `Due in ${hours} hour${hours === 1 ? "" : "s"}`;
        }

        if (days === 1 ){
            return `Due tomorrow`;
        }

        return `Due in ${days} day${days === 1 ? "" : "s"}`;
        
    }

