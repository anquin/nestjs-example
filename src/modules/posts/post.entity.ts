import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @Column()
  title!: string;

  @Column('text')
  content!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne('User', 'posts', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  author!: any;

  @OneToMany('Comment', 'post')
  comments!: any[];
}
