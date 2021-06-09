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
 *  Enums
 *
 * */

enum DataPromiseState {
    FULFILLED,
    PENDING,
    REJECTED
}

/* *
 *
 *  Class
 *
 * */

class DataPromise<TValue = never, TError = any> {

    /* *
     *
     *  Static Properties
     *
     * */

    private static builtinPromise = true;

    /* *
     *
     *  Static Functions
     *
     * */

    public static noBuiltinPromise(disable: boolean): void {
        DataPromise.builtinPromise = !disable;
    }

    public static reject<TValue = never, TError = any>(
        reason: (TError|DataPromise<TValue, TError>)
    ): DataPromise<TValue, TError> {
        if (win.Promise && DataPromise.builtinPromise) {
            return win.Promise.reject(reason);
        }
        if (reason instanceof DataPromise) {
            return reason;
        }
        return new DataPromise<TValue, TError>(
            (_resolve, reject): number => setTimeout(
                (): void => reject(reason),
                0
            )
        );
    }

    public static resolve<TValue = never, TError = any>(
        value: (TValue|DataPromise<TValue, TError>)
    ): DataPromise<TValue, TError> {
        if (win.Promise && DataPromise.builtinPromise) {
            return win.Promise.resolve(value);
        }
        if (value instanceof DataPromise) {
            return value;
        }
        return new DataPromise<TValue, TError>(
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
            resolve: (value: TValue) => void,
            reject: (reason?: TError) => void
        ) => void
    ) {
        if (win.Promise && DataPromise.builtinPromise) {
            return new win.Promise(executor);
        }

        const promise = this;

        try {
            executor(
                (value: TValue): void => promise.resolve(value),
                (reason?: TError): void => promise.reject(reason)
            );
        } catch (e) {
            promise.reject(e);
        }
    }

    /* *
     *
     *  Properties
     *
     * */

    private registry: Array<DataPromise.RegistryItem<TValue, TError>> = [];

    private reason?: TError;

    private state: DataPromiseState = DataPromiseState.PENDING;

    private value?: TValue;

    /* *
     *
     *  Functions
     *
     * */

    private callBack(): void {
        const promise = this,
            registry = promise.registry;

        let registryItem: (DataPromise.RegistryItem<TValue, TError>|undefined);

        if (promise.state === DataPromiseState.FULFILLED) {
            const value = promise.value as TValue;
            while ((registryItem = registry.shift())) {
                registryItem.resolvePromise(value);
            }
        } else {
            const reason = promise.reason;
            while ((registryItem = registry.shift())) {
                if (registryItem.rejectPromise) {
                    registryItem.rejectPromise(reason);
                }
            }
        }
    }

    private reject(reason?: TError): void {
        const promise = this;

        if (promise.state === DataPromiseState.PENDING) {
            promise.state = DataPromiseState.REJECTED;
            promise.reason = reason;
        }

        promise.callBack();
    }

    private resolve(value: (TValue|DataPromise<TValue>)): void {
        const promise = this;

        if (promise.state === DataPromiseState.PENDING) {
            if (value instanceof DataPromise) {
                value.then(promise.resolve, promise.reject);
            } else {
                promise.state = DataPromiseState.FULFILLED;
                promise.value = value;
            }
        }

        promise.callBack();
    }

    public then<UValue = never, UError = any>(
        onfulfilled?: (DataPromise.OnResolved<TValue, UValue, UError>|null),
        onrejected?: DataPromise.OnRejected<TError, UValue, UError>
    ): DataPromise<UValue, UError> {
        const promise = this,
            reason = promise.reason,
            value = promise.value;

        switch (promise.state) {
            case DataPromiseState.FULFILLED:
                if (onfulfilled) {
                    try {
                        return DataPromise.resolve(onfulfilled(value as TValue));
                    } catch (e) {
                        return DataPromise.reject(e);
                    }
                }
                return DataPromise.resolve(void 0 as unknown as UValue);
            case DataPromiseState.REJECTED:
                if (onrejected) {
                    try {
                        return DataPromise.resolve(onrejected(reason));
                    } catch (e) {
                        return DataPromise.reject(e);
                    }
                }
                return DataPromise.reject(reason);
        }

        return new DataPromise<UValue, UError>((resolve, reject): void => {
            promise.registry.push({
                resolvePromise: (value: TValue): void => {
                    try {
                        if (onfulfilled) {
                            const result = onfulfilled(value);
                            if (result instanceof DataPromise) {
                                result.then(resolve, reject);
                            } else {
                                resolve(result);
                            }
                        } else {
                            resolve(value as unknown as UValue);
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                rejectPromise: (reason?: TError): void => {
                    try {
                        if (onrejected) {
                            const result = onrejected(reason);
                            if (result instanceof DataPromise) {
                                result.then(resolve, reject);
                            } else {
                                resolve(result);
                            }
                        } else {
                            reject(reason as unknown as UError);
                        }
                    } catch (e) {
                        reject(e);
                    }
                }
            });
        });
    }

    public 'catch'<UValue = never, UError = any>(
        onrejected: DataPromise.OnRejected<TError, UValue, UError>
    ): DataPromise<UValue, UError> {
        return this.then(void 0, onrejected);
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

// interface DataPromise<TValue = never, TError = any> extends Promise<TValue> {
//     // fake full API in case of browser support
// }

/* *
 *
 *  Class Namespace
 *
 * */

namespace DataPromise {
    export interface RegistryItem<TValue, TError> {
        rejectPromise?: OnRejected<TError, void>;
        resolvePromise: OnResolved<TValue, void>;
    }
    export type OnRejected<TError, UValue = never, UError = any> = (
        reason?: TError
    ) => (UValue|DataPromise<UValue, UError>);
    export type OnResolved<TValue, UValue = never, UError = any> = (
        value: TValue
    ) => (UValue|DataPromise<UValue, UError>);
}

/* *
 *
 *  Default Export
 *
 * */

export default DataPromise;
