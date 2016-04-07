import * as supertest from 'supertest';
import {expect} from 'chai';
import * as async from 'async';
import {cb as auth_test_sdk_cb} from './../auth/auth_test_sdk.d';
import {IVisit} from '../../../api/visit/models.d';

export class VisitTestSDK {
    constructor(public app) {
    }

    register(visit: IVisit, cb: auth_test_sdk_cb) {
        if (!visit) return cb(new TypeError('visit argument to register must be defined'));
        supertest(this.app)
            .post(`/api/patient/${visit.medicare_no}/visit`)
            .send(visit)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                expect(Object.keys(res.body).sort()).to.deep.equal([
                    'createdAt', 'id', 'iop_left_eye', 'medicare_no', 'updatedAt'
                ]);
                return cb(err, res.body);
            })
    }

    deregister(visit: IVisit, cb: auth_test_sdk_cb) {
        if (!visit) return cb(new TypeError('visit argument to register must be defined'));
        supertest(this.app)
            .delete(`/api/patient/${visit.medicare_no}/visit/${visit.createdAt}`)
            .send(visit)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                expect(res.statusCode).to.equal(204);
                return cb(err, res.body);
            })
    }

    registerManyFaux(visits: {visits: IVisit[]}, cb: auth_test_sdk_cb) {
        if (!visits) return cb(new TypeError('visits argument to registerManyFaux must be defined'));

        async.map(visits.visits, this.register, cb);
    }

    deregisterManyFaux(visits: {visits: IVisit[]}, cb: auth_test_sdk_cb) {
        if (!visits) return cb(new TypeError('visits argument to deregisterManyFaux must be defined'));
        async.map(visits.visits, this.deregister, cb);
    }
}
