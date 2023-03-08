/**
 * This is a complicated demo of Highcharts Maps, not intended to get you up to
 * speed quickly, but to show off some basic maps and features in one single
 * place. For the basic demo, check out
 * https://www.highcharts.com/maps/demo/geojson instead.
 *
 * @todo
 * - Remove jQuery where not necessary
 */

// Base path to maps
const baseMapPath = 'https://code.highcharts.com/mapdata/';

let showDataLabels = false, // Switch for data labels enabled/disabled
    mapCount = 0,
    mapOptions = '';

// Populate dropdown menus and turn into jQuery UI widgets
$.each(Highcharts.mapDataIndex, (mapGroup, maps) => {
    if (mapGroup !== 'version') {
        mapOptions += `<option class="option-header">${mapGroup}</option>`;
        $.each(maps, (desc, path) => {
            mapOptions += `<option value="${path}">${desc}</option>`;
            mapCount += 1;
        });
    }
});
const searchText = `Search ${mapCount} maps`;
mapOptions =
    `<option value="custom/world.js">${searchText}</option>${mapOptions}`;
$('#mapDropdown').append(mapOptions).combobox();

// Change map when item selected in dropdown
$('#mapDropdown').on('change', async function () {
    const $selectedItem = $('option:selected', this),
        mapDesc = $selectedItem.text(),
        mapKey = this.value.slice(0, -3),
        svgPath = baseMapPath + mapKey + '.svg',
        geojsonPath = baseMapPath + mapKey + '.geo.json',
        topojsonPath = baseMapPath + mapKey + '.topo.json',
        javascriptPath = baseMapPath + this.value,
        isHeader = $selectedItem.hasClass('option-header');

    // Dim or highlight search box
    if (mapDesc === searchText || isHeader) {
        $('.custom-combobox-input').removeClass('valid');
        location.hash = '';
    } else {
        $('.custom-combobox-input').addClass('valid');
        location.hash = mapKey;
    }

    if (isHeader) {
        return false;
    }

    // Show loading
    if (Highcharts.charts[0]) {
        Highcharts.charts[0].showLoading(
            '<i class="fa fa-spinner fa-spin fa-2x"></i>'
        );
    }

    // Load the map
    let filesize = '';
    const mapData = await fetch(topojsonPath)
        .then(response => {
            const size = response.headers.get('content-length');
            if (size) {
                filesize = Math.round(size / 1024) + ' kB';
            }

            return response.json();
        })
        .catch(e => console.log('Error', e));

    if (!mapData) {
        if (Highcharts.charts[0]) {
            Highcharts.charts[0].showLoading(
                '<i class="fa fa-frown"></i> Map not found'
            );
        }
        return;
    }

    // Update info box download links
    $('#download').html(
        '<small>' + filesize + '</small> <br><br>' +
        '<a class="button" target="_blank" href="https://jsfiddle.net/gh/get/jquery/1.11.0/' +
            'highcharts/highcharts/tree/master/samples/mapdata/' + mapKey + '">' +
            'View clean demo</a>' +
            '<div class="or-view-as">... or view as ' +
            '<a target="_blank" href="' + svgPath + '">SVG</a>, ' +
            '<a target="_blank" href="' + geojsonPath + '">GeoJSON</a>, ' +
            '<a target="_blank" href="' + topojsonPath + '">TopoJSON</a>, ' +
            '<a target="_blank" href="' + javascriptPath + '">JavaScript</a>.</div>'
    );

    // Generate non-random data for the map
    const data = mapData.objects.default.geometries.map((g, value) => ({
        key: g.properties['hc-key'],
        value
    }));

    // Show arrows the first time a real map is shown
    if (mapDesc !== searchText) {
        $('.selector .prev-next').show();
        $('#side-box').show();
    }

    // Is there a layer above this?
    const match = mapKey
        .match(/^(countries\/[a-z]{2}\/[a-z]{2})-[a-z0-9]+-all$/);
    let parent;
    if (/^countries\/[a-z]{2}\/[a-z]{2}-all$/.test(mapKey)) { // country
        parent = {
            desc: 'World',
            key: 'custom/world'
        };
    } else if (match) { // admin1
        parent = {
            desc: $('option[value="' + match[1] + '-all.js"]').text(),
            key: match[1] + '-all'
        };
    }
    $('#up').html('');
    if (parent) {
        $('#up').append(
            $('<a><i class="fa fa-angle-up"></i> ' + parent.desc + '</a>')
                .attr({
                    title: parent.key
                })
                .on('click', function () {
                    $('#mapDropdown').val(parent.key + '.js').trigger('change');
                })
        );
    }

    // Data labels formatter. Use shorthand codes for world and US
    const formatter = function () {
        return (
            mapKey === 'custom/world' ||
            mapKey === 'countries/us/us-all'
        ) ?
            (this.point.properties && this.point.properties['hc-a2']) :
            this.point.name;
    };

    // On point click, look for a detailed map to drill into
    const onPointClick = function () {
        const key = this.key;
        $('#mapDropdown option').each(function () {
            if (this.value === `countries/${key.substr(0, 2)}/${key}-all.js`) {
                $('#mapDropdown').val(this.value).trigger('change');
            }
        });
    };

    const fitToGeometry = (mapKey === 'custom/world') ? {
        type: 'MultiPoint',
        coordinates: [
            // Alaska west
            [-164, 54],
            // Greenland north
            [-35, 84],
            // New Zealand east
            [179, -38],
            // Chile south
            [-68, -55]
        ]
    } : undefined;

    // Instantiate chart
    console.time('map');
    Highcharts.mapChart('container', {

        chart: {
            map: mapData
        },

        title: {
            text: null
        },

        accessibility: {
            series: {
                descriptionFormat: '{series.name}, map with {series.points.length} areas.',
                pointDescriptionEnabledThreshold: 50
            }
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                alignTo: 'spacingBox',
                x: 10
            }
        },

        mapView: {
            fitToGeometry
        },

        colorAxis: {
            min: 0,
            stops: [
                [0, '#EFEFFF'],
                [0.5, Highcharts.getOptions().colors[0]],
                [
                    1,
                    Highcharts.color(Highcharts.getOptions().colors[0])
                        .brighten(-0.5).get()
                ]
            ]
        },

        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'bottom'
        },

        series: [{
            data,
            joinBy: ['hc-key', 'key'],
            name: 'Random data',
            states: {
                hover: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            dataLabels: {
                enabled: showDataLabels,
                formatter,
                style: {
                    fontWeight: 100,
                    fontSize: '10px',
                    textOutline: 'none'
                }
            },
            point: {
                events: {
                    click: onPointClick
                }
            }
        }, {
            type: 'mapline',
            name: 'Lines',
            accessibility: {
                enabled: false
            },
            data: Highcharts.geojson(mapData, 'mapline'),
            /*
            data: [{
                geometry: mapData.objects.default['hc-recommended-mapview'].insets[0].geoBounds
            }],
            // */
            nullColor: '#333333',
            showInLegend: false,
            enableMouseTracking: false
        }]
    });
    console.timeEnd('map');

    showDataLabels = $('#chkDataLabels').prop('checked');
});

// Toggle data labels - Note: Reloads map with new random data
$('#chkDataLabels').on('change', function () {
    showDataLabels = $('#chkDataLabels').prop('checked');
    $('#mapDropdown').trigger('change');
});

// Switch to previous map on button click
$('#btn-prev-map').on('click', function () {
    $('#mapDropdown option:selected')
        .prev('option')
        .prop('selected', true)
        .trigger('change');
});

// Switch to next map on button click
$('#btn-next-map').on('click', function () {
    $('#mapDropdown option:selected')
        .next('option')
        .prop('selected', true)
        .trigger('change');
});

// Trigger change event to load map on startup
if (location.hash) {
    $('#mapDropdown').val(location.hash.substr(1) + '.js');
}
$('#mapDropdown').trigger('change');
