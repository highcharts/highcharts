/**
 * This is a complicated demo of Highcharts Maps, not intended to get you up to
 * speed quickly, but to show off some basic maps and features in one single
 * place. For the basic demo, check out
 * https://www.highcharts.com/demo/maps/tooltip instead.
 *
 */

// Background of the dark mode. The other palette colors are blended from it,
// and the demo CSS uses them through the CSS variables.
Highcharts.setOptions({
    palette: {
        dark: {
            backgroundColor: '#1e1e1e'
        }
    }
});

// Get all HTML elements
const mapSearch = document.getElementById('map-search'),
    input = document.getElementById('map-search-input'),
    toggleButton = document.getElementById('map-search-toggle'),
    listbox = document.getElementById('map-listbox'),
    thumbnailBox = document.getElementById('map-thumbnails'),
    emptyMessage = document.getElementById('map-search-empty'),
    searchStatus = document.getElementById('map-search-status'),
    prevMapButton = document.getElementById('prev-map-btn'),
    nextMapButton = document.getElementById('next-map-btn'),
    dataLabelsCheckbox = document.getElementById('datalabels-checkbox'),
    viewAs = document.getElementById('view-as'),
    viewAsButton = document.getElementById('view-as-button'),
    viewAsMenu = document.getElementById('view-as-menu'),
    cleanDemoLink = document.getElementById('clean-demo-link'),
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
        name: 'World, medium resolution',
        // Crops the small islands at the far left and right
        thumbnailZoom: 0.3
    }, {
        label: 'Europe',
        name: 'Europe'
    }, {
        label: 'United States of America',
        name: 'United States of America'
    }, {
        label: 'European Union (2020)',
        name: 'European Union (2020)'
    }];

// Demo data: a percentage per area, scaled down to stay within 100%
function getData(mapData) {
    const geometries = mapData.objects.default.geometries,
        step = Math.min(1, 100 / Math.max(geometries.length - 1, 1));

    return geometries.map((g, i) => ({
        key: g.properties['hc-key'],
        drilldown: g.properties['hc-key'],
        value: Math.round(i * step * 10) / 10
    }));
}

// From 0 to a round tick above the highest value, with some space at the
// ends to keep the tick dots inside the gradient
function getColorAxisRange(data) {
    // The values grow, so the last one is the highest
    const maxValue = data[data.length - 1].value,
        tickInterval = Highcharts.normalizeTickInterval(
            Math.max(maxValue, 1) / 5,
            void 0,
            void 0,
            false
        ),
        lastTick = Math.max(Math.ceil(maxValue / tickInterval), 1) *
            tickInterval,
        padding = lastTick * 0.03;

    return {
        min: -padding,
        max: lastTick + padding,
        tickInterval
    };
}

// recommendMapView keeps the padding of the previous map when the new map has
// none
function resetMapPadding(chart) {
    chart.mapView.update({ padding: 0 }, false);
}

// Without animation, so that the old tick dots don't fly out of the legend
function updateColorAxis(chart, data) {
    chart.colorAxis[0].update(getColorAxisRange(data), false);
    chart.redraw(false);
}

let currentMapName,
    // All maps, or the suggested maps when picked from that group
    mapOrder = mapNames,
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
            if (suggested) {
                option.dataset.suggested = 'true';
            }
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

const indexGroups = [];

for (const [groupName, maps] of Object.entries(Highcharts.mapDataIndex)) {
    if (groupName !== 'version') {
        const groupMaps = [];
        for (const [indexName, path] of Object.entries(maps)) {
            // Remove unwanted text from the display name
            const name = indexName.replace(', Miller projection', '');
            if (!mapsToSkip.test(name)) {
                allMaps[name] = path;
                mapNames.push(name);
                groupMaps.push({ label: name, name });
            }
        }
        indexGroups.push([groupNames[groupName] || groupName, groupMaps]);
    }
}

// Leave out suggested maps that are missing from the map index
const availableSuggestedMaps = suggestedMaps.filter(map => allMaps[map.name]),
    suggestedNames = availableSuggestedMaps.map(map => map.name);

