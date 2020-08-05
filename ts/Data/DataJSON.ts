/* *
 *
 *  Data module
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import U from '../Core/Utilities.js';
const {
    merge
} = U;

type GlobalArray<T> = Array<T>;

class DataJSON {

    /* *
     *
     *  Static Properties
     *
     * */

    private static registry: Record<string, DataJSON.ClassType> = {};

    /* *
     *
     *  Static Functions
     *
     * */

    public static addClass(dataClassType: DataJSON.ClassType): boolean {

        const dataClassName = dataClassType.$class,
            registry = DataJSON.registry;

        if (
            !dataClassName ||
            registry[dataClassName]
        ) {
            return false;
        }

        registry[dataClassName] = dataClassType;

        return true;
    }

    public static fromJSON(json: DataJSON.ClassJSON): (DataJSON.Class|undefined) {

        const dataClassType = DataJSON.registry[json.$class];

        if (!dataClassType) {
            return;
        }

        return dataClassType.fromJSON(json);
    }

    public static getAllClassNames(): Array<string> {
        return Object.keys(DataJSON.registry);
    }

    public static getAllClassTypes(): Record<string, DataJSON.ClassType> {
        return merge(DataJSON.registry);
    }

    public static getClass(dataClassType: string): (DataJSON.ClassType|undefined) {
        return DataJSON.registry[dataClassType];
    }

    /* *
     *
     *  Constructor
     *
     * */

    private constructor() {
        // prevents instantiation, therefor static only
    }

}

namespace DataJSON {

    export type Primitives = (boolean|number|string|null);

    // eslint-disable-next-line @typescript-eslint/ban-types
    export type Types = (Object|Array);

    export interface Array extends GlobalArray<(Primitives|Types)> {
        [index: number]: (Primitives|Types);
    }

    export interface Class {
        toJSON(): DataJSON.ClassJSON;
    }

    export interface ClassJSON extends Object {
        $class: string;
    }

    export interface ClassType {
        $class: string;
        constructor: Function;
        prototype: Class;
        fromJSON(json: DataJSON.Object): (Class|undefined);
    }

    export interface Object {
        [key: string]: (Primitives|Types);
    }
}

export default DataJSON;
