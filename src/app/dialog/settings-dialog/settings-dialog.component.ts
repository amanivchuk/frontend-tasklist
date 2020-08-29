import {Component, OnInit} from '@angular/core';
import {Priority} from '../../model/Priority';
import {MatDialogRef} from '@angular/material';
import {PriorityService} from '../../data/impl/PriorityService';
import {DialogAction, DialogResult} from '../../object/DialogResult';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent implements OnInit {

  private priorities: Priority[];
  settingsChanged = false; // были ли изменены настройки

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent>,
    private priorityService: PriorityService // ссылка на сервис для работы с данными
  ) {
  }

  ngOnInit() {
    this.priorityService.findAll().subscribe(priorities => this.priorities = priorities);
  }

//нажали Закрыть
  onClose() {
    if (this.settingsChanged) {
      this.dialogRef.close(new DialogResult(DialogAction.SETTINGS_CHANGE, this.priorities));
    } else {
      this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
    }
  }

//добавили приоритет
  onAddPriority(priority: Priority) {
    this.settingsChanged = true;

    this.priorityService.add(priority).subscribe(result => {
      this.priorities.push(result);
    });
  }

//  удалили приоритет
  onDeletePriority(priority: Priority) {
    this.settingsChanged = true;

    this.priorityService.delete(priority.id).subscribe(() => {
      // т.к. данные простые и без сортировки - то можно просто удалить объект в локальном массиве,
      // а не запрашивать заново из БД
      this.priorities.splice(this.getPriorityIndex(priority), 1);
    });
  }

//  Обновили приоритет
  onUpdatePriority(priority: Priority) {
    this.settingsChanged = true;

    this.priorityService.update(priority).subscribe(() => {
      this.priorities[this.getPriorityIndex(priority)] = priority;
    });
  }

  // находит индекс элемента (по id) в локальном массиве
  getPriorityIndex(priority: Priority): number {
    const tmpPriority = this.priorities.find(t => t.id === priority.id);
    return this.priorities.indexOf(tmpPriority);
  }
}
