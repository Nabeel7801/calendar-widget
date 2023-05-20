import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date?.split('Z')[0]), 'dd MMM yyyy');
}

export function customeDateFormat(date, dateFormat) {
  if (!date) return ""
  return format(new Date(date), dateFormat);
}
export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fTimestamp(date) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fDateGetFormattedString(date) {
  return format(date, 'yyyy-MM-dd');
}

export function getISOString(date) {
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  return (new Date(date - tzoffset)).toISOString();
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}
