import {collections} from '../../main';
import {IPrognosis} from './models.d';
import {NotFoundError, fmtError} from './../../utils/errors';

export const Prognosis = {
    identity: 'prognosis_tbl',
    connection: 'postgres',
    beforeValidate: (prognosis: IPrognosis, next) => {
        const Patient: waterline.Query = collections['patient_tbl'],
            Visit: waterline.Query = collections['visit_tbl'];
        Patient.count({medicare_no: prognosis.medicare_no}, (err, patientCount: number) => {
            if (err)
                return next(fmtError(err));
            else if (!patientCount)
                return next(new NotFoundError('patient'));
            Visit.count({medicare_no: prognosis.medicare_no, visit_created_at: prognosis.visit_created_at},
                (error, visitCount: number) => {
                    if (error)
                        return next(fmtError(error));
                    else if (!visitCount)
                        return next(new NotFoundError('visit'));
                    return next();
                });
        });
    },
    toJSON: function toJSON() {
        let prognosis: IPrognosis = this.toObject();
        for (const key in prognosis)
            if (prognosis.hasOwnProperty(key) && !prognosis[key]) delete prognosis[key];
        return prognosis;
    },
    attributes: {
        medicare_no: {
            required: true,
            type: 'string'
        },
        visit: {
            model: 'visit_tbl'
        },
        visit_created_at: {
            required: true,
            type: 'string'
        },
        prognosis: {
            required: true,
            type: 'string'
        },
        intervention: {
            required: true,
            type: 'string'
        }
    }
};
