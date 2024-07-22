(async () => {

    const dataJson = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@8a1f8f0eb4/samples/data/africa-export-2021.json'
    ).then(response => response.json());


    Highcharts.chart('container', {
        colorAxis: {
            minColor: Highcharts.getOptions().colors[6],
            maxColor: Highcharts.getOptions().colors[3]
        },
        series: [
            {
                name: 'Export',
                type: 'treemap',
                layoutAlgorithm: 'squarified',
                allowDrillToNode: true,
                dataLabels: {
                    enabled: false,
                    crop: true
                },
                groupAreaThreshold: {
                    enabled: true,
                    width: 20,
                    height: 20
                },
                colorKey: 'value',
                borderColor: 'black',
                levels: [
                    {
                        level: 1,
                        dataLabels: {
                            format: '{point.name} {point.value:.0f}%',
                            style: {
                                textOutline: false,
                                fontSize: 18
                            },
                            zIndex: 9
                        }
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
        ]
    });
})();
