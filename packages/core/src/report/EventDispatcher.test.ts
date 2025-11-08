import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventDispatcher } from './EventDispatcher';

interface TestEvents {
    foo: (a: number, b: string) => void;
    bar: () => void;
}

describe('EventDispatcher', () => {
    let dispatcher: EventDispatcher<TestEvents>;
    beforeEach(() => {
        dispatcher = new EventDispatcher<TestEvents>();
    });

    it('should add and call event listeners', async () => {
        const handler = vi.fn();
        dispatcher.addEventListener('foo', handler);

        await dispatcher.dispatch('foo', 1, 'x');

        expect(handler).toHaveBeenCalledWith(1, 'x');
    });

    it('should remove event listeners', async () => {
        const handler = vi.fn();
        const remove = dispatcher.addEventListener('foo', handler);
        remove();

        await dispatcher.dispatch('foo', 2, 'y');

        expect(handler).not.toHaveBeenCalled();
    });

    it('should support multiple listeners for the same event', async () => {
        const handler1 = vi.fn();
        const handler2 = vi.fn();
        dispatcher.addEventListener('foo', handler1);
        dispatcher.addEventListener('foo', handler2);

        await dispatcher.dispatch('foo', 3, 'z');

        expect(handler1).toHaveBeenCalledWith(3, 'z');
        expect(handler2).toHaveBeenCalledWith(3, 'z');
    });

    it('should do nothing if dispatching an event with no listeners', async () => {
        await expect(dispatcher.dispatch('bar')).resolves.toBe(undefined);
    });
});
