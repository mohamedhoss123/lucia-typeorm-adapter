import { Entity, PrimaryColumn, Column, BaseEntity, ManyToOne } from "typeorm"
import { user } from "./user.entity.js"

@Entity()
export class key extends BaseEntity {
    @PrimaryColumn()
    id: string
    @Column()
    hashed_password?: string
    @Column()
    user_id: string

    @ManyToOne(()=>user,(user) => {user.keys})
    user:Relation<user>

}