addListGroup('Suggested', availableSuggestedMaps, true);
indexGroups.forEach(([label, maps]) => addListGroup(label, maps));

input.placeholder = `Search ${mapNames.length} maps`;

// Thumbnails of the first suggested maps, as quick picks. Each one is a small
// static map chart.
const thumbnails = availableSuggestedMaps.slice(0, 3).map(map => {
    const button = document.createElement('button'),
        preview = document.createElement('span'),
        label = document.createElement('span'),
        mapKey = allMaps[map.name].slice(0, -3);

    preview.className = 'map-thumbnail-chart';
    preview.setAttribute('aria-hidden', 'true');
    label.textContent = map.label;

    button.type = 'button';
    button.className = 'map-thumbnail';
    button.dataset.name = map.name;
    button.append(preview, label);
    thumbnailBox.append(button);

    fetch(`${baseMapPath}${mapKey}.topo.json`)
        .then(response => response.json())
        .then(mapData => Highcharts.mapChart(preview, {
            accessibility: {
                enabled: false
            },
            chart: {
                animation: false,
                backgroundColor: 'transparent',
                spacing: [0, 0, 0, 0],
                events: {
                    load() {
                        if (map.thumbnailZoom) {
                            this.mapView.zoomBy(map.thumbnailZoom);
                        }
                    }
                }
            },
            colorAxis: {
                minColor: 'var(--map-thumbnail-min-color)',
                maxColor: 'var(--map-thumbnail-max-color)',
                min: 0,
                // End at the highest value, so that every map uses the full
                // color range
                endOnTick: false
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            series: [{
                data: getData(mapData),
                mapData,
                joinBy: ['hc-key', 'key'],
                borderColor: 'var(--map-border-color)',
                borderWidth: 0.2,
                enableMouseTracking: false
            }],
            title: {
                text: null
            },
            tooltip: {
                enabled: false
            }
        }))
        .catch(e => console.log('Error', e));

    return button;
});

// Helper functions
function setAttributes(el, attrs) {
    for (const key in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, key)) {
            el.setAttribute(key, attrs[key]);
        }
    }
}

function fillInfo(mapName, mapKey, order = mapNames) {
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

    setAttributes(cleanDemoLink, {
        href: `https://jsfiddle.net/gh/get/jquery/1.11.0/highcharts/highcharts/tree/master/samples/mapdata/${mapKey}`
    });

    // The search field shows the name of the current map
    currentMapName = mapName;
    mapOrder = order;
    input.value = mapName;
    input.setSelectionRange(0, 0);
    input.scrollLeft = 0;

    // Mark the current map in the group that the order comes from
    listGroups.forEach(group => group.options.forEach(option => {
        option.classList.toggle(
            'current',
            option.dataset.name === mapName &&
                !!option.dataset.suggested === (order === suggestedNames)
        );
    }));
    thumbnails.forEach(thumbnail => {
        if (thumbnail.dataset.name === mapName) {
            thumbnail.setAttribute('aria-current', 'true');
        } else {
            thumbnail.removeAttribute('aria-current');
        }
    });
}

// Bottom of the visible area: the window, or a parent that cuts off content
function getVisibleBottom(element) {
    let bottom = window.innerHeight;
    let parent = element.parentElement;
    while (parent) {
        if (getComputedStyle(parent).overflowY !== 'visible') {
            bottom = Math.min(bottom, parent.getBoundingClientRect().bottom);
        }
        parent = parent.parentElement;
    }
    return bottom;
}

// "View demo as" menu button
const menuItems = [...viewAsMenu.querySelectorAll('[role="menuitem"]')];

function openMenu(focusLast) {
    viewAsMenu.hidden = false;
    viewAsButton.setAttribute('aria-expanded', 'true');

    // Open upwards only when there is no room below and more room above
    const bottom = getVisibleBottom(viewAs),
        button = viewAsButton.getBoundingClientRect();

    viewAs.classList.remove('open-up');
    if (
        viewAsMenu.getBoundingClientRect().bottom > bottom &&
        button.top > bottom - button.bottom
    ) {
        viewAs.classList.add('open-up');
    }

    menuItems[focusLast ? menuItems.length - 1 : 0].focus();
}

