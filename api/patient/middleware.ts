import * as restify from 'restify';
import {NotFoundError} from 'restify';
import {collections} from '../../main';
import {IPatient} from './models.d';
import {fmtError} from '../../utils/helpers';

export interface IPatientFetchRequest extends restify.Request {
    patient: IPatient;
}

export function fetchPatient(req: IPatientFetchRequest, res: restify.Response, next: restify.Next) {
    const Patient: waterline.Query = collections['patient_tbl'];

    const q = Patient.findOne({medicare_no: req.params.medicare_no});
    if (req.params.populate_contact)
        q.populate('contact')
            .populate('gp')
            .populate('other_specialists');
    q.exec((error, patient: IPatient) => {
        if (error) {
            const e: errors.CustomError = fmtError(error);
            res.send(e.statusCode, e.body);
            return next();
        }
        else if (!patient) {
            return next(new NotFoundError(`patient with medicare_no '${req.params.medicare_no}'`));
        }
        req.patient = patient;
        return next();
    });
}
