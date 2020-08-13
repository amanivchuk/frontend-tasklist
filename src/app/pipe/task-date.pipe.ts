import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'taskDate'
})
export class TaskDatePipe extends DatePipe implements PipeTransform {

  transform(date: Date | string, format: string = 'mediumDate'): string {

    if (date == null) {
      return 'Без срока';
    }

    date = new Date(date);

    if (date.getDate() === new Date().getDate()) {
      return 'Сегодня';
    }

    if (date.getDate() === new Date().getDate() - 1) {
      return 'Вчера';
    }

    if (date.getDate() === new Date().getDate() + 1) {
      return 'Завтра';
    }

    return new DatePipe('ru-RU').transform(date, format); //показать дату в нужной локали
  }

}
