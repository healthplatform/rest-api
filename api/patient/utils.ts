import * as async from 'async';
import {collections} from '../../main';
import {IContact, IContactBase} from '../contact/models.d';
import {IPatient, IPatientBase} from './models.d';
import {NotFoundError} from './../../utils/errors'
import {DefiniteHttpError} from 'restify';

type IResult = [IContact, IPatient];

export function createPatient(newPatient: IPatientBase,
                              callback: (error: Error|DefiniteHttpError, results?: IResult) => void) {
    const Patient: waterline.Query = collections['patient_tbl'],
        Contact: waterline.Query = collections['contact_tbl'];

    const b_contact: IContactBase = newPatient.contact;
    delete newPatient.contact;
    const gp: IContactBase = newPatient.gp;
    delete newPatient.gp;
    const other_specialists: IContactBase[] = newPatient.other_specialists;
    delete newPatient.other_specialists;

    if (!b_contact) return callback(new NotFoundError('patient.contact'));

    async.waterfall([
        cb => Contact.findOrCreate(b_contact).exec((err, contact: IContact) => {
                if (err) return cb(err);
                else if (!contact) return cb(new NotFoundError('patient.contact'));
                return cb(null, contact.id);
            }
        ),
        (b_contactId: string, cb) => gp ? Contact.findOrCreate(gp).exec((err, contact: IContact) => {
            if (err) return cb(err);
            else if (!contact) return cb(new NotFoundError('gp.contact'));
            return cb(null, b_contactId, contact.id);
        }) : cb(null, b_contactId, null),
        (b_contactId: string, gpId: string, cb) => other_specialists && other_specialists.length ?
            async.map(other_specialists,
                (specialist, _cb) => Contact.findOrCreate(specialist, _cb),
                (err, specialists) => cb(err, b_contactId, gpId, specialists)
            ) : cb(null, b_contactId, gpId, null),
        (b_contactId, gpId, other_specialistsRes, cb) => {
            newPatient.contact = b_contactId;
            if (gp) newPatient.gp = gpId;
            if (other_specialistsRes && other_specialistsRes.length)
                newPatient.other_specialists = other_specialistsRes.map(c => c.id);
            Patient.create(newPatient).exec((err, patient: IPatient) =>
                cb(patient ? err : err || new NotFoundError('patient'), patient)
            )
        }
    ], callback);
    /* // Sample callback
     (error, results: IResult) => {
     if (error) return next(fmtError(error));
     res.json(201, results);
     return next();
     })
     */
}
