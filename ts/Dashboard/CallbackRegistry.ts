interface Callback{
    type: string;
    func: Function;
    // args: [];
    // context?: ThisType<any>;
}


interface CallbackJSON {
    type: string;
    func: string;
}


class CallbackRegistry {
    public registry: Record<string, Callback> = {};

    public addCallback(id: string, callback: Callback): void {
        this.registry[id] = callback;
    }

    public getCallback(id: string): Callback {
        return this.registry[id];
    }

    public toJSON(): Record<string, CallbackJSON> {

        const json: Record<string, CallbackJSON> = {};
        Object.keys(this.registry).forEach((key): void => {
            const entry = this.getCallback(key);
            const { func, type } = entry;

            json[key] = {
                func: func.toString(),
                type
            };

        });

        return json;
    }
}

export default CallbackRegistry;
