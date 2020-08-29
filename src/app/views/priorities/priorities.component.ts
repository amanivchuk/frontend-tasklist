import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Priority} from '../../model/Priority';
import {MatDialog} from '@angular/material';
import {EditPriorityComponent} from '../../dialog/edit-priority/edit-priority.component';
import {EditCategoryDialogComponent} from '../../dialog/edit-category-dialog/edit-category-dialog.component';
import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';
import {DialogAction} from '../../object/DialogResult';

@Component({
  selector: ' app-priorities',
  templateUrl: './priorities.component.html',
  styleUrls: ['./priorities.component.css']
})
export class PrioritiesComponent implements OnInit {

  static defaultColor = '#fff';
  @Output()
  deletePriority = new EventEmitter<Priority>();
  @Output()
  updatePriority = new EventEmitter<Priority>();
  @Output()
  addPriority = new EventEmitter<Priority>();
  @Input()
  private priorities: [Priority];

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  onAddPriority() {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: [new Priority(null, '', PrioritiesComponent.defaultColor),
        'Добавление приоритета'],
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) {
        return;
      }
      if (result.action === DialogAction.SAVE) {
        const newPriority = result.obj as Priority;
        this.addPriority.emit(newPriority);
      }
    });
  }

  delete(priority: Priority) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: 'Вы действительнио хотите удалить?'
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletePriority.emit(priority);
      }
    });
  }

  private setColor(priority: Priority, color: string) {
    priority.color = color;
  }

  private onEditPriority(priority: Priority) {
    const dialogRef = this.dialog.open(EditPriorityComponent, {
      data: [new Priority(priority.id, priority.title, priority.color), 'Редактирование приоритета']
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!(result)) {
        return;
      }

      if (result.action === DialogAction.DELETE) {
        this.deletePriority.emit(priority);
        return;
      }

      if (result.action === DialogAction.SAVE) {
        priority = result.obj as Priority;
        this.updatePriority.emit(priority);
        return;
      }
    });
  }
}
