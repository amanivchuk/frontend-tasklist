import {CommonDAO} from './CommonDAO';
import {Task} from '../../model/Task';
import {Observable} from 'rxjs';
import {TaskSearchValues} from '../search/SearchObjects';

export interface TaskDAO extends CommonDAO<Task> {

  //поиск по любым параметра
  //если какой-либо параметр null - он не будет учитываться при поиске
  findTasks(taskSearchValues: TaskSearchValues): Observable<any>;

}
