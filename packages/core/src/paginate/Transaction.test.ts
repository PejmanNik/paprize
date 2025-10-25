import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Transaction } from './Transaction';

describe('Transaction', () => {
    let transaction: Transaction;

    beforeEach(() => {
        transaction = new Transaction();
    });

    it('should not be active upon creation', () => {
        expect(transaction.isActive).toBe(false);
    });

    it('should start a transaction', () => {
        transaction.start();
        expect(transaction.isActive).toBe(true);
    });

    it('should throw if start is called twice', () => {
        transaction.start();
        expect(() => transaction.start()).toThrow(
            'Transaction already in progress'
        );
    });

    it('should call all rollback callbacks on rollback', () => {
        transaction.start();
        const cb1 = vi.fn();
        const cb2 = vi.fn();
        transaction.addRollbackCallback(cb1);
        transaction.addRollbackCallback(cb2);
        transaction.rollback();
        expect(cb1).toHaveBeenCalled();
        expect(cb2).toHaveBeenCalled();
    });

    it('should not call rollback callbacks if not active', () => {
        const rollbackCb = vi.fn();
        transaction.addRollbackCallback(rollbackCb);
        transaction.rollback();
        expect(rollbackCb).not.toHaveBeenCalled();
    });

    it('should call all commit callbacks on commit', () => {
        transaction.start();
        const cb1 = vi.fn();
        const cb2 = vi.fn();
        transaction.addCommitCallback(cb1);
        transaction.addCommitCallback(cb2);
        transaction.commit();
        expect(cb1).toHaveBeenCalled();
        expect(cb2).toHaveBeenCalled();
    });

    it('should call commit callbacks immediately if not active', () => {
        const commitCb = vi.fn();
        transaction.addCommitCallback(commitCb);
        expect(commitCb).toHaveBeenCalled();
    });

    it('should reset callbacks on new start', () => {
        transaction.start();
        const rollbackCb = vi.fn();
        transaction.addRollbackCallback(rollbackCb);
        transaction.rollback();

        transaction.start();
        const rollbackCb2 = vi.fn();
        transaction.addRollbackCallback(rollbackCb2);
        transaction.rollback();

        expect(rollbackCb).toHaveBeenCalledTimes(1);
        expect(rollbackCb2).toHaveBeenCalledTimes(1);
    });

    it('should not call rollback or commit callbacks twice', () => {
        transaction.start();
        const rollbackCb = vi.fn();
        const commitCb = vi.fn();
        transaction.addRollbackCallback(rollbackCb);
        transaction.addCommitCallback(commitCb);

        transaction.commit();
        expect(commitCb).toHaveBeenCalled();
        expect(rollbackCb).not.toHaveBeenCalled();

        commitCb.mockClear();
        transaction.commit();
        expect(commitCb).not.toHaveBeenCalled();
    });
});
