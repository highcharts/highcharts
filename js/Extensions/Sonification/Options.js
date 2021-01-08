/* *
 *
 *  (c) 2009-2021 Øystein Moseng
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
        duration: 2500,
        afterSeriesWait: 700,
        masterVolume: 1,
        order: 'sequential',
        defaultInstrumentOptions: {
            instrument: 'sineMusical',
            // Start at G4 note, end at C6
            minFrequency: 392,
            maxFrequency: 1046,
            mapping: {
                pointPlayTime: 'x',
                duration: 200,
                frequency: 'y'
            }
        }
    }
};
export default options;
