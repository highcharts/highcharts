/**
 * This is a complicated demo of Highcharts Maps, not intended to get you up to
 * speed quickly, but to show off some basic maps and features in one single
 * place. For the basic demo, check out
 * https://www.highcharts.com/demo/maps/tooltip instead.
 *
 */

// Get all HTML elements
const mapSearch = document.getElementById('map-search'),
    input = document.getElementById('map-search-input'),
    toggleButton = document.getElementById('map-search-toggle'),
    listbox = document.getElementById('map-listbox'),
    emptyMessage = document.getElementById('map-search-empty'),
    searchStatus = document.getElementById('map-search-status'),
    prevMapButton = document.getElementById('prev-map-btn'),
    nextMapButton = document.getElementById('next-map-btn'),
    dataLabelsCheckbox = document.getElementById('datalabels-checkbox'),
    cleanDemoButton = document.getElementById('clean-demo-btn'),
    svgLink = document.getElementById('svg-link'),
    geojsonLink = document.getElementById('geojson-link'),
    topojsonLink = document.getElementById('topojson-link'),
    javascriptLink = document.getElementById('javascript-link');

// Base path to maps
const baseMapPath = 'https://code.highcharts.com/mapdata/',
    allMaps = {}, // Map name => path
    mapNames = [], // Map names in list order, used by Prev and Next
    mapsToSkip = /(Eckert III|Robinson) projection/,
    // Readable names for the groups in the map index
    groupNames = {
        Custom: 'World and regions'
    },
    // Hand-picked maps shown on top of the list
    suggestedMaps = [{
        label: 'World map',
        name: 'World, medium resolution'
    }, {
        label: 'Europe',
        name: 'Europe'
    }, {
        label: 'United States of America',
        name: 'United States of America'
    }, {
        label: 'European Union (2020)',
        name: 'European Union (2020)'
    }, {
        label: 'California',
        name: 'California, admin2'
    }];

let currentMapName,
    activeOption,
    optionCount = 0;

// Build the grouped list of maps
const listGroups = [];

function addListGroup(label, maps, suggested) {
    const group = document.createElement('div'),
        heading = document.createElement('div'),
        options = maps.map(map => {
            const option = document.createElement('div');
            option.id = `map-option-${optionCount++}`;
            option.className = 'map-option';
            option.textContent = map.label;
            option.dataset.name = map.name;
            option.setAttribute('role', 'option');
            option.setAttribute('aria-selected', 'false');
            return option;
        });

    heading.id = `map-group-${listGroups.length}`;
    heading.className = 'map-group-label';
    heading.textContent = label;
    heading.setAttribute('role', 'presentation');

    group.setAttribute('role', 'group');
    group.setAttribute('aria-labelledby', heading.id);
    group.append(heading, ...options);
    listbox.append(group);

    listGroups.push({ element: group, options, suggested });
}

addListGroup('Suggested', suggestedMaps, true);

for (const [groupName, maps] of Object.entries(Highcharts.mapDataIndex)) {
    if (groupName !== 'version') {
        const groupMaps = [];
        for (const [name, path] of Object.entries(maps)) {
            if (!mapsToSkip.test(name)) {
                allMaps[name] = path;
                mapNames.push(name);
                groupMaps.push({ label: name, name });
            }
        }
        addListGroup(groupNames[groupName] || groupName, groupMaps);
    }
}

input.placeholder = `Search ${mapNames.length} maps`;

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
        href: `https://jsfiddle.net/gh/get/jquery/1.11.0/highcharts/highcharts/tree/master/samples/mapdata/${mapKey}`
    });

    // The search field shows the name of the current map
    currentMapName = mapName;
    input.value = mapName;
    listGroups.forEach(group => group.options.forEach(option => {
        option.classList.toggle(
            'current',
            option.dataset.name === mapName
        );
    }));
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

// Map search, a combobox that filters the list while typing
function isOpen() {
    return input.getAttribute('aria-expanded') === 'true';
}

function getVisibleOptions() {
    return listGroups
        .filter(group => !group.element.hidden)
        .flatMap(group => group.options.filter(option => !option.hidden));
}

function filterOptions(text) {
    const query = text.trim().toLowerCase();
    let count = 0;

    listGroups.forEach(group => {
        let groupCount = 0;
        group.options.forEach(option => {
            // Suggested maps are only shown in the full list
            const match = query ?
                !group.suggested &&
                    option.textContent.toLowerCase().includes(query) :
                true;
            option.hidden = !match;
            if (match) {
                groupCount++;
            }
        });
        group.element.hidden = !groupCount;
        if (!group.suggested) {
            count += groupCount;
        }
    });

    listbox.hidden = !count;
    emptyMessage.hidden = !!count;
    searchStatus.textContent = query ?
        `${count} map${count === 1 ? '' : 's'} found` :
        '';
}

