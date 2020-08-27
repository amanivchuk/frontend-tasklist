import {Inject, Injectable, InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';
import {PrioritySearchValues} from '../search/SearchObjects';
import {HttpClient} from '@angular/common/http';
import {Priority} from '../../model/Priority';
import {PriorityDAO} from '../interface/PriorityDAO';
import {CommonService} from './CommonService';

export const PRIORITY_URL_TOKEN = new InjectionToken<string>('url');

@Injectable({
  providedIn: 'root'
})
export class PriorityService extends CommonService<Priority> implements PriorityDAO {

  constructor(
    @Inject(PRIORITY_URL_TOKEN) private baseUrl,
    public httpClient: HttpClient
  ) {
    super(baseUrl);
  }

  findPriorities(prioritySearchValues: PrioritySearchValues): Observable<any> {
    return this.httpClient.post<Priority[]>(this.baseUrl + '/search', prioritySearchValues);
  }
}
