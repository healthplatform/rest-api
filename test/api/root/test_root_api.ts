import * as supertest from 'supertest';
import {expect} from 'chai';
import {main} from './../../../main';

describe('Root::routes', () => {
    before(done =>
        main(
            {},
            app => {
                this.app = app;
                return done();
            },
            true
        )
    );

    describe('/', () => {
        it('should get version', (done) =>
            supertest(this.app)
                .get('/')
                .expect('Content-Type', /json/)
                .expect('Content-Length', '19')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.statusCode).to.be.equal(200);
                    expect(res.body).to.have.property('version').with.length(5);
                    return done();
                })
        );
    });
});
