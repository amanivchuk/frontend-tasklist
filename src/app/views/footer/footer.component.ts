import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {AboutComponent} from '../../dialog/about-dialog/about.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  private year: Date;
  private site = 'test.com';
  private siteName = 'Todo.com';

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.year = new Date();
  }

  //окно о программе
  private openAboutDialog() {
    this.dialog.open(AboutComponent, {
      autoFocus: false,
      data: {
        dialogTitle: 'О программе',
        message: 'Приложение создано для теста'
      },
      width: '400px'
    });
  }

}
