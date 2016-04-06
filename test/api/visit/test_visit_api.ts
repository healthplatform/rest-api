import * as async from 'async';
import {main, all_models_and_routes} from './../../../main';
import {VisitTestSDK} from './visit_test_sdk';
import {PatientTestSDK} from './../patient/patient_test_sdk';
import {VisitMocks} from './visit_mocks';
import {PatientMocks} from '../patient/patient_mocks';
import {IVisit} from '../../../api/visit/models.d';

const models_and_routes: helpers.IModelRoute = {
    contact: all_models_and_routes['contact'],
    patient: all_models_and_routes['patient'],
    kv: all_models_and_routes['kv'],
    visit: all_models_and_routes['visit']
};

describe('Visit::routes', () => {
    const self = this;
    before(done => main(models_and_routes,
        (app, connections) => {
            self.connections = connections;
            self.app = app;
            self.sdk = new VisitTestSDK(self.app);
            self.patient_mocks = new PatientMocks();
            self.mocks = VisitMocks;

            async.waterfall([
                cb => this.authSDK.logout_unregister(undefined, () => cb()),
                cb => this.authSDK.register_login(undefined, cb)
            ], (err, token) => {
                if (err) {
                    return done(err);
                }
                self.token = token;
                self.patientSDK = new PatientTestSDK(self.app, self.token);
                return done();
            });
            done();
        }
    ));

    // Deregister database adapter connections
    after(done =>
        async.parallel(Object.keys(self.connections).map(
            connection => self.connections[connection]._adapter.teardown
        ), (err, _res) => done(err))
    );

    describe('/api/patient/{medicare_no}/visit', () => {
        beforeEach(done =>
            self.patient_sdk.deregister(self.patient_mocks.patients[0], () =>
                self.patient_sdk.register(self.patient_mocks.patients[0], done)
            )
        );

        afterEach(done =>
            self.sdk.deregister(self.mocks[0], err =>
                err && done(err) || self.patient_sdk.deregister(self.patient_mocks.patients[0], done)
            )
        );

        it('POST should create Visit', (done) => {
            self.sdk.register(self.mocks[0], (err, visit: IVisit) => {
                if (err) return done(err);
                self.mocks[0].createdAt = visit.createdAt;
                return done();
            })
        });
    });

    describe('[FAUX] /api/patient/{medicare_no}/visits', () => {
        beforeEach(done =>
            self.patient_sdk.deregisterMany(self.patient_mocks, () =>
                self.patient_sdk.registerMany(self.patient_mocks, done)
            )
        );

        afterEach(done =>
            self.sdk.deregisterManyFaux(self.mocks, err =>
                err && done(err) || self.patient_sdk.deregister(self.patient_mocks.patients[0], done)
            )
        );

        it('POST should create many Visit', (done) => {
            self.sdk.registerManyFaux(self.mocks, (err, visits: IVisit[]) => {
                if (err) return done(err);
                console.log('visits =', visits);
                for (let i = 0; i < visits.length; i++)
                    self.mocks[i].createdAt = visits[i].createdAt;

                return done();
            })
        });
    });
});
