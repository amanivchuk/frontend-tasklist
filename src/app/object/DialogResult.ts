export class DialogResult {
  action: DialogAction;
  obj: any;


  constructor(action: DialogAction, obj?: any) {
    this.action = action;
    this.obj = obj;
  }
}

//возмоджные действия в диалоговом окне
export enum DialogAction {
  SETTINGS_CHANGE = 0, //НАСТРОЙКИ БЫЛИ ИЗМЕНЕНЫ
  SAVE = 1, //СОХРАНЕНИЕ ИЗМЕНЕНИЙ
  OK = 2, //для подтверждения всех действий
  CANCEL = 3, //отмена всех действий
  DELETE = 4, //удаление объекта
  COMPLETE = 5, //завершение задачи
  ACTIVATE = 6 // возврат задач  в активное состояние
}


