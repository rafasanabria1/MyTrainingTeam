import moment from 'moment';
import 'moment/locale/es';

import firebase from 'firebase/app';

moment.locale ('es');

interface dateParams {
    seconds: number,
    nanoseconds: number
};
export function formatDate (dateValue: dateParams, format: string) {

    return moment (new firebase.firestore.Timestamp (dateValue.seconds, dateValue.nanoseconds).toDate ()).format (format);
};