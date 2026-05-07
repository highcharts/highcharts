/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

/* *
 *
 *  Declarations
 *
 * */

/**
 * Type structor of arrays as it is supported in JSON.
 */
export interface JSONArray<T extends (JSONPrimitive|JSONType)=(JSONPrimitive|JSONType)> extends globalThis.Array<T> {
    [index: number]: T;
}

/**
 * Class API for JSON.stringify.
 */
export interface JSONBuilder {
    toJSON(): JSONType;
}

/**
 * Type structure of a record object as it is supported in JSON.
 */
export interface JSONObject<T extends (JSONPrimitive|JSONType)=(JSONPrimitive|JSONType)> {
    [key: string]: T;
}

/**
 * All primitive types, that are supported in JSON.
 */
export type JSONPrimitive = (boolean|number|string|null|undefined);

/**
 * All object types, that are supported in JSON.
 */
export type JSONType = (JSONArray|JSONObject);
