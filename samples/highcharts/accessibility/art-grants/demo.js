
// Workaround to modify the data table.
// The default format is a bit messy for this dataset.
Highcharts.Chart.prototype.callbacks.push(function (chart) {
    // We wrap the specific instance after the chart has been created to make
    // sure we don't interfere with the table mutation of the accessibility
    // module.
    Highcharts.wrap(chart, 'viewData', function (proceed) {
        if (this.dataTableDiv) {
            return;
        }

        proceed.apply(this); // Run original method

        var tableDiv = document.getElementById('highcharts-data-table-' + this.index),
            thead = tableDiv.getElementsByTagName('thead')[0],
            tbody = tableDiv.getElementsByTagName('tbody')[0],
            first = [],
            second = [],
            third = [],
            fourth = [];

        // Remove first column from head
        Highcharts.each(thead.children, function (row) {
            row.deleteCell(0);
        });

        Highcharts.each(tbody.children, function (row) {
            // Remove first column from body
            row.deleteCell(0);

            // Split rows into columns
            if (row.firstChild.innerHTML.length) {
                first.push([row.firstChild.innerHTML, row.children[1].innerHTML]);
            } else if (row.children[2] && row.children[2].innerHTML.length) {
                second.push([row.children[2].innerHTML, row.children[3].innerHTML]);
            } else if (row.children[4] && row.children[4].innerHTML.length) {
                third.push([row.children[4].innerHTML, row.children[5].innerHTML]);
            } else if (row.children[6] && row.children[6].innerHTML.length) {
                fourth.push([row.children[6].innerHTML, row.children[7].innerHTML]);
            }
        });

        // Remove existing table body
        tbody.innerHTML = '';

        for (var i = 0; i < Math.max(
            first.length, second.length, third.length, fourth.length
        ); ++i) {
            tbody.insertAdjacentHTML('beforeend',
                '<tr>' +
                (first[i] ?
                    '<td>' + first[i][0] + '</td>' +
                    '<td class="number">' + first[i][1] + '</td>' :
                    '<td></td><td></td>'
                ) +
                (second[i] ?
                    '<td>' + second[i][0] + '</td>' +
                    '<td class="number">' + second[i][1] + '</td>' :
                    '<td></td><td></td>'
                ) +
                (third[i] ?
                    '<td>' + third[i][0] + '</td>' +
                    '<td class="number">' + third[i][1] + '</td>' :
                    '<td></td><td></td>'
                ) +
                (fourth[i] ?
                    '<td>' + fourth[i][0] + '</td>' +
                    '<td class="number">' + fourth[i][1] + '</td>' :
                    '<td></td><td></td>'
                ) +
                '</tr>'
            );
        }
    });

    // Remove click events on container to avoid having "clickable" announced by AT
    // These events are needed for custom click events, drag to zoom, and navigator
    // support.
    chart.container.onmousedown = null;
    chart.container.onclick = null;
});


// Function to run on series show/hide to update the pointStart settings of
// all series. We do this to avoid gaps on the xAxis when hiding series.
function updatePointStart() {
    var allSeries = this.chart.series;
    Highcharts.each(allSeries, function (series) {
        var i = series.index,
            pointStart = 0;
        if (series.type === 'column') {
            while (i--) {
                if (allSeries[i].visible && allSeries[i].type === 'column') {
                    pointStart += allSeries[i].points.length + 1;
                }
            }
        } else {
            pointStart = allSeries[i - 1].options.pointStart;
        }
        series.update({
            pointStart: pointStart
        });
    });
}

function dollarFormat(x) {
    return '$' + Highcharts.numberFormat(x, -1);
}

var colors = Highcharts.getOptions().colors;

Highcharts.setOptions({
    lang: {
        thousandsSep: ','
    }
});

