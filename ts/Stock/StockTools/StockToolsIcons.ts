/* *
 *
 *  (c) 2017 Highsoft AS
 *  Authors: Paweł Fus
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Renderer/SVG/SymbolType' {
    interface SymbolTypeRegistry {
        /** @requires Extensions/StockTools */
        'current-price-hide.svg': typeof currentPriceHide;
        /** @requires Extensions/StockTools */
        'current-price-show.svg': typeof currentPriceShow;
        /** @requires Extensions/StockTools */
        'annotations-hidden.svg': typeof annotationsHidden;
        /** @requires Extensions/StockTools */
        'annotations-visible.svg': typeof annotationsVisible;
        /** @requires Extensions/StockTools */
        'arrow-right.svg': typeof arrowRight;
        /** @requires Extensions/StockTools */
        'separator.svg': typeof separator,
        /** @requires Extensions/StockTools */
        'circle.svg': typeof circle,
        /** @requires Extensions/StockTools */
        'close.svg': typeof close,
        /** @requires Extensions/StockTools */
        'destroy.svg': typeof destroy,
        /** @requires Extensions/StockTools */
        'edit.svg': typeof edit,
        /** @requires Extensions/StockTools */
        'ellipse.svg': typeof ellipse,
        /** @requires Extensions/StockTools */
        'rectangle.svg': typeof rectangle,
        /** @requires Extensions/StockTools */
        'label.svg': typeof label,
        /** @requires Extensions/StockTools */
        'flag-basic.svg': typeof flagBasic,
        /** @requires Extensions/StockTools */
        'flag-diamond.svg': typeof flagDiamond,
        /** @requires Extensions/StockTools */
        'flag-trapeze.svg': typeof flagTrapeze,
        /** @requires Extensions/StockTools */
        'flag-elipse.svg': typeof flagElipse,
        /** @requires Extensions/StockTools */
        'segment.svg': typeof segment,
        /** @requires Extensions/StockTools */
        'arrow-segment.svg': typeof arrowSegment,
        /** @requires Extensions/StockTools */
        'ray.svg': typeof ray,
        /** @requires Extensions/StockTools */
        'arrow-ray.svg': typeof arrowRay,
        /** @requires Extensions/StockTools */
        'line.svg': typeof line,
        /** @requires Extensions/StockTools */
        'arrow-line.svg': typeof arrowLine,
        /** @requires Extensions/StockTools */
        'vertical-line.svg': typeof verticalLine,
        /** @requires Extensions/StockTools */
        'horizontal-line.svg': typeof horizontalLine,
        /** @requires Extensions/StockTools */
        'crooked-3.svg': typeof crooked3,
        /** @requires Extensions/StockTools */
        'crooked-5.svg': typeof crooked5,
        /** @requires Extensions/StockTools */
        'elliott-3.svg': typeof elliott3,
        /** @requires Extensions/StockTools */
        'elliott-5.svg': typeof elliott5,
        /** @requires Extensions/StockTools */
        'vertical-counter.svg': typeof verticalCounter,
        /** @requires Extensions/StockTools */
        'vertical-label.svg': typeof verticalLabel,
        /** @requires Extensions/StockTools */
        'vertical-arrow.svg': typeof verticalArrow,
        /** @requires Extensions/StockTools */
        'pitchfork.svg': typeof pitchfork,
        /** @requires Extensions/StockTools */
        'fibonacci.svg': typeof fibonacci,
        /** @requires Extensions/StockTools */
        'fibonacci-timezone.svg': typeof fibonacciTimezone,
        /** @requires Extensions/StockTools */
        'parallel-channel.svg': typeof parallelChannel,
        /** @requires Extensions/StockTools */
        'time-cycles.svg': typeof timeCycles,
        /** @requires Extensions/StockTools */
        'measure-x.svg': typeof measureX,
        /** @requires Extensions/StockTools */
        'measure-y.svg': typeof measureY,
        /** @requires Extensions/StockTools */
        'measure-xy.svg': typeof measureXY,
        /** @requires Extensions/StockTools */
        'indicators.svg': typeof indicators,
        /** @requires Extensions/StockTools */
        'zoom-x.svg': typeof zoomX,
        /** @requires Extensions/StockTools */
        'zoom-y.svg': typeof zoomY,
        /** @requires Extensions/StockTools */
        'zoom-xy.svg': typeof zoomXY,
        /** @requires Extensions/StockTools */
        'series-ohlc.svg': typeof seriesOhlc,
        /** @requires Extensions/StockTools */
        'series-line.svg': typeof seriesLine,
        /** @requires Extensions/StockTools */
        'series-candlestick.svg': typeof seriesCandlestick,
        /** @requires Extensions/StockTools */
        'series-hlc.svg': typeof seriesHlc,
        /** @requires Extensions/StockTools */
        'series-heikin-ashi.svg': typeof seriesHeikinAshi,
        /** @requires Extensions/StockTools */
        'series-hollow-candlestick.svg': typeof seriesHollowCandlestick,
        /** @requires Extensions/StockTools */
        'fullscreen.svg': typeof fullscreen,
        /** @requires Extensions/StockTools */
        'save-chart.svg': typeof saveChart

    }
}

