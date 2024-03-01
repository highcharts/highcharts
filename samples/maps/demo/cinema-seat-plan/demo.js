const colors = Highcharts.getOptions().colors,
    seatPlan = JSON.parse(document.getElementById('data').innerHTML),
    selectedListHTML = document.getElementById('selected-list'),
    deselect = document.getElementById('deselect'),
    selectedList = [],
    rowLabelX = -5;

const chart = Highcharts.mapChart('container', {
    chart: {
        margin: 20
    },
    accessibility: {
        typeDescription: 'Map of cinema seat plan.',
        point: {
            descriptionFormat: 'Seat {name}, {#if isNull}Unavailable{else}' +
                '{#if selected}Selected{else}Available{/if}{/if}'
        }
    },
    title: {
        text: 'Cinema seat plan',
        x: 10
    },
    subtitle: {
        text: 'Click to select',
        x: 10
    },
    legend: {
        enabled: false
    },
    mapNavigation: {
        enabled: false
    },
    mapView: {
        padding: 10,
        fitToGeometry: {
            type: 'Polygon',
            coordinates: [
                [
                    [-10, -20],
                    [325, 170]
                ]
            ]
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                allowOverlap: true,
                style: {
                    fontSize: '14px'
                }
            },
            states: {
                inactive: {
                    enabled: false
                }
            }
        }
    },
    tooltip: {
        outside: true,
        format: 'Seat <b>{point.name}</b> {#if point.selected}Selected{else}' +
            'Available{/if}'
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 450
            },
            chartOptions: {
                series: [{
                    id: 'seats',
                    dataLabels: {
                        style: {
                            fontSize: '9px'
                        }
                    }
                }, {}]
            }
        }]
    },
    series: [{
        id: 'seats',
        point: {
            events: {
                click: function () {
                    toggleSelection(this.name);
                    // Update to trigger the accessibility module
                    this.update({ selected: !this.selected });
                    this.select(this.selected, true);
                    // Refresh to update the selection state
                    this.series.chart.tooltip.refresh(this);
                }
            }
        },
        mapData: seatPlan,
        nullColor: '#ccc',
        borderWidth: 0,
        states: {
            select: {
                color: colors[3]
            }
        },
        // Seats (null values are for taken seats, undefined for available ones)
        keys: ['name', 'dataLabels.rotation', 'value'],
        data: [
            ['A1', 18, null],
            ['A2', 14, null],
            ['A3', 8],
            ['A4', 5],
            ['A5', 0],
            ['A6', 0],
            ['A7', 0],
            ['A8', -5],
            ['A9', -8],
            ['A10', -14],
            ['A11', -18, null],
            ['B1', 18, null],
            ['B2', 14],
            ['B3', 8, null],
            ['B4', 5, null],
            ['B5', 0],
            ['B6', 0],
            ['B7', 0],
            ['B8', -5],
            ['B9', -8],
            ['B10', -14],
            ['B11', -18],
            ['C1', 18],
            ['C2', 14],
            ['C3', 8],
            ['C4', 5],
            ['C5', 0, null],
            ['C6', 0, null],
            ['C7', 0],
            ['C8', -5],
            ['C9', -8],
            ['C10', -14],
            ['C11', -18],
            ['D1', 18],
            ['D2', 14],
            ['D3', 8],
            ['D4', 5],
            ['D5', 0],
            ['D6', 0],
            ['D7', 0, null],
            ['D8', -5, null],
            ['D9', -8],
            ['D10', -14],
            ['D11', -18],
            ['E1', 18],
            ['E2', 14],
            ['E3', 8],
            ['E4', 5],
            ['E5', 0],
            ['E6', 0],
            ['E7', 0],
            ['E8', -5],
            ['E9', -8, null],
            ['E10', -14, null],
            ['E11', -18],
            ['F1', 18],
            ['F2', 14],
            ['F3', 8, null],
            ['F4', 5, null],
            ['F5', 0, null],
            ['F6', 0],
            ['F7', 0],
            ['F8', -5],
            ['F9', -8],
            ['F10', -14, null],
            ['F11', -18, null]
        ],
        joinBy: 'name'
    }, {
        // Row & screen labels
        type: 'mappoint',
        marker: {
            enabled: false
        },
        enableMouseTracking: false,
        accessibility: {
            enabled: false
        },
        dataLabels: {
            crop: false,
            style: {
                fontSize: '18px',
                fontWeight: '200'
            },
            verticalAlign: 'middle'
        },
        keys: ['x', 'y', 'name'],
        data: [
            [rowLabelX, 10, 'A'],
            [rowLabelX, 35, 'B'],
            [rowLabelX, 60, 'C'],
            [rowLabelX, 85, 'D'],
            [rowLabelX, 110, 'E'],
            [rowLabelX, 135, 'F'],
            [162.5, -5, 'STAGE']
        ]
    }]
});

function toggleSelection(seat) {
    // Update the list
    if (typeof seat !== 'string') {
        // Clear selection
        selectedList.length = 0;
        // Update to trigger the accessibility module
        chart.getSelectedPoints().forEach(point => {
            point.update({ selected: false }, false);
        });
        chart.series[0].points[0].select(false);
        chart.redraw();
    } else {
        const seatIndex = selectedList.indexOf(seat);
        if (seatIndex < 0) {
            // Add
            selectedList.push(seat);
        } else {
            // Remove
            selectedList.splice(seatIndex, 1);
        }
    }

    deselect.disabled = !selectedList.length;
    selectedListHTML.innerHTML = selectedList.sort().join(', ') || 'None';
}
deselect.onclick = toggleSelection;