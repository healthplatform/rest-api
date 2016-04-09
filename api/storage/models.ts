export const Storage = {
    identity: 'storage_tbl',
    connection: 'postgres',
    attributes: {
        name: {
            type: 'string',
            required: true,
            primaryKey: true
        },
        uploader: {
            type: 'string',
            required: true
        },
        remote_location: {
            type: 'string'
        },
        local_location: {
            type: 'string'
        },
        size: {
            type: 'integer'
        },
        mime_type: {
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
