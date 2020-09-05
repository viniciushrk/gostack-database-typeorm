import {Entity,PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import Category from './Category';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column()
  value: number;

  @ManyToOne(()=>Category)
  // @ManyToOne(()=>Category,{ eager: true })
  @JoinColumn({name: 'category_id'})
  category: Category;

  @Column({select:false})
  category_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
