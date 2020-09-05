import {getCustomRepository,getRepository,In, TransactionRepository} from "typeorm";
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import csvParse from 'csv-parse';
import fs from 'fs';

interface CSVTransaction {
  title: string;
  type: 'income'| 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository)
    const categoriesRepository = getRepository(Category)
    const contactsReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      from_line:2,
    })

    const parseCSV = contactsReadStream.pipe(parsers);
    const transactions:CSVTransaction[] = [];
    const categories:string[] = [];

    parseCSV.on('data', async line =>{
      const [title,type,value,category] = line.map((cell:string)=>
        cell.trim(),
      );
      if(!title || !type || !value) return;

      categories.push(category);

      transactions.push({title,type,value,category});

    });

    await new Promise(resolve => parseCSV.on('end',resolve));

    const existentCategories =await categoriesRepository.find({
      where:{
        title:In(categories)
      },
    });

    const existentCategoriesTitle = existentCategories.map((category:Category)=> category.title);

    const addCategoryTitle = categories.filter(
      category=>!existentCategoriesTitle.includes(category),
    ).filter((value,index,self)=>self.indexOf(value)===index);

    const newCategories = categoriesRepository.create(
      addCategoryTitle.map(title=>({
        title
      })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];
    const createdTransactions = await transactionsRepository.create(
      transactions.map(transaction=>(
        {
          title: transaction.title,
          type:transaction.type,
          value:transaction.value,
          category:finalCategories.find(
            category=>category.title === transaction.category,
          ),
        }))
    )
    await transactionsRepository.save(createdTransactions);

    await fs.promises.unlink(filePath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
