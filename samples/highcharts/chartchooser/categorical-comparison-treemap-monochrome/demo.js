(async () => {


    const dataJson = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@dac9b997d8/samples/data/denmark-export-2018.json'
    ).then(response => response.json());

    Highcharts.chart('container', {
        accessibility: {
            screenReaderSection: {
                beforeChartFormat:
            '<{headingTagName}>{chartTitle}</{headingTagName}><div>{typeDescription}</div><div>{chartSubtitle}</div><div>{chartLongdesc}</div>'
            },
            description:
          'Tree map detailing exported goods from Denmark in 2018. The services category is the largest, and makes up 39% of the total export. Transport services are the most exported. Chemicals are the second most exported category with 13%, then agriculture with 12%, and machinery with 10%. The other categories are textiles, electronics, metals, minerals, vehicles, stone, and other.'
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
                color: '#ffffff',
                borderColor: 'black',
                levels: [
                    {
                        level: 1,
                        dataLabels: {
                            format: '{point.name} {point.value:.0f}%',
                            style: {
                                fontSize: 18
                            },
                            zIndex: 9
                        },
                        borderWidth: 3
                    },
                    {
                        level: 2,
                        borderWidth: 1
                    },
                    {
                        level: 1,
                        levelIsConstant: false,
                        dataLabels: {
                            enabled: true
                        }
                    }
                ],
                data: dataJson
            }
        ],
        title: {
            text: 'Denmark Export 2018'
        },
        subtitle: {
            text: 'Source: Harvard.edu'
        },
        tooltip: {
            valueDecimals: 2,
            pointFormat: '<b>{point.name}</b>: <b>{point.value}%'
        }
    });

})();
