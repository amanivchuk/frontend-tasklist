import {Component, OnInit} from '@angular/core';
import {Priority} from '../../model/Priority';
import {MatDialogRef} from '@angular/material';
import {DataHandlerService} from '../../service/data-handler.service';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent implements OnInit {

  private priorities: Priority[];

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent>,
    private dataHandler: DataHandlerService //ссылка на сервис для работы с данными
  ) {
  }

  ngOnInit() {
    //  получаем все значнеия, чтобы отобразить настройку цветов
    this.dataHandler.getAllPriorities().subscribe(
      priorities => this.priorities = priorities
    );
  }

//нажали Закрыть
  private onClose() {
    this.dialogRef.close(false);
  }

//добавили приоритет
  private onAddPriority(priority: Priority) {
    this.dataHandler.addPriority(priority).subscribe();
  }

//  удалили приоритет
  private onDeletePriority(priority: Priority) {
    this.dataHandler.deletePriority(priority.id).subscribe();
  }

//  Обновили приоритет
  private onUpdatePriority(priority: Priority) {
    this.dataHandler.updatePriority(priority).subscribe();
  }

}
