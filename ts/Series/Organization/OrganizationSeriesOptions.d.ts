/* *
 *
 *  Organization chart module
 *
 *  (c) 2018-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ColorString from '../../Core/Color/ColorString';
import type OrganizationDataLabelOptions from './OrganizationDataLabelOptions';
import type {
    SankeySeriesLevelOptions,
    SankeySeriesNodeOptions,
    SankeySeriesOptions
} from '../Sankey/SankeySeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Sankey/SankeySeriesOptions' {
    interface SankeySeriesOptions {
        /** @requires OrganizationSeries */
        linkColor?: OrganizationSeriesOptions['linkColor'];
        /** @requires OrganizationSeries */
        linkLineWidth?: OrganizationSeriesOptions['linkLineWidth'];
        /** @requires OrganizationSeries */
        link?: OrganizationSeriesOptions['link'];
    }
}

export type OrganizationLinkTypeValues = 'curved' | 'straight' | 'orthogonal';

export type OrganizationNodesLayoutValue = ('normal'|'hanging');

export interface OrganizationLinkOptions {
    linkOpacity?: number;
    curveFactor?: number;
    color?: ColorString;
    lineWidth?: number;
    type?: OrganizationLinkTypeValues;
    radius?: number;
}

export type OrganizationHangingIndentTranslationValue = (
    'inherit'|'cumulative'|'shrink'
);


export interface OrganizationSeriesLevelOptions extends SankeySeriesLevelOptions {
    borderRadius?: number;
    linkColor?: ColorString;
    linkLineWidth?: number;
    link?: OrganizationLinkOptions;
    states: SeriesStatesOptions<OrganizationSeriesOptions>;
}

export interface OrganizationSeriesNodeOptions extends SankeySeriesNodeOptions {
    description?: string;
    image?: string;
    layout?: OrganizationNodesLayoutValue;
    title?: string;
}

export interface OrganizationSeriesOptions extends SankeySeriesOptions {
    dataLabels: OrganizationDataLabelOptions;
    hangingIndent?: number;
    hangingIndentTranslation?: OrganizationHangingIndentTranslationValue;
    hangingSide?: 'left' | 'right';
    levels?: Array<OrganizationSeriesLevelOptions>;
    link: OrganizationLinkOptions;
    linkColor?: ColorString;
    linkLineWidth?: number;
    linkRadius?: number;
    minNodeLength?: number;
    nodes?: Array<OrganizationSeriesNodeOptions>;
    states?: SeriesStatesOptions<OrganizationSeriesOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default OrganizationSeriesOptions;
