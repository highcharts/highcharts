/* *
 *
 *  (c) 2009-2026 Highsoft AS
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
    export interface Array<T extends (Primitive|Type)=(Primitive|Type)> extends globalThis.Array<T> {
        [index: number]: T;
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
    export interface Object<T extends (Primitive|Type)=(Primitive|Type)> {
        [key: string]: T;
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
