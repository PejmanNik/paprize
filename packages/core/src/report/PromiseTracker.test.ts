import { describe, it, expect, vi } from 'vitest';
import { PromiseTracker } from './PromiseTracker';

describe('PromiseTracker', () => {
    it('handles rejected promises and triggers events', async () => {
        let reject1: () => void;
        let resolve2: () => void;
        const p1 = new Promise<void>((_, rej) => {
            reject1 = rej;
        }).catch(() => {});

        const p2 = new Promise<void>((res) => {
            resolve2 = res;
        });
        const tracker = new PromiseTracker();

        const onChange = vi.fn();
        const onComplete = vi.fn();
        tracker.monitor.addEventListener('onChange', onChange);
        tracker.monitor.addEventListener('onComplete', onComplete);

        await tracker.add([p1, p2]);

        reject1!();
        // p1 has extra microtasks (catch)
        await Promise.resolve();
        await Promise.resolve();

        expect(onChange).toHaveBeenCalledWith(1);
        expect(onComplete).not.toHaveBeenCalled();

        resolve2!();
        await Promise.resolve();

        expect(onChange).toHaveBeenLastCalledWith(0);
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(tracker.getPending()).toHaveLength(0);
    });

    it('getPending returns only pending promises', async () => {
        let resolve1: () => void;
        let resolve2: () => void;
        const p1 = new Promise<void>((res) => {
            resolve1 = res;
        });
        const p2 = new Promise<void>((res) => {
            resolve2 = res;
        });
        const tracker = new PromiseTracker();
        await tracker.add([p1, p2]);

        expect(tracker.getPending().length).toBe(2);

        resolve1!();
        await Promise.resolve();
        expect(tracker.getPending().length).toBe(1);

        resolve2!();
        await Promise.resolve();
        expect(tracker.getPending().length).toBe(0);

        await tracker.promise;
    });

    it('handles mix of resolved, rejected, and pending promises', async () => {
        let resolve1: () => void;
        let reject2: () => void;
        const p1 = new Promise<void>((res) => {
            resolve1 = res;
        });
        const p2 = new Promise<void>((_, rej) => {
            reject2 = rej;
        }).catch(() => {});
        const p3 = Promise.resolve();

        const tracker = new PromiseTracker();

        const onChange = vi.fn();
        const onComplete = vi.fn();
        tracker.monitor.addEventListener('onChange', onChange);
        tracker.monitor.addEventListener('onComplete', onComplete);

        await tracker.add([p1, p2, p3]);

        resolve1!();
        await Promise.resolve();
        reject2!();
        await Promise.resolve();

        await tracker.promise;
        expect(onChange).toHaveBeenCalledTimes(2);
        expect(onChange).toHaveBeenNthCalledWith(1, 1);
        expect(onChange).toHaveBeenNthCalledWith(2, 0);
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(tracker.getPending()).toHaveLength(0);
    });

    it('does not trigger events for empty array', async () => {
        const tracker = new PromiseTracker();

        const onChange = vi.fn();
        const onComplete = vi.fn();
        tracker.monitor.addEventListener('onChange', onChange);
        tracker.monitor.addEventListener('onComplete', onComplete);

        await tracker.add([]);
        await tracker.promise;

        expect(onChange).not.toHaveBeenCalled();
        expect(onComplete).not.toHaveBeenCalled();
        expect(tracker.getPending()).toHaveLength(0);
    });

    it('does not trigger on change for already resolved promises but triggers on complete', async () => {
        const p1 = Promise.resolve(1);
        const p2 = Promise.resolve(2);
        const tracker = new PromiseTracker();

        const onChange = vi.fn();
        const onComplete = vi.fn();
        tracker.monitor.addEventListener('onChange', onChange);
        tracker.monitor.addEventListener('onComplete', onComplete);

        await tracker.add([p1, p2]);
        await tracker.promise;

        expect(onChange).not.toHaveBeenCalled();
        expect(onComplete).toHaveBeenCalled();
        expect(tracker.getPending()).toHaveLength(0);
    });
});
