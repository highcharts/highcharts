/* *
 *
 *  Arc diagram module
 *
 *  (c) 2021 Piotr Madej, Grzegorz Blachliński
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

import type ArcDiagramSeriesOptions from './ArcDiagramSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

const ArcDiagramSeriesDefaults: ArcDiagramSeriesOptions = {

    centeredLinks: false,

    equalNodes: false,

    dataLabels: {

        linkTextPath: {

            attributes: {

                startOffset: '25%'

            }

        }

    },

    marker: {

        fillOpacity: 1,

        lineWidth: 0,

        states: {},

        symbol: 'circle'

    },

    offset: '100%',

    reversed: false

};

/* *
 *
 *  Default Export
 *
 * */

export default ArcDiagramSeriesDefaults;
