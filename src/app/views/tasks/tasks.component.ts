import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Task} from '../../model/Task';
import {DataHandlerService} from '../../service/data-handler.service';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {EditTaskDialogComponent} from '../../dialog/edit-task-dialog/edit-task-dialog.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  @Output()
  updateTask = new EventEmitter<Task>();
  private displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category'];
  private dataSource: MatTableDataSource<Task>;
  //ссылки на компоненты таблицы
  @ViewChild(MatPaginator, {static: false}) private paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) private sort: MatSort;
  private tasks: Task[];

  constructor(
    private dataHandler: DataHandlerService,
    private dialog: MatDialog //работа с диалоговым окном
  ) {
  }

  @Input('tasks')
  private set setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.fillTable();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.fillTable();
  }

  toggleTaskCompleted(task: Task) {
    task.completed = !task.completed;
  }

  //диалоговое окно для редактирования и добавления задач
  openEditTaskDialog(task: Task) {

    //открытие диалогового окна
    const dialogRef = this.dialog.open(EditTaskDialogComponent,
      {data: [task, 'Редактирование задачи'], autoFocus: false});

    dialogRef.afterClosed().subscribe(result => {
      //обработка результатов
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

    this.addTableObjects();

    // @ts-ignore
    this.dataSource.sortingDataAccessor = (task, colName) => {
      switch (colName) {
        case 'priority' : {
          return task.priority ? task.priority.id : null;
        }
        case 'category' : {
          return task.category ? task.category.id : null;
        }
        case 'date' : {
          return task.date ? task.date : null;
        }
        case 'title' : {
          return task.title;
        }

      }
    };
  }

  private addTableObjects() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
