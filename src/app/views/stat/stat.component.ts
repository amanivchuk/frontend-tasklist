import {Component, Input, OnInit} from '@angular/core';
import {DashboardData} from '../../object/DashboardData';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})
export class StatComponent implements OnInit {

  @Input()
  dash: DashboardData; //данные дэшборда

  @Input()
  showStat: boolean; //показать или скрыть статистику

  constructor() {
  }

  ngOnInit() {
  }

  getTotal(): number {
    if (this.dash) {
      return this.dash.completedTotal + this.dash.uncompletedTotal;
    }
  }

  getCompletedCount() {
    if (this.dash) {
      return this.dash.completedTotal;
    }
  }

  getUncompletedCount() {
    if (this.dash) {
      return this.dash.uncompletedTotal;
    }
  }

  getCompletedPercent() {
    if (this.dash) {
      return this.dash.completedTotal ? (this.dash.completedTotal / this.getTotal()) : 0;
    }
  }

  getUncompletedPercent() {
    if (this.dash) {
      return this.dash.uncompletedTotal ? (this.dash.uncompletedTotal / this.getTotal()) : 0;
    }
  }


}
