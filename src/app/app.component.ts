import {Component, OnInit} from '@angular/core';
import {Task} from './model/Task';
import {DataHandlerService} from './service/data-handler.service';
import {Category} from './model/Category';
import {Priority} from './model/Priority';
import {zip} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private tasks: Task[];
  private categories: Category[];
  private priorities: Priority[];

  private selectedCategory: Category = null;
  private searchTaskText: string;
  private statusFilter: boolean;
  private priorityFilter: Priority;
  private searchCategoryText: string;

  //статистика
  private totalTasksCountInCategory: number;
  private completedCountInCategory: number;
  private uncompletedCountInCategory: number;
  private uncompletedTotalTasksCount: number;

  //показать/скрыть статистику
  private showStat = true;

  constructor(
    private dataHadler: DataHandlerService, //фасад для работы с данными
  ) {
  }

  ngOnInit(): void {
    // this.dataHadler.getAllTasks().subscribe(tasks => this.tasks = tasks);
    this.dataHadler.getAllCategories().subscribe(categories => this.categories = categories);
    this.dataHadler.getAllPriorities().subscribe(priorities => this.priorities = priorities);

    this.onSelectCategory(null);
  }

  //изменение категории
  onSelectCategory(category: Category) {
    this.selectedCategory = category;

    // this.updateTasks();
    this.updateTasksAndStat();
  }

  onUpdateTask(task: Task) {
    this.dataHadler.updateTask(task).subscribe(cat => {
      // this.updateTasks();
      this.updateTasksAndStat();
    });
  }

  onFilterTasksByPriority(priority: Priority) {
    this.priorityFilter = priority;
    // this.updateTasks();
    this.updateTasksAndStat();
  }

  onAddTask(task: Task) {
    this.dataHadler.addTask(task).subscribe(result => {
      // this.updateTasks();
      this.updateTasksAndStat();
    });
  }

  onAddCategory(title: string) {
    this.dataHadler.addCategory(title).subscribe(() => this.updateCategories());
  }

  toggleStat(showStat: boolean) {
    this.showStat = showStat;
  }

  private onDeleteTask(task: Task) {

    this.dataHadler.deleteTask(task.id).subscribe(cat => {
      // this.updateTasks();
      this.updateTasksAndStat();
    });
  }

  //удаление категории
  private onDeleteCategory(category: Category) {
    this.dataHadler.deleteCategory(category.id).subscribe(cat => {
      this.selectedCategory = null; //открываем категорию все
      this.onSelectCategory(null);
    });
  }

  //обновляем категорию
  private onUpdateCategory(category: Category) {
    this.dataHadler.updateCategory(category).subscribe(() => {
      this.onSearchCategory(this.searchCategoryText);
    });
  }

  //поиск задач
  private onSearchTasks(searchString: string) {
    this.searchTaskText = searchString;
    // this.updateTasks();
    this.updateTasksAndStat();
  }

  //фильтрация задач по статусу(все, решенные, нерешенные)
  private onFilterTaskByStatus(status: boolean) {
    this.statusFilter = status;
    // this.updateTasks();
    this.updateTasksAndStat();
  }

  private updateTasks() {
    this.dataHadler.searchTasks(
      this.selectedCategory,
      this.searchTaskText,
      this.statusFilter,
      this.priorityFilter
    ).subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }

  private updateCategories() {
    this.dataHadler.getAllCategories().subscribe(categories => this.categories = categories);
  }

  //поиск категории
  private onSearchCategory(title: string) {
    this.searchCategoryText = title;
    this.dataHadler.searchCategories(title).subscribe(categories => {
      this.categories = categories;
    });
  }

//  показывает задачи с применением всех текущих условий (категория, поиск, фильтры, и пр.)
  private updateTasksAndStat() {
    this.updateTasks(); //Обновить список задач

    //обновить переменные для статистики
    this.updateStat();

  }

  //обновить статистику
  private updateStat() {
    zip(
      this.dataHadler.getTotalCountInCategory(this.selectedCategory),
      this.dataHadler.getCompletedCountInCategory(this.selectedCategory),
      this.dataHadler.getUncompletedCountInCategory(this.selectedCategory),
      this.dataHadler.getUncompletedTotalCount())

      .subscribe(array => {
        this.totalTasksCountInCategory = array[0];
        this.completedCountInCategory = array[1];
        this.uncompletedCountInCategory = array[2];
        this.uncompletedTotalTasksCount = array[3]; //нужно для категории Все
      });
  }
}
