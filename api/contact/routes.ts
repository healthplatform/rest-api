import * as restify from 'restify';
import {collections} from '../../main';
import {fmtError} from '../../utils/helpers';
import {IContact} from './models.d';
import {has_body} from '../../utils/validators';
import CustomError = errors.CustomError;

export function batchGet(app: restify.Server, namespace: string = ""): void {
    app.get(`${namespace}s`,
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Contact: waterline.Query = collections['contact_tbl'];

            Contact.find().exec((error, contacts: IContact[]) => {
                if (error) {
                    const e: errors.CustomError = fmtError(error);
                    res.send(e.statusCode, e.body);
                    return next();
                }
                res.json({'contacts': contacts});
                return next();
            });
        }
    );
}

export function create(app: restify.Server, namespace: string = ""): void {
    app.post(namespace, has_body, //mk_valid_body_mw(user_schema),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Contact: waterline.Query = collections['contact_tbl'];

            Contact.create(req.body).exec((err, contact: IContact) => {
                    if (err) {
                        const e: CustomError = fmtError(err);
                        res.send(e.statusCode, e.body);
                        return next();
                    }
                    res.json(contact);
                    return next();
                }
            );
        }
    )
}

