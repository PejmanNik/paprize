export interface EventReference {
    [key: string]: (...args: any[]) => void;
}

export interface Monitor<TEvents extends EventReference> {
    addEventListener<T extends keyof TEvents>(
        name: T,
        handler: TEvents[T]
    ): () => void;
    removeEventListener(
        name: keyof TEvents,
        handler: TEvents[keyof TEvents]
    ): void;
}

export class EventDispatcher<TEvents extends EventReference>
    implements Monitor<TEvents>
{
    private registry = new Map<keyof TEvents, Set<Function>>();

    public addEventListener<T extends keyof TEvents>(
        name: T,
        handler: TEvents[T]
    ) {
        const { registry } = this;
        const listeners = new Set(registry.get(name));

        listeners.add(handler);
        registry.set(name, listeners);

        return () => this.removeEventListener(name, handler);
    }

    public removeEventListener(
        name: keyof TEvents,
        handler: TEvents[keyof TEvents]
    ) {
        const { registry } = this;
        const listeners = new Set(registry.get(name));

        listeners.delete(handler);
        registry.set(name, listeners);
    }

    public dispatch<T extends keyof TEvents>(
        name: T,
        ...args: Parameters<TEvents[T]>
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
