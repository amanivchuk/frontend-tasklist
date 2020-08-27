import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {Category} from '../../model/Category';
import {DialogAction, DialogResult} from '../../object/DialogResult';

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.css']
})
export class EditCategoryDialogComponent implements OnInit {

  private dialogTitle: string; //текст диалогового окна
  private category: Category;// категория
  private canDelete = true;

  constructor(
    private dialogRef: MatDialogRef<EditCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Category, string],
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    //получаем переданные в диалоговое окно данные
    this.category = this.data[0];
    this.dialogTitle = this.data[1];

    // если было передано значение, значит это редактированиеЮ пожтому делаем удаление возможным
    if (this.category && this.category.id && this.category.id > 0) {
      this.canDelete = true;
    }
  }

  //нажали ок
  onConfirm(): void {
    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.category));
  }

  onCancel(): void {
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }

  delete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердить действие',
        message: 'Вы действительно хотите удалить категорию?'
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
