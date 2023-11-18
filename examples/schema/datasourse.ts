import { DataSource } from "typeorm"
import { key } from "./key.entity.js"
import { session } from "./session.entity.js"
import { user } from "./user.entity.js"


export const AppDataSource = new DataSource({
    // type: "mysql",
    // host: "localhost",
    // port: 3306,
    // username: "root",
    // password: "",
    // database: "lucia",
    // synchronize: true,
    // entities: [user, key, session],
    // subscribers: [],
    // migrations: [],
})