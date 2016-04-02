import * as async from 'async';
import {main, all_models_and_routes} from './../../../main';
import {test_sdk} from './historic_test_sdk';
import {test_sdk as patient_test_sdk} from './../patient/patient_test_sdk';
import {PatientMocks} from './../patient/patient_mocks';
import {HistoricMocks} from './historic_mocks';

const models_and_routes: helpers.IModelRoute = {
    contact: all_models_and_routes['contact'],
    patient: all_models_and_routes['patient'],
    historic: all_models_and_routes['historic']
};

describe('Historic::routes', () => {
    const self = this;
    before(done => main(models_and_routes,
        (app, connections) => {
            self.connections = connections;
            self.app = app;
            self.sdk = test_sdk(self.app);
            self.patient_sdk = patient_test_sdk(self.app);
            self.patient_mocks = new PatientMocks();
            self.mocks = HistoricMocks;
            done();
        }
    ));

    // Deregister database adapter connections
    after(done =>
        async.parallel(Object.keys(self.connections).map(
            connection => self.connections[connection]._adapter.teardown
        ), (err, _res) => done(err))
    );

    describe('/api/patient/{medicare_no}/historic', () => {
        beforeEach(done =>
            self.patient_sdk.deregister(self.patient_mocks.patients[0], () =>
                self.patient_sdk.register(self.patient_mocks.patients[0], done)
            )
        );

        afterEach(done =>
            self.sdk.deregister(self.mocks[0], (err) =>
                err && done(err) || self.patient_sdk.deregister(self.patient_mocks.patients[0], done)
            )
        );

        it('POST should create Historic', (done) => {
            self.sdk.register(self.mocks[0], done);
        });
    });
});
