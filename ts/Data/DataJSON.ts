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

class DataJSON {

    /* *
     *
     *  Static Properties
     *
     * */

    private static readonly nameRegExp = /^function\s+(\w*?)\s*\(/;
    private static readonly registry: Record<string, DataJSON.ClassType> = {};

    /* *
     *
     *  Static Functions
     *
     * */

    public static addClass(classType: DataJSON.ClassType): boolean {

        const className = DataJSON.getName(classType),
            registry = DataJSON.registry;

        if (!className || registry[className]) {
            return false;
        }

        registry[className] = classType;

        return true;
    }

    public static fromJSON(json: DataJSON.ClassJSON): (DataJSON.Class|undefined) {

        const classType = DataJSON.registry[json.$class];

        if (!classType) {
            return;
        }

        return classType.fromJSON(json);
    }

    public static getAllClassNames(): Array<string> {
        return Object.keys(DataJSON.registry);
    }

    public static getAllClassTypes(): Record<string, DataJSON.ClassType> {
        return merge(DataJSON.registry);
    }

    public static getClass(className: string): (DataJSON.ClassType|undefined) {
        return DataJSON.registry[className];
    }

    private static getName(classType: DataJSON.ClassType): string {
        return (
            classType.toString().match(DataJSON.nameRegExp) ||
            ['', '']
        )[1];
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

    export interface Array extends globalThis.Array<(Primitives|Types)> {
        [index: number]: (Primitives|Types);
    }

    export interface Class {
        toJSON(): DataJSON.ClassJSON;
    }

    export interface ClassJSON extends Object {
        $class: string;
    }

    export interface ClassType {
        constructor: Function;
        prototype: Class;
        fromJSON(json: DataJSON.Object): (Class|undefined);
    }

    export interface Object {
        [key: string]: (Primitives|Types);
    }

}

export default DataJSON;
