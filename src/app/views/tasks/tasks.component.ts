import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from '../../model/Task';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {Category} from '../../model/Category';
import {Priority} from '../../model/Priority';
import {TaskSearchValues} from '../../data/search/SearchObjects';
import {EditTaskDialogComponent} from '../../dialog/edit-task-dialog/edit-task-dialog.component';
import {DialogAction} from '../../object/DialogResult';
import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  // ----------------------- исходящие действия----------------------------

  @Output()
  addTask = new EventEmitter<Task>();
  @Output()
  deleteTask = new EventEmitter<Task>();
  @Output()
  updateTask = new EventEmitter<Task>();
  @Output()
  selectCategory = new EventEmitter<Category>();// нажали на категорию из списка задач
  @Output()
  paging = new EventEmitter<PageEvent>(); // переход по страницам данных
  @Output()
  searchAction = new EventEmitter<TaskSearchValues>(); //переход по страницам данных
  @Output()
  toggleSearch = new EventEmitter<boolean>(); //показать/скрыть поиск

  // -------------------------------------------------------------------------

  priorities: Priority[]; // список приоритетов (для фильтрации задач, для выпадающих списков)
  categories: Category[];

  @Input()
  totalTasksFounded: number; //сколько всего задач найдено

  @Input()
  showSearch: boolean; //показать/скрыть поиск

  @Input('priorities')
  set setPriorities(priorities: Priority[]) {
    this.priorities = priorities;
  }

  tasks: Task[]; // текущий список задач для отображения
  dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>(); // источник данных для таблицы

  // -------------------------------------------------------------------------
  @Input()
  private selectedCategory: Category;

  constructor(private dialog: MatDialog) {
  }

  @Input('categories')
  set setCategories(categories: Category[]) {
    this.categories = categories;
  }

  // все возможные параметры для поиска задач
  @Input('taskSearchValues')
  set setTaskSearchValues(taskSearchValues: TaskSearchValues) {
    this.taskSearchValues = taskSearchValues;
    this.initSearchValues(); //записать в локальные переменные
    this.initSortDirectionIcon(); //показать правильную иконку (убывание, возрастание)
  }

  changed = false;
  readonly defaultSortColumn = 'title';
  readonly defaultSortDirection = 'asc';

  //значения для поиска
  filterTitle: string;
  filterCompleted: number;
  filterPriorityId: number;
  filterSortColumn: string;
  filterSortDirection: string;

  // параметры поиска задач - первоначально данные загружаются из cookies (в app.component)
  taskSearchValues: TaskSearchValues;
  sortIconName: string; //иконка сортировки (убываниеб возрастание)

  //название иконки из коллекции
  readonly iconNameDown = 'arrow_downward';
  readonly iconNameUp = 'arrow_upward';

  // цвета
  readonly colorCompletedTask = '#F8F9FA';
  readonly colorWhite = '#fff';

  // поля для таблицы (те, что отображают данные из задачи - должны совпадать с названиями переменных класса)
  private displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category', 'operations', 'select'];

  // -------------------------------------------------------------------------

  @Input('tasks')
  private set setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.fillTable(); // передать данные таблице для отображения задач
  }

  ngOnInit() {
  }

  //диалоговое окно для редактирования и добавления задач
  openEditTaskDialog(task: Task) {

    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: [task, 'Редактирование задачи', this.categories, this.priorities],
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) {
        return;
      }
      if (result.action === DialogAction.DELETE) {
        this.deleteTask.emit(task);
        return;
      }
      if (result.action === DialogAction.COMPLETE) {
        task.completed = 1;// ставим статус задачи как выполненная
        this.updateTask.emit(task);
      }
      if (result.action === DialogAction.ACTIVATE) {
        task.completed = 0; // возвращаем статус задачи как невыполненная
        this.updateTask.emit(task);
        return;
      }
      if (result.action === DialogAction.SAVE) { // если нажали ОК и есть результат
        this.updateTask.emit(task);
        return;
      }
    });
  }

  // диалоговое окно подтверждения удаления
  openDeleteDialog(task: Task) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {dialogTitle: 'Подтвердите действия', message: `Вы действительно хотите удалить: "${task.title}"?`},
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) {
        return;
      }
      if (result.action === DialogAction.OK) {
        this.deleteTask.emit(task);
      }
    });
  }

  //диалоговое окно для добовление задачи
  openAddTaskDialog() {
    const task = new Task(null, '', 0, null, this.selectedCategory);

    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: [task, 'Добавление задачи', this.categories, this.priorities]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) {// если просто закрыли окно, ничего не нажав
        return;
      }

      if (result.action === DialogAction.SAVE) { // если нажали ОК
        this.addTask.emit(task);
      }
    });
  }

  // нажали/отжали выполнение задачи
  onToggleCompleted(task: Task) {
    if (task.completed === 0) {
      task.completed = 1;
    } else {
      task.completed = 0;
    }
    this.updateTask.emit(task);

  }

  getPriorityColor(task: Task) {
    //цвет завершенной задачи
    if (task.completed) {
      return '#F8F9FA';
    }

    if (task.priority && task.priority.color) {
      return task.priority.color;
    }

    return '#fff';
  }

  // в зависимости от статуса задачи - вернуть фоновый цвет
  getPriorityBgColor(task: Task) {

    if (task.priority != null && !task.completed) {
      return task.priority.color;
    }

    return 'none';
  }

