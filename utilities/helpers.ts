import { getCalendars } from 'expo-localization';
import moment from 'moment-timezone';

export const getDate = (date: Date) => {
    const { timeZone } = getCalendars()[0];
    const dateOBJ = moment(date).utc(true).tz(timeZone ? timeZone : "America/New_York");
    return dateOBJ.format("MMM. D");
}
