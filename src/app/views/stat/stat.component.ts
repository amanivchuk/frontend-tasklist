import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})
export class StatComponent implements OnInit {

  @Input()
  totalTasksInCategory: number; //общее кол-во задач в категории

  @Input()
  completeTasksInCategory: number; // кол-во решенных задач в категории

  @Input()
  uncompleteTasksInCategory: number; //кол-во нерешенных задач в категории

  @Input()
  showStat: boolean; //показать или скрыть статистику

  constructor() {
  }

  ngOnInit() {
  }

}
