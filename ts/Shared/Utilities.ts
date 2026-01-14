/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */


/**
 * Utility function to extend an object with the members of another.
 *
 * @param {T|undefined} a
 *        The object to be extended.
 *
 * @param {Partial<T>} b
 *        The object to add to the first one.
 *
 * @return {T}
 *         Object a, the original object.
 */
export function extend<T extends object>(a: (T|undefined), b: Partial<T>): T {
    /* eslint-enable valid-jsdoc */
    let n;

    if (!a) {
        a = {} as T;
    }
    for (n in b) { // eslint-disable-line guard-for-in
        (a as any)[n] = (b as any)[n];
    }
    return a;
}

/**
 * Utility function to check for string type.
 *
 * @function Highcharts.isString
 *
 * @param {*} s
 *        The item to check.
 *
 * @return {boolean}
 *         True if the argument is a string.
 */
export function isString(s: unknown): s is string {
    return typeof s === 'string';
}

/**
 * Utility function to check if an item is an array.
 *
 * @function Highcharts.isArray
 *
 * @param {*} obj
 *        The item to check.
 *
 * @return {boolean}
 *         True if the argument is an array.
 */
export function isArray(obj: unknown): obj is Array<unknown> {
    const str = Object.prototype.toString.call(obj);

    return str === '[object Array]' || str === '[object Array Iterator]';
}

export function isObject<T>(obj: T, strict: true): obj is object & NonArray<NonFunction<NonNullable<T>>>;
export function isObject<T>(obj: T, strict?: false): obj is object & NonFunction<NonNullable<T>>;
/**
 * Utility function to check if an item is of type object.
 *
 * @function Highcharts.isObject
 *
 * @param {*} obj
 *        The item to check.
 *
 * @param {boolean} [strict=false]
 *        Also checks that the object is not an array.
 *
 * @return {boolean}
 *         True if the argument is an object.
 */
export function isObject<T>(
    obj: T,
    strict?: boolean
): obj is object & NonFunction<NonNullable<T>> {
    return (
        !!obj &&
        typeof obj === 'object' &&
        (!strict || !isArray(obj))
    ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/* eslint-disable valid-jsdoc */
/**
 * Iterate over object key pairs in an object.
 *
 * @function Highcharts.objectEach<T>
 *
 * @param {*} obj
 *        The object to iterate over.
 *
 * @param {Highcharts.ObjectEachCallbackFunction<T>} fn
 *        The iterator callback. It passes three arguments:
 *        * value - The property value.
 *        * key - The property key.
 *        * obj - The object that objectEach is being applied to.
 *
 * @param {T} [ctx]
 *        The context.
 */
export function objectEach<TObject, TContext>(
    obj: TObject,
    fn: ObjectEachCallback<TObject, TContext>,
    ctx?: TContext
): void {
    /* eslint-enable valid-jsdoc */
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            fn.call(ctx || obj[key] as unknown as TContext, obj[key], key, obj);
        }
    }
}

/* *
 *
 *  Declarations
 *
 * */

type NonArray<T> = T extends Array<unknown> ? never : T;
type NonFunction<T> = T extends Function ? never : T;

export interface ObjectEachCallback<TObject, TContext> {
    (
        this: TContext,
        value: TObject[keyof TObject],
        key: Extract<keyof TObject, string>,
        obj: TObject
    ): void;
}
