import * as async from 'async';
import {main, all_models_and_routes} from './../../../main';
import {AuthTestSDK} from './../auth/auth_test_sdk';
import {AccessToken} from './../../../api/auth/models';
import {user_mocks} from './../user/user_mocks';
import {ITestSDK} from './auth_test_sdk.d';

const user_models_and_routes: helpers.IModelRoute = {
    user: all_models_and_routes['user'],
    auth: all_models_and_routes['auth'],
};

describe('Auth::routes', () => {
    before(done => main(user_models_and_routes,
        (app, connections) => {
            this.connections = connections;
            this.app = app;
            this.sdk = new AuthTestSDK(this.app);
            done();
        }
    ));

    // Deregister database adapter connections
    after(done =>
        async.parallel(Object.keys(this.connections).map(
            connection => this.connections[connection]._adapter.teardown
        ), (err, _res) => done(err))
    );

    describe('/api/auth', () => {
        beforeEach(done => this.sdk.unregister_all(user_mocks.successes, () => done()));
        afterEach(done => this.sdk.unregister_all(user_mocks.successes,  () => done()));

        it('POST should login user', (done) => {
            const sdk: ITestSDK = this.sdk;
            async.waterfall([
                    (cb) => this.sdk.register(user_mocks.successes[0], cb),
                    (_, cb) => sdk.login(user_mocks.successes[0], cb)
                ],
                (err, results) => done(err)
            );
        });

        it('DELETE should logout user', (done) => {
            const sdk: ITestSDK = this.sdk;
            async.waterfall([
                    (cb) => this.sdk.register(user_mocks.successes[1], cb),
                    (_, cb) => sdk.login(user_mocks.successes[1], (err, res) =>
                        err ? cb(err) : cb(null, res.body.access_token)
                    ),
                    (access_token, cb) =>
                        sdk.logout(access_token, (err, res) =>
                            cb(err, access_token)
                        )
                    ,
                    (access_token, cb) =>
                        AccessToken().findOne(access_token, (e, r) =>
                            cb(!e ? new Error("Access token wasn't invalidated/removed") : null)
                        )
                ],
                (err, results) => done(err)
            )
        });
    });
});
