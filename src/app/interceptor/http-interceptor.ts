import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SpinnerService} from '../service/spinner.service';
import {tap} from 'rxjs/operators';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {


  constructor(private spinnerService: SpinnerService) {
  }

  //перехватываем все HTTP запросы
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.spinnerService.show(); // показать спиннер

    return next
      .handle(req)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) { //пришел ответ - значит запрос завершен
            this.spinnerService.hide(); //когда запрос выполнился - убрать спиннер
          }
        }, (error) => {
          this.spinnerService.hide(); //если возникла ошибка - убрать спиннер
        })
      );
  }

}
