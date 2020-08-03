/* *
 *
 *  Data module
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

export type JSONPrimitive = (boolean|number|string|null);

export type JSONType = (JSONObject|JSONArray);

export interface JSONArray extends Array<(JSONPrimitive|JSONType)> {
}

export interface JSONObject {
    [key: string]: (JSONPrimitive|JSONType);
}

export default JSONType;
