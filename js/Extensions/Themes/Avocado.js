/* *
 *
 *  (c) 2010-2020 Highsoft AS
 *
 *  Author: Øystein Moseng
 *
 *  License: www.highcharts.com/license
 *
 *  Accessible high-contrast theme for Highcharts. Considers colorblindness and
 *  monochrome rendering.
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
var setOptions = U.setOptions;
H.theme = {
    colors: ['#F3E796', '#95C471', '#35729E', '#251735'],
    colorAxis: {
        maxColor: '#05426E',
        minColor: '#F3E796'
    },
    plotOptions: {
        map: {
            nullColor: '#FCFEFE'
        }
    },
    navigator: {
        maskFill: 'rgba(170, 205, 170, 0.5)',
        series: {
            color: '#95C471',
            lineColor: '#35729E'
        }
    }
};
// Apply the theme
setOptions(H.theme);
