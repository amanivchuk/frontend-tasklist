import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataHandlerService} from '../../service/data-handler.service';
import {Category} from '../../model/Category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  //выбрали категорию из списка
  @Output()
  selectCategory = new EventEmitter<Category>();
  @Input()
  private categories: Category[];

  selectedCategory: Category;

  constructor(private dataHandler: DataHandlerService) {
  }

  ngOnInit() {
  }

  showTaskByCategory(category: Category) {

    //если не изменилось значение, ничего не делать
    if (this.selectedCategory === category) {
      return;
    }

    this.selectedCategory = category; //сохраняем выбранную категорию

    //вызываем внешний обработчик и передаем туда выбранную категорию
    this.selectCategory.emit(this.selectedCategory);
  }
}
