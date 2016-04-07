import * as async from 'async';
import {main, all_models_and_routes} from './../../../main';
import {HistoricTestSDK} from './historic_test_sdk';
import {PatientTestSDK} from './../patient/patient_test_sdk';
import {PatientMocks} from './../patient/patient_mocks';
import {HistoricMocks} from './historic_mocks';
import {AuthTestSDK} from '../auth/auth_test_sdk';

const models_and_routes: helpers.IModelRoute = {
    user: all_models_and_routes['user'],
    auth: all_models_and_routes['auth'],
    contact: all_models_and_routes['contact'],
    patient: all_models_and_routes['patient'],
    historic: all_models_and_routes['historic']
};

describe('Historic::routes', () => {
    before(done => main(models_and_routes,
        (app, connections) => {
            this.connections = connections;
            this.app = app;
            this.patient_mocks = new PatientMocks();
            this.mocks = HistoricMocks;
            this.authSDK = new AuthTestSDK(this.app);

            async.series([
                cb => this.authSDK.logout_unregister(undefined, () => cb()),
                cb => this.authSDK.register_login(undefined, cb)
            ], (err, responses: Array<string>) => {
                if (err) {
                    return done(err);
                }
                this.token = responses[1];
                this.patientSDK = new PatientTestSDK(this.app, this.token);
                this.sdk = new HistoricTestSDK(this.app, this.token);
                return done();
            });
        }
    ));

    // Deregister database adapter connections
    after(done =>
        this.connections && async.parallel(Object.keys(this.connections).map(
            connection => this.connections[connection]._adapter.teardown
        ), done)
    );

    describe('/api/patient/{medicare_no}/historic', () => {
        beforeEach(done =>
            async.series([
                cb => this.patientSDK.deregister(this.patient_mocks.patients[0], () => cb()),
                cb => this.patientSDK.register(this.patient_mocks.patients[0], cb)
            ], done)
        );

        afterEach(done =>
            async.series([
                cb => this.sdk.deregister(this.mocks[0], cb),
                cb => this.patientSDK.deregister(this.patient_mocks.patients[0], cb)
            ], done)
        );


        it('POST should create Historic', (done) => {
            this.sdk.register(this.mocks[0], done);
        });
    });
});
