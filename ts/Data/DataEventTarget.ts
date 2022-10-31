/* *
 *
 *  Declarations
 *
 * */

type DataEventListeners =
    Record<string, Array<EventListenerOrEventListenerObject>>;

/* *
 *
 *  Class
 *
 * */

class DataEventTarget implements EventTarget {

    /* *
     *
     *  Static Properties
     *
     * */

    private static __listeners: DataEventListeners = {};

    /* *
     *
     *  Properties
     *
     * */

    private __listeners: DataEventListeners = {};

    /* *
     *
     *  Functions
     *
     * */

    public addEventListener(
        type: string,
        callback: (EventListenerOrEventListenerObject|null)
    ): void {

        if (!callback) {
            return;
        }

        (this.__listeners[type] = this.__listeners[type] || []).push(callback);
    }

    public attachEvent(): boolean {
        return false;
    }

    public detachEvent(): number {
        return 0;
    }

    public dispatchEvent(
        e: (AnyRecord|Event)
    ): boolean {
        let ev: Event;

        if (e instanceof Event) {
            ev = e;
        } else {
            ev = new CustomEvent(e.type, { detail: e });
        }

        let listeners = (this.__listeners[ev.type] || []);

        if (!listeners.length) {
            return true;
        }

        let canceled = false,
            stopped = false,
            stoppedAll = false;

        ev.preventDefault = (): void => {
            canceled = true;
        };
        ev.stopImmediatePropagation = (): void => {
            stoppedAll = true;
        };
        ev.stopPropagation = (): void => {
            stopped = true;
        };

        const dispatch = (): void => {
            for (const listener of listeners) {

                if (typeof listener === 'function') {
                    listener.call(this, ev);
                } else if (typeof listener.handleEvent === 'function') {
                    listener.handleEvent.call(this, ev);
                }

                if (canceled || stoppedAll) {
                    break;
                }
            }
        };
        console.log('dispatching...');
        dispatch();

        // if (!stoppedAll) {
        //     listeners = (this.constructor as typeof DataEventTarget)
        //         .__listeners[ev.type] || [];

        //     dispatch();
        // }
        console.log('done');
        return !ev.cancelable || canceled;
    }

    public removeEventListener(
        type: string,
        callback: (EventListenerOrEventListenerObject|null)
    ): void {

        if (!callback) {
            return;
        }

        const index = (this.__listeners[type] = this.__listeners[type] || [])
            .lastIndexOf(callback);

        this.__listeners[type].splice(index, 1);
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DataEventTarget;
