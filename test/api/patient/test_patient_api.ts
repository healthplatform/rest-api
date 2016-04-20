import * as async from 'async';
import {main, all_models_and_routes} from './../../../main';
import {PatientTestSDK} from './patient_test_sdk';
import {PatientMocks} from './patient_mocks';
import {AuthTestSDK} from './../auth/auth_test_sdk';

const models_and_routes: helpers.IModelRoute = {
    user: all_models_and_routes['user'],
    auth: all_models_and_routes['auth'],
    contact: all_models_and_routes['contact'],
    patient: all_models_and_routes['patient'],
    visit: all_models_and_routes['visit'],
    prognosis: all_models_and_routes['prognosis']
};

process.env.NO_SAMPLE_DATA = true;

describe('Patient::routes', () => {
    before(done => main(models_and_routes,
        (app, connections) => {
            this.connections = connections;
            this.app = app;
            this.mocks = new PatientMocks();
            this.authSDK = new AuthTestSDK(this.app);

            async.series([
                cb => this.authSDK.logout_unregister(undefined, 1, () => cb()),
                cb => this.authSDK.register_login(undefined, 1, cb)
            ], (err, responses: Array<string>) => {
                if (err) {
                    return done(err);
                }
                this.token = responses[1];
                this.sdk = new PatientTestSDK(this.app, this.token);
                return done();
            });

        }
    ));

    // Deregister database adapter connections
    after(done =>
        async.series([
                cb => this.authSDK.logout_unregister(undefined, cb),
                cb => async.parallel(Object.keys(this.connections).map(
                    connection => this.connections[connection]._adapter.teardown
                ), cb)
            ], done
        )
    );

    describe('/api/patient', () => {
        beforeEach(done =>
            this.sdk.deregister(this.mocks.patients[0], done)
        );

        afterEach(done =>
            this.sdk.deregister(this.mocks.patients[0], done)
        );

        it('POST should create Patient', (done) => {
            this.sdk.register(this.mocks.patients[0], done);
        });
    });

    describe('/api/patients', () => {
        beforeEach(done =>
            this.sdk.deregisterMany(this.mocks, done)
        );

        afterEach(done =>
            this.sdk.deregisterMany(this.mocks, done)
        );

        it('POST should create many Patient', (done) => {
            this.sdk.registerMany(this.mocks, done);
        });
    });
});
