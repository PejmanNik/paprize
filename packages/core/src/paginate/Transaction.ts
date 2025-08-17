export class Transaction {
  private _onRollback: (() => void)[];
  private _onCommit: (() => void)[];
  public isActive: boolean;

  constructor() {
    this._onRollback = [];
    this._onCommit = [];
    this.isActive = false;
  }

  start = () => {
    if (this.isActive) {
      throw new Error("Transaction already in progress");
    }
    this.isActive = true;
    this._onRollback = [];
    this._onCommit = [];
  };

  addRollbackCallback = (callback: () => void) => {
    this._onRollback.push(callback);
  };

  addCommitCallback = (callback: () => void) => {
    if (!this.isActive) {
      callback();
      return;
    }
    this._onCommit.push(callback);
  };

  rollback = () => {
    if (!this.isActive) return;
    this.isActive = false;
    this._onRollback.forEach((func) => func());
  };

  commit = () => {
    if (!this.isActive) return;
    this.isActive = false;
    this._onCommit.forEach((func) => func());
  };
}
