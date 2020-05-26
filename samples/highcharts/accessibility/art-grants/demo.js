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
    return '$' + Highcharts.numberFormat(x, 0);
}

var colors = Highcharts.getOptions().colors;

Highcharts.setOptions({
    lang: {
        thousandsSep: ','
    }
});

Highcharts.chart('container', {
    chart: {
        type: 'column'
    },

    accessibility: {
        series: {
            descriptionFormatter: function (series) {
                return series.type === 'line' ?
                    series.name + ', ' + dollarFormat(series.points[0].y) :
                    series.name + ' grant amounts, bar series with ' + series.points.length + ' bars.';
            }
        },
        keyboardNavigation: {
            seriesNavigation: {
                mode: 'serialize'
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
        accessibility: {
            description: 'Grant applicants',
            rangeDescription: ''
        }
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
        accessibility: {
            description: 'Grant category totals'
        },
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
            pointPadding: 0.1,
            groupPadding: 0,
            events: {
                hide: updatePointStart,
                show: updatePointStart
            },
            tooltip: {
                headerFormat: '<span style="font-size: 10px"><span style="color:{point.color}">\u25CF</span> {series.name}</span><br/>',
                pointFormatter: function () {
                    return this.name + ': <b>' + dollarFormat(this.y) + '</b><br/>';
                }
            },
            accessibility: {
                pointDescriptionFormatter: function (point) {
                    return (point.index + 1) + '. ' + point.name + ' ' +
                        dollarFormat(point.y) + '.';
                }
            }
        },
        line: {
            yAxis: 1,
            lineWidth: 5,
            accessibility: {
                exposeAsGroupOnly: true
            },
            marker: {
                enabled: false
            },
            enableMouseTracking: false,
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
                }
            }
        }
    },

    series: [{
        name: 'Creative Space (CRSP)',
        color: colors[0],
        borderColor: '#A59273',
        borderWidth: 1,
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
        name: 'Creative Space (CRSP) grant totals',
        data: [
            550000, 550000, 550000, 550000, 550000, 550000, 550000, 550000, 550000
        ],
        color: colors[0]
    }, {
        name: 'Cultural Center',
        color: '#EC6E65',
        data: [
            ['Asian Pacific Islander Cultural Center', 104252.36],
            ['Queer Cultural Center', 104252.36],
            ['Bayview Opera House Ruth Williams Memorial Theater', 336103.08],
            ['African American Art and Culture Complex', 534628.08],
            ['Mission Cultural Center for Latino American Arts', 563938.76],
            ['SOMArts Cultural Centers', 630191.36]
        ],
        pointStart: 10
    }, {
        type: 'line',
        name: 'Cultural Center grant totals',
        data: [
            2273366, 2273366, 2273366, 2273366, 2273366, 2273366
        ],
        pointStart: 10,
        color: '#EC6E65'
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
        name: 'Cultural Equity Initiative grant totals',
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
