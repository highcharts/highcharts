Map collection
===

For your convenience, Highmaps offers a free [collection of maps](https://code.highcharts.com/mapdata/), optimized for use with Highmaps. For common maps, it saves you the trouble of finding or drawing suitable SVG or GeoJSON maps. Instead, you can choose between hundres of pre-generated maps of countries, regions and other administration levels.

License
-------

The Highmaps Map Collection comes with the license of the source data. For Admin0 (countries) and Admin1 (US states, German Bundesländer, Dutch regions etc), the source data is [Natural Earth](https://www.naturalearthdata.com/), which is [Public Domain](https://en.wikipedia.org/wiki/Public_domain). For Admin2, we have only compiled selected countries, and these maps are created from national files with their own license which is specified on the SVG map and in the other format files as meta data. If your country is missing from the list, please contact us and we'll try to find a suitable shapefile and generate more maps. 

For maps loaded using the default GeoJSON input into the mapData option, a short version of the copyright will be printed in the chart's credits label.

Using the map collection
------------------------

### Install from our CDN

In the [map collection reference](https://code.highcharts.com/mapdata/), each map name is followed by a link to an example. View the source of this example to get started. In short, the GeoJSON version of the map is loaded in a script tag in the page. This GeoJSON object is then registered to the Highcharts.maps object, and applied to the mapData option in the chart setup.

1. Add the map as a JavaScript element:

```html
<script src="https://code.highcharts.com/mapdata/custom/world.js"></script>
```

<p>You can alternatively link to a specific version or subversion of the map at <code>https://code.highcharts.com/mapdata/<strong>1.1</strong>/custom/world.js</code>.</p>

-----------------------------------------------------------------------------------------------------------------------------------------

2. Load it in `series.mapData`:
```js
mapData: Highcharts.maps['custom/world'],
```
Alternatively, you can set the default map for all series with the [`chart.map`](https://api.highcharts.com/highmaps/chart.map) option:

```js
map: 'custom/world'

3. Join your data with the map. By default Highmaps is set up to map your data against the `hc-key`property of the map collection, allowing you to define your data like this:
```js 
data: [['us-ny', 0], ['us-mi', 5], ['us-tx', 3], ['us-ak', 5]]
```
For other data joining options, see the [`series.joinBy`](https://api.highcharts.com/highmaps/plotOptions.series.joinBy) and [`series.keys`](https://api.highcharts.com/highcharts/plotOptions.series.keys) options.

### Install from npm

Our map collection is available on npm as [@highcharts/map-collection](https://www.npmjs.com/package/@highcharts/map-collection) and can be installed as following:
```sh
npm i @highcharts/map-collection
```

To load a map in Node.js and use it in Highmaps you can do the following:

```js    
var Highcharts = require('highcharts/highmaps.js'),
    map = require('@highcharts/map-collection/custom/world.geo.json');
    
Highcharts.mapChart('container', {
    chart: {
    map: geojson
    },
    // ...
});
```
    

Map properties
--------------

The following table outlines the properties available in the Highmaps Map Collection maps, and their meaning. The properties are accessible from the **point.properties** object ([example](https://jsfiddle.net/oysteinmoseng/52rgg5zq/)).

| Property       | Example values                        | Description                                                                                                                                                                                                                                                                                                                                                                           | Availability                                                      |
| -------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| hc-group       | admin1, admin2, special               | The administrative group the area belongs to. Admin0 is countries, admin1 is first level administrative division (USA States, German Bundesländer, Canada Provinces). Admin2 is second level adm.div. (USA counties, German Kreise, Norwegian Kommuner). "Special" is used to denote an area where this grouping does not make sense (e.g. congressional districts, historical maps). | All maps                                                          |
| hc-middle-x    | 0.65                                  | Data label X position. Defined as fraction of map bounding box width. 0 is left aligned, 1 is right aligned.                                                                                                                                                                                                                                                                          | All maps                                                          |
| hc-middle-y    | 0.65                                  | Data label Y position. Defined as fraction of map bounding box height. 0 is top aligned, 1 is bottom aligned                                                                                                                                                                                                                                                                          | All maps                                                          |
| hc-key         | us, us-ma-027, gb-hi                  | Unique hierarchical identifier for the area. Consistent across maps, and reflected in the naming convention of the maps. More detailed description below.                                                                                                                                                                                                                             | All maps                                                          |
| hc-a2          | KV, PA, BB                            | Two letter abbreviation of area name. Usually same as postal code/ISO code, but not always. Not guaranteed to be unique within map.                                                                                                                                                                                                                                                   | All maps                                                          |
| name           | Fremont, Brandenburg, Saipan          | Name of the area                                                                                                                                                                                                                                                                                                                                                                      | All maps                                                          |
| iso-a2         | US, MC, LV                            | ISO 2 letter country code                                                                                                                                                                                                                                                                                                                                                             | Most admin0 areas                                                 |
| iso-a3         | USA, MCO, LVA                         | ISO 3 letter country code                                                                                                                                                                                                                                                                                                                                                             | Most admin0 areas                                                 |
| continent      | Asia, North America                   | Continent the area lies within                                                                                                                                                                                                                                                                                                                                                        | Most admin0 areas                                                 |
| country-abbrev | Pan., C.R.                            | Abbreviated country name                                                                                                                                                                                                                                                                                                                                                              | Most admin0 areas                                                 |
| region         | Midwest, South, Highlands and Islands | The region the area lies within                                                                                                                                                                                                                                                                                                                                                       | Most admin1 areas within country maps                             |
| subregion      | Southern Europe, Highland             | The subregion the area lies within                                                                                                                                                                                                                                                                                                                                                    | Most admin0 and admin1 areas                                      |
| fips           | 120, GM10, US05, 56031                | FIPS code for the area. Format may vary between maps as to whether the country code is included.                                                                                                                                                                                                                                                                                      | Most admin1 areas within country maps, as well as USA admin2 maps |
| hasc           | DE.BB, US.AR                          | HASC code for the area                                                                                                                                                                                                                                                                                                                                                                | Most admin1 areas within country maps                             |
| postal-code    | AK, NY, TI                            | Postal code for the area, usually two letters wide                                                                                                                                                                                                                                                                                                                                    | Most admin1 areas within country maps                             |
| type           | State, Emirate, Fylke, Land           | Description of the area type                                                                                                                                                                                                                                                                                                                                                          | Most admin1 areas within country maps                             |





The **hc-key** property reflects the naming convention of the maps, and can be used for dynamic drilldown purposes. This is illustrated in the [Map drilldown demo](https://highcharts.com/maps/demo/map-drilldown). The property follows the following format:

```
<unique admin0 id>-<unique admin1 id>-<unique admin2 id>-...
```

Attempts are made to use commonly known codes for each level, to increase readability. As an example, most countries are identified by their two letter ISO-3166 code. Most admin1 areas are identified by their postal codes. For United States, admin2 (county) areas are identified by their FIPS codes.

In addition to the above mentioned properties, all points have an **id** property that is stored on the point itself, rather than in the properties object. The **id** property is an unique ID for the point within the map. It follows a hierarchical system identical to that of the **hc-key** property, but uses capital letters and periods as delimiters.

Some maps may provide additional properties that are not mentioned in the above table. Open the GeoJSON/Javascript source of the map in a text editor to find all available properties.

Using parts of a map
--------------------

If you can't find the exact map that you want in the collection, it is easy to use only selected parts of a larger area. Say you want a comparative map of Canada, USA and Mexico. Since we don't have that exact combination in the collection (as of now), you can use the map called "North America without Central". This map also contains Greenland as well as Caribbean islands. So we apply a data set only for the three countries we want, and set the [allAreas](https://api.highcharts.com/highmaps/plotOptions.map.allAreas) option to false. This option makes sure all null points (the countries that don't have data), are hidden. See [demo on jsFiddle](https://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/maps/plotoptions/series-allareas-false/).

Modify our maps
---------------

Our maps are also a good starting points for your own modified maps. Borders can be moved, areas joined, and labels modified by loading the SVG map in Inkscape, the free SVG editor. Our article on [Custom maps](https://highcharts.com/docs/maps/custom-maps) explains in detail how to draw your maps from scratch. Modifying existing maps is easier - instead of drawing shapes use the existing ones (SVG files can be downloaded from [here](https://code.highcharts.com/mapdata)) and perform the same operations as described in the article. Alternatively, follow the article on [Custom GeoJSON maps](https://highcharts.com/docs/maps/custom-geojson-maps) to edit the map with a GIS editor for even more control and advanced mapping features.

Disclaimer
----------

We offer the map collection for free to use with Highmaps, for your convenience. We will not be held responsible for errors in the maps, although we will strive to respond to bug reports and keep the maps correct.
