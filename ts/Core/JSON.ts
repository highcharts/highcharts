/* *
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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

export namespace JSON {

    /**
     * Type structor of arrays as it is supported in JSON.
     */
    export interface Array extends globalThis.Array<(Primitive|Type)> {
        [index: number]: (Primitive|Type);
    }

    /**
     * Class API for toJSON implementation based on JSON.stringify.
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
