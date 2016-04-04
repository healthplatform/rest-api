import * as restify from 'restify';
import {NotFoundError} from 'restify';
import {has_body} from './../../utils/validators';
import {collections} from './../../main';
import {fmtError} from './../../utils/helpers';
import {IVisit} from './models.d.ts';
import {fetchVisit, fetchVisits, IVisitFetchRequest, IVisitsFetchRequest} from './middleware';


export function create(app: restify.Server, namespace: string = ""): void {
    const noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.post(`${namespace}/patient/:medicare_no/${noun}`, has_body, //mk_valid_body_mw(user_schema),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Visit: waterline.Query = collections['visit_tbl'],
                Patient: waterline.Query = collections['patient_tbl'];

            req.body.medicare_no = req.params.medicare_no;

            Patient.count({medicare_no: req.body.medicare_no}, (err, count) => {
                if (err) {
                    const e: errors.CustomError = fmtError(err);
                    res.send(e.statusCode, e.body);
                    return next();
                } else if (!count) {
                    return next(new NotFoundError('patient'));
                } else {
                    Visit.create({
                        medicare_no: req.params.medicare_no,
                        iop_left_eye: 5
                    }).exec((error, visit: IVisit) => {
                        if (error) {
                            const e: errors.CustomError = fmtError(error);
                            res.send(e.statusCode, e.body);
                            return next();
                        }
                        res.json(201, visit);
                        return next();
                    });
                }
            });
        }
    )
}

export function get(app: restify.Server, namespace: string = ""): void {
    const noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.get(`${namespace}/patient/:medicare_no/${noun}/:createdAt`, fetchVisit,
        function (req: IVisitFetchRequest, res: restify.Response, next: restify.Next) {
            res.json(req.visit);
            return next();
        }
    );
}

export function del(app: restify.Server, namespace: string = ""): void {
    const noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.del(`${namespace}/patient/:medicare_no/${noun}/:createdAt`,
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Visit: waterline.Query = collections['visit_tbl'];

            Visit.destroy({createdAt: req.params.createdAt}).exec(error => {
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
    const noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.get(`${namespace}/patient/:medicare_no/${noun}s`, fetchVisits,
        function (req: IVisitsFetchRequest, res: restify.Response, next: restify.Next) {
            res.json({'visits': req.visits});
            return next();
        }
    );
}

export function batchCreate(app: restify.Server, namespace: string = ""): void {
    const noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.post(`${namespace}/patient/:medicare_no/${noun}s`, has_body,
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Visit: waterline.Query = collections['visit_tbl'],
                Patient: waterline.Query = collections['patient_tbl'];

            if (!req.body.visits) return next(new NotFoundError('visits key on body'));
            else if (req.body.visits.filter((value, index, self) =>
                    self.indexOf(value) === index
                ).length !== 1) {
                res.json(400, {
                    error: 'ValidationError',
                    error_message: 'All medicare_no need to be equal to bulk create them'
                });
                return next();
            }

            Patient.count({medicare_no: req.body.visits[0].medicare_no}, (err, count) =>
                (err || !count) ? next(err || new NotFoundError('patient'))
                    : Visit.createEach(req.body.visits).exec(
                    (error, visits: IVisit[]) => {
                        if (error) {
                            const e: errors.CustomError = fmtError(error);
                            res.send(e.statusCode, e.body);
                            return next();
                        }
                        res.json({'visits': visits});
                        return next();
                    })
            )
        }
    );
}

export function batchDelete(app: restify.Server, namespace: string = ""): void {
    const noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.del(`${namespace}/patient/:medicare_no/${noun}s`, has_body, //mk_valid_body_mw(user_schema),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Visit: waterline.Query = collections['visit_tbl'];

            if (!req.body.visits) return next(new NotFoundError('visits key on body'));
            else if (req.body.visits.filter((value, index, self) =>
                    self.indexOf(value) === index
                ).length !== 1) {
                res.json(400, {
                    error: 'ValidationError',
                    error_message: 'All medicare_no need to be equal to bulk create them'
                });
                return next();
            }

            Visit.destroy({medicare_no: req.body.visits.map(v => v.medicare_no)}).exec((error) => {
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