function setActiveOption(option) {
    if (activeOption) {
        activeOption.classList.remove('active');
        activeOption.setAttribute('aria-selected', 'false');
    }
    activeOption = option;

    if (option) {
        option.classList.add('active');
        option.setAttribute('aria-selected', 'true');
        input.setAttribute('aria-activedescendant', option.id);

        // Scroll the option into view, with its group label if it is the
        // first option in the group
        const target = option.previousElementSibling.matches(
                '.map-group-label'
            ) ? option.parentElement : option,
            top = target.offsetTop,
            bottom = option.offsetTop + option.offsetHeight;

        if (top < listbox.scrollTop) {
            listbox.scrollTop = top;
        } else if (bottom > listbox.scrollTop + listbox.clientHeight) {
            listbox.scrollTop = bottom - listbox.clientHeight;
        }
    } else {
        input.removeAttribute('aria-activedescendant');
    }
}

function openList(showAll) {
    if (showAll) {
        filterOptions('');
        listbox.scrollTop = 0;
    }
    setActiveOption(null);
    mapSearch.classList.add('open');
    input.setAttribute('aria-expanded', 'true');
    toggleButton.setAttribute('aria-expanded', 'true');
}

function closeList() {
    setActiveOption(null);
    listbox.hidden = true;
    emptyMessage.hidden = true;
    searchStatus.textContent = '';
    mapSearch.classList.remove('open');
    input.setAttribute('aria-expanded', 'false');
    toggleButton.setAttribute('aria-expanded', 'false');

    // Show the current map name again if the search was abandoned
    input.value = currentMapName;
}

function moveActiveOption(step) {
    const options = getVisibleOptions(),
        index = options.indexOf(activeOption);

    if (options.length) {
        setActiveOption(
            index < 0 ?
                options[step > 0 ? 0 : options.length - 1] :
                options[(index + step + options.length) % options.length]
        );
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
                    chart.showLoading('Map not found');
                    fail = setTimeout(() => {
                        chart.hideLoading();
                    }, 1000);
                }
            }, 3000);

            chart.showLoading('Loading...');

            fillInfo(mapName, mapKey);

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
        }
        this.credits.update();
    };

    const data = mapData.objects.default.geometries.map((g, value) => ({
        key: g.properties['hc-key'],
        drilldown: g.properties['hc-key'],
        value
    }));

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

    // Used to ignore responses of maps that are no longer requested, when
    // switching quickly with Prev and Next
    let updateRequest = 0;

    async function updateChart(mapName) {
        const mapKey = allMaps[mapName].slice(0, -3),
            request = ++updateRequest;

        chart.showLoading('Loading...');

        fillInfo(mapName, mapKey);

        const mapData = await fetch(`${baseMapPath}${mapKey}.topo.json`)
            .then(response => response.json())
            .catch(e => console.log('Error', e));

        if (request !== updateRequest) {
            return;
        }

        if (!mapData) {
            chart.showLoading('Map not found');
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

    function selectMap(mapName) {
        closeList();

        if (allMaps[mapName] && mapName !== currentMapName) {
            const pointOnCurrentMap =
                chart.series[0].points.find(point => point.name === mapName);

            if (pointOnCurrentMap) {
                pointOnCurrentMap.doDrilldown();
            } else {
                resetDrilldown(chart);
                updateChart(mapName);
            }
        }
    }

    // Switch to the previous or next map in the list
    function stepMap(step) {
        const index = mapNames.indexOf(currentMapName),
            count = mapNames.length;

        resetDrilldown(chart);
        updateChart(mapNames[
            index < 0 ?
                (step > 0 ? 0 : count - 1) :
                (index + step + count) % count
        ]);
    }

    // Map search events
    input.addEventListener('click', function () {
        if (!isOpen()) {
            openList(true);
            this.select();
        }
    });

    input.addEventListener('input', function () {
        filterOptions(this.value);
        openList(false);

        // Pressing Enter picks the first match
        if (this.value.trim()) {
            setActiveOption(getVisibleOptions()[0]);
        }
    });

    input.addEventListener('keydown', function (e) {
        switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp':
            e.preventDefault();
            if (!isOpen()) {
                openList(true);
            }
            if (!e.altKey) {
                moveActiveOption(e.key === 'ArrowDown' ? 1 : -1);
            }
            break;
        case 'Enter':
            if (isOpen() && activeOption) {
                e.preventDefault();
                selectMap(activeOption.dataset.name);
            }
            break;
        case 'Escape':
            if (isOpen()) {
                e.preventDefault();
                closeList();
                this.select();
            }
            break;
        default:
        }
    });

    // Keep focus in the input while using the mouse in the list
    [toggleButton, listbox, emptyMessage].forEach(element => {
        element.addEventListener('mousedown', e => e.preventDefault());
    });

    toggleButton.addEventListener('click', function () {
        if (isOpen()) {
            closeList();
        } else {
            openList(true);
            input.focus();
            input.select();
        }
    });

    listbox.addEventListener('click', function (e) {
        const option = e.target.closest('[role="option"]');
        if (option) {
            selectMap(option.dataset.name);
        }
    });

    mapSearch.addEventListener('focusout', function (e) {
        if (isOpen() && !this.contains(e.relatedTarget)) {
            closeList();
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

    prevMapButton.addEventListener('click', () => stepMap(-1));
    nextMapButton.addEventListener('click', () => stepMap(1));
})();
