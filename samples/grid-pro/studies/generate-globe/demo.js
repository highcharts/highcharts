const groupStageData = [
    // Group A
    {
        country: 'Mexico',
        iso2: 'mx',
        group: 'A',
        wins: 3,
        losses: 0,
        draws: 0,
        points: 9,
        goalDifference: 6
    },
    {
        country: 'South Africa',
        iso2: 'za',
        group: 'A',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: -1
    },
    {
        country: 'Korea Republic',
        iso2: 'kr',
        group: 'A',
        wins: 1,
        losses: 2,
        draws: 0,
        points: 3,
        goalDifference: -1
    },
    {
        country: 'Czechia',
        iso2: 'cz',
        group: 'A',
        wins: 0,
        losses: 2,
        draws: 1,
        points: 1,
        goalDifference: -4
    },

    // Group B
    {
        country: 'Switzerland',
        iso2: 'ch',
        group: 'B',
        wins: 2,
        losses: 0,
        draws: 1,
        points: 7,
        goalDifference: 4
    },
    {
        country: 'Canada',
        iso2: 'ca',
        group: 'B',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: 5
    },
    {
        country: 'Bosnia and Herzegovina',
        iso2: 'ba',
        group: 'B',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: -1
    },
    {
        country: 'Qatar',
        iso2: 'qa',
        group: 'B',
        wins: 0,
        losses: 2,
        draws: 1,
        points: 1,
        goalDifference: -8
    },

    // Group C
    {
        country: 'Brazil',
        iso2: 'br',
        group: 'C',
        wins: 2,
        losses: 0,
        draws: 1,
        points: 7,
        goalDifference: 6
    },
    {
        country: 'Morocco',
        iso2: 'ma',
        group: 'C',
        wins: 2,
        losses: 0,
        draws: 1,
        points: 7,
        goalDifference: 3
    },
    {
        country: 'Scotland',
        iso2: 'gb-sct',
        group: 'C',
        wins: 1,
        losses: 2,
        draws: 0,
        points: 3,
        goalDifference: -3
    },
    {
        country: 'Haiti',
        iso2: 'ht',
        group: 'C',
        wins: 0,
        losses: 3,
        draws: 0,
        points: 0,
        goalDifference: -6
    },

    // Group D
    {
        country: 'United States',
        iso2: 'us',
        group: 'D',
        wins: 2,
        losses: 1,
        draws: 0,
        points: 6,
        goalDifference: 4
    },
    {
        country: 'Australia',
        iso2: 'au',
        group: 'D',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: 0
    },
    {
        country: 'Paraguay',
        iso2: 'py',
        group: 'D',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: -2
    },
    {
        country: 'Türkiye',
        iso2: 'tr',
        group: 'D',
        wins: 1,
        losses: 2,
        draws: 0,
        points: 3,
        goalDifference: -2
    },

    // Group E
    {
        country: 'Germany',
        iso2: 'de',
        group: 'E',
        wins: 2,
        losses: 1,
        draws: 0,
        points: 6,
        goalDifference: 6
    },
    {
        country: 'Côte d\'Ivoire',
        iso2: 'ci',
        group: 'E',
        wins: 2,
        losses: 1,
        draws: 0,
        points: 6,
        goalDifference: 2
    },
    {
        country: 'Ecuador',
        iso2: 'ec',
        group: 'E',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: 0
    },
    {
        country: 'Curaçao',
        iso2: 'cw',
        group: 'E',
        wins: 0,
        losses: 2,
        draws: 1,
        points: 1,
        goalDifference: -8
    },

    // Group F
    {
        country: 'Netherlands',
        iso2: 'nl',
        group: 'F',
        wins: 2,
        losses: 0,
        draws: 1,
        points: 7,
        goalDifference: 6
    },
    {
        country: 'Japan',
        iso2: 'jp',
        group: 'F',
        wins: 1,
        losses: 0,
        draws: 2,
        points: 5,
        goalDifference: 4
    },
    {
        country: 'Sweden',
        iso2: 'se',
        group: 'F',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: 0
    },
    {
        country: 'Tunisia',
        iso2: 'tn',
        group: 'F',
        wins: 0,
        losses: 3,
        draws: 0,
        points: 0,
        goalDifference: -10
    },

    // Group G
    {
        country: 'Belgium',
        iso2: 'be',
        group: 'G',
        wins: 1,
        losses: 0,
        draws: 2,
        points: 5,
        goalDifference: 4
    },
    {
        country: 'Egypt',
        iso2: 'eg',
        group: 'G',
        wins: 1,
        losses: 0,
        draws: 2,
        points: 5,
        goalDifference: 2
    },
    {
        country: 'Iran',
        iso2: 'ir',
        group: 'G',
        wins: 0,
        losses: 0,
        draws: 3,
        points: 3,
        goalDifference: 0
    },
    {
        country: 'New Zealand',
        iso2: 'nz',
        group: 'G',
        wins: 0,
        losses: 2,
        draws: 1,
        points: 1,
        goalDifference: -6
    },

    // Group H
    {
        country: 'Spain',
        iso2: 'es',
        group: 'H',
        wins: 2,
        losses: 0,
        draws: 1,
        points: 7,
        goalDifference: 5
    },
    {
        country: 'Cape Verde',
        iso2: 'cv',
        group: 'H',
        wins: 0,
        losses: 0,
        draws: 3,
        points: 3,
        goalDifference: 0
    },
    {
        country: 'Uruguay',
        iso2: 'uy',
        group: 'H',
        wins: 0,
        losses: 1,
        draws: 2,
        points: 2,
        goalDifference: -1
    },
    {
        country: 'Saudi Arabia',
        iso2: 'sa',
        group: 'H',
        wins: 0,
        losses: 1,
        draws: 2,
        points: 2,
        goalDifference: -4
    },

    // Group I
    {
        country: 'France',
        iso2: 'fr',
        group: 'I',
        wins: 3,
        losses: 0,
        draws: 0,
        points: 9,
        goalDifference: 8
    },
    {
        country: 'Norway',
        iso2: 'no',
        group: 'I',
        wins: 2,
        losses: 1,
        draws: 0,
        points: 6,
        goalDifference: 1
    },
    {
        country: 'Senegal',
        iso2: 'sn',
        group: 'I',
        wins: 1,
        losses: 2,
        draws: 0,
        points: 3,
        goalDifference: 2
    },
    {
        country: 'Iraq',
        iso2: 'iq',
        group: 'I',
        wins: 0,
        losses: 3,
        draws: 0,
        points: 0,
        goalDifference: -11
    },

    // Group J
    {
        country: 'Argentina',
        iso2: 'ar',
        group: 'J',
        wins: 3,
        losses: 0,
        draws: 0,
        points: 9,
        goalDifference: 7
    },
    {
        country: 'Austria',
        iso2: 'at',
        group: 'J',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: 0
    },
    {
        country: 'Algeria',
        iso2: 'dz',
        group: 'J',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: -2
    },
    {
        country: 'Jordan',
        iso2: 'jo',
        group: 'J',
        wins: 0,
        losses: 3,
        draws: 0,
        points: 0,
        goalDifference: -5
    },

    // Group K
    {
        country: 'Colombia',
        iso2: 'co',
        group: 'K',
        wins: 2,
        losses: 0,
        draws: 1,
        points: 7,
        goalDifference: 3
    },
    {
        country: 'Portugal',
        iso2: 'pt',
        group: 'K',
        wins: 1,
        losses: 0,
        draws: 2,
        points: 5,
        goalDifference: 5
    },
    {
        country: 'DR Congo',
        iso2: 'cd',
        group: 'K',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: 1
    },
    {
        country: 'Uzbekistan',
        iso2: 'uz',
        group: 'K',
        wins: 0,
        losses: 3,
        draws: 0,
        points: 0,
        goalDifference: -9
    },

    // Group L
    {
        country: 'England',
        iso2: 'gb',
        group: 'L',
        wins: 2,
        losses: 0,
        draws: 1,
        points: 7,
        goalDifference: 4
    },
    {
        country: 'Croatia',
        iso2: 'hr',
        group: 'L',
        wins: 2,
        losses: 1,
        draws: 0,
        points: 6,
        goalDifference: 0
    },
    {
        country: 'Ghana',
        iso2: 'gh',
        group: 'L',
        wins: 1,
        losses: 1,
        draws: 1,
        points: 4,
        goalDifference: 0
    },
    {
        country: 'Panama',
        iso2: 'pa',
        group: 'L',
        wins: 0,
        losses: 3,
        draws: 0,
        points: 0,
        goalDifference: -4
    }
];

