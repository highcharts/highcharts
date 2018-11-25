/**
 * (c) 2009-2018 Øystein Moseng
 *
 * Implementation of Higcharts.Point.sonify()
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../../parts/Globals.js';
import musicalFrequencies from 'musicalFrequencies.js';

// Defaults for the instrument options
var defaultInstrumentOptions = {
    minDuration: 20,
    maxDuration: 10000,
    minVolume: 0.1,
    maxVolume: 1,
    minPan: -1,
    maxPan: 1,
    minFrequency: 220,
    maxFrequency: 2500,
    allowedFrequencies: musicalFrequencies
};


/**
 * Translate a value on a sonification axis. Creates a new, virtual,
 * sonification axis with a min and max, and maps the value onto this axis.
 *
 * @private
 *
 * @param {number} value The data value to translate.
 * @param {Object} dataExtremes The data extremes for the chart for this value.
 * @param {Object} limits Limits for the sonification axis.
 * @param {Array<number>} allowedValues List of allowed values for the
 *      sonification axis. If none is provided, we assume all values are okay.
 * @return {number} The value mapped to the sonification axis.
 */
function sonifyAxisTranslate(value, dataExtremes, limits, allowedValues) {
    var lenValueAxis = dataExtremes.max - dataExtremes.min,
        lenSonifyAxis = limits.max - limits.min,
        sonifyValue = limits.min +
            lenSonifyAxis * (value - dataExtremes.min) / lenValueAxis;

    return allowedValues ?

        // Use allowed values only
        allowedValues.filter(
            // Only use allowed values within min/max limits
            function (allowedValue) {
                return allowedValue < limits.max && allowedValue > limits.min;
            }
        ).reduce(function (acc, cur) {
            // Find the closest allowed value
            return Math.abs(cur - sonifyValue) < Math.abs(acc - sonifyValue) ?
                cur : acc;
        }, Infinity) :

        // Use the sonify axis value directly
        sonifyValue;
}


/**
 * @typedef {Object} PointInstrumentOptions
 * @property {Highcharts.Instrument|String} instrument - An Instrument instance
 *      or the name of the instrument in the Highcharts.sonification.instruments
 *      map.
 * @property {Object} instrumentMapping - Map point data properties to
 *      instrument parameters.
 * @property {String|number|Function} instrumentMapping.volume - Define the
 *      volume of the instrument. This can be a string with a data property
 *      name, e.g. `'y'`, in which case this data property is used to define the
 *      volume relative to the `y`-values of the other points. A higher `y`
 *      value would then result in a higher volume. This option can also be a
 *      fixed number or a function. If it is a function, this function is called
 *      in regular intervals while the note is playing. It receives three
 *      arguments: The point, the dataExtremes, and the current relative time -
 *      where 0 is the beginning of the note and 1 is the end. The function
 *      should return the volume of the note as a number between 0 and 1.
 * @property {String|number|Function} instrumentMapping.duration - Define the
 *      duration of the notes for this instrument. This can be a string with a
 *      data property name, e.g. `'y'`, in which case this data property is used
 *      to define the duration relative to the `y`-values of the other points. A
 *      higher `y` value would then result in a longer duration. This option can
 *      also be a fixed number or a function. If it is a function, this function
 *      is called once before the note starts playing, and should return the
 *      duration in milliseconds. It receives two arguments: The point, and the
 *      dataExtremes.
 * @property {String|number|Function} [instrumentMapping.pan=0] - Define the
 *      panning of the instrument. This can be a string with a data property
 *      name, e.g. `'x'`, in which case this data property is used to define the
 *      panning relative to the `x`-values of the other points. A higher `x`
 *      value would then result in a higher panning value (panned further to the
 *      right). This option can also be a fixed number or a function. If it is a
 *      function, this function is called in regular intervals while the note is
 *      playing. It receives three arguments: The point, the dataExtremes, and
 *      the current relative time - where 0 is the beginning of the note and 1
 *      is the end. The function should return the panning of the note as a
 *      number between -1 and 1.
 * @property {String|number|Function} instrumentMapping.frequency - Define the
 *      frequency of the instrument. This can be a string with a data property
 *      name, e.g. `'y'`, in which case this data property is used to define the
 *      frequency relative to the `y`-values of the other points. A higher `y`
 *      value would then result in a higher frequency. This option can also be a
 *      fixed number or a function. If it is a function, this function is called
 *      in regular intervals while the note is playing. It receives three
 *      arguments: The point, the dataExtremes, and the current relative time -
 *      where 0 is the beginning of the note and 1 is the end. The function
 *      should return the frequency of the note as a number (in Hz).
 * @property {Object} [instrumentOptions] - Options to apply to this instrument.
 * @property {number} [instrumentOptions.minDuration=20] - The minimum duration
 *      for a note when using a data property for duration. Can be overridden
 *      by using either a fixed number or a function for
 *      instrumentMapping.duration.
 * @property {number} [instrumentOptions.maxDuration=10000] - The maximum
 *      duration for a note when using a data property for duration. Can be
 *      overridden by using either a fixed number or a function for
 *      instrumentMapping.duration.
 * @property {number} [instrumentOptions.minPan=-1] - The minimum pan value
 *      for a note when using a data property for panning. Can be overridden
 *      by using either a fixed number or a function for
 *      instrumentMapping.pan.
 * @property {number} [instrumentOptions.maxPan=1] - The maximum pan value
 *      for a note when using a data property for panning. Can be overridden
 *      by using either a fixed number or a function for
 *      instrumentMapping.pan.
 * @property {number} [instrumentOptions.minVolume=0.1] - The minimum volume
 *      for a note when using a data property for volume. Can be overridden
 *      by using either a fixed number or a function for
 *      instrumentMapping.volume.
 * @property {number} [instrumentOptions.maxVolume=1] - The maximum volume
 *      for a note when using a data property for volume. Can be overridden
 *      by using either a fixed number or a function for
 *      instrumentMapping.volume.
 * @property {number} [instrumentOptions.minFrequency=200] - The minimum
 *      frequency for a note when using a data property for frequency. Can be
 *      overridden by using either a fixed number or a function for
 *      instrumentMapping.frequency.
 * @property {number} [instrumentOptions.maxFrequency=2500] - The maximum
 *      frequency for a note when using a data property for frequency. Can be
 *      overridden by using either a fixed number or a function for
 *      instrumentMapping.frequency.
 * @property {Array<number>} [instrumentOptions.allowedFrequencies] - A
 *      list of frequencies to use when using a data property for frequency.
 *      Only frequencies in this list between minFrequency and maxFrequency
 *      will be used. Set to `null` to allow all frequencies to be used. This
 *      list is not considered if a fixed number or function is used for
 *      instrumentMapping.frequency. By default, this option is set to a list
 *      of musical frequencies from C0 to C8.
 * @property {Function} [onEnd] - A callback function to call when a note has
 *      ended.
 */

