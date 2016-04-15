export const Visit = {
    identity: 'visit_tbl',
    connection: 'postgres',
    attributes: {
        medicare_no: {
            required: true,
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
        toJSON: function toJSON(): JSON {
            let visit = this.toObject();
            for (const key in visit)
                if (!visit[key]) delete visit[key];
            return visit;
        }
    }
};
