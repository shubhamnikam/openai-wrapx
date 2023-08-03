import { Injectable } from '@angular/core';
import { AppConstants } from '../utilities/AppConstants';
import { IRateLimiter } from '../models/IRateLimiter';
import { StorageService } from './storage.service';
import { NotifyService } from './notify.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class RateLimiterService {
  constructor(
    private storageService: StorageService,
    private notifyService: NotifyService
  ) {}

  handleRateLimiterSession(shouldCreateNewSession = false): boolean {
    /*check session expiry 
     - if session expired the create new session with counter 1 if shouldCreateNewSession == true
     - else
        - if check counter should be less than max request allowed then ++counter 
        - else notify
     */
    let shouldAllowNextTask = false;
    const cachedRateLimiter = this.storageService.getFromLocalStorage(
      AppConstants.CACHE_KEY_RATE_LIMITER
    );

    if (!cachedRateLimiter) {
      this.createNewSession();
      shouldAllowNextTask = true;
    } else {
      if (shouldCreateNewSession) {
        if (this.validateSession(cachedRateLimiter)) {
          shouldAllowNextTask = true;
        } else if (!this.validateSessionEndTimeSpan(cachedRateLimiter)) {
          this.createNewSession();
          shouldAllowNextTask = true;
        } else {
          //notify warning
          this.notifyService.notifyWarning(
            'You have exhausted allowed requests per session',
            `Please retry after ${AppConstants.RATE_LIMITER_ALLOWED_IN_HOURS} Hour/s`
          );
          shouldAllowNextTask = false;
        }
      } else {
        if (this.validateSession(cachedRateLimiter)) {
          shouldAllowNextTask = true;
          this.incrementRequestCounter(cachedRateLimiter);
        } else {
          //notify warning
          this.notifyService.notifyWarning(
            'You have exhausted allowed requests per session',
            `Please retry after ${AppConstants.RATE_LIMITER_ALLOWED_IN_HOURS} Hour/s`
          );
          shouldAllowNextTask = false;
        }
      }
    }
    return shouldAllowNextTask;
  }

  private createNewSession(): void {
    console.log(moment().format());

    const newSession: IRateLimiter = {
      sessionStartTimestamp: moment().utc(),
      sessionEndTimestamp: moment()
        .utc()
        .add(AppConstants.RATE_LIMITER_ALLOWED_IN_HOURS, 'hours'),
      requestCounter: 0,
    };
    this.storageService.setToLocalStorage(
      AppConstants.CACHE_KEY_RATE_LIMITER,
      newSession
    );
  }

  private validateSession(oldSession: IRateLimiter): boolean {
    let isSessionValid = false;
    if (
      oldSession &&
      this.validateSessionEndTimeSpan(oldSession) &&
      this.validateRequestCounter(oldSession)
    ) {
      isSessionValid = true;
    }
    return isSessionValid;
  }

  private validateSessionEndTimeSpan(oldSession: IRateLimiter): boolean {
    let diff = moment()
      .utc()
      .diff(oldSession.sessionEndTimestamp, 'milliseconds');

    return diff <= 0;
  }

  private validateRequestCounter(oldSession: IRateLimiter): boolean {
    return (
      oldSession.requestCounter < AppConstants.RATE_LIMITER_ALLOWED_REQUESTS
    );
  }

  private incrementRequestCounter(oldSession: IRateLimiter): void {
    //update counter
    ++oldSession.requestCounter;
    //save updated counter
    this.storageService.setToLocalStorage(
      AppConstants.CACHE_KEY_RATE_LIMITER,
      oldSession
    );
  }
}
