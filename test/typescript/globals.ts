/* *
 *
 *  Test cases for globals.d.ts
 *
 *  (c) 2018 Highsoft AS. All rights reserved.
 *
 * */

import * as globals from 'highcharts/globals';

test_GlobalSVGElement();

/**
 * Tests globals.GlobalSVGElement in a simple use case.
 */
function test_GlobalSVGElement() {
    let test: (globals.GlobalSVGElement|null);
    test = document.getElementById('test') as (SVGElement|null);
    if (test) {
        test.focus();
    }
}
