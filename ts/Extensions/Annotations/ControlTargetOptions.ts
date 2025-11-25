/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ControlPointOptions from './ControlPointOptions';
import type MockPointOptions from './MockPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface ControlTargetOptions {
    /** @internal */
    controlPointOptions?: ControlPointOptions;

    controlPoints?: Array<ControlPointOptions>;

    point?: (string|MockPointOptions);

    points?: Array<(string|MockPointOptions)>;

    /** @internal */
    x?: number;

    /** @internal */
    y?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default ControlTargetOptions;
