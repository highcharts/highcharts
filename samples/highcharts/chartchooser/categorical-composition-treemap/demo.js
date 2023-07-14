Highcharts.chart('container', {
    accessibility: {
        screenReaderSection: {
            beforeChartFormat:
        '<{headingTagName}>{chartTitle}</{headingTagName}><div>{typeDescription}</div><div>{chartSubtitle}</div><div>{chartLongdesc}</div>'
        },
        description:
      'Tree map detailing the areas of Canadian regions and provinces. The treemap chart makes it clear that Canada is composed of four main regions: Northern Canada, Atlantic Canada, Central Canada, and Western Canada. Each region is composed of many provinces and territories.'
    },
    series: [
        {
            type: 'treemap',
            layoutAlgorithm: 'squarified',
            allowDrillToNode: true,
            dataLabels: {
                enabled: false
            },
            levels: [
                {
                    level: 1,
                    dataLabels: {
                        enabled: true,
                        style: {
                            textOutline: false
                        }
                    },
                    borderWidth: 3
                }
            ],
            data: [
                {
                    id: 'Northern Canada',
                    name: 'Northern Canada',
                    value: 3921739,
                    color: '#87E8D2'
                },
                {
                    id: 'Yukon',
                    name: 'Yukon',
                    value: 482443,
                    parent: 'Northern Canada'
                },
                {
                    id: 'Northwest Territories',
                    name: 'Northwest Territories',
                    value: 1346106,
                    parent: 'Northern Canada'
                },
                {
                    id: 'Nunavut',
                    name: 'Nunavut',
                    value: 2093190,
                    parent: 'Northern Canada'
                },
                {
                    id: 'Western Canada',
                    name: 'Western Canada',
                    value: 2905416,
                    color: '#e987cf'
                },
                {
                    id: 'British Columbia',
                    name: 'British Columbia',
                    value: 944735,
                    parent: 'Western Canada'
                },
                {
                    id: 'Alberta',
                    name: 'Alberta',
                    value: 661848,
                    parent: 'Western Canada'
                },
                {
                    id: 'Saskatchewan',
                    name: 'Saskatchewan',
                    value: 651900,
                    parent: 'Western Canada'
                },
                {
                    id: 'Central Canada',
                    name: 'Central Canada',
                    value: 2618451,
                    color: '#adadad'
                },
                {
                    id: 'Ontario',
                    name: 'Ontario',
                    value: 1076000,
                    parent: 'Central Canada'
                },
                {
                    id: 'Quebec',
                    name: 'Quebec',
                    value: 1667000,
                    parent: 'Central Canada'
                },
                {
                    id: 'Atlantic Canada',
                    name: 'Atlantic Canada',
                    value: 539064,
                    color: '#86CDE7'
                },
                {
                    id: 'New Brunswick',
                    name: 'New Brunswick',
                    value: 72908,
                    parent: 'Atlantic Canada'
                },
                {
                    id: 'Prince Edward Island',
                    name: 'Prince Edward Island',
                    value: 5660,
                    parent: 'Atlantic Canada'
                },
                {
                    id: 'Nova Scotia',
                    name: 'Nova Scotia',
                    value: 55283,
                    parent: 'Atlantic Canada'
                },
                {
                    id: 'Newfoundland and Labrador',
                    name: 'Newfoundland and Labrador',
                    value: 405212,
                    parent: 'Atlantic Canada'
                }
            ]
        }
    ],
    title: {
        text: 'Canadian provinces and territories by area'
    },
    subtitle: {
        useHTMl: true,
        text:
      'Source:<a href="https://en.wikipedia.org/wiki/List_of_Canadian_provinces_and_territories_by_area">Wikipedia</a>'
    },
    tooltip: {
        useHTML: true,
        pointFormat:
      'The area of <b>{point.name}</b> is <b>{point.value}km<sup>2</sup></b>'
    }
});
