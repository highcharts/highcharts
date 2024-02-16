/* global seatPlan */

const colors = Highcharts.getOptions().colors;
const nullColor = '#ccc';

const selectedListHTML = document.getElementById('selected-list');
const deselect = document.getElementById('deselect');
const selectedList = [];

const rowLabelX = -5;
const chart = Highcharts.mapChart('container', {
    chart: {
        margin: 20
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
                allowOverlap: true
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
            let str = `Seat <b>${this.point.name}</b>`;
            if (this.point.selected) {
                str = str + ' Selected';
            } else {
                str = str + ' Available';
            }
            return str;
        }
    },

    series: [{
        point: {
            events: {
                click: function () {
                    toggleSelection(this.name);
                    this.select(!this.selected, true);
                    this.series.chart.tooltip.refresh(this);
                }
            }
        },
        mapData: seatPlan,
        nullColor,
        borderWidth: 0,
        states: {
            select: {
                color: colors[3]
            }
        },
        // Available seats
        data: [
            ['A1'], ['A2'], ['A4'], ['A5'], ['A7'], ['A8'],
            ['B1'], ['B3'], ['B4'], ['B5'], ['B6'], ['B7'], ['B8'], ['B9'],
            ['C1'], ['C2'], ['C3'], ['C4'], ['C5'], ['C6'],
            ['D1'], ['D2'], ['D4'], ['D5'], ['D6'], ['D7'], ['D8'],
            ['E1'], ['E2'], ['E3'], ['E7'], ['E8'], ['E10'], ['E11'],
            ['F1'], ['F2'], ['F3'], ['F5'], ['F6'], ['F7'], ['F8'], ['F10']
        ],
        dataLabels: {
            enabled: true,
            useHTML: true,
            style: {
                fontSize: '14px'
            },
            formatter: function () {
                const rotations = [18, 14, 8, 5, 0, 0, 0, -5, -8, -14, -18];
                const pointIndex = this.key.substring(1) - 1;
                let posLeft = -10;
                if (pointIndex === 10) {
                    posLeft = -14;
                } else if (pointIndex === 11) {
                    posLeft = -12;
                }

                return '<span style="transform:rotate(' +
                    rotations[pointIndex] + 'deg);position:absolute;left:' +
                    posLeft + 'px">' + this.key + '</span>';
            }
        },
        keys: ['name', 'selected'],
        joinBy: 'name'
    }, {
        // Row & screen labels
        type: 'mappoint',
        marker: {
            enabled: false
        },
        enableMouseTracking: false,
        dataLabels: {
            allowOverlap: true,
            crop: false,
            shape: 'rectangle',
            borderColor: 'transparent',
            borderWidth: 1,
            borderRadius: 5,
            padding: 6,
            style: {
                fontSize: '18px',
                fontWeight: '200',
                textOutline: false
            },
            align: 'center',
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
        chart.series[0].points[0].select(false);
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