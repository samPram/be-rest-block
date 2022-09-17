import { User } from '../../models/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('login-activity')
export class LoginActivity {
  @PrimaryGeneratedColumn('uuid')
  id_activity: string;

  @Column('varchar', { length: 144, nullable: false })
  refresh_token: string;

  @Column('timestamp')
  expired: Date;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
