import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {DataHandlerService} from '../../service/data-handler.service';
import {Task} from '../../model/Task';
import {Category} from '../../model/Category';
import {Priority} from '../../model/Priority';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})
export class EditTaskDialogComponent implements OnInit {

  private categories: Category[];
  private priorities: Priority[];
  private dialogTitle: string; //заголовок окна
  private task: Task; // задача для редактирования/создания
  private tmpTitle: string;
  private tmpCategory: Category;
  private tmpPriority: Priority;
  private tmpDate: Date;

  constructor(
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,//для возможности работы с текущим диалоговым оконом
    @Inject(MAT_DIALOG_DATA) private data: [Task, string], //данные которые прередали в диалоговое окно
    private dataHandler: DataHandlerService, //ссылка на сервис для работы с данными
    private dialog: MatDialog, //для открытия нового диалогового окна (из текущего), например для подтверждения удаления
  ) {
  }

  ngOnInit() {
    this.task = this.data[0]; //задача для редактирования/создания
    this.dialogTitle = this.data[1]; //текст для диалогового окна

    this.tmpTitle = this.task.title;
    this.tmpCategory = this.task.category;
    this.tmpPriority = this.task.priority;
    this.tmpDate = this.task.date;

    this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
    this.dataHandler.getAllPriorities().subscribe(priorities => this.priorities = priorities);
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердить действие',
        message: `Вы действительно хотите удалить задачу "${this.task.title}"?`
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close('delete');//нажали удалить
      }
    });
  }

//  нажали отмену
  private onCancel(): void {
    this.dialogRef.close(null);
  }

  complete() {
    this.dialogRef.close('complete');
  }

  activate() {
    this.dialogRef.close('activate');
  }

  //нажали ОК
  private onConfirm(): void {
    this.task.title = this.tmpTitle;
    this.task.category = this.tmpCategory;
    this.task.priority = this.tmpPriority;
    this.task.date = this.tmpDate;

    this.dialogRef.close(this.task);
  }

}
