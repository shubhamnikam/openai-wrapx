export interface ICommonOutputModel<T> {
  StepName: string;
  StepStatus: string;
  Message: string;
  Description: string;
  TimestampUTC: Date;
  Data: T;
}
