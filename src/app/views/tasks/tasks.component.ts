import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Task} from '../../model/Task';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource, PageEvent} from '@angular/material';
import {EditTaskDialogComponent} from '../../dialog/edit-task-dialog/edit-task-dialog.component';
import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';
import {Category} from '../../model/Category';
import {Priority} from '../../model/Priority';
import {OperType} from '../../dialog/OperType';
import {TaskSearchValues} from '../../data/search/SearchObjects';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  @Input()
  totalTasksFounded: number; //сколько всего задач найдено
  @Output()
  deleteTask = new EventEmitter<Task>();
  @Output()
  selectCategory = new EventEmitter<Category>();// нажали на категорию из списка задач
  @Output()
  paging = new EventEmitter<PageEvent>(); // переход по страницам данных
  @Output()
  searchAction = new EventEmitter<TaskSearchValues>(); //переход по страницам данных

  // ----------------------- исходящие действия----------------------------
  @Output()
  filterByTitle = new EventEmitter<string>();
  //параметры поиска задач - первоначально данные загружаются из cookies (в app.component)
  taskSearchValues: TaskSearchValues;

  @Output()
  updateTask = new EventEmitter<Task>();
  @Input()
  private selectedCategory: Category;
  @Output()
  private addTask = new EventEmitter<Task>();
  @Output()
  private filterByStatus = new EventEmitter<boolean>();
  @Output()
  private filterByPriority = new EventEmitter<Priority>();
  private tasks: Task[];

  constructor(
    private dialog: MatDialog //работа с диалоговым окном
  ) {
  }

  // -------------------------------------------------------------------------

  // все возможные параметры для поиска задач
  @Input('taskSearchValues')
  set setTaskSearchValues(taskSearchValues: TaskSearchValues) {
    this.taskSearchValues = taskSearchValues;
  }

  private displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category', 'operations', 'select'];
  private dataSource: MatTableDataSource<Task>;

  //ссылки на компоненты таблицы
  @ViewChild(MatPaginator, {static: false}) private paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) private sort: MatSort;

  @Input('priorities')
  set setPriorities(priorities: Priority[]) {
    this.priorities = priorities;
  }

  private searchTaskText: string;
  private selectedStatusFilter: boolean;

  private priorities: Priority[];
  private selectedPriorityFilter: Priority;

  @Input('tasks')
  private set setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.fillTable();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
  }

  toggleTaskCompleted(task: Task) {
    task.completed = !task.completed;
  }

  //диалоговое окно для редактирования и добавления задач
  openEditTaskDialog(task: Task) {

    //открытие диалогового окна
    const dialogRef = this.dialog.open(EditTaskDialogComponent,
      {
        data: [task, 'Редактирование задачи', OperType.EDIT],
        autoFocus: false
      });

    dialogRef.afterClosed().subscribe(result => {
      //обработка результатов

      if (result === 'complete') {
        task.completed = true;
        this.updateTask.emit(task);
        return;
      }

      if (result === 'activate') {
        task.completed = false;
        this.updateTask.emit(task);
        return;
      }

      if (result === 'delete') {
        this.deleteTask.emit(task);
        return;
      }

      if (result as Task) {//если нажали ОК и есть  результат
        this.updateTask.emit(task);
        return;
      }
    });
  }

  private getPriorityColor(task: Task) {

    //цвет завершенной задачи
    if (task.completed) {
      return '#F8F9FA';
    }

    if (task.priority && task.priority.color) {
      return task.priority.color;
    }

    return '#fff';
  }

  private fillTable() {

    if (!this.dataSource) {
      return;
    }
    this.dataSource.data = this.tasks;
  }

  private addTableObjects() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  openDeleteDialog(task: Task) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {dialogTitle: 'Подтвердите действия', message: `Вы действительно хотите удалить: "${task.title}"?`},
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTask.emit(task);
      }
    });
  }


  onToggleStatus(task: Task) {
    task.completed = !task.completed;
    this.updateTask.emit(task);
  }

  private onSelectCategory(category: Category) {
    this.selectCategory.emit(category);
  }

  //фильтрация по названию
  private onFilterByTitle() {
    this.filterByTitle.emit(this.searchTaskText);
  }

  private onFilterByStatus(value: boolean) {
    if (value != this.selectedStatusFilter) {
      this.selectedStatusFilter = value;
      this.filterByStatus.emit(this.selectedStatusFilter);
    }
  }

  private onFilterByPriority(value: Priority) {
    if (value !== this.selectedPriorityFilter) {
      this.selectedPriorityFilter = value;
      this.filterByPriority.emit(this.selectedPriorityFilter);
    }
  }

  //диалоговое окно для добовление задачи
  private openAddTaskDialog() {
    const task = new Task(null, '', false, null, this.selectedCategory);

    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: [task, 'Добавление задачи', OperType.ADD]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addTask.emit(task);
      }
    });
  }

  //в это событие попадает как переход на другую страницу (pageIndex),  так и изменение кол-ва данных на странице
  pageChanged(pageEvent: PageEvent) {
    this.paging.emit(pageEvent);
  }
}
