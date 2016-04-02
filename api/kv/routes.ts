/// <reference path='./../../typings/restify/restify.d.ts' />
/// <reference path='./../../typings/tv4/tv4.d.ts' />
/// <reference path='./../../cust_typings/waterline.d.ts' />
/// <reference path='./../../typings/async/async.d.ts' />
/// <reference path='./models.d.ts' />
/// <reference path='./../../utils/errors.d.ts'/>

import * as restify from 'restify';
import {collections} from '../../main';
import {has_body} from './../../utils/validators';
import {IKV} from './models.d.ts';
import CustomError = errors.CustomError;
import {fmtError} from '../../utils/helpers';


export function create(app: restify.Server, namespace: string = ""): void {
    app.post(namespace, has_body, //mk_valid_body_mw(user_schema),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const KV: waterline.Query = collections['kv_tbl'];

            KV.create(req.body).exec((error, kv: IKV) => {
                if (error) {
                    const e: errors.CustomError = fmtError(error);
                    res.send(e.statusCode, e.body);
                    return next();
                }
                res.json(201, kv);
                return next();
            });
        }
    )
}

export function get(app: restify.Server, namespace: string = ""): void {
    app.get(`${namespace}/:key`,
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const KV: waterline.Query = collections['kv_tbl'];

            KV.findOne({key: req.params.key}).exec(
                (error, kv: IKV) => {
                    if (error) {
                        const e: errors.CustomError = fmtError(error);
                        res.send(e.statusCode, e.body);
                        return next();
                    }
                    res.json(kv);
                    return next();
                });
        }
    );
}

export function del(app: restify.Server, namespace: string = ""): void {
    app.del(`${namespace}/:key`,
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const KV: waterline.Query = collections['kv_tbl'];

            KV.destroy({key: req.params.key}).exec(
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
