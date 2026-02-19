/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  Accessibility module for Highcharts: Default options
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type { Options } from '../Core/Options.js';
import type { DeepPartial } from '../Shared/Types';

const Options: DeepPartial<Options> = {
    a11y: {
        enabled: true,
        order: [
            'breadcrumbs', 'rangeSelector', 'data', 'zoom',
            'navigator', 'legend', 'menu', 'credits', 'stockTools'
        ],
        chartDescriptionSection: {
            chartTitleFormat: '{chartTitle}',
            chartSubtitleFormat: '{chartSubtitle}',
            linkedDescription: '*[data-highcharts-chart="{index}"] + .highcharts-description', // eslint-disable-line max-len
            chartDescriptionFormat: '{#if linkedDescription}{linkedDescription}{else}{caption}{/if}', // eslint-disable-line max-len
            chartAutoDescriptionFormat: '{chartAutoDescription}',
            positionOnChart: true
        },
        dataDescriptions: {
            // ...
        }
    },

    lang: {
        a11y: {
            defaultChartTitle: 'Chart',
            chartInteractionHint: 'Chart has {#if chart.sonification}' +
                'audio features and {/if}additional interactive tools.'
        }
    }
};

export default Options;
