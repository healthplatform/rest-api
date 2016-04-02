export const PatientRecord = {
    identity: 'patient_record_tbl',
    connection: 'postgres',
    attributes: {
        medicare_no: {
            type: 'string',
            required: true,
            primaryKey: true
        },
        name: {
            type: 'string',
            required: true
        },
        suburb: {
            type: 'string',
            required: true
        },
        callback: {
            type: 'date',
            required: true
        },
        street: {
            type: 'string',
            required: true
        },
        state: {
            type: 'string',
            required: true
        },
        country: {
            type: 'string',
            required: true
        },
        contact0: {
            type: 'string',
            required: true
        },
        contact1: {
            type: 'string'
        },
        dob: {
            type: 'date',
            required: true
        },
        ethnicity: {
            type: 'string',
            required: true
        },
        toJSON: function toJSON(): JSON {
            let visit = this.toObject();
            for (const key in visit)
                if (!visit[key]) delete visit[key];
            return visit;
        }
    }
};
