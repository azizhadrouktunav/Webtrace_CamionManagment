
export function convertToJSONDate(strDate){
    var dt = new Date(strDate);
    var newDate = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours()-1, dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds()));
    return '/Date(' + newDate.getTime() + ')/';
  }