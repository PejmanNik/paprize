type EventHandler<TKey extends keyof TEvents, TEvents> = TEvents[TKey] extends (
    ...args: any[]
) => void
    ? TEvents[TKey]
    : never;

export class EventDispatcher<TEvents> {
    private registry = new Map<keyof TEvents, Set<Function>>();

    public addEventListener<T extends keyof TEvents>(
        name: T,
        handler: EventHandler<T, TEvents>
    ) {
        const { registry } = this;
        const listeners = new Set(registry.get(name));

        listeners.add(handler);
        registry.set(name, listeners);

        return () => this.removeEventListener(name, handler);
    }

    public removeEventListener<T extends keyof TEvents>(
        name: T,
        handler: EventHandler<T, TEvents>
    ) {
        const { registry } = this;
        const listeners = new Set(registry.get(name));

        listeners.delete(handler);
        registry.set(name, listeners);
    }

    public dispatch<T extends keyof TEvents>(
        name: T,
        ...args: Parameters<EventHandler<T, TEvents>>
    ) {
        const { registry } = this;
        const listeners = registry.get(name);

        if (!listeners) {
            return;
        }

        for (const listener of listeners) {
            listener(...args);
        }
    }
}

export type Monitor<TEvents> = Omit<EventDispatcher<TEvents>, 'dispatch'>;
