/// <reference path='./../../../typings/supertest/supertest.d.ts' />
/// <reference path='./../../../typings/chai/chai.d.ts' />
/// <reference path='./../../../typings/async/async.d.ts' />
/// <reference path='./auth_test_sdk.d.ts' />

import * as supertest from 'supertest';
import {expect} from 'chai';
import * as async from 'async';
import {ITestSDK} from './auth_test_sdk.d';
import {cb} from '../../share_interfaces.d';
import {IUser, IUserBase} from '../../../api/user/models.d';
import {user_mocks} from '../user/user_mocks';
import request = require("superagent");

export class AuthTestSDK implements ITestSDK {
    constructor(public app) {
    }

    register(user: IUserBase, cb: cb) {
        if (!user) return cb(new TypeError('user argument to register must be defined'));
        supertest(this.app)
            .post('/api/user')
            .send(user)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                expect(res.statusCode).to.be.equal(201);
                expect(Object.keys(res.body).sort()).to.deep.equal(['createdAt', 'email', 'updatedAt']);
                return cb(err, res);
            });
    }

    login(user: IUserBase, cb: cb) {
        if (!user) return cb(new TypeError('user argument to login must be defined'));
        supertest(this.app)
            .post('/api/auth')
            .send(user)
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                expect(Object.keys(res.body)).to.deep.equal(['access_token']);
                return cb(err, res);
            })
    }

    get_user(access_token: string, user: IUser | IUserBase, cb: cb) {
        if (!access_token) return cb(new TypeError('access_token argument to get_user must be defined'));
        supertest(this.app)
            .get('/api/user')
            .set({'X-Access-Token': access_token})
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                Object.keys(user).map(
                    attr => expect(user[attr] === res.body[attr])
                );
                return cb(err, res);
            })
    }

    logout(access_token: string, cb: cb) {
        if (!access_token) return cb(new TypeError('access_token argument to logout must be defined'));
        supertest(this.app)
            .delete('/api/auth')
            .set({'X-Access-Token': access_token})
            .expect(204)
            .end(cb)
    }

    unregister(ident: { access_token?: string, user_id?: string }, cb: cb) {
        if (!ident) return cb(new TypeError('ident argument to unregister must be defined'));
        if (ident.access_token)
            supertest(this.app)
                .delete('/api/user')
                .set({'X-Access-Token': ident.access_token})
                .expect(204)
                .end(cb);
        else
            supertest(this.app)
                .delete('/api/user')
                .send({email: ident.user_id})
                .expect(204)
                .end(cb)
    }

    unregister_all(users: Array<IUser | IUserBase>, done: cb) {
        async.map(users, (user, callback) =>
                async.waterfall([
                    cb => this.login(user, (err, res) =>
                        err ? cb(err) : cb(null, res.body.access_token)
                    ),
                    (access_token, cb) =>
                        this.unregister({access_token: access_token}, (err, res) =>
                            cb(err, access_token)
                        )
                    ,
                ], callback)
            , done
        )
    }

    register_login(user: IUserBase, num_or_done, done?: cb) {
        if (!done) {
            done = num_or_done;
            num_or_done = 0;
        }
        user = user || user_mocks.successes[num_or_done];
        async.series([
                cb => this.register(user, cb),
                cb => this.login(user, cb)
            ], (err, results: Array<request.Response>) => {
                if (err) {
                    return done(err);
                }
                return done(err, results[1].get('x-access-token'));
            }
        )
    }

    logout_unregister(user: IUserBase, num_or_done, done?: cb) {
        if (!done) {
            done = num_or_done;
            num_or_done = 0;
        }
        user = user || user_mocks.successes[num_or_done];
        if (!user) {
            return done(new TypeError('user undefined in `logout_unregister`'));
        }
        this.unregister_all([user], done)
    }
}