const columnsForGroup = group => {
    const rows = groupStageData.filter(team => team.group === group);
    return {
        Country: rows.map(r => r.country),
        Wins: rows.map(r => r.wins),
        Draws: rows.map(r => r.draws),
        Losses: rows.map(r => r.losses),
        Points: rows.map(r => r.points),
        GoalDifference: rows.map(r => r.goalDifference)
    };
};


const GROUP_STAGE_COLOR = 'light-dark(#c9ced6, #667080)';
const NON_GROUP_STAGE_COLOR = 'light-dark(#f7f8fa, #242830)';
const SELECTED_GROUP_COLOR = '#0400ff';

const defaultGroup = 'A';
const groups = [...new Set(groupStageData.map(team => team.group))];
const groupSelect = document.getElementById('group-select');
let mapChart;
let isMoving = false;

const dataTable = new Grid.DataTable({
    columns: columnsForGroup(defaultGroup)
});

if (groupSelect) {
    groups.forEach(group => {
        const option = document.createElement('option');
        option.textContent = `Group ${group}`;
        option.value = group;
        groupSelect.appendChild(option);
    });
    groupSelect.value = defaultGroup;
    groupSelect.addEventListener('change', function () {
        selectGroup(this.value);
    });
}

function mapData(group) {
    return groupStageData
        .map(team => ({
            'hc-key': team.iso2,
            color: team.group === group ?
                SELECTED_GROUP_COLOR : GROUP_STAGE_COLOR,
            custom: {
                country: team.country,
                group: team.group
            },
            value: team.group === group ? 2 : 1
        }));
}

