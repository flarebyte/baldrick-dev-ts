import { LintActionOpts, RunnerContext, StatusRecord, TestActionOpts } from './model';
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
  lintActionStart(ctx: RunnerContext, lintOpts: LintActionOpts) {
    const optsStr = JSON.stringify(lintOpts)
    this._statusRecords.push({
      title: 'lint action',
      message: 'run',
      params: [ctx.currentPath, optsStr],
      status: 'before',
    });
  }
  testActionStart(ctx: RunnerContext, testOpts: TestActionOpts) {
    const optsStr = JSON.stringify(testOpts)
    this._statusRecords.push({
      title: 'Test action',
      message: 'run',
      params: [ctx.currentPath, optsStr],
      status: 'before',
    });
  }
}
