import * as restify from 'restify';
import {NotFoundError, fmtError} from './../../utils/errors';
import {collections} from '../../main';
import {has_body} from './../../utils/validators';
import {IPatientHistory} from './models.d.ts';
import {fetchHistoric, IPatientHistoryFetchRequest} from './middleware';
import {has_auth} from '../auth/middleware';
import CustomError = errors.CustomError;


export function create(app: restify.Server, namespace: string = ""): void {
    const noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.post(`${namespace}/patient/:medicare_no/${noun}`, has_body, has_auth(), //mk_valid_body_mw(user_schema),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const PatientHistory: waterline.Query = collections['patient_historic_tbl'],
                Patient: waterline.Query = collections['patient_tbl'];

            Patient.count({medicare_no: req.body.medicare_no}, (err, count) => {
                    next.ifError(err);
                    if (!count) {
                        return next(new NotFoundError('patient'));
                    } else {
                        PatientHistory.create(req.body).exec((error, historic: IPatientHistory) => {
                            next.ifError(fmtError(error));
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
    app.get(`${namespace}/patient/:medicare_no/${noun}`, has_auth(), fetchHistoric,
        function (req: IPatientHistoryFetchRequest, res: restify.Response, next: restify.Next) {
            res.json(req.historic);
            return next();
        }
    );
}

export function del(app: restify.Server, namespace: string = ""): void {
    const noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.del(`${namespace}/patient/:medicare_no/${noun}`, has_auth(),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const PatientHistory: waterline.Query = collections['patient_historic_tbl'];

            PatientHistory.destroy({medicare_no: req.params.medicare_no}).exec(error => {
                next.ifError(fmtError(error));
                res.send(204);
                return next();
            });
        }
    );
}
