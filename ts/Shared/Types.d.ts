/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Declarations
 *
 * */

/**
 * Any type for objects with mixed property types.
 *
 * **Note:** This is not type safe and should be used only for property
 *           loops.
 */
export type AnyRecord = Record<string, any>;

/**
 * Utility type to mark recursively all properties and sub-properties
 * optional.
 */
export type DeepPartial<T> = {
    [K in keyof T]?: (T[K]|DeepPartial<T[K]>);
};

/**
 * Any typed array.
 */
export type TypedArray = (
    Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|
    Int32Array|Uint32Array|Float32Array|Float64Array
);

/**
 * Constructor of a typed array.
 */
export type TypedArrayConstructor = (
    Int8ArrayConstructor|Uint8ArrayConstructor|Uint8ClampedArrayConstructor|
    Int16ArrayConstructor|Uint16ArrayConstructor|Int32ArrayConstructor|
    Uint32ArrayConstructor|Float32ArrayConstructor|Float64ArrayConstructor
);
