import {Priority} from './Priority';
import {Category} from './Category';

export class Task{
  id: number;
  title: string;
  completed: number;
  priority?: Priority;
  category?: Category;
  date?: Date;

  //Сюда будет записываться старое значение,
  //которое изменили на новое (нужно для правильного обновления счетчиков категорий
  oldCategory: Category;


  constructor(id: number, title: string, completed: number, priority?: Priority, category?: Category, date?: Date, oldCategory?: Category) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.priority = priority;
    this.category = category;
    this.date = date;
    this.oldCategory = oldCategory;
  }
}

