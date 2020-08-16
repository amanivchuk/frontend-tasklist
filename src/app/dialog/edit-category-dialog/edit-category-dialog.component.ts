import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {OperType} from '../OperType';

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.css']
})
export class EditCategoryDialogComponent implements OnInit {

  private dialogTitle: string; //текст диалогового окна
  private categoryTitle: string;//текст названия категории
  // private canDelete = true;
  private operType: OperType;

  constructor(
    private dialogRef: MatDialogRef<EditCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [string, string, OperType],
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    //получаем переданные в диалоговое окно данные
    this.categoryTitle = this.data[0];
    this.dialogTitle = this.data[1];
    this.operType = this.data[2]; //тип операции

    //если было передано значение, значит это редактированиеЮ пожтому делаем удаление возможным
    // if(!this.categoryTitle){
    //   this.canDelete = false;
    // }
  }

  //нажали ок
  private onConfirm() {
    this.dialogRef.close(this.categoryTitle);
  }

  private onCancel() {
    this.dialogRef.close(false);
  }

  private delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердить действие',
        message: 'Вы действительно хотите удалить категорию?'
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
    return this.operType === OperType.EDIT;
  }

}
