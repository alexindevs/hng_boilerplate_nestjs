import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity';

@Entity({ name: 'waitlist' })
export class WaitlistEntry extends AbstractBaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;
}
