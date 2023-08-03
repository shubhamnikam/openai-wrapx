import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    request = request.clone({ 
        headers: this.addHeaders()
      });

    return next.handle(request);
  }

  addHeaders(): HttpHeaders {
    return new HttpHeaders().set('Content-Type', 'application/json');
  }
}
