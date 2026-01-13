import { Exclude } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Exclude()
  @ManyToOne(() => User)
  user: User;

  constructor(partial: Partial<Task>) {
    Object.assign(this, partial);
  }
}
