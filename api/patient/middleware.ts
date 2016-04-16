import * as restify from 'restify';
import {NotFoundError, fmtError} from './../../utils/errors';
import {collections} from '../../main';
import {IPatient} from './models.d';

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
        next.ifError(fmtError(error));
        if (!patient) {
            return next(new NotFoundError(`patient with medicare_no '${req.params.medicare_no}'`));
        }
        req.patient = patient;
        return next();
    });
}
