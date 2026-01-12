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
