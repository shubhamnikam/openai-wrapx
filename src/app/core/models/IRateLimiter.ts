import { Moment } from "moment";

export interface IRateLimiter {
  sessionStartTimestamp: Moment;
  sessionEndTimestamp: Moment;
  requestCounter: number;
}