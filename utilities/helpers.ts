import { getCalendars } from 'expo-localization';
import moment from 'moment-timezone';

const formatDate = (date: Date) => {
    const { timeZone } = getCalendars()[0];
    const dateOBJ = moment(date).utc(true).tz(timeZone ? timeZone : "America/New_York");
    return dateOBJ;
}

export const parseDate = (date: Date) => {
    let dateOBJ = formatDate(date);
    return dateOBJ.format("MMM. D");
}

export const getDateDiffInDays = (date1: Date | string, date2: Date | string) => {
    const date1OBJ = new Date(date1);
    const date2OBJ = new Date(date2);

    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(date1OBJ.getFullYear(), date1OBJ.getMonth(), date1OBJ.getDate());
    const utc2 = Date.UTC(date2OBJ.getFullYear(), date2OBJ.getMonth(), date2OBJ.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}