function subtitleFor(group) {
    return `Countries in group ${group} are highlighted`;
}

// --- Helpers used to rotate the globe to a clicked country's centroid ---

function getTeamFromPoint(point) {
    const key = point['hc-key'];
    return groupStageData.find(team =>
        team.iso2 === key
    );
}
function moveTo(center) {
    if (
        !center ||
        !Highcharts.isNumber(center.lon) ||
        !Highcharts.isNumber(center.lat)
    ) {
        return;
    }

    const mapView = mapChart.mapView;
    const from = mapView.projection.options.rotation || [0, 0];
    const to = [-center.lon, -center.lat];
    const distance = Highcharts.Projection.distance(from, to);
    const rotations = Highcharts.Projection.geodesic(
        from,
        to,
        true,
        Math.max(distance / 60, 500000)
    );

    Highcharts.stop(mapChart.renderer.boxWrapper, 'animator');
    mapChart.renderer.boxWrapper.attr({ animator: 0 });
    isMoving = true;

    Highcharts.animate(
        mapChart.renderer.boxWrapper,
        { animator: rotations.length - 1 },
        {
            duration: 750,
            easing: 'easeInOutSine',
            step: now => {
                const rotation = rotations[Math.round(now)];
                console.log('moveTo step', now, rotation);

                mapView.update({
                    projection: {
                        name: 'Orthographic',
                        rotation
                    }
                }, false);

                // Keep the projected globe origin centered after pointer
                // rotation has changed the map view's internal center.
                mapView.setView(
                    mapView.projection.inverse([0, 0]),
                    mapView.zoom,
                    true,
                    false
                );
            },
            complete: () => {
                isMoving = false;
            }
        }
    );
}

function updateMapGroup(group, center) {
    if (!mapChart) {
        return;
    }
    mapChart.pointer.reset(false, 0);

    const groupsSeries = mapChart.get('groups');
    if (groupsSeries) {
        groupsSeries.points.forEach(point => {
            const team = getTeamFromPoint(point);
            if (!team) {
                return;
            }

            const isSelected = team.group === group;
            point.update({
                value: isSelected ? 2 : 1,
                color: isSelected ? SELECTED_GROUP_COLOR : GROUP_STAGE_COLOR
            }, false);
        });
    }

    mapChart.update({
        subtitle: { text: subtitleFor(group) }
    }, false);

    if (center) {
        moveTo(center);
    }   else {
        mapChart.redraw();
    }
}
// --- Grid ---

const groupGrid = Grid.grid('grid', {
    data: {
        dataTable
    },
    columnDefaults: {
        cells: {
            events: {
                click: function () {
                    const country = this.row.data.Country;
                    const team = groupStageData.find(
                        team => team.country === country
                    );
                    const point = mapChart
                        .get('groups')
                        .points
                        .find(point => getTeamFromPoint(point) === team);

                    moveTo({
                        lon: point.properties['hc-middle-lon'],
                        lat: point.properties['hc-middle-lat']
                    });
                }
            }
        }
    }
});


