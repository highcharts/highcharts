import type JSON from '../Core/JSON';

/* *
 *
 *  Namespace
 *
 * */

namespace JSONUtilities {

    /* *
     *
     *  Declarations
     *
     * */

    export interface ClassJSON extends JSON.Object{
        $class: string;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default JSONUtilities;
