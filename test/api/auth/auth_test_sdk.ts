/// <reference path='./../../../typings/supertest/supertest.d.ts' />
/// <reference path='./../../../typings/chai/chai.d.ts' />
/// <reference path='./../../../typings/async/async.d.ts' />
/// <reference path='./auth_test_sdk.d.ts' />

import * as supertest from 'supertest';
import {expect} from 'chai';
import * as async from 'async';
import {ITestSDK, cb as auth_test_sdk_cb} from './auth_test_sdk.d';
import {IUser, IUserBase} from '../../../api/user/models.d';
import {user_mocks} from '../user/user_mocks';

export class AuthTestSDK implements ITestSDK {
    constructor(public app) {
    }

    register(user: IUserBase, cb: auth_test_sdk_cb) {
        if (!user) return cb(new TypeError('user argument to register must be defined'));
        console.log('Calling AuthTestSDK.register with:', user, cb);
        supertest(this.app)
            .post('/api/user')
            .send(user)
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                console.error('AuthTestSDK.register err =', err);
                console.log('AuthTestSDK.register res =', res);
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                expect(Object.keys(res.body).sort()).to.deep.equal(['createdAt', 'email', 'updatedAt']);
                return cb(err, res);
            });
    }

    login(user: IUserBase, cb: auth_test_sdk_cb) {
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

    get_user(access_token: string, user: IUser | IUserBase, cb: auth_test_sdk_cb) {
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

    logout(access_token: string, cb: auth_test_sdk_cb) {
        if (!access_token) return cb(new TypeError('access_token argument to logout must be defined'));
        supertest(this.app)
            .delete('/api/auth')
            .set({'X-Access-Token': access_token})
            .expect(204)
            .end(cb)
    }

    unregister(ident: { access_token?: string, user_id?: string }, cb: auth_test_sdk_cb) {
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

    unregister_all(users: Array<IUser | IUserBase>, done: auth_test_sdk_cb) {
        const self = this;

        function f(user, callback) {
            return async.waterfall([
                cb => self.login(user, (err, res) =>
                    err ? cb(err) : cb(null, res.body.access_token)
                ),
                (access_token, cb) =>
                    self.unregister({access_token: access_token}, (err, res) =>
                        cb(err, access_token)
                    )
                ,
            ], callback);
        }

        async.map(users, f,
            done
        )
    }

    register_login(user: IUserBase, done: auth_test_sdk_cb) {
        user = user || user_mocks.successes[0];
        if (!user) {
            return done(new TypeError('user undefined in `register_login`'));
        }
        console.log('IN register_login');
        async.waterfall([
                cb => this.register(user, (err, res) => {
                    console.info('register_login::register::res =', res);
                    return cb(err, res);
                }),
                cb => this.login(user, cb)
            ], (err, res) => {
                err && console.error('register_login::err =', err);
                res && console.info('register_login::res =', res);
                return done(err, res)
            }
        )
    }

    logout_unregister(user: IUserBase, done: auth_test_sdk_cb) {
        user = user || user_mocks.successes[0];
        if (!user) {
            return done(new TypeError('user undefined in `logout_unregister`'));
        }
        this.unregister_all([user], done)
    }
}
