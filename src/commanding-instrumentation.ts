import { StatusRecord } from './model';
const unknown: StatusRecord = {
  title: 'unknown',
  message: 'no record yet',
  params: [],
  status: 'failure',
};
export class CommandingInstrumentation {
  _statusRecords: StatusRecord[] = [];
  getStatusRecords() {
    return this._statusRecords;
  }
  reset() {
    this._statusRecords = [];
  }
  getLastRecord(): StatusRecord {
    const lastId = this._statusRecords.length - 1;
    return lastId >= 0 ? this._statusRecords[lastId] : unknown;
  }
  globActionStart(params: string[]) {
    this._statusRecords.push({
      title: 'glob action',
      message: 'run',
      params,
      status: 'before',
    });
  }
}
