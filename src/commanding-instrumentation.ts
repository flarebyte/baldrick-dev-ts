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
  globAction(params: string[]) {
      console.log('>>>', params)
    this._statusRecords.push({
      title: 'glob action',
      message: 'run',
      params,
      status: 'success',
    });
  }
}
