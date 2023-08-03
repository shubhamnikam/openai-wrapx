import { Injectable } from '@angular/core';
import { AppConstants } from '../utilities/AppConstants';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  constructor() {
  }

  getFromLocalStorage(key: string): any {
    const encodedData = localStorage.getItem(key);
    if (encodedData) {
      const decodedData = this.getDecodedText(encodedData);
      if (decodedData) {
        const data = JSON.parse(decodedData);
        return data;
      }
    }
    return null;
  }

  setToLocalStorage(key: string, value: any): any {
    if (key && value) {
      //encodes to a base-64
      const data = JSON.stringify(value);
      if (data) {
        const encodedData = this.getEncodedText(data);
        if (encodedData) {
          localStorage.setItem(key, encodedData);
        }
      }
    }
  }

  //to encode str
  private getEncodedText(str: string) {
    if (AppConstants.CACHE_ENCODE_ENABLE){
      if (str) {
        return btoa(str);
      }
      return null;
    } else {
      return str;
    }
  }

  //to decode str
  private getDecodedText(str: string) {
    if (AppConstants.CACHE_ENCODE_ENABLE) {
      if (str) {
        return atob(str);
      }
      return null;
    } else {
      return str;
    }
  }
}
