/* *
 *
 *  (c) 2009-2022 Øystein Moseng
 *
 *  Musical scales for sonification.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

const Scales = {
    minor: [0, 2, 3, 5, 7, 8, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
    phrygian: [0, 1, 3, 5, 7, 8, 11],
    major: [0, 2, 4, 5, 7, 9, 11],
    lydian: [0, 2, 4, 6, 7, 9, 11],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],
    majorPentatonic: [0, 2, 4, 7, 9],
    minorPentatonic: [0, 3, 5, 7, 10]
};


/* *
 *
 *  Default Export
 *
 * */

export default Scales;


/* *
 *
 *  API declarations
 *
 * */

/**
 * Preset scales for pitch mapping.
 * @requires modules/sonification
 * @interface Highcharts.SonificationScalePresetsObject
 *//**
 * Minor scale (aeolian)
 * @name Highcharts.SonificationScalePresetsObject#minor
 * @type {Array<number>}
 *//**
 * Dorian scale
 * @name Highcharts.SonificationScalePresetsObject#dorian
 * @type {Array<number>}
 *//**
 * Harmonic minor scale
 * @name Highcharts.SonificationScalePresetsObject#harmonicMinor
 * @type {Array<number>}
 *//**
 * Phrygian scale
 * @name Highcharts.SonificationScalePresetsObject#phrygian
 * @type {Array<number>}
 *//**
 * Major (ionian) scale
 * @name Highcharts.SonificationScalePresetsObject#major
 * @type {Array<number>}
 *//**
 * Lydian scale
 * @name Highcharts.SonificationScalePresetsObject#lydian
 * @type {Array<number>}
 *//**
 * Mixolydian scale
 * @name Highcharts.SonificationScalePresetsObject#mixolydian
 * @type {Array<number>}
 *//**
 * Major pentatonic scale
 * @name Highcharts.SonificationScalePresetsObject#majorPentatonic
 * @type {Array<number>}
 *//**
 * Minor pentatonic scale
 * @name Highcharts.SonificationScalePresetsObject#minorPentatonic
 * @type {Array<number>}
 */

(''); // Keep above doclets in JS file
