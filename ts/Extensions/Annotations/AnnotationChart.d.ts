/* *
 *
 *  (c) 2009-2021 Highsoft, Black Label
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type Annotation from './Annotations';
import type { AnnotationsOptions } from './AnnotationsOptions';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type Chart from '../../Core/Chart/Chart.js';


/* *
 *
 * Declarations
 *
 * */

export interface AnnotationChart extends Chart {
    annotations: Array<Annotation>;
    controlPointsGroup: SVGElement;
    options: Annotation.ChartOptions;
    plotBoxClip: SVGElement;
    addAnnotation(userOptions: AnnotationsOptions, redraw?: boolean): Annotation;
    drawAnnotations(): void;
    initAnnotation(userOptions: AnnotationsOptions): Annotation;
    removeAnnotation(idOrAnnotation: (number|string|Annotation)): void;
}

/* *
 *
 * Default Export
 *
 * */
export default AnnotationChart;
