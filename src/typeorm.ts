import type {
    SessionSchema,
    Adapter,
    InitializeAdapter,
    UserSchema,
    KeySchema
} from "lucia";

import { DataSource, EntityTarget, ObjectLiteral } from "typeorm"
type PossiblePrismaError = {
    code: string;
    message: string;
};


export const typeormAdapter = (
    db: DataSource,
    modelNames: {
        user: EntityTarget<ObjectLiteral>;
        session: EntityTarget<ObjectLiteral> | null;
        key: EntityTarget<ObjectLiteral>;
    }
): InitializeAdapter<Adapter> => {
    const getModels = () => {
        return {
            User: modelNames.user,
            Session: modelNames.session,
            Key: modelNames.key
        };
    };
    const { User, Session, Key } = getModels();


    let manager = db.manager
    return (LuciaError) => {
        return {
            getUser: async (userId) => {
                const result = await manager.findOne(User, {
                    where: {
                        id: userId
                    }
                })
                return result;
            },
            setUser: async (user, key) => {
                if (!key) {
                    await manager.save(User, user)
                    return;
                }
                try {
                    await manager.transaction(async (transactionalEntityManager) => {
                        await transactionalEntityManager.save(User, user)
                        await transactionalEntityManager.save(Key, key)
                    })
                } catch (e) {
                    // const error = e as Partial<PossiblePrismaError>;
                    // if (error.code === "P2025") {
                    //     // user does not exist
                    //     return;
                    // }
                    throw e;
                }
            },
            deleteUser: async (userId) => {
                await manager.remove(User, { id: userId })
            },
            updateUser: async (userId, partialUser) => {
                await manager.update(User, { id: userId }, partialUser);
            },

            getSession: async (sessionId) => {
                if (!Session) {
                    throw new Error("Session table not defined");
                }
                const result = await manager.findOne(Session, {
                    where: {
                        id: sessionId
                    }
                });
                if (!result) return null;
                return transformTypeormSession(result);
            },
            getSessionsByUserId: async (userId) => {
                if (!Session) {
                    throw new Error("Session table not defined");
                }
                const sessions = await manager.find(Session, {
                    where: {
                        user_id: userId
                    }
                });
                return sessions.map((session) => transformTypeormSession(session));
            },
            setSession: async (session) => {
                if (!Session) {
                    throw new Error("Session table not defined");
                }
                try {
                    await manager.save(Session, {
                        ...session
                    });
                } catch (e) {
                    const error = e as Partial<PossiblePrismaError>;
                    if (error.code === "P2003") {
                        throw new LuciaError("AUTH_INVALID_USER_ID");
                    }

                    throw error;
                }
            },
            deleteSession: async (sessionId) => {
                if (!Session) {
                    throw new Error("Session table not defined");
                }
                try {
                    await manager.delete(Session, {
                        where: {
                            id: sessionId
                        }
                    });
                } catch (e) {
                    const error = e as Partial<PossiblePrismaError>;
                    if (error.code === "P2025") {
                        // session does not exist
                        return;
                    }
                    throw e;
                }
            },
            deleteSessionsByUserId: async (userId) => {
                if (!Session) {
                    throw new Error("Session table not defined");
                }
                await manager.delete(Session, {
                    where: {
                        user_id: userId
                    }
                });
            },
            updateSession: async (userId, partialSession) => {
                if (!Session) {
                    throw new Error("Session table not defined");
                }
                await manager.update(Session, 
                    {where: {
                        id: userId
                    }}, partialSession
                );
            },
            getKey: async (keyId) => {
				return await manager.findOne(Key,{
					where: {
						id: keyId
					}
				}) as KeySchema;
			},
			getKeysByUserId: async (userId) => {
				return await  manager.find(Key,{
					where: {
						user_id: userId
					}
				}) as KeySchema[];
			},
            setKey: async (key) => {
				try {
					await manager.save(Key,key);
				} catch (e) {
					const error = e as Partial<PossiblePrismaError>;
					if (error.code === "P2003") {
						throw new LuciaError("AUTH_INVALID_USER_ID");
					}
					if (error.code === "P2002" && error.message?.includes("`id`")) {
						throw new LuciaError("AUTH_DUPLICATE_KEY_ID");
					}
					throw error;
				}
			},
            deleteKey: async (keyId) => {
				try {
					await manager.delete(Key,{
						where: {
							id: keyId
						}
					});
				} catch (e) {
					const error = e as Partial<PossiblePrismaError>;
					if (error.code === "P2025") {
						// key does not exist
						return;
					}
					throw e;
				}
			},
            deleteKeysByUserId: async (userId) => {
				await manager.delete(Key,{
					where: {
						user_id: userId
					}
				});
			},
            updateKey: async (keyId, partialKey) => {
				await manager.update(Key,{
					where: {
						id: keyId
					}
				},partialKey);
			}

          
        };
    };
};

export const transformTypeormSession = (
    sessionData: ObjectLiteral
): SessionSchema => {
    const { active_expires, idle_expires: idleExpires, ...data } = sessionData;
    return {
        ...data,
        active_expires: Number(active_expires),
        idle_expires: Number(idleExpires)
    };
};
