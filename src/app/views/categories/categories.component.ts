import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataHandlerService} from '../../service/data-handler.service';
import {Category} from '../../model/Category';
import {EditCategoryDialogComponent} from '../../dialog/edit-category-dialog/edit-category-dialog.component';
import {MatDialog} from '@angular/material';
import {OperType} from '../../dialog/OperType';

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

  @Input()
  selectedCategory: Category;

  //удалить категорию
  @Output()
  deleteCategory = new EventEmitter<Category>();

  //изменили категорию
  @Output()
  updateCategory = new EventEmitter<Category>();

  private indexMouseMove: number;

  @Output()
  private addCategory = new EventEmitter<string>();

  private searchCategoryTitle: string;

  @Output()
  private searchCategory = new EventEmitter<string>();

  constructor(
    private dataHandler: DataHandlerService,
    private dialog: MatDialog //работа с диалоговым окном
  ) {
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

  //сохраняет индекс записи категории, над которым в данный момент проходит мышка и там отображается кнопка
  private showEditIcon(index: number) {
    this.indexMouseMove = index;
  }

  //диалоговое окно для редактирования категории
  private openEditDialog(category: Category) {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: [category.title, 'Редактирование категории', OperType.EDIT],
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result === 'delete') {
        this.deleteCategory.emit(category);
        return;
      }

      if (typeof (result) === 'string') {
        category.title = result as string;

        this.updateCategory.emit(category);
        return;
      }
    });
  }

  // диалоговое окно для добавления категории
  private openAddDialog() {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: ['', 'Добавление категории', OperType.ADD],
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addCategory.emit(result as string); //вызываем внешний обработчик
      }
    });
  }

  //поиск категории
  private search() {
    if (this.searchCategoryTitle == null) {
      return;
    }

    this.searchCategory.emit(this.searchCategoryTitle);
  }
}