/**
 * Sonify a single point.
 *
 * @function Highcharts.Point#sonify
 *
 * @param   {Object} options
 *          Options for the sonification of the point.
 *
 * @param   {Array<PointInstrumentOptions>} options.instruments
 *          The instrument definitions for this point.
 *
 * @param   {Object} [options.dataExtremes]
 *          Optionally provide the minimum/maximum values for the points. If
 *          this is not supplied, it is calculated from the points in the
 *          chart on demand. This option is supplied in the following format,
 *          as a map of point data properties to objects with min/max values:
 *  ```js
 *      dataExtremes: {
 *          y: {
 *              min: 0,
 *              max: 100
 *          },
 *          z: {
 *              min: -10,
 *              max: 10
 *          }
 *          // Properties used and not provided are calculated on demand
 *      }
 *  ```
 *
 * @sample highcharts/sonification/point-basic/
 *         Click on points to sonify
 */
function pointSonify(options) {
    var point = this,
        dataExtremes = options.dataExtremes || {},
        // Get the value to pass to instrument.play from the mapping value
        // passed in.
        getMappingValue = function (
            value, makeFunction, allowedExtremes, allowedValues
        ) {
            // Fixed number, just use that
            if (typeof value === 'number' || value === undefined) {
                return value;
            }
            // Function. Return new function if we try to use callback,
            // otherwise call it now and return result.
            if (typeof value === 'function') {
                return makeFunction ?
                    function (time) {
                        return value(point, dataExtremes, time);
                    } :
                    value(point, dataExtremes);
            }
            // String, this is a data prop.
            if (typeof value === 'string') {
                // Find data extremes if we don't have them
                dataExtremes[value] = dataExtremes[value] ||
                    H.sonification.utilities.calculateDataExtremes(
                        point.series.chart, value
                    );
                // Find the value
                return sonifyAxisTranslate(
                    H.pick(point[value], point.options[value]),
                    dataExtremes[value],
                    allowedExtremes,
                    allowedValues
                );
            }
        };

    options.instruments.forEach(function (instrumentDefinition) {
        var instrument = typeof instrumentDefinition.instrument === 'string' ?
                H.sonification.instruments[instrumentDefinition.instrument] :
                instrumentDefinition.instrument,
            mapping = instrumentDefinition.instrumentMapping || {},
            extremes = H.merge(
                defaultInstrumentOptions,
                instrumentDefinition.instrumentOptions
            );

        // Play the note on the instrument
        if (instrument && instrument.play) {
            instrument.play({
                frequency: getMappingValue(
                    mapping.frequency,
                    true,
                    { min: extremes.minFrequency, max: extremes.maxFrequency },
                    extremes.allowedFrequencies
                ),
                duration: getMappingValue(
                    mapping.duration,
                    false,
                    { min: extremes.minDuration, max: extremes.maxDuration }
                ),
                pan: getMappingValue(
                    mapping.pan,
                    true,
                    { min: extremes.minPan, max: extremes.maxPan }
                ),
                volume: getMappingValue(
                    mapping.volume,
                    true,
                    { min: extremes.minVolume, max: extremes.maxVolume }
                ),
                onEnd: instrumentDefinition.onEnd
            });
        } else {
            H.error(30);
        }
    });
}

export default pointSonify;
