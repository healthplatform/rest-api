import * as restify from 'restify';
import {has_body} from './../../utils/validators';
import {has_auth} from '../auth/middleware';


export function create(app: restify.Server, namespace: string = ""): void {
    const noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.post(`${namespace}/patient/:medicare_no/:visit_created_at/${noun}`, has_body, has_auth(),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            res.send(501);
            return next();
        }
    )
}

export function get(app: restify.Server, namespace: string = ""): void {
    const noun = namespace.substr(namespace.lastIndexOf('/') + 1);
    namespace = namespace.substr(0, namespace.lastIndexOf('/'));
    app.post(`${namespace}/patient/:medicare_no/:visit_created_at/${noun}`, has_body, has_auth(),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            res.send(501);
            return next();
        }
    )
}
