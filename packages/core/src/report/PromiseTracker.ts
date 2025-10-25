import { EventDispatcher } from './EventDispatcher';

type PromiseStatus = 'pending' | 'resolved' | 'rejected';

interface TrackedPromise {
    promise: Promise<unknown>;
    status: PromiseStatus;
}

export interface PromiseTrackerEvents {
    onChange: (pendingCount: number) => void;
}

export class PromiseTracker {
    private readonly _promises: TrackedPromise[];

    public readonly monitor: EventDispatcher<PromiseTrackerEvents>;

    public get promise(): Promise<void> {
        return this._promises.length > 0
            ? Promise.allSettled(this._promises.map((p) => p.promise)).then(
                  () => {}
              )
            : Promise.resolve();
    }

    public constructor() {
        this._promises = [];
        this.monitor = new EventDispatcher<PromiseTrackerEvents>();
    }

    public async add(promises: Promise<unknown>[] = []) {
        this._promises.push(...promises.map(PromiseTracker.toTracked));

        // let all microtask queue flush by queuing a macrotask
        await new Promise((resolve) => setTimeout(resolve, 0));

        if (this.getPending().length === 0) {
            this.monitor.dispatch('onChange', 0);
            return;
        }

        this._promises.forEach((p) => this.injectEvents(p));
    }

    private static toTracked(promise: Promise<unknown>): TrackedPromise {
        const tracked: TrackedPromise = {
            promise,
            status: 'pending',
        };

        tracked.promise.finally(() => {
            tracked.status = 'resolved';
        });

        return tracked;
    }

    private async injectEvents(tracked: TrackedPromise) {
        tracked.promise.finally(() => {
            const pending = this.getPending();
            this.monitor.dispatch('onChange', pending.length);
        });
    }

    public getPending(): TrackedPromise[] {
        return Array.from(this._promises.values()).filter(
            (p) => p.status === 'pending'
        );
    }
}
