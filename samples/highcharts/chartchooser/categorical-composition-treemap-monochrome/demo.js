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
                    id: 'id_4',
                    name: 'Northern Canada',
                    value: 3921739,
                    color: '#10487F'
                },
                {
                    id: 'id_41',
                    name: 'Yukon',
                    value: 482443,
                    parent: 'id_4'
                },
                {
                    id: 'id_42',
                    name: 'Northwest Territories',
                    value: 1346106,
                    parent: 'id_4'
                },
                {
                    id: 'id_43',
                    name: 'Nunavut',
                    value: 2093190,
                    parent: 'id_4'
                },
                {
                    id: 'id_1',
                    name: 'Western Canada',
                    value: 2905416,
                    color: '#346DA4'
                },
                {
                    id: 'id_11',
                    name: 'British Columbia',
                    value: 944735,
                    parent: 'id_1'
                },
                {
                    id: 'id_12',
                    name: 'Alberta',
                    value: 661848,
                    parent: 'id_1'
                },
                {
                    id: 'id_13',
                    name: 'Saskatchewan',
                    value: 651900,
                    parent: 'id_1'
                },
                {
                    id: 'id_2',
                    name: 'Central Canada',
                    value: 2618451,
                    color: '#7CB5EC'
                },
                {
                    id: 'id_21',
                    name: 'Ontario',
                    value: 1076000,
                    parent: 'id_2'
                },
                {
                    id: 'id_22',
                    name: 'Quebec',
                    value: 1667000,
                    parent: 'id_2'
                },
                {
                    id: 'id_3',
                    name: 'Atlantic Canada',
                    value: 539064,
                    color: '#d5e7f9'
                },
                {
                    id: 'id_31',
                    name: 'New Brunswick',
                    value: 72908,
                    parent: 'id_3'
                },
                {
                    id: 'id_32',
                    name: 'Prince Edward Island',
                    value: 5660,
                    parent: 'id_3'
                },
                {
                    id: 'id_33',
                    name: 'Nova Scotia',
                    value: 55283,
                    parent: 'id_3'
                },
                {
                    id: 'id_34',
                    name: 'Newfoundland and Labrador',
                    value: 405212,
                    parent: 'id_3'
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
