import * as async from 'async';
import {main, all_models_and_routes} from './../../../main';
import {test_sdk} from './historic_test_sdk';
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
    const self = this;
    before(done => main(models_and_routes,
        (app, connections) => {
            this.connections = connections;
            this.app = app;
            this.sdk = test_sdk(self.app);
            this.patient_mocks = new PatientMocks();
            this.mocks = HistoricMocks;
            this.authSDK = new AuthTestSDK(this.app);

            console.info('about to call async.waterfall()');

            async.waterfall([
                cb => this.authSDK.logout_unregister(undefined, () => cb()),
                cb => this.authSDK.register_login(undefined, cb)
            ], (err, token) => {
                if (err) {
                    return done(err);
                }
                this.token = token;
                this.patientSDK = new PatientTestSDK(this.app, this.token);
                return done();
            });
        }
    ));

    // Deregister database adapter connections
    after(done =>
        self.connections && async.parallel(Object.keys(self.connections).map(
            connection => self.connections[connection]._adapter.teardown
        ), done)
    );

    describe('/api/patient/{medicare_no}/historic', () => {
        beforeEach(done =>
            async.series([
                cb => self.patient_sdk.deregister(self.patient_mocks.patients[0], () => cb()),
                cb => self.patient_sdk.register(self.patient_mocks.patients[0], cb)
            ], done)
        );

        afterEach(done =>
            async.series([
                cb => self.sdk.deregister(self.mocks[0], cb),
                cb => self.patient_sdk.deregister(self.patient_mocks.patients[0], cb)
            ], done)
        );


        it('POST should create Historic', (done) => {
            self.sdk.register(self.mocks[0], done);
        });
    });
});
