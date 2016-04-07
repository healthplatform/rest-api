import * as supertest from 'supertest';
import {expect} from 'chai';
import * as async from 'async';
import {cb} from '../../share_interfaces.d';
import {IVisit} from '../../../api/visit/models.d';

export class VisitTestSDK {
    constructor(private app, private token) {
        if (!token) {
            throw TypeError('PatientTestSDK needs token filled');
        }
    }

    register(visit: IVisit, cb: cb) {
        if (!visit) return cb(new TypeError('visit argument to register must be defined'));
        supertest(this.app)
            .post(`/api/patient/${visit.medicare_no}/visit`)
            .set({'X-Access-Token': this.token})
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

    deregister(visit: IVisit, cb: cb) {
        if (!visit) return cb(new TypeError('visit argument to register must be defined'));
        supertest(this.app)
            .delete(`/api/patient/${visit.medicare_no}/visit/${visit.createdAt}`)
            .set({'X-Access-Token': this.token})
            .send(visit)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                expect(res.statusCode).to.equal(204);
                return cb(err, res.body);
            })
    }

    registerManyFaux(visits: {visits: IVisit[]}, cb: cb) {
        if (!visits) return cb(new TypeError('visits argument to registerManyFaux must be defined'));
        async.map(visits.visits, this.register, cb);
    }

    deregisterManyFaux(visits: {visits: IVisit[]}, cb: cb) {
        if (!visits) return cb(new TypeError('visits argument to deregisterManyFaux must be defined'));
        async.map(visits.visits, this.deregister, cb);
    }
}
