import {Component, OnInit} from '@angular/core';
import {Task} from './model/Task';
import {DataHandlerService} from './service/data-handler.service';
import {Category} from './model/Category';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tasks: Task[];
  categories: Category[];
  private selectedCategory: Category;

  constructor(
    private dataHadler: DataHandlerService, //фасад для работы с данными
  ) {
  }

  ngOnInit(): void {
    this.dataHadler.getAllTasks().subscribe(tasks => this.tasks = tasks);
    this.dataHadler.getAllCategories().subscribe(categories => this.categories = categories);
  }

  //изменение категории
  onSelectCategory(category: Category) {
    this.selectedCategory = category;

    this.dataHadler.searchTasks(
      this.selectedCategory,
      null,
      null,
      null,
    ).subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }

  onUpdateTask(task: Task) {
    this.dataHadler.updateTask(task).subscribe(() => {

      this.dataHadler.searchTasks(
        this.selectedCategory,
        null,
        null,
        null
      ).subscribe(tasks => {
        this.tasks = tasks;
      });
    });
  }
}
