import {Inject, Injectable, InjectionToken} from '@angular/core';
import {Category} from '../../model/Category';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {TaskDAO} from '../interface/TaskDAO';
import {TaskSearchValues} from '../search/SearchObjects';
import {Task} from '../../model/Task';
import {CommonService} from './CommonService';

export const TASK_URL_TOKEN = new InjectionToken<string>('url');


@Injectable({
  providedIn: 'root'
})
export class TaskService extends CommonService<Task> implements TaskDAO {

  constructor(
    @Inject(TASK_URL_TOKEN) private baseUrl,
    public httpClient: HttpClient
  ) {
    super(baseUrl, httpClient);
  }


  findTasks(taskSearchValues: TaskSearchValues): Observable<any> {
    return this.httpClient.post<Category[]>(this.baseUrl + '/search', taskSearchValues);
  }
}
