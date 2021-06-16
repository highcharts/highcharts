/* *
 *
 *  Data Layer
 *
 *  (c) 2020-2021 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import H from '../Core/Globals.js';
const win: AnyRecord = H.win;

/* *
 *
 *  Class
 *
 * */

class DataPromise<T> implements Promise<T> {

    /* *
     *
     *  Static Properties
     *
     * */

    public static onlyPolyfill = false;

    /* *
     *
     *  Static Functions
     *
     * */

    private static isPromiseLike<T>(promise: unknown): promise is PromiseLike<T> {
        return (
            typeof promise === 'object' &&
            promise !== null &&
            typeof (promise as PromiseLike<T>).then === 'function'
        );
    }

    public static reject<T = never>(
        reason: unknown
    ): DataPromise<T> {
        if (win.Promise && !DataPromise.onlyPolyfill) {
            return win.Promise.reject(reason);
        }
        if (reason instanceof DataPromise) {
            return reason;
        }
        return new DataPromise<T>(
            (_resolve, reject): number => setTimeout(
                (): void => reject(reason),
                0
            )
        );
    }


    public static resolve<T>(
        value: (T|PromiseLike<T>)
    ): DataPromise<T>;
    public static resolve<T>(): DataPromise<(T|void)>;
    public static resolve<T>(
        value?: (T|PromiseLike<T>)
    ): DataPromise<(T|void)> {
        if (win.Promise && !DataPromise.onlyPolyfill) {
            return win.Promise.resolve(value);
        }
        if (DataPromise.isPromiseLike(value)) {
            return new DataPromise((resolve, reject): void => {
                value.then(resolve, reject);
            });
        }
        return new DataPromise(
            (resolve): number => setTimeout(
                (): void => resolve(value),
                0
            )
        );
    }

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        executor: (
            resolve: (value?: (T|PromiseLike<T>)) => void,
            reject: (reason?: unknown) => void
        ) => void
    ) {
        if (win.Promise && !DataPromise.onlyPolyfill) {
            return new win.Promise(executor);
        }

        const promise = this;

        try {
            executor(
                (value?: (T|PromiseLike<T>)): void => promise.resolved(value),
                (reason?: unknown): void => promise.rejected(reason)
            );
        } catch (e) {
            promise.rejected(e);
        }
    }

    /* *
     *
     *  Properties
     *
     * */

    private jobs: Array<DataPromise.Job<T>> = [];

    private reason: unknown;

    private state = DataPromise.State.Pending;

    public readonly [Symbol.toStringTag]: string = 'DataPromise';

    private value: T = void 0 as unknown as T;

    /* *
     *
     *  Functions
     *
     * */

    public 'catch'<TResult = never>(
        onrejected?: (((reason: unknown) => (TResult|PromiseLike<TResult>))|null)
    ): DataPromise<(T|TResult)> {
        return this.then(null, onrejected);
    }

    private rejected(reason?: unknown): void {
        const promise = this;

        if (promise.state === DataPromise.State.Pending) {
            promise.state = DataPromise.State.Rejected;
            promise.reason = reason;
            setTimeout((): void => promise.work(), 0);
        }
    }

    private resolved(value?: (T|PromiseLike<T>)): void {
        const promise = this;

        if (promise.state === DataPromise.State.Pending) {
            if (DataPromise.isPromiseLike(value)) {
                value.then(
                    (value: T): void => promise.resolved(value),
                    (reason: unknown): void => promise.rejected(reason)
                );
            } else {
                promise.state = DataPromise.State.Fulfilled;
                promise.value = value as T;
                setTimeout((): void => promise.work(), 0);
            }
        }
    }

    public then<TResult1 = T, TResult2 = never>(
        onfulfilled?: (((value: T) => (TResult1|PromiseLike<TResult1>))|null),
        onrejected?: (((reason: unknown) => (TResult2|PromiseLike<TResult2>))|null)
    ): DataPromise<(TResult1|TResult2)> {
        const promise = this,
            newPromise = new DataPromise<(TResult1|TResult2)>(
                (resolve, reject): void => {
                    const rejecter = (reason: unknown): void => {
                            if (onrejected) {
                                try {
                                    const result = onrejected(reason);
                                    if (result instanceof DataPromise) {
                                        result.then(resolve, reject);
                                    } else {
                                        resolve(result);
                                    }
                                    return;
                                } catch (e) {
                                    reason = e;
                                }
                            }
                            if (newPromise.jobs.length) {
                                reject(reason);
                            } else if (reason) {
                                throw reason;
                            } else {
                                throw new Error('Unhandled exception');
                            }
                        },
                        resolver = (value: T): void => {
                            if (onfulfilled) {
                                try {
                                    const result = onfulfilled(value);
                                    if (result instanceof DataPromise) {
                                        result.then(resolve, reject);
                                    } else {
                                        resolve(result);
                                    }
                                } catch (e) {
                                    rejecter(e);
                                }
                            } else {
                                resolve(value as unknown as TResult1);
                            }
                        };

                    switch (promise.state) {
                        case DataPromise.State.Fulfilled:
                            return resolver(promise.value);
                        case DataPromise.State.Rejected:
                            return rejecter(promise.reason);
                    }

                    promise.jobs.push({
                        resolve: resolver,
                        reject: rejecter
                    });
                }
            );

        return newPromise;
    }

    private work(): void {
        const promise = this,
            jobs = promise.jobs;

        let job: (DataPromise.Job<T>|undefined),
            rejectHandled: (boolean|undefined);

        while ((job = jobs.shift())) {
            try {
                if (promise.state === DataPromise.State.Fulfilled) {
                    job.resolve(promise.value);
                } else if (job.reject) {
                    rejectHandled = true;
                    job.reject(promise.reason);
                }
            } catch (e) {
                rejectHandled = false;
                promise.reason = e;
                promise.state = DataPromise.State.Rejected;
            }
        }

        if (rejectHandled === false) {
            if (promise.reason) {
                throw promise.reason;
            } else {
                throw new Error('Unhandled rejection');
            }
        }
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface DataPromise<T> extends Promise<T> {
    // applies all promise typing to class
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace DataPromise {

    /* *
     *
     *  Declarations
     *
     * */

    export interface Job<T> {
        resolve: (value: T) => void;
        reject: (reason: unknown) => void;
    }

    /* *
     *
     *  Enums
     *
     * */

    export enum State {
        Fulfilled = 2,
        Pending = 0,
        Rejected = 1
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DataPromise;
