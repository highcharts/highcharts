// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/annotations-advanced
 * @requires highcharts
 *
 * Annotations module
 *
 * (c) 2009-2026 Highsoft AS
 * Author: Torstein Honsi
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import Annotation from '../../Extensions/Annotations/Annotation.js';
import NavigationBindings from '../../Extensions/Annotations/NavigationBindings.js';

// Import all the advanced annotation types to make sure they are registered
// when both annotations and annotations-advanced modules are loaded.
import '../../Extensions/Annotations/Types/BasicAnnotation.js';
import '../../Extensions/Annotations/Types/CrookedLine.js';
import '../../Extensions/Annotations/Types/ElliottWave.js';
import '../../Extensions/Annotations/Types/Tunnel.js';
import '../../Extensions/Annotations/Types/InfinityLine.js';
import '../../Extensions/Annotations/Types/TimeCycles.js';
import '../../Extensions/Annotations/Types/Fibonacci.js';
import '../../Extensions/Annotations/Types/FibonacciTimeZones.js';
import '../../Extensions/Annotations/Types/Pitchfork.js';
import '../../Extensions/Annotations/Types/VerticalLine.js';
import '../../Extensions/Annotations/Types/Measure.js';
const G: AnyRecord = Highcharts;

// Ensure annotations module is initialized if not already loaded
if (!G.Annotation) {
    G.Annotation = Annotation;
    G.NavigationBindings = G.NavigationBindings || NavigationBindings;
    G.Annotation.compose(
        G.Chart, G.NavigationBindings, G.Pointer, G.SVGRenderer
    );
}

// Copy types from the imported Annotation to G.Annotation if they're
// different instances. This ensures types registered on the imported
// Annotation are available on G.Annotation.
if (G.Annotation !== Annotation && Annotation.types) {
    Object.assign(G.Annotation.types, Annotation.types);
}

export default Highcharts;
