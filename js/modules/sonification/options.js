/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  Default options for sonification.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
// Experimental, disabled by default, not exposed in API
var options = {
    sonification: {
        enabled: false,
        duration: 2000,
        afterSeriesWait: 1000,
        order: 'sequential',
        pointPlayTime: 'x',
        instruments: [{
                instrument: 'sineMusical',
                instrumentMapping: {
                    duration: 400,
                    frequency: 'y',
                    volume: 0.7
                },
                // Start at G4 note, end at C6
                instrumentOptions: {
                    minFrequency: 392,
                    maxFrequency: 1046
                }
            }]
    }
};
export default options;
