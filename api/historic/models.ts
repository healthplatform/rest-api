export const Historic = {
    identity: 'patient_historic_tbl',
    connection: 'postgres',
    attributes: {
        medicare_no: {
            type: 'string',
            required: true,
            primaryKey: true
        },
        hypertension: {
            type: 'boolean'
        },
        asthma: {
            type: 'boolean'
        },
        diabetes: {
            type: 'boolean'
        },
        diabetes_type: {
            type: 'string'
        },
        diabetic_since: {
            type: 'date'
        },
        diabetes_control: {
            type: 'string'
        },
        hbA1c: {
            type: 'numeric'
        },
        /*
        allergies: {
            type: 'array',
            'items': {
                type: 'string'
            }
        },
        current_medication: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        */
        eyedrop_intolerance: {
            type: 'string'
        },
        family_social_history: {
            type: 'string'
        },
        ethnicity: {
            type: 'string'
        },
        toJSON: function toJSON(): JSON {
            let visit = this.toObject();
            for (const key in visit)
                if (!visit[key]) delete visit[key];
            return visit;
        }
    }
};
