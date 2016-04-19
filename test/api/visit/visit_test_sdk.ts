import * as supertest from 'supertest';
import {expect} from 'chai';
import * as async from 'async';
import {cb} from '../../share_interfaces.d';
import {IVisit} from '../../../api/visit/models.d';

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

        supertest(this.app)
            .post(`/api/patient/${visit.medicare_no}/visit`)
            .set({'X-Access-Token': this.token})
            .send(visit)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                expect(res.body).to.have.all.keys(
                    'createdAt', 'id','iop_left_eye', 'medicare_no','updatedAt', 'hello'
                );
                return cb(err, res.body);
            })
    }

    deregister(visit: IVisit, cb: cb) {
        if (!visit || visit === undefined || Object.keys(visit).length < 1)
            return cb(new TypeError('visit argument to register must be defined'));
        else if (!visit.medicare_no)
            return cb(new TypeError('visit doesn\'t have medicare_no attribute'));
        else if (!visit.createdAt)
            return cb(new TypeError('visit doesn\'t have createdAt attribute'));
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
