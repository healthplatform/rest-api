import * as restify from 'restify';
import * as async from 'async';
import {has_body, mk_valid_body_mw, mk_valid_body_mw_ignore, remove_from_body} from './../../utils/validators';
import {collections} from './../../main';
import {isShallowSubset} from './../../utils/helpers';
import {NotFoundError, fmtError} from './../../utils/errors';
import {has_auth} from './../auth/middleware';
import {AccessToken} from './../auth/models';
import {IUser} from './models.d';

const user_schema: tv4.JsonSchema = require('./../../test/api/user/schema');

export function create(app: restify.Server, namespace: string = ""): void {
    app.post(namespace, has_body, mk_valid_body_mw(user_schema),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const User: waterline.Query = collections['user_tbl'];

            User.create(req.body).exec((error, user: IUser) => {
                if (error) return next(fmtError(error));
                res.setHeader('X-Access-Token', AccessToken().add(req.body.email, 'login'));
                res.json(201, user);
                return next();
            });
        }
    )
}

export function read(app: restify.Server, namespace: string = ""): void {
    app.get(namespace, has_auth(),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const User: waterline.Query = collections['user_tbl'];

            User.findOne({email: req['user_id']},
                (error: waterline.WLError, user: IUser) => {
                    if (error) return next(fmtError(error));
                    else if (!user) next(new NotFoundError('User'));
                    res.json(user);
                    return next();
                }
            );
        }
    );
}

export function update(app: restify.Server, namespace: string = ""): void {
    app.put(namespace, remove_from_body(['email']),
        has_body, mk_valid_body_mw(user_schema, false),
        mk_valid_body_mw_ignore(user_schema, ['Missing required property']), has_auth(),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            if (!isShallowSubset(req.body, user_schema.properties))
                return res.json(400, {
                        error: 'ValidationError',
                        error_message: 'Invalid keys detected in body'
                    }) && next();
            else if (!req.body || !Object.keys(req.body).length)
                return res.json(400, {error: 'ValidationError', error_message: 'Body required'}) && next();

            const User: waterline.Query = collections['user_tbl'];

            async.waterfall([
                cb => User.findOne({email: req['user_id']},
                    (err: waterline.WLError, user: IUser) => {
                        if (err) cb(err);
                        else if (!user) cb(new NotFoundError('User'));
                        return cb(err, user)
                    }),
                (user, cb) =>
                    User.update(user, req.body, (e, r: IUser) => cb(e, r[0]))
            ], (error, result) => {
                if (error) return next(fmtError(error));
                res.json(200, result);
                return next()
            });
        }
    );
}

export function del(app: restify.Server, namespace: string = ""): void {
    app.del(namespace, has_auth(),
        function (req: restify.Request, res: restify.Response, next: restify.Next) {
            const User: waterline.Query = collections['user_tbl'];

            async.waterfall([
                cb => AccessToken().logout({user_id: req['user_id']}, cb),
                cb => User.destroy({email: req['user_id']}, cb)
            ], (error) => {
                if (error) return next(fmtError(error));
                res.send(204);
                return next()
            });
        }
    );
}
