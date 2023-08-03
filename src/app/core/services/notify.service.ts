import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {

  constructor(private toastr: ToastrService) {}

  notifySuccess(title: string, message: string) {
    this.toastr.success(message, title);
  }
  notifyError(title: string, message: string) {
    this.toastr.error(message, title);
  }
  notifyWarning(title: string, message: string) {
    this.toastr.warning(message, title);
  }
  notifyInfo(title: string, message: string) {
    this.toastr.info(message, title);
  }
}
