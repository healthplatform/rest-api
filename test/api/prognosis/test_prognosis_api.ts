import * as async from 'async';
import {main, all_models_and_routes} from './../../../main';
import {PrognosisTestSDK} from './prognosis_test_sdk';
import {PatientTestSDK} from './../patient/patient_test_sdk';
import {PrognosisMocks} from './prognosis_mocks';
import {PatientMocks} from '../patient/patient_mocks';
import {IVisit} from '../../../api/visit/models.d';
import {AuthTestSDK} from '../auth/auth_test_sdk';

const models_and_routes: helpers.IModelRoute = {
    user: all_models_and_routes['user'],
    auth: all_models_and_routes['auth'],
    contact: all_models_and_routes['contact'],
    patient: all_models_and_routes['patient'],
    kv: all_models_and_routes['kv'],
    visit: all_models_and_routes['visit'],
    prognosis:  all_models_and_routes['prognosis']
};

describe('Prognosis::routes', () => {
    before(done => main(models_and_routes,
        (app, connections) => {
            this.connections = connections;
            this.app = app;
            this.patient_mocks = new PatientMocks();
            this.mocks = PrognosisMocks;
            this.authSDK = new AuthTestSDK(this.app);

            async.series([
                cb => this.authSDK.logout_unregister(undefined, () => cb()),
                cb => this.authSDK.register_login(undefined, cb)
            ], (err, responses: Array<string>) => {
                if (err) {
                    return done(err);
                }
                this.token = responses[1];
                this.sdk = new PrognosisTestSDK(this.app, this.token);
                this.patientSDK = new PatientTestSDK(this.app, this.token);
                return done();
            });
        }
    ));

    // Deregister database adapter connections
    after(done =>
        async.parallel(Object.keys(this.connections).map(
            connection => this.connections[connection]._adapter.teardown
        ), done)
    );

    /*
    describe('/api/patient/{medicare_no}/visit', () => {
        beforeEach(done =>
            this.patientSDK.deregister(this.patient_mocks.patients[0], () =>
                this.patientSDK.register(this.patient_mocks.patients[0], done)
            )
        );

        afterEach(done =>
            this.sdk.deregister(this.mocks[0], err =>
                err && done(err) || this.patientSDK.deregister(this.patient_mocks.patients[0], done)
            )
        );

        it('POST should create Visit', (done) => {
            this.sdk.register(this.mocks[0], (err, visit: IVisit) => {
                if (err) return done(err);
                this.mocks[0].createdAt = visit.createdAt;
                return done();
            })
        });
    });
    */
});