function closeMenu(focusButton) {
    viewAsMenu.hidden = true;
    viewAsButton.setAttribute('aria-expanded', 'false');
    if (focusButton) {
        viewAsButton.focus();
    }
}

viewAsButton.addEventListener('click', () => {
    if (viewAsMenu.hidden) {
        openMenu();
    } else {
        closeMenu();
    }
});

viewAsButton.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        openMenu(e.key === 'ArrowUp');
    }
});

viewAsMenu.addEventListener('keydown', e => {
    const index = menuItems.indexOf(document.activeElement),
        count = menuItems.length,
        focusItem = i => menuItems[(i + count) % count].focus();

    switch (e.key) {
    case 'ArrowDown':
        e.preventDefault();
        focusItem(index + 1);
        break;
    case 'ArrowUp':
        e.preventDefault();
        focusItem(index - 1);
        break;
    case 'Home':
        e.preventDefault();
        focusItem(0);
        break;
    case 'End':
        e.preventDefault();
        focusItem(count - 1);
        break;
    case 'Escape':
        e.preventDefault();
        closeMenu(true);
        break;
    case 'Tab':
        closeMenu();
        break;
    default:
    }
});

// Close the menu after following a link or when clicking outside it
viewAsMenu.addEventListener('click', e => {
    if (e.target.closest('[role="menuitem"]')) {
        closeMenu();
    }
});

document.addEventListener('pointerdown', e => {
    if (!viewAsMenu.hidden && !viewAs.contains(e.target)) {
        closeMenu();
    }
});

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

function getCurrentOption() {
    return getVisibleOptions().find(
        option => option.classList.contains('current')
    );
}

