import * as restify from 'restify';
import {collections} from '../../main';
import {IContact} from './models.d';
import {has_body} from '../../utils/validators';
import CustomError = errors.CustomError;
import {fmtError} from '../../utils/errors';


export function batchGet(app: restify.Server, namespace: string = ""): void {
    app.get(`${namespace}s`,
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const Contact: waterline.Query = collections['contact_tbl'];

            Contact.find().exec((error, contacts: IContact[]) => {
                if (error) return next(fmtError(error));
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

            Contact.create(req.body).exec((error, contact: IContact) => {
                    if (error) return next(fmtError(error));
                    res.json(contact);
                    return next();
                }
            );
        }
    )
}

