/* *
 *
 *  (c) 2023 Hubert Kozik
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

export interface Theme {
    url: string,
    minZoom: number,
    maxZoom: number,
    credits?: string
}

export interface Themes {
    [key: string]: Theme
}

export declare class ProviderDefinition {
    subdomains?: Array<string>;
    themes: Themes;
    defaultCredits: String;
    initialProjectionName: DeepPartial<string>;
    requiresApiKey?: boolean;
}

export default ProviderDefinition;
