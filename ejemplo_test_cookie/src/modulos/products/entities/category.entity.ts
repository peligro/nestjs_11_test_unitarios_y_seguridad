import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';


@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  slug: string;
}