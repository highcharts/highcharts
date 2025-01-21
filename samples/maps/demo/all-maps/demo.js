/**
 * This is a complicated demo of Highcharts Maps, not intended to get you up to
 * speed quickly, but to show off some basic maps and features in one single
 * place. For the basic demo, check out
 * https://www.highcharts.com/demo/maps/tooltip instead.
 *
 */

// Get all HTML elements
const datalist = document.getElementById('maps'),
    input = document.getElementById('map-datalist-input'),
    prevMapButton = document.getElementById('prev-map-btn'),
    nextMapButton = document.getElementById('next-map-btn'),
    dataLabelsCheckbox = document.getElementById('datalabels-checkbox'),
    mapNameHeader = document.getElementById('map-name-header'),
    cleanDemoButton = document.getElementById('clean-demo-btn'),
    svgLink = document.getElementById('svg-link'),
    geojsonLink = document.getElementById('geojson-link'),
    topojsonLink = document.getElementById('topojson-link'),
    javascriptLink = document.getElementById('javascript-link');

// Base path to maps
const baseMapPath = 'https://code.highcharts.com/mapdata/',
    options = [], // Options elements
    allMaps = {},
    mapsToSkip = [
        'World, Eckert III projection, high resolution',
        'World, Eckert III projection, low resolution',
        'World, Eckert III projection, medium resolution',
        'World, Robinson projection, high resolution',
        'World, Robinson projection, low resolution',
        'World, Robinson projection, medium resolution'
    ];

// Populate dropdown options
for (const [mapGroup, maps] of Object.entries(Highcharts.mapDataIndex)) {
    if (mapGroup !== 'version') {
        Highcharts.merge(true, allMaps, maps);
    }
}

// Remove unwanted text from maps display name
for (const key of Object.keys(allMaps)) {
    if (key.includes(', Miller projection')) {
        allMaps[key.replace(', Miller projection', '')] = allMaps[key];
        delete allMaps[key];
    }
}

for (const [desc, path] of Object.entries(allMaps)) {
    if (!mapsToSkip.includes(desc)) {
        const option = document.createElement('option');
        option.value = desc; // Display name
        option.dataset.value = path; // Desired value
        options.push(option);
    }
}

datalist.append(...options);

const searchText = `Search ${Object.keys(options).length} maps`;
input.placeholder = searchText;

// Helper functions
function setAttributes(el, attrs) {
    for (const key in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, key)) {
            el.setAttribute(key, attrs[key]);
        }
    }
}

function fillInfo(mapName, mapKey) {
    const paths = [{
        type: 'svg',
        elem: svgLink,
        path: `${baseMapPath}${mapKey}.svg`
    }, {
        type: 'geojson',
        elem: geojsonLink,
        path: `${baseMapPath}${mapKey}.geo.json`
    }, {
        type: 'topojson',
        elem: topojsonLink,
        path: `${baseMapPath}${mapKey}.topo.json`
    }, {
        type: 'javascript',
        elem: javascriptLink,
        path: `${baseMapPath}${mapKey}.js`
    }];

    paths.forEach(({
        elem,
        path
    }) => {
        setAttributes(elem, {
            href: path
        });
    });

    setAttributes(cleanDemoButton, {
        href: `https://highcharts.com/samples/mapdata/${mapKey}`
    });

    mapNameHeader.innerText = mapName;
}

function resetDrilldown(chart) {
    // Reset drilldown functionalities
    if (chart.breadcrumbs && chart.breadcrumbs.elementList[0]) {
        chart.breadcrumbs.destroy();
        delete chart.breadcrumbs;
        delete chart.drilldown;
        delete chart.drilldownLevels;
    }
}

