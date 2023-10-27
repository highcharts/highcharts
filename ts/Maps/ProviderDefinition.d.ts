/* *
 *
 *  (c) 2023 Hubert Kozik
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { ProjectionRegistryName } from './Projections/ProjectionRegistry';

/* *
 *
 *  Declarations
 *
 * */

export interface Theme {
    credits?: string;
    maxZoom: number;
    minZoom: number;
    url: string;
}

export interface Themes {
    [key: string]: Theme
}

export interface ProviderDefinition {
    defaultCredits: string;
    initialProjectionName: ProjectionRegistryName;
    requiresApiKey: (boolean|undefined);
    subdomains: (Array<string>|undefined);
    themes: Themes;
}

/* *
 *
 *  Default Export
 *
 * */

export default ProviderDefinition;
