/* *
 *
 *  (c) 2020-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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

export namespace JSON {

    /**
     * Type structor of arrays as it is supported in JSON.
     */
    export interface Array extends globalThis.Array<(Primitive|Type)> {
        [index: number]: (Primitive|Type);
    }

    /**
     * Class API for JSON.stringify.
     */
    export interface Builder {
        toJSON(): Type;
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
    export type Type = (Array|Object);

}

/* *
 *
 *  Default Export
 *
 * */

export default JSON;
