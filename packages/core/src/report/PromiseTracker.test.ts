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
        tracker.monitor.addEventListener('onChange', onChange);

        await tracker.add([p1, p2]);

        reject1!();
        // p1 has extra microtasks (catch)
        await Promise.resolve();
        await Promise.resolve();

        expect(onChange).toHaveBeenCalledWith(1);

        resolve2!();
        await Promise.resolve();

        expect(onChange).toHaveBeenLastCalledWith(0);
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

        await tracker.toPromise();
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
        tracker.monitor.addEventListener('onChange', onChange);

        await tracker.add([p1, p2, p3]);

        resolve1!();
        await Promise.resolve();
        reject2!();
        await Promise.resolve();

        await tracker.toPromise();
        expect(onChange).toHaveBeenCalledTimes(3);
        expect(onChange).toHaveBeenNthCalledWith(1, 2);
        expect(onChange).toHaveBeenNthCalledWith(2, 1);
        expect(onChange).toHaveBeenNthCalledWith(3, 0);
        expect(tracker.getPending()).toHaveLength(0);
    });

    it.for([[], undefined])('trigger events for empty array', async (input) => {
        const tracker = new PromiseTracker();

        const onChange = vi.fn();
        tracker.monitor.addEventListener('onChange', onChange);

        await tracker.add(input);
        await tracker.toPromise();

        expect(onChange).toHaveBeenCalledOnce();
    });
});
