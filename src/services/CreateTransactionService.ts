import AppError from '../errors/AppError';
import {getRepository, getCustomRepository} from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
// import Transaction from '../models/Transaction';
import Category from '../models/Category';
interface Request{
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({title,value,type,category}:Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const {total} = await transactionsRepository.getBalance();

    if(type === "outcome" && total < value){
      throw new AppError('You do not have enough balance')
    }

    let findCategory = await categoryRepository.findOne({
      where:{title:category}
    });
    if(!findCategory){
        findCategory = await categoryRepository.create({title:category});
        await categoryRepository.save(findCategory)
    }
    const transaction = await transactionsRepository.create(
        {title,value,type:type,category:findCategory}
      );

    await transactionsRepository.save(transaction)

    return transaction;
  }
}

export default CreateTransactionService;
