/// <reference path='./../../typings/restify/restify.d.ts' />
/// <reference path='./../../typings/tv4/tv4.d.ts' />
/// <reference path='./../../cust_typings/waterline.d.ts' />
/// <reference path='./../../typings/async/async.d.ts' />
/// <reference path='./models.d.ts' />
/// <reference path='./../../utils/errors.d.ts'/>

import * as restify from 'restify';
import {NotFoundError} from 'restify';
import {collections} from '../../main';
import {has_body} from './../../utils/validators';
import {IPatientHistory} from './models.d.ts';
import {fmtError} from '../../utils/helpers';
import {fetchHistoric, IPatientHistoryFetchRequest} from './middleware';
import CustomError = errors.CustomError;


export function create(app: restify.Server, namespace: string = ""): void {
    const noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.post(`${namespace}/patient/:medicare_no/${noun}`, has_body, //mk_valid_body_mw(user_schema),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const PatientHistory: waterline.Query = collections['patient_historic_tbl'],
                Patient: waterline.Query = collections['patient_tbl'];

            Patient.count({medicare_no: req.body.medicare_no}, (err, count) => {
                    if (err) {
                        const e: errors.CustomError = fmtError(err);
                        res.send(e.statusCode, e.body);
                        return next();
                    } else if (!count) {
                        return next(new NotFoundError('patient'));
                    } else {
                        PatientHistory.create(req.body).exec((error, historic: IPatientHistory) => {
                            if (error) {
                                const e: errors.CustomError = fmtError(error);
                                res.send(e.statusCode, e.body);
                                return next();
                            }
                            res.json(201, historic);
                            return next();
                        })
                    }
                }
            );
        }
    )
}

export function get(app: restify.Server, namespace: string = ""): void {
    const noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.get(`${namespace}/patient/:medicare_no/${noun}`, fetchHistoric,
        function (req: IPatientHistoryFetchRequest, res: restify.Response, next: restify.Next) {
            setTimeout(() => {
                res.json(req.historic);
                return next();
            }, 2000);
        }
    );
}

export function del(app: restify.Server, namespace: string = ""): void {
    const noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.del(`${namespace}/patient/:medicare_no/${noun}`,
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const PatientHistory: waterline.Query = collections['patient_historic_tbl'];

            PatientHistory.destroy({medicare_no: req.params.medicare_no}).exec(error => {
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
