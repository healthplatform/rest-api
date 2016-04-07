import * as supertest from 'supertest';
import {expect} from 'chai';
import {cb as auth_test_sdk_cb} from './../auth/auth_test_sdk.d';
import {IPatientHistory} from '../../../api/historic/models.d';

export class HistoricTestSDK {
    constructor(private app, private token: string) {
        if (!token) {
            throw TypeError('PatientTestSDK needs token filled');
        }
    }

    register(historic: IPatientHistory, cb: auth_test_sdk_cb) {
        if (!historic) return cb(new TypeError('historic argument to register must be defined'));
        supertest(this.app)
            .post(`/api/patient/${historic.medicare_no}/historic`)
            .set({'X-Access-Token': this.token})
            .send(historic)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                expect(Object.keys(res.body).sort()).to.deep.equal([
                    'asthma', 'createdAt', 'diabetes', 'ethnicity',
                    'hbA1c', 'hypertension', 'medicare_no', 'updatedAt'
                ]);
                return cb(err, res);
            })
    }

    deregister(historic: IPatientHistory, cb: auth_test_sdk_cb) {
        if (!historic) return cb(new TypeError('historic argument to register must be defined'));
        supertest(this.app)
            .delete(`/api/patient/${historic.medicare_no}/historic`)
            .set({'X-Access-Token': this.token})
            .send(historic)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                expect(res.statusCode).to.equal(204);
                return cb(err, res);
            })
    }
}
