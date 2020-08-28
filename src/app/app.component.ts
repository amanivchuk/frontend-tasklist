import {Component, OnInit} from '@angular/core';
import {Task} from './model/Task';
import {Category} from './model/Category';
import {Priority} from './model/Priority';
import {Observable} from 'rxjs';
import {CategoryService} from './data/impl/CategoryService';
import {CategorySearchValues, TaskSearchValues} from './data/search/SearchObjects';
import {TaskService} from './data/impl/TaskService';
import {MatDialog, PageEvent} from '@angular/material';
import {PriorityService} from './data/impl/PriorityService';
import {Stat} from './model/Stat';
import {DashboardData} from './object/DashboardData';
import {StatService} from './data/impl/StatService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  readonly defaultPageSize = 5;

  private tasks: Task[];
  private categories: Category[]; // все категории
  private priorities: Priority[]; // все приоритеты
  readonly defaultPageNumber = 0;
  // параметры поисков
  categorySearchValues = new CategorySearchValues();
  taskSearchValues = new TaskSearchValues();
  // выбранная категория
  private selectedCategory: Category = null;

  // показать/скрыть статистику
  showStat = true;
  // статистика для категории ВСЕ
  private uncompletedCountForCategoryAll: number;
  //показать-скрыть поиск
  showSearch = true;
  private totalTasksFounded: number;

  stat: Stat; // даннын общей статистики
  dash: DashboardData = new DashboardData();//данные для дашбоарда

  constructor(
    private categoryService: CategoryService,
    private taskService: TaskService,
    private priorityService: PriorityService,
    private statService: StatService,
    private dialog: MatDialog
  ) {
    this.statService.getOverallStat().subscribe((result) => {
      this.stat = result;
      this.uncompletedCountForCategoryAll = this.stat.uncompletedTotal;

      //  заполнить категории
      this.fillAllCategories().subscribe(res => {
        this.categories = res;

        //первоначальное отображение задач при загрузке приложения
        //запускаем только после выполнения статистики (т.к. понадобятся ее данные) и загруженных категорий
        this.onSelectCategory(this.selectedCategory);
      });
    });
  }

  ngOnInit() {
    this.fillAllPriorities();
  }

  //заполняет массив приоритетов
  fillAllPriorities() {
    this.priorityService.findAll().subscribe(result => {
      this.priorities = result;
    });
  }

  // заполняет категории и кол-во невыполненных задач по каждой из них (нужно для отображения категорий)
  fillAllCategories(): Observable<Category[]> {
    return this.categoryService.findAll();
  }

  //заполниить дэш конкретными значениями
  fillDashData(completedCount: number, uncompletedCount: number) {
    this.dash.completedTotal = completedCount;
    this.dash.uncompletedTotal = uncompletedCount;
  }

  //изменили кол-во элементов на странице или перешли на другую страницу
  paging(pageEvent: PageEvent) {
    //если изменили кол-во нв странице - заново делаем щапрос и показываем с 1й страницы
    if (this.taskSearchValues.pageSize !== pageEvent.pageSize) {
      this.taskSearchValues.pageNumber = 0;//новые данные будем показывать с 1й страницы (индекс 0)
    } else {
      //если просто перешли на другую страницу
      this.taskSearchValues.pageNumber = pageEvent.pageIndex;
    }

    this.taskSearchValues.pageSize = pageEvent.pageSize;
    this.taskSearchValues.pageNumber = pageEvent.pageIndex;

    this.onSearchTasks(this.taskSearchValues); // показываем новые данные
  }

  //
  updateCategoryCounter(category: Category) {
    this.categoryService.findById(category.id).subscribe(cat => {
      this.categories[this.getCategoryIndex(category)] = cat;
      this.showCategoryDashboard(cat);
    });
  }

  // добавление категории
  private onAddCategory(category: Category): void {
    this.categoryService.add(category).subscribe(result => {
      this.onSearchCategory(this.categorySearchValues);
    });
  }

  // удаление категории
  private onDeleteCategory(category: Category) {
    this.categoryService.delete(category.id).subscribe(cat => {
      this.onSearchCategory(this.categorySearchValues);
      this.onSelectCategory(this.selectedCategory);
    });
  }

  // обновлении категории
  private onUpdateCategory(category: Category): void {
    this.categoryService.update(category).subscribe(() => {
      this.onSearchCategory(this.categorySearchValues); //обновляем список категорий
      this.onSearchTasks(this.taskSearchValues); //обновляем список задач
    });
  }

  // поиск категории
  private onSearchCategory(categorySearchValues: CategorySearchValues): void {
    this.categoryService.findCategories(categorySearchValues).subscribe(result => {
      this.categories = result;
    });
  }

  // поиск задач
  private onSearchTasks(searchTaskValues: TaskSearchValues): void {
    this.taskSearchValues = searchTaskValues;

    this.taskService.findTasks(this.taskSearchValues).subscribe(result => {
      this.totalTasksFounded = result.totalElements;// сколько данных показывать на странице
      this.tasks = result.content; //массив задач
    });
  }

  showCategoryDashboard(cat: Category) {
    if (this.selectedCategory && this.selectedCategory.id === cat.id) {
      this.fillDashData(cat.completedCount, cat.uncompletedCount);
    }
  }

  getCategoryIndex(category: Category): number {
    const tmpCategory = this.categories.find(t => t.id === category.id);
    return this.categories.indexOf(tmpCategory);
  }

  getCategoryIndexById(id: number): number {
    const tmpCategory = this.categories.find(t => t.id === id);
    return this.categories.indexOf(tmpCategory);
  }

  // показать-скрыть статистику
  private toggleStat(showStat: boolean): void {
    this.showStat = showStat;
  }

  //показать-скрыть поиск
  toggleSearch(showSearch: boolean) {
    this.showSearch = showSearch;
  }

  // обновить общую статистику и счетчик для категории Все (и показать эти данные в дашборде, если выбрана категория "Все")
  updateOverallCounter() {
    this.statService.getOverallStat().subscribe((res) => {
      this.stat = res;
      this.uncompletedCountForCategoryAll = this.stat.uncompletedTotal;

      if (!this.selectedCategory) {
        this.fillDashData(this.stat.completedTotal, this.stat.uncompletedTotal);
      }
    });
  }

  // выбрали/ изменение категории
  private onSelectCategory(category: Category): void {

    if (category) { // если это не категория Все - то заполняем дэш данными выбранной категории
      this.fillDashData(category.completedCount, category.uncompletedCount);
    } else {
      this.fillDashData(this.stat.completedTotal, this.stat.uncompletedTotal);// заполняем дэш данными для категории Все
    }

    // сбрасываем, чтобы показывать результат с первой страницы
    this.taskSearchValues.pageNumber = 0;

    this.selectedCategory = category; //запоминаем выбранную категорию

    // для поиска задач по данной категории
    this.taskSearchValues.categoryId = category ? category.id : null;

    //  обновить список задач согласно выбранной категории и другим параметрам поиска из taskSearchValues
    this.onSearchTasks(this.taskSearchValues);

  }

  // добавление задачи
  private onAddTask(task: Task) {
    // более правильно - реализовать код ниже с помощью цепочки rxjs (чтобы выполнялось последовательно и с условиями),
    // но решил сильно не усложнять
    this.taskService.add(task).subscribe(result => {

      if (task.category) { //если в новой задаче была указана категория
        this.updateCategoryCounter(task.category);
      }
      this.updateOverallCounter(); // обновляем всю статистику (в том числе для категории Все
      this.onSearchTasks(this.taskSearchValues); // обновляем список задач
    });
  }

  // обновление задачи
  private onUpdateTask(task: Task): void {
    this.taskService.update(task).subscribe(result => {

      if (task.oldCategory) {
        this.updateCategoryCounter(task.oldCategory);
      }
      if (task.category) {
        this.updateCategoryCounter(task.category);
      }
      this.updateOverallCounter();
      this.onSearchTasks(this.taskSearchValues);
    });
  }

  // удаление задачи
  private onDeleteTask(task: Task) {
    // более правильно - реализовать код ниже с помощью цепочки rxjs (чтобы выполнялось последовательно и с условиями),
    // но решил сильно не усложнять
    this.taskService.delete(task.id).subscribe(result => {

      if (task.category) { // если в удаленной задаче была указана категория
        this.updateCategoryCounter(task.category);// обновляем счетчик для указанной категории
      }
      this.updateOverallCounter();// обновляем всю статистику (в том числе счетчик для категории "Все")
      this.onSearchTasks(this.taskSearchValues); // обновляем список задач
    });
  }
}