// Initial creation of the chart
(async () => {
    const initialMapName = 'World, medium resolution',
        initialMapKey = 'custom/world',
        mapData = await fetch(`https://code.highcharts.com/mapdata/${initialMapKey}.topo.json`)
            .then(response => response.json())
            .catch(e => console.log('Error', e));

    fillInfo(initialMapName, initialMapKey);

    // On point click, look for a detailed map to drill into
    const drilldown = async function (e) {
        const map = Object.entries(allMaps).find(map =>
            map[0] === e.point.name
        ) || Object.entries(allMaps).find(map =>
            map[0].indexOf(e.point.name) === 0
        );
        if (!e.seriesOptions && map) {
            const chart = this,
                mapName = map[0],
                mapKey = map[1].slice(0, -3);

            // Handle error, the timeout is cleared on success
            let fail = setTimeout(() => {
                if (!Highcharts.maps[mapKey]) {
                    chart.showLoading(
                        '<i class="fa fa-frown"></i> Map not ' +
                        'found'
                    );
                    fail = setTimeout(() => {
                        chart.hideLoading();
                    }, 1000);
                }
            }, 3000);

            // Show the Font Awesome spinner
            chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>');

            fillInfo(mapName, mapKey);
            input.value = mapName;
            prevMapButton.style.opacity = 1;
            nextMapButton.style.opacity = 1;

            // Load the drilldown map
            const topology = await fetch(
                `https://code.highcharts.com/mapdata/${mapKey}.topo.json`
            ).then(response => response.json());

            const data =
                topology.objects.default.geometries.map((g, value) => ({
                    key: g.properties['hc-key'],
                    drilldown: g.properties['hc-key'],
                    value
                }));

            // Data labels formatter. Use shorthand codes for world and US
            const formatter = function () {
                return (
                    mapKey === 'custom/world' ||
                    mapKey === 'countries/us/us-all'
                ) ?
                    (this.point.properties && this.point.properties['hc-a2']) :
                    this.point.name;
            };

            // Hide loading and add series
            chart.hideLoading();
            clearTimeout(fail);
            chart.addSeriesAsDrilldown(e.point, {
                mapData: topology,
                name: e.point.name,
                data,
                joinBy: ['hc-key', 'key'],
                dataLabels: {
                    formatter
                },
                custom: {
                    mapName,
                    mapKey
                }
            });

            // Update credits in afterDrilldown. The chart is not ready yet.
        }
    };

    // On drill up, reset to the top-level map view
    const afterDrillUp = function (e) {
        const {
            mapName,
            mapKey
        } = e.seriesOptions.custom;
        if (mapName && mapKey) {
            fillInfo(mapName, mapKey);
            input.value = mapName;
        }
        this.credits.update();
    };

    const data = mapData.objects.default.geometries.map((g, value) => ({
        key: g.properties['hc-key'],
        drilldown: g.properties['hc-key'],
        value
    }));

    console.time('map');
    const chart = Highcharts.mapChart('container', {
        accessibility: {
            series: {
                descriptionFormat: '{series.name}, map with ' +
                    '{series.points.length} areas.',
                pointDescriptionEnabledThreshold: 50
            }
        },

        chart: {
            events: {
                drilldown,
                afterDrillUp,
                afterDrilldown: function () {
                    this.credits.update();
                }
            }
        },

        colorAxis: {
            min: 0
        },

        drilldown: {
            activeDataLabelStyle: {
                color: '#fff',
                fontWeight: 'normal',
                textDecoration: 'none'
            }
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                alignTo: 'spacingBox',
                x: 10
            }
        },

        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'bottom'
        },

        plotOptions: {
            map: {
                dataLabels: {
                    enabled: dataLabelsCheckbox.checked
                }
            }
        },

        series: [{
            data,
            mapData,
            joinBy: ['hc-key', 'key'],
            name: initialMapName,
            dataLabels: {
                formatter: function () {
                    return this.point.properties && this.point.properties[
                        'hc-a2'];
                }
            },
            custom: {
                mapName: initialMapName,
                mapKey: initialMapKey
            }
        }],

        title: {
            text: null
        },

        responsive: {
            rules: [{
                condition: {
                    callback() {
                        return document.body.offsetWidth < 753;
                    }
                },
                chartOptions: {
                    colorAxis: {
                        layout: 'horizontal'
                    },
                    legend: {
                        align: 'center'
                    },
                    mapNavigation: {
                        buttonOptions: {
                            verticalAlign: 'bottom'
                        }
                    }
                }
            }]
        }
    });
    console.timeEnd('map');

    async function updateChart(mapName) {
        const mapKey = allMaps[mapName].slice(0, -3);

        // Show loading
        chart.showLoading('<i class="fa fa-spinner fa-spin fa-2x"></i>');

        fillInfo(mapName, mapKey);

        const mapData = await fetch(`${baseMapPath}${mapKey}.topo.json`)
            .then(response => response.json())
            .catch(e => console.log('Error', e));

        if (!mapData) {
            chart.showLoading('<i class="fa fa-frown"></i> Map not found');
            return;
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

        const data = mapData.objects.default.geometries.map((g, value) => ({
            key: g.properties['hc-key'],
            drilldown: g.properties['hc-key'],
            value
        }));

        chart.series[0].update({
            mapData,
            data,
            name: mapName,
            dataLabels: {
                formatter
            },
            custom: {
                mapName,
                mapKey
            }
        });
        chart.hideLoading();
        chart.credits.update();
    }

    // Change map on input change
    input.addEventListener('input', async function () {
        if (allMaps[this.value]) {
            prevMapButton.style.opacity = 1;
            nextMapButton.style.opacity = 1;
            const pointOnCurrentMap =
                chart.series[0].points.find(point => point.name === this.value);

            if (pointOnCurrentMap) {
                pointOnCurrentMap.doDrilldown();
            } else {
                resetDrilldown(chart);
                updateChart(this.value);
            }
        }
    });

    // Toggle data labels
    dataLabelsCheckbox.addEventListener('click', function () {
        chart.update({
            plotOptions: {
                map: {
                    dataLabels: {
                        enabled: this.checked
                    }
                }
            }
        });
    });

    // Switch to previous map on button click
    prevMapButton.addEventListener('click', function () {
        const desiredIndex = Object.keys(allMaps).indexOf(input.value) - 1,
            [mapName] = Object.entries(allMaps)[
                desiredIndex < 0 ?
                    Object.keys(allMaps).length - 1 :
                    desiredIndex
            ];
        resetDrilldown(chart);
        updateChart(mapName);
        input.value = mapName;
    });

    // Switch to next map on button click
    nextMapButton.addEventListener('click', function () {
        const desiredIndex = Object.keys(allMaps).indexOf(input.value) + 1,
            [mapName] = Object.entries(allMaps)[
                desiredIndex > Object.keys(allMaps).length - 1 ?
                    0 :
                    desiredIndex
            ];
        resetDrilldown(chart);
        updateChart(mapName);
        input.value = mapName;
    });
})();
