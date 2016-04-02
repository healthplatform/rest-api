// Should really use the Postgres KV feature
// ... also I do have Redis...
export const KV = {
    identity: 'kv_tbl',
    connection: 'postgres',
    attributes: {
        key: {
            type: 'string',
            required: true,
            primaryKey: true
        },
        value: {
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
