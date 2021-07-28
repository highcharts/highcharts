const categories = 11;

Highcharts.getJSON('https://raw.githubusercontent.com/mekhatria/demo_highcharts/master/denmarkExportIn2018.json?callback=?',

    function (dataJson) {

        for (let i = 0; i < categories; i++) {
            dataJson[i].color = 'white';
        }

        Highcharts.chart('container', {
            accessibility: {
                screenReaderSection: {
                    beforeChartFormat: '<{headingTagName}>{chartTitle}</{headingTagName}><div>{typeDescription}</div><div>{chartSubtitle}</div><div>{chartLongdesc}</div>'
                },
                description: 'Tree map detailing exported goods from Denmark in 2018. The services category is the largest, and makes up 39% of the total export. Transport services are the most exported. Chemicals are the second most exported category with 13%, then agriculture with 12%, and machinery with 10%. The other categories are textiles, electronics, metals, minerals, vehicles, stone, and other.'
            },
            series: [
                {
                    name: 'Export',
                    type: 'treemap',
                    layoutAlgorithm: 'squarified',
                    allowDrillToNode: true,
                    turboThreshold: dataJson.length,
                    dataLabels: {
                        enabled: false
                    },
                    borderColor: 'black',
                    levels: [
                        {
                            level: 1,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name} {point.value:.0f}%',
                                style: {
                                    textOutline: false,
                                    fontSize: 18
                                },
                                zIndex: 9
                            },
                            borderWidth: 3
                        },
                        {
                            level: 2,
                            dataLabels: {
                                enabled: false
                            },
                            borderWidth: 1
                        }
                    ],
                    data: dataJson
                }
            ],
            title: {
                text: 'Denmark Export 2018'
            },
            subtitle: {
                useHTMl: true,
                text: 'Source:Harvard.edu'
            },
            tooltip: {
                useHTML: true,
                valueDecimals: 2,
                pointFormat: '<b>{point.name}</b>: <b>{point.value}%'
            }
        });
    }
);
