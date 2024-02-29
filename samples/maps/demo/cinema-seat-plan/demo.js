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
        formatter: function () {
            return `Seat <b>${this.point.name}</b> ` +
                (this.point.selected ? 'Selected' : 'Available');
        }
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
        // Seats
        data: (function () {
            const rot = [18, 14, 8, 5, 0, 0, 0, -5, -8, -14, -18],
                taken = [
                    '11000000001', // A1-A11
                    '10110000000',
                    '00001100000',
                    '00000011000',
                    '00000000110',
                    '00111000011'
                ].join('');

            return new Array(66).fill(1).map((seat, i) => [
                String.fromCharCode(65 + Math.floor(i / 11)) + (i % 11 + 1),
                +taken[i] ? null : void 0,
                rot[i % 11]
            ]);
        }()),
        keys: ['name', 'value', 'dataLabels.rotation'],
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