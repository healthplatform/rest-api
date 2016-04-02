/// <reference path='./../../typings/restify/restify.d.ts' />
/// <reference path='./../../typings/tv4/tv4.d.ts' />
/// <reference path='./../../cust_typings/waterline.d.ts' />
/// <reference path='./../../typings/async/async.d.ts' />
/// <reference path='./models.d.ts' />
/// <reference path='./../../utils/errors.d.ts'/>

import * as async from 'async';
import * as restify from 'restify';
import {has_body} from '../../utils/validators';
import {collections} from '../../main';
import {fmtError} from '../../utils/helpers';
import {IPatient} from './models.d';
import {IContact} from '../contact/models.d';
import {NotFoundError} from '../../utils/errors';
import {createPatient} from './utils';
import CustomError = errors.CustomError;


export function create(app: restify.Server, namespace: string = ""): void {
    app.post(namespace, has_body, //mk_valid_body_mw(user_schema),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            type IResult = [IContact, IPatient];
            createPatient(req.body, (error, results: IResult) => {
                if (error) {
                    const e: errors.CustomError = fmtError(error);
                    res.send(e.statusCode, e.body);
                    return next();
                }

                res.json(201, results);
                return next();
            })
        }
    )
}

export function get(app: restify.Server, namespace: string = ""): void {
    app.get(`${namespace}/:medicare_no`,
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
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
                res.json(patient.toJSON());
                return next();
            });
        }
    );
}

export function del(app: restify.Server, namespace: string = ""): void {
    app.del(`${namespace}/:medicare_no`,
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Patient: waterline.Query = collections['patient_tbl'];

            console.log('req.params =', req.params);
            console.log('req.body =', req.body);
            req.log.info('req.params =', req.params);
            req.log.info('req.body =', req.body);


            // Don't delete Contact, even with no Patient, Contact may prove useful whence persisted
            Patient.destroy({medicare_no: req.params.medicare_no}).exec(
                (error) => {
                    if (error) {
                        const e: errors.CustomError = fmtError(error);
                        res.send(e.statusCode, e.body);
                        return next();
                    }
                    res.send(204);
                    return next();
                });
        }
    );
}

export function batchGet(app: restify.Server, namespace: string = ""): void {
    app.get(`${namespace}s`,
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Patient: waterline.Query = collections['patient_tbl'];

            Patient.find().exec((error, patients) => {
                if (error) {
                    const e: errors.CustomError = fmtError(error);
                    res.send(e.statusCode, e.body);
                    return next();
                }
                res.json({'patients': patients});
                return next();
            });
        }
    );
}

export function batchCreate(app: restify.Server, namespace: string = ""): void {
    app.post(`${namespace}s`, has_body, //mk_valid_body_mw(user_schema),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            type IResult = Array<[IContact, IPatient]>;

            async.mapLimit(req.body.patients, 1, createPatient, (error, results: IResult) => {
                if (error) {
                    console.error(error);
                    const e: errors.CustomError = fmtError(error);
                    res.send(e.statusCode, e.body);
                    return next();
                }

                res.json(201, {patients: results});
                return next();
            });


            /*
             Patient.createEach(req.body.patients).exec((error, patients: Array<IPatient>) => {
             if (error) {
             const e: errors.CustomError = fmtError(error);
             res.send(e.statusCode, e.body);
             return next();
             }
             res.json(201, {'patients': patients});
             return next();
             });
             */
        }
    )
}

export function batchDelete(app: restify.Server, namespace: string = ""): void {
    app.del(`${namespace}s`, has_body, //mk_valid_body_mw(user_schema),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Patient: waterline.Query = collections['patient_tbl'];

            if (!req.body.patients) return next(new NotFoundError('patients key on body'));
            req.log.info('req.body.patients =', req.body.patients);
            Patient.destroy({medicare_no: req.body.patients.map(v => v.medicare_no)}).exec((error) => {
                if (error) {
                    const e: errors.CustomError = fmtError(error);
                    res.send(e.statusCode, e.body);
                    return next();
                }
                res.json(204);
                return next();
            });
        }
    )
}
