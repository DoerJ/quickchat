
// maps numeric value of month to the short form
const months: any = {
  '1': 'Jan',
  '2': 'Feb',
  '3': 'Mar',
  '4': 'Apr',
  '5': 'May',
  '6': 'Jun',
  '7': 'Jul',
  '8': 'Aug',
  '9': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec'
}

// compute the diff of two datetimes in hours
// b should always be ahead of a
function getDateDiff(a: number, b: number): number {
  var diff = Math.ceil((b - a) / (1000 * 60 * 60));
  return diff;
}

export class DateTimeService {

  // generate timestamp in format of [month day year hours:minutes]
  static formatCurrentTimestamp(): string {
    var nowDateTime = new Date();
    var date = nowDateTime.getDate(),
        month = nowDateTime.getMonth() + 1,
        year = nowDateTime.getFullYear(),
        hours = nowDateTime.getHours(),
        minutes = nowDateTime.getMinutes();

    return `${month} ${date} ${year} ${hours}:${minutes}`;
  }

  // output datetime display based on the current time and the retrieved timestamp 
  // compare the date diff, if the same day, output 'Today', if differed by one day, output 'Yesterday',
  // for all other case, output the same date as in timestamp
  // the time (i.e., hours and minutes) will be stated as in timestamp 
  // if the hours < 12, output 'am', otherwise, 'pm'
  // e.g: Today 10:30am, Aug 29 10:30pm
  static outputTimestamp(timestamp: string): string {
    var now = new Date();
    var datetime = new Date(timestamp);
    var date = '', time = '', dayzone = ''; 
    // compute date 
    if (getDateDiff(datetime.getTime(), now.getTime()) <= 48) {
      date = (datetime.getDate() === now.getDate()) ? 'Today' : 'Yesterday';
    } 
    else {
      date = months[datetime.getMonth() + 1] + ' ' + datetime.getDate();
    }
    // format time
    time = datetime.getHours() + ':' + datetime.getMinutes();
    // compute dayzone
    dayzone = (datetime.getHours() < 12) ? 'am' : 'pm';

    return date + ' ' + time + dayzone;
  }

}