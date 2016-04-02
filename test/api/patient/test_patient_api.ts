import * as async from 'async';
import {main, all_models_and_routes} from './../../../main';
import {test_sdk} from './patient_test_sdk';
import {PatientMocks} from './patient_mocks';

const models_and_routes: helpers.IModelRoute = {
    contact: all_models_and_routes['contact'],
    patient: all_models_and_routes['patient']
};

describe('Patient::routes', () => {
    before(done => main(models_and_routes,
        (app, connections) => {
            this.connections = connections;
            this.app = app;
            this.sdk = test_sdk(this.app);
            this.mocks = new PatientMocks();
            done();
        }
    ));

    // Deregister database adapter connections
    after(done =>
        async.parallel(Object.keys(this.connections).map(
            connection => this.connections[connection]._adapter.teardown
        ), (err, _res) => done(err))
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
            this.sdk.deregisterManyFaux(this.mocks, done)
        );

        afterEach(done =>
            this.sdk.deregisterManyFaux(this.mocks, done)
        );

        it('POST should create many Patient', (done) => {
            this.sdk.registerManyFaux(this.mocks, done);
        });
    });
});