function openList(showAll) {
    if (showAll) {
        filterOptions('');
    }

    // Fit the list in the visible area
    listbox.style.maxHeight = Math.max(
        120,
        Math.min(
            320,
            getVisibleBottom(listbox) - listbox.getBoundingClientRect().top - 8
        )
    ) + 'px';

    if (showAll) {
        // Show the current map in the middle of the list
        const current = getCurrentOption();
        listbox.scrollTop = current ?
            current.offsetTop -
                (listbox.clientHeight - current.offsetHeight) / 2 :
            0;
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
    input.setSelectionRange(0, 0);
    input.scrollLeft = 0;
}

function moveActiveOption(step) {
    const options = getVisibleOptions(),
        // Without an active option, step from the current map
        index = options.indexOf(activeOption || getCurrentOption());

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

    const initialOrder = suggestedNames.includes(initialMapName) ?
        suggestedNames :
        mapNames;

    fillInfo(initialMapName, initialMapKey, initialOrder);

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

            const data = getData(topology);

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
            resetMapPadding(chart);
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

            // Update the color axis and credits in afterDrilldown. The
            // chart is not ready yet.
        }
    };

    // On drill up, reset to the top-level map view
    const afterDrillUp = function (e) {
        // Before the recommended map view is applied
        resetMapPadding(this);

        const {
            mapName,
            mapKey,
            suggested
        } = e.seriesOptions.custom;
        if (mapName && mapKey) {
            fillInfo(mapName, mapKey, suggested ? suggestedNames : mapNames);
        }
        // The drilled series is still in the chart
        updateColorAxis(this, e.seriesOptions.data);
        this.credits.update();
    };

    const data = getData(mapData);

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
                    updateColorAxis(this, this.series[0].options.data);
                    this.credits.update();
                }
            }
        },

        colorAxis: {
            stops: [
                [0, 'var(--map-min-color)'],
                [0.5, 'var(--map-mid-color)'],
                [1, 'var(--map-max-color)']
            ],
            // The grid lines are drawn as a dot on each tick, with the CSS
            // in demo.css
            gridLineColor: '#ffffff',
            gridLineWidth: 5,
            gridLineDashStyle: '0, 100',
            width: 11,
            height: '50%',
            ...getColorAxisRange(data),
            startOnTick: false,
            endOnTick: false,
            labels: {
                format: '{value}%',
                style: {
                    fontSize: '0.75rem'
                }
            }
        },

        drilldown: {
            activeDataLabelStyle: {
                color: 'contrast',
                fontWeight: 'normal',
                textDecoration: 'none'
            }
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                alignTo: 'spacingBox',
                width: 12,
                height: 12,
                padding: 8,
                style: {
                    color: 'var(--highcharts-neutral-color-80)'
                },
                // The outline of both buttons is drawn in demo.css
                theme: {
                    r: 8,
                    'stroke-width': 0
                }
            }
        },

        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'bottom',
            backgroundColor: 'var(--highcharts-background-color)',
            borderColor: 'var(--demo-border-color)',
            borderWidth: 1,
            borderRadius: 10,
            padding: 12,
            // Rounded ends of the color axis gradient
            symbolRadius: 5.5
        },

        plotOptions: {
            map: {
                borderColor: 'var(--map-border-color)',
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
                mapKey: initialMapKey,
                suggested: initialOrder === suggestedNames
            }
        }],

        title: {
            text: null
        },

        tooltip: {
            valueSuffix: '%'
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
                        layout: 'horizontal',
                        width: '50%',
                        height: 11
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

    async function updateChart(mapName, order) {
        const mapKey = allMaps[mapName].slice(0, -3),
            request = ++updateRequest;

        chart.showLoading('Loading...');

        fillInfo(mapName, mapKey, order);

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

        const data = getData(mapData);

        // Before the series is replaced, as recommendMapView redraws with
        // animation, which would move the new map in from the old view
        resetMapPadding(chart);
        chart.mapView.recommendMapView(chart, [mapData], true);

        // Series.update would merge the new map data into the old
        chart.series[0].remove(false);
        chart.addSeries({
            mapData,
            data,
            joinBy: ['hc-key', 'key'],
            name: mapName,
            animation: false,
            dataLabels: {
                formatter
            },
            custom: {
                mapName,
                mapKey,
                // Used to restore the order after drilling up
                suggested: order === suggestedNames
            }
        }, false);
        chart.colorAxis[0].update(getColorAxisRange(data), false);

        // The whole new map, also after zooming in on the previous one
        chart.mapView.fitToBounds(void 0, void 0, true, false);

        chart.hideLoading();
        chart.credits.update();
    }

    function selectMap(mapName, order) {
        closeList();

        // Load the map directly. Drilldown, with its breadcrumbs, is only used
        // when clicking an area on the map.
        if (allMaps[mapName] && mapName !== currentMapName) {
            resetDrilldown(chart);
            updateChart(mapName, order);
        } else if (mapName === currentMapName && order !== mapOrder) {
            // Same map from the other group, only the order changes
            fillInfo(mapName, allMaps[mapName].slice(0, -3), order);
        }
    }

    function getOrder(option) {
        return option.dataset.suggested ? suggestedNames : mapNames;
    }

    // Switch to the previous or next map in the current order
    function stepMap(step) {
        const index = mapOrder.indexOf(currentMapName),
            count = mapOrder.length;

        resetDrilldown(chart);
        updateChart(mapOrder[
            index < 0 ?
                (step > 0 ? 0 : count - 1) :
                (index + step + count) % count
        ], mapOrder);
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

        // Pressing Enter picks the best match: the exact name, a name that
        // starts with the query, or the first match
        const query = this.value.trim().toLowerCase();
        if (query) {
            const options = getVisibleOptions(),
                text = option => option.textContent.toLowerCase();

            setActiveOption(
                options.find(option => text(option) === query) ||
                options.find(option => text(option).startsWith(query)) ||
                options[0]
            );
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
                selectMap(
                    activeOption.dataset.name,
                    getOrder(activeOption)
                );
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
            selectMap(option.dataset.name, getOrder(option));
        }
    });

    thumbnailBox.addEventListener('click', function (e) {
        const thumbnail = e.target.closest('.map-thumbnail');
        if (thumbnail) {
            // The quick picks are suggested maps
            selectMap(thumbnail.dataset.name, suggestedNames);
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
