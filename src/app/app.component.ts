import {Component, OnInit} from '@angular/core';
import {Task} from './model/Task';
import {Category} from './model/Category';
import {Priority} from './model/Priority';
import {Observable} from 'rxjs';
import {CategoryService} from './data/impl/CategoryService';
import {CategorySearchValues, TaskSearchValues} from './data/search/SearchObjects';
import {TaskService} from './data/impl/TaskService';
import {PageEvent} from '@angular/material';
import {PriorityService} from './data/impl/PriorityService';

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
  private showStat = true;
  // статистика для категории ВСЕ
  private uncompletedCountForCategoryAll: number;
  //статус показать-скрыть статистику
  showSearch: boolean;
  private totalTasksFounded: number;

  //сколько всего задач найдено

  constructor(
    private categoryService: CategoryService,
    private taskService: TaskService,
    private priorityService: PriorityService
  ) {
  }

  ngOnInit() {
    // заполнить меню с категориями
    this.fillAllCategories().subscribe(res => {
      this.categories = res;

      //первоночальное отображение задач при загрузке приложения
      //запускаем только после выполнения статистики (т.к. понвдобятся ее данные) и загруженные категорий
      this.onSelectCategory(this.selectedCategory);
    });

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

  // выбрали/ изменение категории
  private onSelectCategory(category: Category): void {

    // сбрасываем, чтобы показывать результат с первой страницы
    this.taskSearchValues.pageNumber = 0;

    this.selectedCategory = category; //запоминаем выбранную категорию

    // для поиска задач по данной категории
    this.taskSearchValues.categoryId = category ? category.id : null;

    //  обновить список задач согласно выбранной категории и другим параметрам поиска из taskSearchValues
    this.onSearchTasks(this.taskSearchValues);

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

  // добавление задачи
  private onAddTask(task: Task) {

  }

  // обновление задачи
  private onUpdateTask(task: Task): void {

  }

  // удаление задачи
  private onDeleteTask(task: Task) {

  }

  // фильтрация задач по статусу (все, решенные, нерешенные)
  private onFilterTasksByStatus(status: boolean): void {
    // this.statusFilter = status;
    this.updateTasks();
  }

  // фильтрация задач по приоритету
  private onFilterTasksByPriority(priority: Priority): void {
    // this.priorityFilter = priority;
    this.updateTasks();
  }

  // показывает задачи с применением всех текущий условий (категория, поиск, фильтры и пр.)
  private updateTasksAndStat(): void {

    this.updateTasks(); // обновить список задач

    // обновить переменные для статистики
    this.updateStat();

  }

  private updateTasks(): void {
    // this.dataHandler.searchTasks(
    //   this.selectedCategory,
    //   this.searchTaskText,
    //   this.statusFilter,
    //   this.priorityFilter
    // ).subscribe((tasks: Task[]) => {
    //   this.tasks = tasks;
    // });
  }

  // показать-скрыть статистику
  private toggleStat(showStat: boolean): void {
    this.showStat = showStat;
  }

  // обновить статистику
  private updateStat(): void {
    // zip(
    //   this.dataHandler.getTotalCountInCategory(this.selectedCategory),
    //   this.dataHandler.getCompletedCountInCategory(this.selectedCategory),
    //   this.dataHandler.getUncompletedCountInCategory(this.selectedCategory),
    //   this.dataHandler.getUncompletedTotalCount())
    //
    //   .subscribe(array => {
    //     this.totalTasksCountInCategory = array[0];
    //     this.completedCountInCategory = array[1];
    //     this.uncompletedCountInCategory = array[2];
    //     this.uncompletedTotalTasksCount = array[3]; // нужно для категории Все
    //   });
  }

  //показать-скрыть поиск
  toggleSearch(showSearch: boolean) {
    this.showSearch = showSearch;
  }
}
