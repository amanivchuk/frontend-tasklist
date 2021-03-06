import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CategoriesComponent} from './views/categories/categories.component';
import {TasksComponent} from './views/tasks/tasks.component';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatOptionModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule
} from '@angular/material';
import {EditTaskDialogComponent} from './dialog/edit-task-dialog/edit-task-dialog.component';
import {FormsModule} from '@angular/forms';
import {ConfirmDialogComponent} from './dialog/confirm-dialog/confirm-dialog.component';
import {TaskDatePipe} from './pipe/task-date.pipe';
import {registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {EditCategoryDialogComponent} from './dialog/edit-category-dialog/edit-category-dialog.component';
import {FooterComponent} from './views/footer/footer.component';
import {AboutComponent} from './dialog/about-dialog/about.component';
import {HeaderComponent} from './views/header/header.component';
import {StatComponent} from './views/stat/stat.component';
import {StatCardComponent} from './views/stat/stat-card/stat-card.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {SettingsDialogComponent} from './dialog/settings-dialog/settings-dialog.component';
import {PrioritiesComponent} from './views/priorities/priorities.component';
import {EditPriorityComponent} from './dialog/edit-priority/edit-priority.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TASK_URL_TOKEN} from './data/impl/TaskService';
import {CATEGORY_URL_TOKEN} from './data/impl/CategoryService';
import {PRIORITY_URL_TOKEN} from './data/impl/PriorityService';
import {STAT_URL_TOKEN} from './data/impl/StatService';
import {CustomHttpInterceptor} from './interceptor/http-interceptor';

registerLocaleData(localeRu);

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    TasksComponent,
    EditTaskDialogComponent,
    ConfirmDialogComponent,
    TaskDatePipe,
    EditCategoryDialogComponent,
    FooterComponent,
    AboutComponent,
    HeaderComponent,
    StatComponent,
    StatCardComponent,
    SettingsDialogComponent,
    PrioritiesComponent,
    EditPriorityComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ColorPickerModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: TASK_URL_TOKEN,
      useValue: 'http://localhost:9200/task'
    },
    {
      provide: CATEGORY_URL_TOKEN,
      useValue: 'http://localhost:9200/category'
    },
    {
      provide: PRIORITY_URL_TOKEN,
      useValue: 'http://localhost:9200/priority'
    },
    {
      provide: STAT_URL_TOKEN,
      useValue: 'http://localhost:9200/stat'
    },
    {
      provide: HTTP_INTERCEPTORS, // все HTTP запросы будут выполняться с отображением индиктаро загрузки
      useClass: CustomHttpInterceptor,
      multi: true
    }
  ],
  entryComponents: [
    EditTaskDialogComponent,
    ConfirmDialogComponent,
    EditCategoryDialogComponent,
    AboutComponent,
    SettingsDialogComponent,
    EditPriorityComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
