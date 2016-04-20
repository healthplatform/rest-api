import * as supertest from 'supertest';
import {expect} from 'chai';
import {cb} from '../../share_interfaces.d';
import {IPatientHistory} from '../../../api/historic/models.d';

export class HistoricTestSDK {
    constructor(private app, private token: string) {
        if (!token) {
            throw TypeError('PatientTestSDK needs token filled');
        }
    }

    register(historic: IPatientHistory, cb: cb) {
        if (!historic || Object.keys(historic).length < 1)
            return cb(new TypeError('historic argument to register must be defined'));
        supertest(this.app)
            .post(`/api/patient/${historic.medicare_no}/historic`)
            .set({'X-Access-Token': this.token})
            .send(historic)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));
                try {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.all.keys(
                        'asthma', 'createdAt', 'diabetes', 'ethnicity',
                        'hbA1c', 'hypertension', 'medicare_no', 'updatedAt'
                    );
                } catch (e) {
                    err = <Chai.AssertionError>e;
                } finally {
                    cb(err, res);
                }
            })
    }

    deregister(historic: IPatientHistory, cb: cb) {
        if (!historic || Object.keys(historic).length < 1)
            return cb(new TypeError('historic argument to register must be defined'));
        supertest(this.app)
            .delete(`/api/patient/${historic.medicare_no}/historic`)
            .set({'X-Access-Token': this.token})
            .send(historic)
            .end((err, res) => {
                if (err) return cb(err);
                else if (res.statusCode / 100 >= 3) return cb(new Error(JSON.stringify(res.text, null, 4)));

                try {
                    expect(res.statusCode).to.equal(204);
                } catch (e) {
                    err = <Chai.AssertionError>e;
                } finally {
                    cb(err, res);
                }
            })
    }
}
