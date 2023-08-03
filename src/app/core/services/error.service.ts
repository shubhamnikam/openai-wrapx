import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorService implements ErrorHandler {
  constructor(
    private router: Router,
    private notifyService: NotifyService
  ) {}

  handleError(
    error: Error | HttpErrorResponse,
    titleToastr: any = 'Something went wrong',
    consoleLogType: string = 'WARN'
  ): void {
    if (error instanceof HttpErrorResponse) {
      //logs error in all conditions
      console.error(error);
      //handle server http side error
      if (!navigator.onLine) {
        //handle offline error
        this.notifyService.notifyError(
          'Network error',
          'Check your internet connection...'
        );
      } else {
        //handle http errors
        const httpErrorCode = error.status;
        switch (httpErrorCode) {
          case StatusCodes.NOT_FOUND:
            {
              this.notifyService.notifyError(
                `Server Error ${getReasonPhrase(StatusCodes.NOT_FOUND)}`,
                error.error?.message || error?.message
              );
            }
            break;
          case StatusCodes.BAD_REQUEST:
            {
              this.notifyService.notifyError(
                `Server Error ${getReasonPhrase(StatusCodes.BAD_REQUEST)}`,
                error.error?.message || error?.message
              );
            }
            break;
          default:
            {
              this.notifyService.notifyError(
                `Server Error Something went wrong`,
                error.error?.message || error?.message
              );
            }
            break;
        }
      }
    } else {
      //logs error in all conditions
      if (consoleLogType === 'WARN') {
        console.warn([titleToastr], error?.message);
        //handle client side error
        this.notifyService.notifyError(titleToastr, error?.message);
      } else {
        console.error([titleToastr], error.message);
        //handle client side error
        this.notifyService.notifyError(titleToastr, error?.message);
      }
    }
  }
}