async function selectGroup(group, center) {
    if (groupSelect) {
        groupSelect.value = group;
    }

    updateMapGroup(group, center);
    const data = columnsForGroup(group);
    for (let i = 0, iEnd = dataTable.getRowCount(); i < iEnd; i++) {
        dataTable.setCell(
            'Country',
            i,
            data.Country[i]
        );
        dataTable.setCell(
            'Wins',
            i,
            data.Wins[i]
        );
        dataTable.setCell(
            'Draws',
            i,
            data.Draws[i]
        );
        dataTable.setCell(
            'Losses',
            i,
            data.Losses[i]
        );
        dataTable.setCell(
            'Points',
            i,
            data.Points[i]
        );
        dataTable.setCell(
            'GoalDifference',
            i,
            data.GoalDifference[i]
        );
        const row = groupGrid?.viewport.getRow(i);
        await groupGrid.querying.proceed(true);
        for (const column of groupGrid.viewport.columns) {
            column.loadData();
        }
        row.loadData();
        row.cells.forEach(cell => {
            // `cell.setValue()` without arguments will refresh the cell with
            // the current value from the data table.
            cell.setValue();
        });
    }
}

const getGraticule = () => {
    const data = [];

    // Meridians
    for (let x = -180; x <= 180; x += 15) {
        data.push({
            geometry: {
                type: 'LineString',
                coordinates: x % 90 === 0 ? [
                    [x, -90],
                    [x, 0],
                    [x, 90]
                ] : [
                    [x, -80],
                    [x, 80]
                ]
            }
        });
    }

    // Latitudes
    for (let y = -90; y <= 90; y += 10) {
        const coordinates = [];
        for (let x = -180; x <= 180; x += 5) {
            coordinates.push([x, y]);
        }
        data.push({
            geometry: {
                type: 'LineString',
                coordinates
            }
        });
    }

    return data;
};

// --- Map ---

(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    mapChart = Highcharts.mapChart('map', {
        chart: {
            map: topology
        },
        title: {
            text: 'FIFA World Cup 2026 Group Stage'
        },
        subtitle: {
            text: subtitleFor(defaultGroup)
        },
        legend: {
            enabled: false
        },
        mapNavigation: {
            enabled: true,
            enableDoubleClickZoomTo: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },
        mapView: {
            maxZoom: 30,
            projection: {
                name: 'Orthographic',
                rotation: [60, -30]
            }
        },
        plotOptions: {
            series: {
                animation: {
                    duration: 750
                },
                clip: false
            }
        },
        accessibility: {
            typeDescription: 'Map of World.',
            point: {
                describeNull: false
            }
        },
        series: [{
            name: 'Group stage teams',
            id: 'groups',
            zIndex: 2,
            data: mapData(defaultGroup),
            nullColor: NON_GROUP_STAGE_COLOR,
            color: SELECTED_GROUP_COLOR,
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return this.point.value === 2 ? this.point.name : '';
                }
            },
            tooltip: {
                headerFormat: '',
                pointFormatter: function () {
                    const team = getTeamFromPoint(this);

                    return team ?
                        `${team.country}<br>Group ${team.group}` :
                        this.name;
                }
            },
            point: {
                events: {
                    click: function () {
                        const team = getTeamFromPoint(this);
                        if (team) {
                            selectGroup(team.group, {
                                lon: this.properties['hc-middle-lon'],
                                lat: this.properties['hc-middle-lat']
                            });
                        }
                    }
                }
            }
        }, {
            type: 'mapline',
            name: 'Graticule',
            id: 'graticule',
            zIndex: 1,
            showInLegend: false,
            enableMouseTracking: false,
            data: getGraticule(),
            lineWidth: 0,
            accessibility: {
                enabled: false
            }
        }]
    });

    // Render a circle filled with a radial gradient behind the globe to
    // make it appear as the sea around the continents.
    const renderSea = () => {
        let verb = isMoving ? 'attr' : 'animate';
        if (!mapChart.sea) {
            mapChart.sea = mapChart.renderer
                .circle()
                .attr({
                    fill: {
                        radialGradient: {
                            cx: 0.4,
                            cy: 0.4,
                            r: 1
                        },
                        stops: [
                            [0, 'light-dark(white, #258)'],
                            [1, 'light-dark(lightblue, #446)']
                        ]
                    },
                    zIndex: -1
                })
                .add(mapChart.get('graticule').group);
            verb = 'attr';
        }

        const bounds = mapChart.get('graticule').bounds,
            p1 = mapChart.mapView.projectedUnitsToPixels({
                x: bounds.x1,
                y: bounds.y1
            }),
            p2 = mapChart.mapView.projectedUnitsToPixels({
                x: bounds.x2,
                y: bounds.y2
            });
        mapChart.sea[verb]({
            cx: (p1.x + p2.x) / 2,
            cy: (p1.y + p2.y) / 2,
            r: Math.min(p2.x - p1.x, p1.y - p2.y) / 2
        });
    };

    renderSea();
    Highcharts.addEvent(mapChart, 'redraw', renderSea);
})();
