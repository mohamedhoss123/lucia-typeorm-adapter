import { Entity, PrimaryColumn, ManyToOne, BaseEntity, Column ,Relation} from "typeorm"
import { user } from "./user.entity.js"

@Entity()
export class session extends BaseEntity {
    @PrimaryColumn()
    id: string
    @Column()
    user_id: string
    @Column()
    username:string
    @Column()
    display_name:string
    @Column({type:"bigint"})
    active_expires: string
    @Column({type:"bigint"})
    idle_expires: string
    @ManyToOne(() => user,(user) => {user.sessions})
    user: Relation<user>

}