Highcharts.chart('container', {
    chart: {
        type: 'column',
        description: 'Chart displaying art grants in 2016, grouped by grant category. ' +
        'Cultural Center grants have significantly higher individual grant amounts than the other categories. ' +
        'The largest grant amount went to SOMArts Cultural Centers, and was $630,191.36. ' +
        'The chart leaves out all grants below $50,000. ' +
        'The chart displays one column series for each of the 4 grant categories, ' +
        'as well as a line series for each of the grant category totals.'
    },

    accessibility: {
        seriesDescriptionFormatter: function (series) {
            return series.type !== 'line' ? series.buildSeriesInfoString() :
                series.name + ', ' + dollarFormat(series.points[0].y);
        },
        keyboardNavigation: {
            mode: 'serialize'
        }
    },

    exporting: {
        csv: {
            columnHeaderFormatter: function (item, key) {
                if (key === 'name') {
                    return 'Grant applicant';
                }
                if (key === 'y') {
                    return 'Grant amount';
                }
                return key;
            }
        }
    },

    title: {
        text: 'San Francisco Arts Commission Grants',
        margin: 35
    },

    subtitle: {
        text: 'Grants in 2016 from $50,000 upwards'
    },

    xAxis: {
        visible: false,
        description: 'Grant applicants'
    },

    yAxis: [{
        min: 0,
        max: 800000,
        labels: {
            formatter: function () {
                return '$' + (this.value / 1000) + (this.value ? 'k' : '');
            }
        },
        title: {
            text: 'Grant amount'
        },
        gridLineWidth: 1
    }, {
        description: 'Grant category totals',
        opposite: true,
        min: 0,
        max: 2400000,
        gridLineWidth: 0,
        labels: {
            formatter: function () {
                return '$' + (this.value / 1000) + (this.value ? 'k' : '');
            },
            style: {
                color: '#a88'
            }
        },
        title: {
            text: 'Category total',
            style: {
                color: '#a88'
            }
        }
    }],

    plotOptions: {
        column: {
            keys: ['name', 'y'],
            grouping: false,
            pointPadding: 0.05,
            groupPadding: 0,
            events: {
                hide: updatePointStart,
                show: updatePointStart
            },
            tooltip: {
                headerFormat: '<span style="font-size: 10px"><span style="color:{point.color}">\u25CF</span> {series.name}</span><br/>',
                pointFormat: '{point.name}: <b>${point.y}</b><br/>'
            },
            pointDescriptionFormatter: function (point) {
                return (point.index + 1) + '. ' + point.name + ' ' +
                    dollarFormat(point.y) + '.' +
                    (point.description ? ' ' + point.description : '');
            }
        },
        line: {
            yAxis: 1,
            lineWidth: 5,
            marker: {
                enabled: false
            },
            enableMouseTracking: false,
            skipKeyboardNavigation: true,
            includeInCSVExport: false,
            exposeElementToA11y: true,
            linkedTo: ':previous',
            dataLabels: {
                enabled: true,
                verticalAlign: 'bottom',
                style: {
                    color: '#777',
                    fontWeight: 'normal'
                },
                formatter: function () {
                    if (this.point === this.series.points[Math.floor(
                            this.series.points.length / 2
                    )]) {
                        return 'Total: $' + Highcharts.numberFormat(this.y, 0);
                    }
                    return;
                }
            }
        }
    },

    series: [{
        name: 'Creative Space (CRSP)',
        color: colors[0],
        data: [
            ['509 Cultural Center / the luggage store', 50000],
            ['826 Valencia', 50000],
            ['Acción Latina', 50000],
            ['American Indian Community Cultural Center for the Arts SF (AICCCA-SF)', 50000],
            ['Cutting Ball Theatre Company', 50000],
            ['EXIT Theater', 50000],
            ['New Conservatory Theatre Center', 50000],
            ['Brava Theater Center/Brava! For Women in the Arts', 100000],
            ['Root Division', 100000]
        ]
    }, {
        type: 'line',
        name: 'Creative Space (CRSP) totals',
        data: [
            550000, 550000, 550000, 550000, 550000, 550000, 550000, 550000, 550000
        ],
        color: colors[0]
    }, {
        name: 'Cultural Center',
        color: colors[1],
        data: [
            ['Asian Pacific Islander Cultural Center', 104252.36],
            ['Queer Cultural Center', 104252.36],
            ['Bayview Opera House Ruth Williams Memorial Theater', 336103.08],
            ['African American Art & Culture Complex', 534628.08],
            ['Mission Cultural Center for Latino American Arts', 563938.76],
            ['SOMArts Cultural Centers', 630191.36]
        ],
        pointStart: 10
    }, {
        type: 'line',
        name: 'Cultural Center totals',
        data: [
            2273366, 2273366, 2273366, 2273366, 2273366, 2273366
        ],
        pointStart: 10,
        color: colors[1]
    }, {
        name: 'Cultural Equity Initiative',
        color: colors[2],
        data: [
            ['Acción Latina', 50000],
            ['Anne Bluethenthal and Dancers (ABD Productions)', 50000],
            ['Asian American Women Artists Association (AAWAA)', 50000],
            ['Asian Pacific Islander Cultural Center', 50000],
            ['Circo Zero / Zero Performances', 50000],
            ['CubaCaribe', 50000],
            ['Flyaway Productions', 50000],
            ['Jess Curtis/Gravity', 50000],
            ['Loco Bloco Drum and Dance Ensemble', 50000],
            ['Queer Women of Color Media Arts Project', 50000],
            ['Women’s Audio Mission', 50000],
            ['ABADA Capoeira San Francisco', 100000],
            ['Alliance for California Traditional Arts', 100000],
            ['Fresh Meat Productions', 100000],
            ['World Arts West', 100000],
            ['Yerba Buena Gardens Festival', 100000]
        ],
        pointStart: 17
    }, {
        type: 'line',
        name: 'Cultural Equity Initiative totals',
        data: [
            1050000, 1050000, 1050000, 1050000, 1050000, 1050000, 1050000,
            1050000, 1050000, 1050000, 1050000, 1050000, 1050000, 1050000,
            1050000, 1050000
        ],
        pointStart: 17,
        color: colors[2]
    }, {
        name: 'Special Grant',
        color: colors[3],
        data: [
            ['Arts Education Alliance of the Bay Area (AEABA)', 50000],
            ['ArtSpan', 50000],
            ['Bindlestiff Studio', 70000],
            ['Queer Cultural Center', 80000],
            ['Korean War Memorial Foundation', 110000],
            ['Bayview Opera House Ruth Williams Memorial Theater', 150000],
            ['Bayview Opera House Ruth Williams Memorial Theater', 150000]
        ],
        pointStart: 34
    }, {
        type: 'line',
        name: 'Special Grant totals',
        data: [
            660000, 660000, 660000, 660000, 660000, 660000, 660000
        ],
        pointStart: 34,
        color: colors[3]
    }]
});
