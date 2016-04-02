/// <reference path='./../../typings/restify/restify.d.ts' />
/// <reference path='./../../typings/tv4/tv4.d.ts' />
/// <reference path='./../../cust_typings/waterline.d.ts' />
/// <reference path='./../../typings/async/async.d.ts' />
/// <reference path='./models.d.ts' />
/// <reference path='./../../utils/errors.d.ts'/>

import * as restify from 'restify';
import {has_body} from '../../utils/validators';
import {collections} from '../../main';
import {fmtError} from '../../utils/helpers';
import {IPatientRecord} from './models.d';


export function create(app: restify.Server, namespace: string = ""): void {
    app.post(namespace, has_body, //mk_valid_body_mw(user_schema),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const PatientRecord: waterline.Query = collections['patient_record_tbl'];

            PatientRecord.create(req.body).exec((error, patientRecord: IPatientRecord) => {
                if (error) {
                    const e: errors.CustomError = fmtError(error);
                    res.send(e.statusCode, e.body);
                    return next();
                }
                res.json(201, patientRecord);
                return next();
            });
        }
    )
}

export function get(app: restify.Server, namespace: string = ""): void {
    app.get(`${namespace}/:medicare_no`,
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const PatientRecord: waterline.Query = collections['patient_record_tbl'];

            PatientRecord.findOne({medicare_no: req.params.medicare_no}).exec(
                (error, PatientRecord: IPatientRecord) => {
                    if (error) {
                        const e: errors.CustomError = fmtError(error);
                        res.send(e.statusCode, e.body);
                        return next();
                    }
                    res.json(PatientRecord);
                    return next();
                });
        }
    );
}

export function batchCreate(app: restify.Server, namespace: string = ""): void {
    app.post(`${namespace}s`, has_body, //mk_valid_body_mw(user_schema),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const PatientRecord: waterline.Query = collections['patient_record_tbl'];

            PatientRecord.createEach(req.body.PatientRecords).exec((error, PatientRecords: Array<IPatientRecord>) => {
                if (error) {
                    const e: errors.CustomError = fmtError(error);
                    res.send(e.statusCode, e.body);
                    return next();
                }
                res.json(201, {'PatientRecords': PatientRecords});
                return next();
            });
        }
    )
}

export function batchDelete(app: restify.Server, namespace: string = ""): void {
    app.del(`${namespace}s`, has_body, //mk_valid_body_mw(user_schema),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const PatientRecord: waterline.Query = collections['patient_record_tbl'];

            PatientRecord.destroy({medicare_no: req.body.PatientRecords.map(v => v.medicare_no)}).exec((error) => {
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

export function batchGet(app: restify.Server, namespace: string = ""): void {
    app.get(`${namespace}s`,
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const PatientRecord: waterline.Query = collections['patient_record_tbl'];

            PatientRecord.find().exec((error, PatientRecords) => {
                if (error) {
                    const e: errors.CustomError = fmtError(error);
                    res.send(e.statusCode, e.body);
                    return next();
                }
                res.json({'PatientRecords': PatientRecords});
                return next();
            });
        }
    );
}
