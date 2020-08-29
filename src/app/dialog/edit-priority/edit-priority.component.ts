import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {Priority} from '../../model/Priority';
import {DialogAction, DialogResult} from '../../object/DialogResult';

@Component({
  selector: 'app-edit-priority',
  templateUrl: './edit-priority.component.html',
  styleUrls: ['./edit-priority.component.css']
})
export class EditPriorityComponent implements OnInit {

  private dialogTitle: string; //текст для диалогового окна
  canDelete = true;
  private priority: Priority;// названия приоритета

  constructor(
    private dialogRef: MatDialogRef<EditPriorityComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Priority, string],
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.priority = this.data[0];
    this.dialogTitle = this.data[1];

    if (!this.priority) {
      this.canDelete = false;
    }
  }

  //нажали ОК
  private onConfirm() {
    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.priority));
  }

  //нажали отмену
  private onCancel() {
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }

//  нажали Удалить
  private delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: 'Вы действительно хотите удалить приоритет?'
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) {
        return;
      }

      if (result.action === DialogAction.OK) {
        this.dialogRef.close(new DialogResult(DialogAction.DELETE));//нажали удалить
      }
    });
  }

}
