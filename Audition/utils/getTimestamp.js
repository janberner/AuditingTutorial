/*
* Function take a timestamp in format yyyy-mm-ddThh:mm:ss.mms and transforms it into milliseconds
*/

function getTimestamp(timeOfInterest) { 
    
    let timestr = timeOfInterest.slice(0,-4)  // cut milli seconds from timestamp
    const [dateRelated, timeRelated] = timestr.split('T');
    const [year, month, day, ] = dateRelated.split('-');
    const [hours, minutes, seconds] = timeRelated.split(':');

    const date2 = new Date(+year, month - 1, +day, +hours, +minutes, +seconds);
    
    //  Get timestamp
    const timestamp = date2.getTime();
     return timestamp
}

module.exports = { getTimestamp }