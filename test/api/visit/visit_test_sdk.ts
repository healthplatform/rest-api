import * as supertest from 'supertest';
import * as async from 'async';
import {cb} from '../../share_interfaces.d';
import {IVisit} from '../../../api/visit/models.d';
import {expect} from 'chai';

let g_app: any;
let g_token: string;

export interface IVisitTestSDK {
    register(visit: IVisit, cb: cb);
    deregister(visit: IVisit, cb: cb);
    registerManyFaux(visits: {visits: IVisit[]}, cb: cb);
    deregisterManyFaux(visits: {visits: IVisit[]}, cb: cb);
}

export class VisitTestSDK implements IVisitTestSDK {
    constructor(public app, private token) {
        g_app = app;
        g_token = token;

        if (!token) {
            throw TypeError('PatientTestSDK needs token filled');
        }
    }

    register(visit: IVisit, cb: cb) {
        if (!visit || Object.keys(visit).length < 1)
            return cb(new TypeError('visit argument to register must be defined'));
        else if (!visit.medicare_no)
            return cb(new TypeError('visit doesn\'t have medicare_no attribute'));

        supertest(g_app)
            .post(`/api/patient/${visit.medicare_no}/visit`)
            .set({'X-Access-Token': g_token})
            .send(visit)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));

                try {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.all.keys(
                        'acuity_left_eye_den', 'acuity_left_eye_num', 'acuity_right_eye_den',
                        'acuity_right_eye_num', 'createdAt', 'id', 'iop_left_eye', 'iop_right_eye',
                        'medicare_no', 'updatedAt'
                    );
                } catch (e) {
                    err = <Chai.AssertionError>e;
                } finally {
                    cb(err, res.body);
                }
            })
    }

    deregister(visit: IVisit, cb: cb) {
        if (!visit || visit === undefined || Object.keys(visit).length < 1)
            return cb(new TypeError('visit argument to register must be defined'));
        else if (!visit.medicare_no)
            return cb(new TypeError('visit doesn\'t have medicare_no attribute'));
        else if (!visit.createdAt)
            return cb(new TypeError('visit doesn\'t have createdAt attribute'));
        supertest(g_app)
            .delete(`/api/patient/${visit.medicare_no}/visit/${visit.createdAt}`)
            .set({'X-Access-Token': g_token})
            .send(visit)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));

                try {
                    expect(res.statusCode).to.equal(204);
                } catch (e) {
                    err = <Chai.AssertionError>e;
                } finally {
                    cb(err, res.body);
                }
            })
    }

    registerManyFaux(visits: {visits: IVisit[]}, cb: cb) {
        if (!visits
            || visits === undefined
            || Object.keys(visits).length < 1
            || visits.visits === undefined
            || visits.visits.length === undefined
            || visits.visits.length < 1)
            return cb(new TypeError('visits argument to registerManyFaux must be defined'));
        async.map(visits.visits, this.register, cb);
    }

    deregisterManyFaux(visits: {visits: IVisit[]}, cb: cb) {
        if (!visits
            || visits === undefined
            || Object.keys(visits).length < 1
            || visits.visits === undefined
            || visits.visits.length === undefined
            || visits.visits.length < 1)
            return cb(new TypeError('visits argument to deregisterManyFaux must be defined'));
        async.map(visits.visits, this.deregister, cb);
    }
}
