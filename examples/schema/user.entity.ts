import { Entity, PrimaryColumn, BaseEntity,OneToMany ,Relation,Column} from "typeorm"
import { session } from "./session.entity.js"
import { key } from "./key.entity.js"



@Entity()
export class user extends BaseEntity {
    @PrimaryColumn()
    id: string
    @Column()
    username:string

    @OneToMany(() => session,(session) => {session.user})
    sessions:Relation<session[]>

    @OneToMany(() => key,(key) => {key.user})
    keys :Relation<key[]>
}