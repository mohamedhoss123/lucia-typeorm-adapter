import type { SessionSchema, Adapter, InitializeAdapter } from "lucia";
import { DataSource, EntityTarget, ObjectLiteral } from "typeorm";
export declare const typeormAdapter: (db: DataSource, modelNames: {
    user: EntityTarget<ObjectLiteral>;
    session: EntityTarget<ObjectLiteral> | null;
    key: EntityTarget<ObjectLiteral>;
}) => InitializeAdapter<Adapter>;
export declare const transformPrismaSession: (sessionData: ObjectLiteral) => SessionSchema;
