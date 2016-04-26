import {collections} from '../../main';
import {IVisit} from './models.d';
import {NotFoundError, fmtError} from './../../utils/errors';
import {getUTCDate} from '../../utils/helpers';

export const Visit = {
    identity: 'visit_tbl',
    connection: 'postgres',
    beforeValidate: (visit: IVisit, next) => {
        const Patient: waterline.Query = collections['patient_tbl'];
        Patient.count({medicare_no: visit.medicare_no}, (err, count: number) => {
            if (err)
                return next(fmtError(err));
            else if (!count)
                return next(new NotFoundError('patient'));

            if (!visit.id) { // i.e.: this is a `.create` call
                visit.createdAt = getUTCDate();
                visit.updatedAt = visit.createdAt;
                visit.id = `${visit.medicare_no}\t${visit.createdAt.toISOString()}`;
            }

            return next();
        });
    },
    attributes: {
        id: {
            required: true,
            primaryKey: true,
            type: 'string'
        },
        acuity_left_eye_num: {
            type: 'integer'
        },
        acuity_right_eye_num: {
            type: 'integer'
        },
        acuity_left_eye_den: {
            type: 'integer'
        },
        acuity_right_eye_den: {
            type: 'integer'
        },
        callback: {
            type: 'date'
        },
        cct_left_eye: {
            type: 'integer'
        },
        cct_right_eye: {
            type: 'integer'
        },
        gonio_left_eye: {
            type: 'integer'
        },
        gonio_right_eye: {
            type: 'integer'
        },
        iop_left_eye: {
            type: 'integer'
        },
        iop_right_eye: {
            type: 'integer'
        },
        medicare_no: {
            required: true,
            type: 'string'
        },
        prognoses: {
            collection: 'prognosis_tbl',
            via: 'medicare_no'
        },
        reason: {
            type: 'string'
        },
        refraction_left_eye: {
            type: 'integer'
        },
        refraction_right_eye: {
            type: 'integer'
        },
        retinal_disc_left_eye: {
            type: 'string'
        },
        retinal_disc_right_eye: {
            type: 'string'
        },
        vf_left_eye: {
            type: 'string'
        },
        vf_right_eye: {
            type: 'string'
        },

        /*
         additional_left_eye: {
         collection: 'kv_tbl',
         via: 'key'
         },
         additional_right_eye: {
         collection: 'kv_tbl',
         via: 'key'
         },
         */
        toJSON: function toJSON() {
            let visit: IVisit = this.toObject();
            for (const key in visit)
                if (visit.hasOwnProperty(key) && !visit[key]) delete visit[key];
            return visit;
        },
    }
};
