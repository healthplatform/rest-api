import * as restify from 'restify';
import {collections} from '../../main';
import {IPatientHistory} from './models.d';
import {fmtError} from '../../utils/helpers';

export interface IPatientHistoryFetchRequest extends restify.Request {
    historic: IPatientHistory;
}


export function fetchHistoric(req: IPatientHistoryFetchRequest, res: restify.Response, next: restify.Next) {
    const PatientHistory: waterline.Query = collections['patient_historic_tbl'];

    PatientHistory.findOne({medicare_no: req.params.medicare_no}).exec(
        (error, historic: IPatientHistory) => {
            if (error) {
                const e: errors.CustomError = fmtError(error);
                res.send(e.statusCode, e.body);
                return next();
            }
            req.historic = historic;
            return next();
        });
}
