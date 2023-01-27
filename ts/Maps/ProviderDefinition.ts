/* *
 *
 *  (c) 2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

interface Themes {
    [key: string]: string
}

interface ProviderGetURL {
    (
        subdomain?: string | undefined,
        theme?: string | undefined,
        apiKey?: string | undefined
    ): string;
}

export interface minMaxZoomObject {
    minZoom: number,
    maxZoom: number
}

export declare class ProviderDefinition {
    subdomains?: Array<string>;
    themes: Themes;
    credits: Themes;
    initialProjectionName: String;
    getURL: ProviderGetURL;
    getProjectionName: Function;
    getCredits: Function;
    getMinMaxZoom: Function;
}

export default ProviderDefinition;
