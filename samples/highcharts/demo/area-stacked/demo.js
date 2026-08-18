Highcharts.chart('container', {
    dataTable: {
        columns: {
            Year: [
                2012, 2013, 2014, 2015, 2016, 2017, 2018,
                2019, 2020, 2021, 2022
            ],
            'Ocean transport': [
                13234, 12729, 11533, 17798, 10398, 12811,
                15483, 16196, 15060, 13365, 13301
            ],
            Households: [
                6686, 6536, 6389, 6384, 6251, 5719,
                5611, 5040, 5079, 5088, 4988
            ],
            'Agriculture and hunting': [
                4812, 4872, 4961, 5001, 5070, 5035,
                5045, 5004, 5015, 5076, 4935
            ],
            'Air transport': [
                3502, 3844, 4139, 4351, 3802, 4020,
                4461, 5074, 1558, 1247, 2694
            ],
            Construction: [
                2019, 2189, 2150, 2217, 2179, 2258,
                2348, 2196, 2018, 2180, 2127
            ]
        }
    },
    chart: {
        type: 'area'
    },
    title: {
        text: 'Greenhouse gases from Norwegian economic activity'
    },
    subtitle: {
        text: 'Source: ' +
            '<a href="https://www.ssb.no/en/statbank/table/09288/"' +
            'target="_blank">SSB</a>'
    },
    yAxis: {
        title: {
            text: 'Million tonnes CO₂-equivalents'
        }
    },
    tooltip: {
        shared: true,
        headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span>' +
            '<br>'
    },
    plotOptions: {
        series: {
            dataMapping: {
                x: 'Year'
            }
        },
        area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#666666'
            }
        }
    },
    series: [{
        dataMapping: {
            y: 'Ocean transport'
        }
    }, {
        dataMapping: {
            y: 'Households'
        }
    }, {
        dataMapping: {
            y: 'Agriculture and hunting'
        }
    }, {
        dataMapping: {
            y: 'Air transport'
        }
    }, {
        dataMapping: {
            y: 'Construction'
        }
    }]
});
