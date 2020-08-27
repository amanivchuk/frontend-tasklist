//все возможные параметры поиска категории
export class CategorySearchValues {
  title: string = null;
}

//все возможные параметры поиска приоритетов
export class PrioritySearchValues {
  title: string = null;
}

//поиск задач
export class TaskSearchValues {
  //начальная сортировка по-умолчанию
  title = '';
  completed: number = null;
  priorityId: number = null;
  categoryId: number = null;
  pageNumber = 0; //1-я страница
  pageSize = 5; //сколько элементов на странице

  //сортировка
  sortColumn = 'title';
  sortDirection = 'asc';
}
