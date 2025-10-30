/* *
 *
 *  Provider definition
 *
 *  (c) 2023-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  Authors:
 *  - Hubert Kozik
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

/** @internal */
export interface Theme {
    credits?: string;
    maxZoom: number;
    minZoom: number;
    url: string;
}

/** @internal */
export interface Themes {
    [key: string]: Theme
}

/** @internal */
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

/** @internal */
export default ProviderDefinition;
