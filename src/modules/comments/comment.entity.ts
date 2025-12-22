import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  post_id!: string;

  @Column()
  user_id!: string;

  @Column('text')
  content!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne('Post', 'comments', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post!: any;

  @ManyToOne('User', 'comments', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  author!: any;
}