// в это событие попадает как переход на другую страницу (pageIndex), так и изменение кол-ва данных на страниц (pageSize)
  pageChanged(pageEvent: PageEvent) {
    this.paging.emit(pageEvent);
  }

  //параметры поиска
  initSearch() {
    this.taskSearchValues.title = this.filterTitle;
    this.taskSearchValues.completed = this.filterCompleted;
    this.taskSearchValues.priorityId = this.filterPriorityId;
    this.taskSearchValues.sortColumn = this.filterSortColumn;
    this.taskSearchValues.sortDirection = this.filterSortDirection;

    this.searchAction.emit(this.taskSearchValues);

    this.changed = false; // сбрасываем флаг изменения
  }

  //проверяет были ли изменены какие-либо параметры поиска (по сравнению со старыми значениями)
  checkFilterChanged() {

    this.changed = false;

    // поочередно проверяем все фильтры (текущее введенное значение с последним сохраненным)
    if (this.taskSearchValues.title !== this.filterTitle) {
      this.changed = true;
    }

    if (this.taskSearchValues.completed !== this.filterCompleted) {
      this.changed = true;
    }

    if (this.taskSearchValues.priorityId !== this.filterPriorityId) {
      this.changed = true;
    }

    if (this.taskSearchValues.sortColumn !== this.filterSortColumn) {
      this.changed = true;
    }

    if (this.taskSearchValues.sortDirection !== this.filterSortDirection) {
      this.changed = true;
    }

    return this.changed;

  }

  //выбрали правильную иконку (убывание, возрастание)
  initSortDirectionIcon() {
    if (this.filterSortDirection === 'desc') {
      this.sortIconName = this.iconNameDown;
    } else {
      this.sortIconName = this.iconNameUp;
    }
  }

  //изменяем направдение сортировки
  changedSortDirection() {
    if (this.filterSortDirection === 'asc') {
      this.filterSortDirection = 'desc';
    } else {
      this.filterSortDirection = 'asc';
    }

    this.initSortDirectionIcon(); // применяем правильную иконку
  }

  //обновить локальные переменные поиска
  initSearchValues() {
    if (!this.taskSearchValues) {
      return;
    }

    this.filterTitle = this.taskSearchValues.title;
    this.filterCompleted = this.taskSearchValues.completed;
    this.filterPriorityId = this.taskSearchValues.priorityId;
    this.filterSortColumn = this.taskSearchValues.sortColumn;
    this.filterSortDirection = this.taskSearchValues.sortDirection;
  }

//обновить локальные переменные поиска
  clearSearchValues() {
    this.filterTitle = '';
    this.filterCompleted = null;
    this.filterPriorityId = null;
    this.filterSortColumn = this.defaultSortColumn;
    this.filterSortDirection = this.defaultSortDirection;
  }

  onToggleSearch() {
    this.toggleSearch.emit(!this.showSearch);
  }

  private fillTable() {

    if (!this.dataSource) {
      return;
    }
    this.dataSource.data = this.tasks;
  }
}
