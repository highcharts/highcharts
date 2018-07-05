/**
* (c) 2016 Highsoft AS
* Author: Lars A. V. Cabrera
*
* License: www.highcharts.com/license
*/
'use strict';
import H from '../parts/Globals.js';


var addEvent = H.addEvent,
    Axis = H.Axis,
    PlotLineOrBand = H.PlotLineOrBand,
    merge = H.merge,
    defaultConfig = {
        currentDateIndicator: true,
        color: '#FF0000',
        width: 2,
        label: {
            format: '%a, %b %d %Y, %H:%M:%S',
            formatter: undefined,
            rotation: 0
        }
    };

addEvent(Axis, 'afterSetOptions', function () {
    var options = this.options,
        cdiOptions = options.currentDateIndicator;

    if (cdiOptions) {
        if (typeof cdiOptions === 'object') {
            // Ignore formatter if custom format is defined
            if (cdiOptions.label && cdiOptions.label.format) {
                cdiOptions.label.formatter = undefined;
            }
            cdiOptions = merge(defaultConfig, cdiOptions);
        } else {
            cdiOptions = merge(defaultConfig);
        }

        cdiOptions.value = new Date();

        if (!options.plotLines) {
            options.plotLines = [];
        }

        options.plotLines.push(cdiOptions);
    }

});

addEvent(PlotLineOrBand, 'render', function () {
    var options = this.options,
        format,
        formatter;

    if (options.currentDateIndicator && options.label) {
        format = options.label.format;
        formatter = options.label.formatter;

        options.value = new Date();
        if (typeof formatter === 'function') {
            options.label.text = formatter(this);
        } else {
            options.label.text = H.dateFormat(format, new Date());
        }

        // If the label already exists, update its text
        if (this.label) {
            this.label.attr({
                text: options.label.text
            });
        }
    }
});
