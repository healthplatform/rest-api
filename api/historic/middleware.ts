import * as restify from 'restify';
import {collections} from '../../main';
import {IPatientHistory} from './models.d';
import {NotFoundError, fmtError} from './../../utils/errors';

export interface IPatientHistoryFetchRequest extends restify.Request {
    historic: IPatientHistory;
}


export function fetchHistoric(req: IPatientHistoryFetchRequest, res: restify.Response, next: restify.Next) {
    const PatientHistory: waterline.Query = collections['patient_historic_tbl'];

    PatientHistory.findOne({medicare_no: req.params.medicare_no}).exec(
        (error, historic: IPatientHistory) => {
            if (error) return next(fmtError(error));
            else if(!historic) return next(new NotFoundError('historic'));
            req.historic = historic;
            return next();
        });
}
