import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Category} from '../../model/Category';
import {EditCategoryDialogComponent} from '../../dialog/edit-category-dialog/edit-category-dialog.component';
import {MatDialog} from '@angular/material';
import {CategorySearchValues} from '../../data/search/SearchObjects';
import {DialogAction} from '../../object/DialogResult';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  // добавили категорию
  @Output()
  addCategory = new EventEmitter<Category>(); // передаем только название новой категории
  // поиск категории
  @Output()
  searchCategory = new EventEmitter<CategorySearchValues>(); // передаем строку для поиска
  selectedCategory; // если равно null - по-умолчанию будет выбираться категория 'Все' - задачи любой категории (и пустой в т.ч.)
  // для отображения иконки редактирования при наведении на категорию
  indexMouseMove: number;

  // выбрали категорию из списка
  @Output()
  selectCategory = new EventEmitter<Category>();

  // удалили категорию
  @Output()
  deleteCategory = new EventEmitter<Category>();

  // изменили категорию
  @Output()
  updateCategory = new EventEmitter<Category>();
  showEditIconCategory: boolean; // показывать ли иконку редактирования категории
  categories: Category[]; // категории для отображения

  //---------------------------------------------------------------------------------------
  // параметры поиска категорий
  categorySearchValues: CategorySearchValues;
  // кол-во незавершенных задач для категории Все (для остальных категорий статис-ка подгружаются вместе с самой категорией)
  uncompletedCountForCategoryAll: number;
  filterTitle: string;
  filterChanged: boolean; // были ли изменения в параметре поиска

  @Input('categories')
  set setCategories(categories: Category[]) {
    this.categories = categories;
  }

  @Input('categorySearchValues')
  set setCategorySearchValues(categorySearchValues: CategorySearchValues) {
    this.categorySearchValues = categorySearchValues;
  }

  @Input('selectedCategory')
  set setCategory(selectedCategory: Category) {
    this.selectedCategory = selectedCategory;
  }

  // используется для категории Все
  @Input('uncompletedCountForCategoryAll')
  set uncompletedCount(uncompletedCountForCategoryAll: number) {
    this.uncompletedCountForCategoryAll = uncompletedCountForCategoryAll;
  }

  constructor(
    private dialog: MatDialog, // внедряем MatDialog, чтобы работать с диалоговыми окнами

  ) {
  }

  // метод вызывается автоматически после инициализации компонента
  ngOnInit() {
    // this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
  }

  private showTasksByCategory(category: Category): void {

    // если не изменилось значение, ничего не делать (чтобы лишний раз не делать запрос данных)
    if (this.selectedCategory === category) {
      return;
    }

    this.selectedCategory = category; // сохраняем выбранную категорию

    // вызываем внешний обработчик и передаем туда выбранную категорию
    this.selectCategory.emit(this.selectedCategory);
  }

  clearAndSearch() {
    this.filterTitle = null;
    this.search();
  }

  //проверяет, были ли изменены какие-либо параметры поиска(по сравнению со старыми значениями)
  checkFilterChanged() {
    this.filterChanged = false;

    if (this.filterTitle !== this.categorySearchValues.title) {
      this.filterChanged = true;
    }

    return this.filterChanged;

  }

  showCategory(category: Category) {
    if (this.selectedCategory === category) {
      return;
    }

    this.selectedCategory = category; //сохраняем выбранную категорию
    this.selectCategory.emit(this.selectedCategory); // вызываем внешний обработчик
  }

  // диалоговое окно для редактирования категории
  private openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: [new Category(category.id, category.title), 'Редактирование категории'],
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!(result)) {
        return;
      }

      if (result.action === DialogAction.DELETE) { // нажали удалить
        this.deleteCategory.emit(category); // вызываем внешний обработчик
        return;
      }

      if (result.action === DialogAction.SAVE) { // нажали сохранить
        this.updateCategory.emit(result.obj as Category); // вызываем внешний обработчик
        return;
      }
    });
  }

  // диалоговое окно для добавления категории
  private openAddDialog(): void {

    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: [new Category(null, ''), 'Добавление категории'],
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) { //если просто закрыли окно, ничего не нажав
        return;
      }

      if (result.action === DialogAction.SAVE) {
        this.addCategory.emit(result.obj as Category); //вызываем внешний обработчик
      }
    });
  }

  // поиск категории
  private search(): void {

    console.log(this.categorySearchValues);
    this.filterChanged = false; // сбросить

    if (!this.categorySearchValues) { //если объект с параметрами поиска непустой
      return;
    }

    this.categorySearchValues.title = this.filterTitle;
    this.searchCategory.emit(this.categorySearchValues);

  }

  // сохраняет индекс записи категории, над который в данный момент проходит мышка (и там отображается иконка редактирования)
  private showEditIcon(show: boolean, index: number): void {
    this.indexMouseMove = index;
    this.showEditIconCategory = show;
  }
}
