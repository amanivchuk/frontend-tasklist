import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {OperType} from '../OperType';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-priority',
  templateUrl: './edit-priority.component.html',
  styleUrls: ['./edit-priority.component.css']
})
export class EditPriorityComponent implements OnInit {

  private dialogTitle: string; //текст для диалогового окна
  private priorityTitle: string;// текст для названия приоритета
  private operType: OperType;

  constructor(
    private dialogRef: MatDialogRef<EditPriorityComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [string, string, OperType],
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.priorityTitle = this.data[0];
    this.dialogTitle = this.data[1];
    this.operType = this.data[2];
  }

  //нажали ОК
  private onConfirm() {
    this.dialogRef.close(this.priorityTitle);
  }

  //нажали отмену
  private onCancel() {
    this.dialogRef.close(false);
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
      if (result) {
        this.dialogRef.close('delete');//нажали удалить
      }
    });
  }

  private canDelete(): boolean {
    return this.operType == OperType.EDIT;
  }
}
