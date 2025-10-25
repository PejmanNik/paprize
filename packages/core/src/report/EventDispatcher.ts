type EventHandler<TKey extends keyof TEvents, TEvents> = TEvents[TKey] extends (
    ...args: infer TArgs
) => infer TReturn
    ? (...args: TArgs) => TReturn
    : never;

export class EventDispatcher<TEvents> {
    private registry = new Map<
        keyof TEvents,
        Set<(...args: unknown[]) => void>
    >();

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
