import * as async from 'async';
import {main, all_models_and_routes} from './../../../main';
import {VisitTestSDK, IVisitTestSDK} from './visit_test_sdk';
import {PatientTestSDK} from './../patient/patient_test_sdk';
import {VisitMocks} from './visit_mocks';
import {PatientMocks} from '../patient/patient_mocks';
import {IVisit} from '../../../api/visit/models.d';
import {AuthTestSDK} from '../auth/auth_test_sdk';

const models_and_routes: helpers.IModelRoute = {
    user: all_models_and_routes['user'],
    auth: all_models_and_routes['auth'],
    contact: all_models_and_routes['contact'],
    patient: all_models_and_routes['patient'],
    visit: all_models_and_routes['visit'],
    prognosis: all_models_and_routes['prognosis']
};

describe('Visit::routes', () => {
    const self = this;
    before(done => main(models_and_routes,
        (app, connections) => {
            this.connections = connections;
            this.app = app;
            this.patient_mocks = new PatientMocks();
            this.mocks = VisitMocks;
            this.authSDK = new AuthTestSDK(this.app);

            async.series([
                cb => this.authSDK.logout_unregister(undefined, () => cb()),
                cb => this.authSDK.register_login(undefined, cb)
            ], (err, responses: Array<string>) => {
                if (err) return done(err);
                this.token = <string>responses[1];
                this.sdk = <IVisitTestSDK>new VisitTestSDK(this.app, this.token);
                self.sdk = <IVisitTestSDK>new VisitTestSDK(this.app, this.token);
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

    describe('/api/patient/{medicare_no}/visit', () => {
        beforeEach(done =>
            this.patientSDK.deregister(this.patient_mocks.patients[0], () =>
                this.patientSDK.register(this.patient_mocks.patients[0], done)
            )
        );

        /*
         afterEach(done =>
         this.sdk.deregister(this.mocks[0], err =>
         err ? done(err) : this.patientSDK.deregister(this.patient_mocks.patients[0], done)
         )
         );
         */

        it('POST should create Visit', done =>
            this.sdk.register(this.mocks[0], (err, visit: IVisit) => {
                console.info('cb of this.sdk.register');
                if (err) return done(err);
                this.mocks[0].createdAt = visit.createdAt;
                return done();
            })
        );
    });

    describe('[FAUX] /api/patient/{medicare_no}/visits', () => {
        beforeEach(done =>
            this.patientSDK.deregisterMany(this.patient_mocks, () =>
                this.patientSDK.registerMany(this.patient_mocks, done)
            )
        );

        /*afterEach(done =>
         this.sdk.deregisterManyFaux({visits: this.mocks}, err =>
         err ? done(err) : this.patientSDK.deregisterMany(this.patient_mocks, done)
         )
         );*/

        it('POST should create many Visit', done =>
            self.sdk.registerManyFaux({visits: this.mocks}, (err, visits: IVisit[]) => {
                console.info('GOT THIS FAR');
                process.exit(1);
                if (err) return done(err);
                for (let i = 0; i < visits.length; i++)
                    this.mocks[i].createdAt = visits[i].createdAt;
                console.info('after registerMany =', this.mocks);

                return done();
            })
        );
    });
});
