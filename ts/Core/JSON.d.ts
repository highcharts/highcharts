/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Declarations
 *
 * */

export namespace JSON {

    /**
     * Type structor of arrays as it is supported in JSON.
     */
    export interface Array extends globalThis.Array<(Primitive|Type)> {
        [index: number]: (Primitive|Type);
    }

    /**
     * Type structure of a record object as it is supported in JSON.
     */
    export interface Object {
        [key: string]: (Primitive|Type);
    }

    /**
     * All primitive types, that are supported in JSON.
     */
    export type Primitive = (boolean|number|string|null|undefined);

    /**
     * All object types, that are supported in JSON.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    export type Type = (Array|Object|Primitive);

}

export type JSON = (JSON.Array|JSON.Object);

/* *
 *
 *  Default Export
 *
 * */

export default JSON;
