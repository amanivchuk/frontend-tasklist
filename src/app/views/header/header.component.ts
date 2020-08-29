import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SettingsDialogComponent} from '../../dialog/settings-dialog/settings-dialog.component';
import {DialogAction} from '../../object/DialogResult';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input()
  categoryName: string;

  @Input()
  showStat: boolean;

  @Output()
  toggleStat = new EventEmitter<boolean>(); //показать/скрыть статистику

  @Output()
  toggleMenu = new EventEmitter(); //показать/скрыть

  @Output()
  settingsChanged = new EventEmitter<boolean>();

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

//  окно настроек
  showSettings() {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      autoFocus: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === DialogAction.SETTINGS_CHANGE) {
        this.settingsChanged.emit(true);
        return;
      }
    });
  }

  private onToggleStat() {
    this.toggleStat.emit(!this.showStat); //вкл/выкл статистику
  }

}