/* *
 *
 *  Functions
 *
 * */

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function arrowRight(): SVGPath {
    return [
        ['M', 12.78, 25.03],
        ['L', 11.72, 23.97],
        ['L', 19.689, 16],
        ['L', 11.72, 8.03],
        ['L', 12.78, 6.97],
        ['L', 21.811, 16],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function saveChart(): SVGPath {
    return [
        ['M', 8.749, 21.25],
        ['L', 12.75, 21.25],
        ['L', 12.75, 26.0],
        ['L', 14.25, 26.0],
        ['L', 14.25, 19.75],
        ['L', 12.37, 19.75],
        ['L', 15.999, 16.12],
        ['L', 19.629, 19.75],
        ['L', 17.75, 19.75],
        ['L', 17.75, 26.0],
        ['L', 19.25, 26.0],
        ['L', 19.25, 21.25],
        ['L', 23.25, 21.25],
        ['L', 16.0, 14.0],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function zoomY(): SVGPath {
    return [
        ['M', 16.25, 18.0],
        ['L', 16.25, 15.25],
        ['L', 19.0, 15.25],
        ['L', 19.0, 13.75],
        ['L', 16.25, 13.75],
        ['L', 16.25, 11.0],
        ['L', 14.75, 11.0],
        ['L', 14.75, 13.75],
        ['L', 12.0, 13.75],
        ['L', 12.0, 15.25],
        ['L', 14.75, 15.25],
        ['L', 14.75, 18.0],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function zoomXY(): SVGPath {
    return [
        ['M', 15.25, 11.0],
        ['L', 13.75, 11.0],
        ['L', 13.75, 13.75],
        ['L', 11.0, 13.75],
        ['L', 11.0, 15.25],
        ['L', 13.75, 15.25],
        ['L', 13.75, 18.0],
        ['L', 15.25, 18.0],
        ['L', 15.25, 15.25],
        ['L', 18.0, 15.25],
        ['L', 18.0, 13.75],
        ['L', 15.25, 13.75],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function zoomX(): SVGPath {
    return [
        ['M', 16.25, 18.0],
        ['L', 16.25, 15.25],
        ['L', 19.0, 15.25],
        ['L', 19.0, 13.75],
        ['L', 16.25, 13.75],
        ['L', 16.25, 11.0],
        ['L', 14.75, 11.0],
        ['L', 14.75, 13.75],
        ['L', 12.0, 13.75],
        ['L', 12.0, 15.25],
        ['L', 14.75, 15.25],
        ['L', 14.75, 18.0],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function verticalArrow(): SVGPath {
    return [
        ['M', 16.251, 23.243],
        ['L', 16.251, 4.001],
        ['L', 14.751, 4.001],
        ['L', 14.751, 23.244],
        ['L', 13.0, 23.244],
        ['L', 15.5, 28.0],
        ['L', 18.0, 23.243],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function verticalLabel(): SVGPath {
    return [
        ['M', 16.251, 11.0],
        ['L', 14.751, 11.0],
        ['L', 14.751, 23.244],
        ['L', 13.0, 23.244],
        ['L', 15.5, 28.0],
        ['L', 18.0, 23.243],
        ['L', 16.251, 23.243],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function verticalCounter(): SVGPath {
    return [
        ['M', 16.251, 11.0],
        ['L', 14.751, 11.0],
        ['L', 14.751, 23.244],
        ['L', 13.0, 23.244],
        ['L', 15.5, 28.0],
        ['L', 18.0, 23.243],
        ['L', 16.251, 23.243],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function seriesOhlc(): SVGPath {
    return [
        ['M', 8.3, 6.001],
        ['L', 6.7, 6.001],
        ['L', 6.7, 9.75],
        ['L', 3.75, 9.75],
        ['L', 3.75, 11.25],
        ['L', 6.7, 11.25],
        ['L', 6.7, 24.0],
        ['L', 8.3, 24.0],
        ['L', 8.3, 19.25],
        ['L', 11.25, 19.25],
        ['L', 11.25, 17.75],
        ['L', 8.3, 17.75],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function seriesHeikinAshi(): SVGPath {
    return [];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function seriesCandlestick(): SVGPath {
    return [
        ['M', 7.0, 26.0],
        ['L', 8.0, 26.0],
        ['L', 8.0, 23.0],
        ['L', 9.0, 23.0],
        ['L', 9.0, 18.0],
        ['L', 8.0, 18.0],
        ['L', 8.0, 14.0],
        ['L', 7.0, 14.0],
        ['L', 7.0, 18.0],
        ['L', 6.0, 18.0],
        ['L', 6.0, 23.0],
        ['L', 7.0, 23.0],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function seriesLine(): SVGPath {
    return [
        ['M', 4.125, 28.95],
        ['C', 4.046, 28.938, 3.966, 28.926, 3.886, 28.895],
        ['C', 3.45, 28.763, 3.203, 28.302, 3.335, 27.867],
        ['L', 8.844, 9.664],
        ['L', 14.073, 21.169],
        ['L', 18.747, 12.756],
        ['L', 22.626, 15.787],
        ['L', 27.228, 3.706],
        ['C', 27.391, 3.28, 27.869, 3.066, 28.292, 3.229],
        ['C', 28.718, 3.391, 28.933, 3.868, 28.771, 4.293],
        ['L', 23.373, 18.462],
        ['L', 19.252, 15.243],
        ['L', 13.926, 24.83],
        ['L', 9.156, 14.336],
        ['L', 4.915, 28.363],
        ['C', 4.807, 28.721, 4.479, 28.95, 4.125, 28.95],
        ['Z']
    ];
}


/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function seriesHollowCandlestick(): SVGPath {
    return [
        ['M', 19.77, 10.19],
        ['L', 19.77, 19.77],
        ['L', 18.68, 19.77],
        ['L', 18.68, 10.19],
        ['L', 19.77, 10.19],
        ['M', 20.85, 9.12],
        ['L', 17.6, 9.12],
        ['L', 17.6, 20.84],
        ['L', 20.85, 20.84],
        ['L', 20.85, 9.12],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function separator(): SVGPath {
    return [
        ['M', 32, 16.251],
        ['L', 28.48, 16.251],
        ['L', 28.48, 14.751],
        ['L', 32, 14.751],
        ['Z'],
        ['M', 24.92, 16.251],
        ['L', 21.36, 16.251],
        ['L', 21.36, 14.751],
        ['L', 24.92, 14.751],
        ['Z'],
        ['M', 17.8, 16.251],
        ['L', 14.24, 16.251],
        ['L', 14.24, 14.751],
        ['L', 17.8, 14.751],
        ['Z'],
        ['M', 10.68, 16.251],
        ['L', 7.12, 16.251],
        ['L', 7.12, 14.751],
        ['L', 10.68, 14.751],
        ['Z'],
        ['M', 3.56, 16.251],
        ['L', 0, 16.251],
        ['L', 0, 14.751],
        ['L', 3.56, 14.751],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function segment(): SVGPath {
    return [
        ['M', 24.5, 5.625],
        ['C', 23.465, 5.625, 22.625, 6.465, 22.625, 7.5],
        ['C', 22.625, 7.741, 22.675, 7.97, 22.758, 8.182],
        ['L', 8.182, 22.758],
        ['C', 7.97, 22.675, 7.741, 22.625, 7.5, 22.625],
        ['C', 6.465, 22.625, 5.625, 23.465, 5.625, 24.5],
        ['S', 6.465, 26.375, 7.5, 26.375],
        ['C', 8.535, 26.375, 9.375, 25.535, 9.375, 24.5],
        ['C', 9.375, 24.259, 9.325, 24.03, 9.242, 23.818],
        ['L', 23.818, 9.242],
        ['C', 24.03, 9.325, 24.259, 9.375, 24.5, 9.375],
        ['C', 25.535, 9.375, 26.375, 8.535, 26.375, 7.5],
        ['S', 25.535, 5.625, 24.5, 5.625],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function rectangle(): SVGPath {
    return [
        ['M', 25.25, 22.783],
        ['L', 25.25, 6.75],
        ['L', 6.75, 6.75],
        ['L', 6.75, 25.25],
        ['L', 22.783, 25.25],
        ['C', 23.073, 25.912, 23.731, 26.375, 24.5, 26.375],
        ['C', 25.535, 26.375, 26.375, 25.535, 26.375, 24.5],
        ['C', 26.375, 23.731, 25.912, 23.073, 25.25, 22.783],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function ray(): SVGPath {
    return [
        ['M', 27.03, 6.03],
        ['L', 25.97, 4.97],
        ['L', 18.182, 12.758],
        ['C', 17.97, 12.675, 17.741, 12.625, 17.5, 12.625],
        ['C', 16.465, 12.625, 15.625, 13.465, 15.625, 14.5],
        ['C', 15.625, 14.741, 15.675, 14.97, 15.758, 15.182],
        ['L', 8.182, 22.758],
        ['C', 7.97, 22.675, 7.741, 22.625, 7.5, 22.625],
        ['C', 6.465, 22.625, 5.625, 23.465, 5.625, 24.5],
        ['S', 6.465, 26.375, 7.5, 26.375],
        ['C', 8.535, 26.375, 9.375, 25.535, 9.375, 24.5],
        ['C', 9.375, 24.259, 9.325, 24.03, 9.242, 23.818],
        ['L', 27.03, 6.03],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function pitchfork(): SVGPath {
    return [
        ['M', 28.057, 15.006],
        ['L', 26.998, 13.944],
        ['L', 19.133, 21.807],
        ['C', 18.921, 21.724, 18.692, 21.674, 18.45, 21.674],
        ['C', 18.207, 21.674, 17.976, 21.724, 17.763, 21.808],
        ['L', 14.509, 18.553],
        ['L', 23.057, 10.005],
        ['L', 21.997, 8.944],
        ['L', 13.448, 17.493],
        ['L', 10.191, 14.234],
        ['C', 10.274, 14.022, 10.324, 13.793, 10.324, 13.55],
        ['C', 10.324, 13.309, 10.274, 13.079, 10.192, 12.866],
        ['L', 18.057, 5.004],
        ['L', 16.998, 3.943],
        ['L', 9.133, 11.805],
        ['C', 8.921, 11.722, 8.692, 11.672, 8.45, 11.672],
        ['C', 7.414, 11.672, 6.575, 12.511, 6.575, 13.547],
        ['C', 6.575, 14.582, 7.414, 15.422, 8.45, 15.422],
        ['C', 8.691, 15.422, 8.92, 15.372, 9.131, 15.289],
        ['L', 12.391, 18.549],
        ['L', 7.185, 23.755],
        ['C', 6.972, 23.672, 6.743, 23.622, 6.501, 23.622],
        ['C', 5.465, 23.622, 4.625, 24.462, 4.625, 25.498],
        ['C', 4.625, 26.534, 5.465, 27.374, 6.501, 27.374],
        ['C', 7.537, 27.374, 8.377, 26.534, 8.377, 25.498],
        ['C', 8.377, 25.258, 8.328, 25.029, 8.245, 24.817],
        ['L', 13.452, 19.61],
        ['L', 16.709, 22.868],
        ['C', 16.626, 23.079, 16.576, 23.308, 16.576, 23.548],
        ['C', 16.576, 24.583, 17.416, 25.423, 18.452, 25.423],
        ['C', 19.487, 25.423, 20.327, 24.583, 20.327, 23.548],
        ['C', 20.327, 23.307, 20.277, 23.079, 20.194, 22.866],
        ['L', 28.057, 15.006],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function parallelChannel(): SVGPath {
    return [
        ['M', 17.258, 7.802],
        ['C', 17.487, 7.896, 17.737, 7.95, 18, 7.95],
        ['C', 19.077, 7.95, 19.95, 7.077, 19.95, 6],
        ['S', 19.077, 4.05, 18, 4.05],
        ['C', 16.924, 4.05, 16.05, 4.923, 16.05, 6],
        ['C', 16.05, 6.263, 16.104, 6.513, 16.198, 6.742],
        ['L', 6.742, 16.198],
        ['C', 6.513, 16.104, 6.263, 16.05, 6, 16.05],
        ['C', 4.924, 16.05, 4.05, 16.923, 4.05, 18],
        ['S', 4.924, 19.95, 6, 19.95],
        ['C', 7.077, 19.95, 7.95, 19.077, 7.95, 18],
        ['C', 7.95, 17.737, 7.896, 17.487, 7.802, 17.258],
        ['L', 17.258, 7.802],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function measureY(): SVGPath {
    return [
        ['M', 13.5, 7.535],
        ['L', 11.5, 11.0],
        ['L', 13.0, 11.0],
        ['L', 13.0, 21.0],
        ['L', 11.5, 21.0],
        ['L', 13.5, 24.465],
        ['L', 15.5, 21.0],
        ['L', 14.0, 21.0],
        ['L', 14.0, 11.0],
        ['L', 15.5, 11.0],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function measureXY(): SVGPath {
    return [
        ['M', 25.0, 3.75],
        ['L', 25.0, 5.25],
        ['L', 26.75, 5.25],
        ['L', 26.75, 7.0],
        ['L', 28.25, 7.0],
        ['L', 28.25, 3.75],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function measureX(): SVGPath {
    return [
        ['M', 14.673, 21.0],
        ['L', 15.984, 19.177],
        ['L', 17.287, 21.0],
        ['L', 18.808, 21.0],
        ['L', 16.766, 18.344],
        ['L', 18.559, 16.0],
        ['L', 17.12, 16.0],
        ['L', 16.006, 17.553],
        ['L', 14.923, 16.0],
        ['L', 13.422, 16.0],
        ['L', 15.225, 18.344],
        ['L', 13.193, 21.0],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function line(): SVGPath {
    return [
        ['M', 27.03, 6.03],
        ['L', 25.97, 4.97],
        ['L', 22.182, 8.758],
        ['C', 21.97, 8.675, 21.741, 8.625, 21.5, 8.625],
        ['C', 20.465, 8.625, 19.625, 9.465, 19.625, 10.5],
        ['C', 19.625, 10.741, 19.675, 10.97, 19.758, 11.182],
        ['L', 11.182, 19.758],
        ['C', 10.97, 19.675, 10.741, 19.625, 10.5, 19.625],
        ['C', 9.465, 19.625, 8.625, 20.465, 8.625, 21.5],
        ['C', 8.625, 21.741, 8.675, 21.97, 8.758, 22.182],
        ['L', 4.97, 25.97],
        ['L', 6.03, 27.03],
        ['L', 9.818, 23.242],
        ['C', 10.03, 23.325, 10.259, 23.375, 10.5, 23.375],
        ['C', 11.535, 23.375, 12.375, 22.535, 12.375, 21.5],
        ['C', 12.375, 21.259, 12.325, 21.03, 12.242, 20.818],
        ['L', 20.818, 12.242],
        ['C', 21.03, 12.325, 21.259, 12.375, 21.5, 12.375],
        ['C', 22.535, 12.375, 23.375, 11.535, 23.375, 10.5],
        ['C', 23.375, 10.259, 23.325, 10.03, 23.242, 9.818],
        ['L', 27.03, 6.03],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function label(): SVGPath {
    return [
        ['M', 9.291, 18.0],
        ['L', 10.735, 18.0],
        ['L', 10.735, 13.251],
        ['L', 12.426, 13.251],
        ['L', 12.426, 12.018],
        ['L', 7.601, 12.018],
        ['L', 7.601, 13.251],
        ['L', 9.291, 13.251],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function indicators(): SVGPath {
    return [
        ['M', 14.138, 14.794],
        ['L', 14.697, 16.26],
        ['L', 21.328, 11.074],
        ['L', 22.156, 12.134],
        ['L', 23.723, 8.25],
        ['L', 19.576, 8.834],
        ['L', 20.404, 9.893],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function horizontalLine(): SVGPath {
    return [
        ['M', 27, 14.751],
        ['L', 15.143, 14.751],
        ['C', 14.854, 14.088, 14.195, 13.625, 13.425, 13.625],
        ['C', 12.655, 13.625, 11.997, 14.088, 11.709, 14.751],
        ['L', 5, 14.751],
        ['L', 5, 16.251],
        ['L', 11.709, 16.251],
        ['C', 11.997, 16.912, 12.655, 17.375, 13.425, 17.375],
        ['C', 14.195, 17.375, 14.854, 16.912, 15.143, 16.251],
        ['L', 27, 16.251],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function fullscreen(): SVGPath {
    return [
        ['M', 22.593, 21.657],
        ['L', 19.297, 18.361],
        ['L', 18.413, 19.244],
        ['L', 21.71, 22.541],
        ['L', 20.465, 23.786],
        ['L', 24.75, 24.75],
        ['L', 23.786, 20.464],
        ['Z']
    ];
}
/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function flagTrapeze(): SVGPath {
    return [
        ['M', 19.29, 20.3],
        ['L', 17.0, 20.3],
        ['L', 17.0, 21.7],
        ['L', 18.71, 21.7],
        ['L', 23.311, 26.3],
        ['L', 6.133, 26.3],
        ['L', 8.433, 21.7],
        ['L', 11.0, 21.7],
        ['L', 11.0, 20.3],
        ['L', 7.567, 20.3],
        ['L', 3.867, 27.7],
        ['L', 26.69, 27.7],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function flagElipse(): SVGPath {
    return [
        ['M', 17, 20.385],
        ['V', 21.891],
        ['C', 21.129, 22.289, 23.25, 23.449, 23.25, 24],
        ['C', 23.25, 24.673, 20.104, 26.5, 14, 26.5],
        ['S', 4.75, 24.673, 4.75, 24],
        ['C', 4.75, 21.922, 8.379, 20.757, 12.5, 20.385],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function flagDiamond(): SVGPath {
    return [
        ['M', 17.0, 22.604],
        ['L', 21.65, 24.0],
        ['L', 14.0, 26.295],
        ['L', 6.349, 24.0],
        ['L', 11.0, 22.604],
        ['L', 11.0, 21.195],
        ['L', 1.651, 24.0],
        ['L', 14.0, 27.705],
        ['L', 26.35, 24.0],
        ['L', 17.0, 21.195],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function flagBasic(): SVGPath {
    return [
        ['M', 27.25, 4.75],
        ['L', 15, 4.75],
        ['L', 15, 3],
        ['L', 13.35, 3],
        ['V', 25.175],
        ['C', 13.35, 25.631, 13.719, 26, 14.175, 26],
        ['S', 15, 25.631, 15, 25.175],
        ['V', 16.25],
        ['H', 27.25],
        ['L', 21.5, 10.5],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function ellipse(): SVGPath {
    return [
        ['M', 16.3, 7.2],
        ['C', 10.1, 7.2, 5, 11.1, 5, 15.9],
        ['S', 5.1, 24.6, 11.3, 24.6],
        ['S', 27.6, 15.9, 16.3, 7.2],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function elliott5(): SVGPath {
    return [
        ['M', 27.53, 14.03],
        ['C', 27.823, 13.737, 27.823, 13.263, 27.53, 12.97],
        ['L', 22.466, 7.906],
        ['L', 14.966, 16.406],
        ['L', 10.461, 11.9],
        ['L', 3.434, 20.009],
        ['C', 3.163, 20.322, 3.196, 20.795, 3.509, 21.066],
        ['C', 3.65, 21.189, 3.825, 21.25, 4, 21.25],
        ['C', 4.21, 21.25, 4.419, 21.162, 4.566, 21.041],
        ['L', 10.539, 14.15],
        ['L', 15.034, 18.645],
        ['L', 22.534, 10.145],
        ['L', 26.47, 14.081],
        ['C', 26.763, 14.374, 27.237, 14.374, 27.53, 14.03],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function elliott3(): SVGPath {
    return [
        ['M', 5.048, 22.258],
        ['C', 4.814, 22.258, 4.584, 22.149, 4.438, 21.946],
        ['C', 4.197, 21.608, 4.274, 21.14, 4.611, 20.899],
        ['L', 19.079, 10.529],
        ['L', 26.576, 17.976],
        ['C', 26.87, 18.268, 26.872, 18.743, 26.58, 19.037],
        ['C', 26.288, 19.331, 25.813, 19.329, 25.519, 19.037],
        ['L', 18.922, 12.484],
        ['L', 5.484, 22.114],
        ['C', 5.352, 22.213, 5.199, 22.258, 5.048, 22.258],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function edit(): SVGPath {
    return [
        ['M', 22.125, 3.814],
        ['L', 5.817, 20.122],
        ['L', 4, 28.001],
        ['L', 11.879, 26.183],
        ['L', 28.186, 9.875],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function destroy(): SVGPath {
    return [
        ['M', 25.25, 10.5],
        ['C', 25.25, 8.983, 24.017, 7.75, 22.5, 7.75],
        ['H', 19.25],
        ['V', 7],
        ['C', 19.25, 5.76, 18.24, 4.75, 17, 4.75],
        ['H', 15],
        ['C', 13.76, 4.75, 12.75, 5.76, 12.75, 7],
        ['V', 7.75],
        ['H', 9.5],
        ['C', 7.983, 7.75, 6.75, 8.983, 6.75, 10.5],
        ['V', 12.25],
        ['H', 8.75],
        ['V', 27.25],
        ['H', 21.25],
        ['V', 12.25],
        ['H', 23.25],
        ['V', 10.5],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function currentPriceShow(): SVGPath {
    return [
        ['M', 12.509, 22.893],
        ['L', 12.509, 17.428],
        ['L', 11.409, 17.428],
        ['L', 9.651, 18.718],
        ['L', 10.229, 19.507],
        ['L', 11.363, 18.628],
        ['L', 11.363, 22.893],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function currentPriceHide(): SVGPath {
    return [
        ['M', 12.509, 22.893],
        ['L', 12.509, 17.428],
        ['L', 11.409, 17.428],
        ['L', 9.651, 18.718],
        ['L', 10.229, 19.507],
        ['L', 11.363, 18.628],
        ['L', 11.363, 22.893],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function crooked5(): SVGPath {
    return [
        ['M', 27.53, 14.03],
        ['C', 27.823, 13.737, 27.823, 13.263, 27.53, 12.97],
        ['L', 22.466, 7.906],
        ['L', 14.966, 16.406],
        ['L', 10.461, 11.9],
        ['L', 3.434, 20.009],
        ['C', 3.163, 20.322, 3.196, 20.795, 3.509, 21.066],
        ['C', 3.65, 21.189, 3.825, 21.25, 4, 21.25],
        ['C', 4.21, 21.25, 4.419, 21.162, 4.566, 21.041],
        ['L', 10.539, 14.15],
        ['L', 15.034, 18.645],
        ['L', 22.534, 10.145],
        ['L', 26.47, 14.081],
        ['C', 26.763, 14.374, 27.237, 14.374, 27.53, 14.03],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function crooked3(): SVGPath {
    return [
        ['M', 5.048, 22.258],
        ['C', 4.814, 22.258, 4.584, 22.149, 4.438, 21.946],
        ['C', 4.197, 21.608, 4.274, 21.14, 4.611, 20.899],
        ['L', 19.079, 10.529],
        ['L', 26.576, 17.976],
        ['C', 26.87, 18.268, 26.872, 18.743, 26.58, 19.037],
        ['C', 26.288, 19.331, 25.813, 19.329, 25.519, 19.037],
        ['L', 18.922, 12.484],
        ['L', 5.484, 22.114],
        ['C', 5.352, 22.213, 5.199, 22.258, 5.048, 22.258],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function close(): SVGPath {
    return [
        ['M', 24.308, 8.756],
        ['L', 23.248, 7.695],
        ['L', 16.002, 14.941],
        ['L', 8.757, 7.695],
        ['L', 7.695, 8.754],
        ['L', 14.941, 16.001],
        ['L', 7.696, 23.246],
        ['L', 8.755, 24.308],
        ['L', 16.002, 17.061],
        ['L', 23.247, 24.307],
        ['L', 24.308, 23.248],
        ['L', 17.062, 16.001],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function circle(): SVGPath {
    return [
        ['M', 26.249, 15.999],
        ['C', 26.25, 13.262, 25.184, 10.688, 23.248, 8.752],
        ['C', 21.312, 6.815, 18.737, 5.749, 16, 5.75],
        ['C', 13.262, 5.75, 10.688, 6.816, 8.752, 8.752],
        ['C', 6.816, 10.688, 5.75, 13.262, 5.75, 16],
        ['C', 5.75, 18.736, 6.816, 21.312, 8.752, 23.248],
        ['C', 10.688, 25.184, 13.262, 26.25, 16, 26.25],
        ['C', 17.993, 26.25, 19.897, 25.678, 21.536, 24.536],
        ['C', 22.35, 25.349, 23.64, 25.316, 24.456, 24.501],
        ['C', 25.271, 23.685, 25.238, 22.395, 24.506, 21.531],
        ['C', 25.678, 19.897, 26.25, 17.993, 26.249, 15.999],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function arrowSegment(): SVGPath {
    return [
        ['M', 19.684, 11.256],
        ['L', 8.182, 22.758],
        ['C', 7.97, 22.675, 7.741, 22.625, 7.5, 22.625],
        ['C', 6.465, 22.625, 5.625, 23.465, 5.625, 24.5],
        ['S', 6.465, 26.375, 7.5, 26.375],
        ['C', 8.535, 26.375, 9.375, 25.535, 9.375, 24.5],
        ['C', 9.375, 24.259, 9.325, 24.03, 9.242, 23.818],
        ['L', 19.684, 11.256],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function annotationsVisible(): SVGPath {
    return [
        ['M', 11.751, 16],
        ['C', 11.751, 16.427, 11.833, 16.831, 11.95, 17.22],
        ['L', 13.259, 15.91],
        ['C', 13.307, 14.467, 14.467, 13.306, 15.91, 13.259],
        ['L', 17.219, 11.95],
        ['C', 16.83, 11.833, 16.426, 11.751, 16, 11.751],
        ['C', 13.657, 11.75, 11.751, 13.656, 11.751, 16],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function annotationsHidden(): SVGPath {
    return [
        ['M', 16.001, 20.25],
        ['C', 13.657, 20.25, 11.751, 18.344, 11.751, 16],
        ['C', 11.751, 13.657, 13.657, 11.75, 16.001, 11.75],
        ['C', 18.345, 11.75, 20.251, 13.657, 20.251, 16],
        ['C', 20.251, 18.344, 18.345, 20.25, 16.001, 20.25],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function verticalLine(): SVGPath {
    return [
        ['M', 17.375, 18.574],
        ['C', 17.375, 17.805, 16.912, 17.147, 16.251, 16.858],
        ['V', 5],
        ['H', 14.751],
        ['V', 16.856],
        ['C', 14.088, 17.147, 13.625, 17.805, 13.625, 18.574],
        ['C', 13.625, 19.345, 14.088, 20.003, 14.751, 20.292],
        ['V', 27],
        ['H', 16.251],
        ['V', 20.291],
        ['C', 16.912, 20.003, 17.375, 19.344, 17.375, 18.574],
        ['Z']
    ];
}

function timeCycles(): SVGPath {
    return [
        ['M', 12.1, 27],
        ['C', 12.1, 24.8, 10.3, 23, 8.1, 23],
        ['C', 5.9, 23, 4.1, 24.8, 4.1, 27],
        ['M', 5.5, 27],
        ['C', 5.4, 25.6, 6.5, 24.3, 7.9, 24.3],
        ['C', 9.3, 24.2, 10.6, 25.3, 10.6, 26.7],
        ['C', 10.6, 26.8, 10.6, 26.9, 10.6, 27]
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function fibonacci(): SVGPath {
    return [
        ['M', 4, 4.75],
        ['H', 28],
        ['V', 6.25],
        ['H', 4],
        ['Z'],
        ['M', 4.5, 10.75],
        ['H', 7.5],
        ['V', 12.25],
        ['H', 4.5],
        ['Z'],
        ['M', 14.5, 10.75],
        ['H', 17.5],
        ['V', 12.25],
        ['H', 14.5],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function fibonacciTimezone(): SVGPath {
    return [
        ['M', 5.2, 7.3],
        ['V', 27.5],
        ['H', 3.6],
        ['V', 5.6],
        ['H', 5.2],
        ['Z'],
        ['M', 9.6, 7.3],
        ['V', 27.5],
        ['H', 8],
        ['V', 5.6],
        ['H', 9.6],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function seriesHlc(): SVGPath {
    return [
        ['M', 5.11, 12.22],
        ['V', 24.97],
        ['H', 6.71],
        ['V', 20.22],
        ['H', 9.65],
        ['V', 18.72],
        ['H', 6.71],
        ['V', 6.97],
        ['H', 5.11],
        ['V', 10.72],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function arrowRay(): SVGPath {
    return [
        ['M', 25.429, 9.5],
        ['L', 27, 5],
        ['L', 22.5, 6.571],
        ['L', 23.434, 7.506],
        ['L', 18.182, 12.758],
        ['C', 17.97, 12.675, 17.741, 12.625, 17.5, 12.625],
        ['C', 16.465, 12.625, 15.625, 13.465, 15.625, 14.5],
        ['C', 15.625, 14.741, 15.675, 14.97, 15.758, 15.182],
        ['L', 8.182, 22.758],
        ['C', 7.97, 22.675, 7.741, 22.625, 7.5, 22.625],
        ['C', 6.465, 22.625, 5.625, 23.465, 5.625, 24.5],
        ['S', 6.465, 26.375, 7.5, 26.375],
        ['C', 8.535, 26.375, 9.375, 25.535, 9.375, 24.5],
        ['C', 9.375, 24.259, 9.325, 24.03, 9.242, 23.818],
        ['L', 19.684, 11.256],
        ['Z']
    ];
}

/**
 * @private
 * @function
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
function arrowLine(): SVGPath {
    return [
        ['M', 26.679, 8.25],
        ['L', 28, 4],
        ['L', 23.75, 5.321],
        ['L', 24.684, 6.256],
        ['L', 21.182, 9.758],
        ['C', 20.97, 9.675, 20.741, 9.625, 20.5, 9.625],
        ['C', 19.465, 9.625, 18.625, 10.465, 18.625, 11.5],
        ['C', 18.625, 11.741, 18.675, 11.97, 18.758, 12.182],
        ['L', 11.182, 19.758],
        ['C', 10.97, 19.675, 10.741, 19.625, 10.5, 19.625],
        ['C', 9.465, 19.625, 8.625, 20.465, 8.625, 21.5],
        ['C', 8.625, 21.741, 8.675, 21.97, 8.758, 22.182],
        ['L', 4.97, 25.97],
        ['L', 6.03, 27.03],
        ['L', 9.818, 23.242],
        ['C', 10.03, 23.325, 10.259, 23.375, 10.5, 23.375],
        ['C', 11.535, 23.375, 12.375, 22.535, 12.375, 21.5],
        ['C', 12.375, 21.259, 12.325, 21.03, 12.242, 20.818],
        ['L', 20.818, 12.242],
        ['C', 21.03, 12.325, 21.259, 12.375, 21.5, 12.375],
        ['C', 22.535, 12.375, 23.375, 11.535, 23.375, 10.5],
        ['C', 23.375, 10.259, 23.325, 10.03, 23.242, 9.818],
        ['L', 26.679, 8.25],
        ['Z']
    ];
}

/*
Temporal definitions:

function drawing(): SVGPath {
    return [
        ['M', 18.3, 8.6],
        ['C', 17.8, 8.8, 17.5, 9.3, 17.4, 9.8],
        ['L', 16.4, 17.4],
        ['L', 16.9, 17.7],
        ['L', 20, 13.2],
        ['C', 19.9, 13.1, 19.8, 12.9, 19.8, 12.7],
        ['C', 19.7, 12, 20.1, 11.4, 20.8, 11.3],
        ['S', 22.1, 12.4, 21.2, 13.4],
        ['L', 14.5, 17.1],
        ['L', 20.9, 15.6],
        ['L', 26, 9.4],
        ['L', 22, 7.2],
        ['L', 18.3, 8.6],
        ['Z']
    ];
}

function arrowLeft(): SVGPath {
    return [
        ['M', 19.22, 25.03],
        ['L', 10.189, 16.0],
        ['L', 19.22, 6.97],
        ['L', 20.28, 8.03],
        ['L', 12.311, 16.0],
        ['L', 20.28, 23.97],
        ['Z']
    ];
}

function arrowBottom(): SVGPath {
    return [
        ['M', 12.78, 25.03],
        ['L', 11.72, 23.97],
        ['L', 19.689, 16.0],
        ['L', 11.72, 8.03],
        ['L', 12.78, 6.97],
        ['L', 21.811, 16.0],
        ['Z']
    ];
}

function panning(): SVGPath {
    return [
        ['M', 20.8, 10.7],
        ['V', 10.3],
        ['C', 20.8, 8.9, 19.7, 7.7, 18.3, 7.7],
        ['C', 18.1, 7.7, 17.9, 7.7, 17.6, 7.8],
        ['C', 17, 6.5, 15.5, 6, 14.3, 6.6],
        ['C', 13.8, 6.8, 13.4, 7.3, 13.1, 7.8],
        ['C', 11.7, 7.5, 10.3, 8.3, 9.9, 9.7],
        ['V', 14.6],
        ['L', 7, 19],
        ['L', 11.6, 25.5],
        ['H', 20.2],
        ['L', 21.4, 20.4],
        ['V', 14.6],
        ['C', 21.4, 13.2, 20.3, 12, 18.9, 12],
        ['C', 18.7, 12, 18.5, 12, 18.3, 12.1],
        ['Z']
    ];
}

function logarithmic(): SVGPath {
    return [
        ['M', 24.66, 12.0],
        ['C', 24.39, 11.89, 24.12, 11.79, 23.77, 11.61],
        ['C', 18.46, 9.34, 9.68, 12.0, 9.68, 24.0],
        ['C', 9.68, 24.62, 9.78, 24.88, 9.88, 25.14],
        ['L', 10.46, 25.14],
        ['C', 10.98, 24.62, 11.55, 24.0, 12.11, 23.39],
        ['C', 15.58, 19.49, 20.04, 15.58, 24.66, 12.0]
    ];
}

function removeAnnotations(): SVGPath {
    return [
        ['M', 16.311, 23.7],
        ['L', 26.936, 13.075],
        ['L', 19.777, 5.917],
        ['C', 18.776, 4.915, 17.758, 5.131, 16.971, 5.92],
        ['L', 6.72, 16.17],
        ['C', 6.106, 16.783, 5.768, 17.593, 5.768, 18.45],
        ['C', 5.768, 19.307, 6.106, 20.117, 6.72, 20.73],
        ['L', 11.19, 25.2],
        ['L', 27, 25.2],
        ['L', 27, 23.7],
        ['L', 16.311, 23.7],
        ['Z']
    ];
}

function verticalDoubleArrow(): SVGPath {
    return [
        ['M', 18.0, 10.243],
        ['L', 16.251, 10.243],
        ['L', 16.251, 4.001],
        ['L', 14.751, 4.001],
        ['L', 14.751, 10.244],
        ['L', 13.0, 10.244],
        ['L', 15.5, 15.0],
        ['Z']
    ];
}
*/

/**
 * @private
 */
function compose(
    SVGRendererClass: typeof SVGRenderer
): void {
    const symbols = SVGRendererClass.prototype.symbols;

    symbols['arrow-ray.svg'] = arrowRay;
    symbols['arrow-line.svg'] = arrowLine;
    symbols['vertical-line.svg'] = verticalLine;
    symbols['time-cycles.svg'] = timeCycles;
    symbols['fibonacci.svg'] = fibonacci;
    symbols['fibonacci-timezone.svg'] = fibonacciTimezone;
    symbols['series-hlc.svg'] = seriesHlc;
    symbols['arrow-segment.svg'] = arrowSegment;
    symbols['arrow-right.svg'] = arrowRight;
    symbols['annotations-visible.svg'] = annotationsVisible;
    symbols['annotations-hidden.svg'] = annotationsHidden;
    symbols['current-price-show.svg'] = currentPriceShow;
    symbols['current-price-hide.svg'] = currentPriceHide;
    symbols['crooked-5.svg'] = crooked5;
    symbols['crooked-3.svg'] = crooked3;
    symbols['close.svg'] = close;
    symbols['circle.svg'] = circle;
    symbols['ellipse.svg'] = ellipse;
    symbols['elliott-5.svg'] = elliott5;
    symbols['elliott-3.svg'] = elliott3;
    symbols['edit.svg'] = edit;
    symbols['destroy.svg'] = destroy;
    symbols['flag-trapeze.svg'] = flagTrapeze;
    symbols['flag-elipse.svg'] = flagElipse;
    symbols['flag-diamond.svg'] = flagDiamond;
    symbols['flag-basic.svg'] = flagBasic;
    symbols['indicators.svg'] = indicators;
    symbols['horizontal-line.svg'] = horizontalLine;
    symbols['fullscreen.svg'] = fullscreen;
    symbols['measure-y.svg'] = measureY;
    symbols['measure-xy.svg'] = measureXY;
    symbols['measure-x.svg'] = measureX;
    symbols['line.svg'] = line;
    symbols['label.svg'] = label;
    symbols['pitchfork.svg'] = pitchfork;
    symbols['parallel-channel.svg'] = parallelChannel;
    symbols['rectangle.svg'] = rectangle;
    symbols['ray.svg'] = ray;
    symbols['separator.svg'] = separator;
    symbols['segment.svg'] = segment;
    symbols['series-ohlc.svg'] = seriesOhlc;
    symbols['series-line.svg'] = seriesLine;
    symbols['series-hollow-candlestick.svg'] = seriesHollowCandlestick;
    symbols['series-heikin-ashi.svg'] = seriesHeikinAshi;
    symbols['series-candlestick.svg'] = seriesCandlestick;
    symbols['vertical-arrow.svg'] = verticalArrow;
    symbols['vertical-counter.svg'] = verticalCounter;
    symbols['vertical-label.svg'] = verticalLabel;
    symbols['zoom-x.svg'] = zoomX;
    symbols['zoom-y.svg'] = zoomY;
    symbols['zoom-xy.svg'] = zoomXY;
    /*
    // symbols['arrow-left.svg'] = arrowLeft;
    // symbols['arrow-bottom.svg'] = arrowBottom;
    // symbols['drawing.svg'] = drawing;
    // symbols['logarithmic.svg'] = logarithmic;
    // symbols['panning.svg'] = panning;
    // symbols['remove-annotations.svg'] = removeAnnotations;
    // symbols['text.svg'] = text;
    // symbols['vertical-double-arrow.svg'] = verticalDoubleArrow;
    */


}

const StockToolsSymbols = {
    compose
};

export default StockToolsSymbols;
