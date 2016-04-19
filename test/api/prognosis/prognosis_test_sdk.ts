import * as supertest from 'supertest';
import {expect} from 'chai';
import * as async from 'async';
import {cb} from '../../share_interfaces.d';
import {IPrognosis} from '../../../api/prognosis/models.d';

export class PrognosisTestSDK {
    constructor(private app, private token) {
        if (!token) {
            throw TypeError('PatientTestSDK needs token filled');
        }
    }

    register(prognosis: IPrognosis, cb: cb) {
        if (!prognosis || Object.keys(prognosis).length < 1)
            return cb(new TypeError('prognosis argument to register must be defined'));
        supertest(this.app)
            .post(`/api/patient/${prognosis.medicare_no}/prognosis`)
            .set({'X-Access-Token': this.token})
            .send(prognosis)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                expect(Object.keys(res.body).sort()).to.deep.equal([
                    'createdAt', 'id', 'iop_left_eye', 'medicare_no', 'updatedAt'
                ]);
                return cb(err, res.body);
            })
    }

    deregister(prognosis: IPrognosis, cb: cb) {
        if (!prognosis || Object.keys(prognosis).length < 1)
            return cb(new TypeError('prognosis argument to register must be defined'));
        supertest(this.app)
            .delete(`/api/patient/${prognosis.medicare_no}/prognosis/${prognosis.createdAt}`)
            .set({'X-Access-Token': this.token})
            .send(prognosis)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                expect(res.statusCode).to.equal(204);
                return cb(err, res.body);
            })
    }

    registerManyFaux(prognoses: {prognoses: IPrognosis[]}, cb: cb) {
        if (!prognoses || Object.keys(prognoses).length < 1 || prognoses.prognoses.length < 1)
            return cb(new TypeError('prognoses argument to registerManyFaux must be defined'));
        async.map(prognoses.prognoses, this.register, cb);
    }

    deregisterManyFaux(prognoses: {prognoses: IPrognosis[]}, cb: cb) {
        if (!prognoses || Object.keys(prognoses).length < 1 || prognoses.prognoses.length < 1)
            return cb(new TypeError('prognoses argument to deregisterManyFaux must be defined'));
        async.map(prognoses.prognoses, this.deregister, cb);
    }
}
