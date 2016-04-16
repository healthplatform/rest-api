import * as async from 'async';
import * as restify from 'restify';
import {has_body} from '../../utils/validators';
import {collections} from '../../main';
import {IPatient} from './models.d';
import {IContact} from '../contact/models.d';
import {NotFoundError, fmtError} from '../../utils/errors';
import {createPatient} from './utils';
import {fetchPatient, IPatientFetchRequest} from './middleware';
import {fetchHistoric, IPatientHistoryFetchRequest} from './../historic/middleware';
import {fetchVisits, IVisitsFetchRequest} from './../visit/middleware';
import {has_auth} from '../auth/middleware';
import CustomError = errors.CustomError;


export function create(app: restify.Server, namespace: string = ""): void {
    app.post(namespace, has_body, has_auth(), //mk_valid_body_mw(user_schema),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            type IResult = [IContact, IPatient];
            console.info('req.body =', req.body);
            createPatient(req.body, (error, results: IResult) => {
                next.ifError(fmtError(error));

                res.json(201, results);
                return next();
            })
        }
    )
}

export function get(app: restify.Server, namespace: string = ""): void {
    app.get(`${namespace}/:medicare_no`, has_auth(), fetchPatient,
        function (req: IPatientFetchRequest, res: restify.Response, next: restify.Next) {
            res.json(req.patient.toJSON());
            return next();
        }
    );
}

export function del(app: restify.Server, namespace: string = ""): void {
    app.del(`${namespace}/:medicare_no`, has_auth(),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Patient: waterline.Query = collections['patient_tbl'];

            // Don't delete Contact, even with no Patient, Contact may prove useful whence persisted
            Patient.destroy({medicare_no: req.params.medicare_no}).exec(error => {
                next.ifError(fmtError(error));
                res.send(204);
                return next();
            });
        }
    );
}

export function batchGet(app: restify.Server, namespace: string = ""): void {
    app.get(`${namespace}s`, has_auth(),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Patient: waterline.Query = collections['patient_tbl'];

            const q = Patient.find();
            if (req.params.populate_contact)
                q.populate('contact')
                    .populate('gp')
                    .populate('other_specialists');

            q.exec((error, patients) => {
                next.ifError(fmtError(error));
                res.json({'patients': patients});
                return next();
            });
        }
    );
}

export function batchCreate(app: restify.Server, namespace: string = ""): void {
    app.post(`${namespace}s`, has_body, has_auth(), //mk_valid_body_mw(user_schema),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            type IResult = Array<[IContact, IPatient]>;

            async.mapLimit(req.body.patients, 1, createPatient, (error, results: IResult) => {
                next.ifError(fmtError(error));

                res.json(201, {patients: results});
                return next();
            });


            /*
             Patient.createEach(req.body.patients).exec((error, patients: Array<IPatient>) => {
             next.ifError(fmtError(error));
             res.json(201, {'patients': patients});
             return next();
             });
             */
        }
    )
}

export function batchDelete(app: restify.Server, namespace: string = ""): void {
    app.del(`${namespace}s`, has_body, has_auth(),//mk_valid_body_mw(user_schema),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Patient: waterline.Query = collections['patient_tbl'];

            if (!req.body.patients) return next(new NotFoundError('patients key on body'));
            Patient.destroy({medicare_no: req.body.patients.map(v => v.medicare_no)}).exec((error) => {
                next.ifError(fmtError(error));
                res.json(204);
                return next();
            });
        }
    )
}

interface IFetchAllPatientRelated extends IPatientFetchRequest, IPatientHistoryFetchRequest, IVisitsFetchRequest {
}

export function getAllPatientRelated(app: restify.Server, namespace: string = ""): void {
    app.get(`${namespace}/:medicare_no/all`, has_auth(),
        function (req: IFetchAllPatientRelated, res: restify.Response, next: restify.Next) {
            async.parallel([
                cb => fetchPatient(req, res, cb),
                cb => fetchHistoric(req, res, cb),
                cb => fetchVisits(req, res, cb)
            ], () => {
                res.json({
                    visits: req.visits,
                    historic: req.historic,
                    patient: req.patient
                });
                return next();
            });
        }
    );
}
