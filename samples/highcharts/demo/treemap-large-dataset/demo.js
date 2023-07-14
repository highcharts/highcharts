(async () => {

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-mortality.json'
    ).then(response => response.json());

    let regionP,
        regionVal,
        regionI = 0,
        countryP,
        countryI,
        causeP,
        causeI,
        region,
        country,
        cause;

    const points = [],
        causeName = {
            'Communicable & other Group I': 'Communicable diseases',
            'Noncommunicable diseases': 'Non-communicable diseases',
            Injuries: 'Injuries'
        };

    for (region in data) {
        if (Object.hasOwnProperty.call(data, region)) {
            regionVal = 0;
            regionP = {
                id: 'id_' + regionI,
                name: region,
                color: Highcharts.getOptions().colors[regionI]
            };
            countryI = 0;
            for (country in data[region]) {
                if (Object.hasOwnProperty.call(data[region], country)) {
                    countryP = {
                        id: regionP.id + '_' + countryI,
                        name: country,
                        parent: regionP.id
                    };
                    points.push(countryP);
                    causeI = 0;
                    for (cause in data[region][country]) {
                        if (Object.hasOwnProperty.call(
                            data[region][country], cause
                        )) {
                            causeP = {
                                id: countryP.id + '_' + causeI,
                                name: causeName[cause],
                                parent: countryP.id,
                                value: Math.round(+data[region][country][cause])
                            };
                            regionVal += causeP.value;
                            points.push(causeP);
                            causeI = causeI + 1;
                        }
                    }
                    countryI = countryI + 1;
                }
            }
            regionP.value = Math.round(regionVal / countryI);
            points.push(regionP);
            regionI = regionI + 1;
        }
    }
    Highcharts.chart('container', {
        series: [{
            name: 'Regions',
            type: 'treemap',
            layoutAlgorithm: 'squarified',
            allowDrillToNode: true,
            animationLimit: 1000,
            dataLabels: {
                enabled: false
            },
            levels: [{
                level: 1,
                dataLabels: {
                    enabled: true
                },
                borderWidth: 3,
                levelIsConstant: false
            }, {
                level: 1,
                dataLabels: {
                    style: {
                        fontSize: '14px'
                    }
                }
            }],
            accessibility: {
                exposeAsGroupOnly: true
            },
            data: points
        }],
        subtitle: {
            text: 'Click points to drill down. Source: <a href="http://apps.who.int/gho/data/node.main.12?lang=en">WHO</a>.',
            align: 'left'
        },
        title: {
            text: 'Global Mortality Rate 2012, per 100 000 population',
            align: 'left'
        }
    });
})();