const colors = Highcharts.getOptions().colors;

Highcharts.chart('container', {
    chart: {
        type: 'networkgraph'
    },
    title: {
        text: 'Domestic flights (UK, DE, PL)'
    },
    plotOptions: {
        networkgraph: {
            layoutAlgorithm: {
                enableSimulation: true,
                linkLength: 75,
                integration: 'verlet',
                gravitationalConstant: 0
            },
            keys: ['from', 'to'],
            dataLabels: {
                enabled: true,
                verticalAlign: 'middle',
                format: '{point.airportCode}'
            }
        }
    },

    series: [{
        marker: {
            lineWidth: 1
        },
        nodes: [{
            id: 'Warszawa',
            airportCode: 'WAW',
            marker: {
                radius: 8,
                fillColor: colors[1]
            }
        }, {
            id: 'Rzeszów',
            marker: {
                radius: 3,
                fillColor: colors[1]
            }
        }, {
            id: 'Kraków',
            marker: {
                radius: 3,
                fillColor: colors[1]
            }
        }, {
            id: 'Katowice',
            marker: {
                radius: 3,
                fillColor: colors[1]
            }
        }, {
            id: 'Wrocław',
            marker: {
                radius: 3,
                fillColor: colors[1]
            }
        }, {
            id: 'Poznań',
            marker: {
                radius: 3,
                fillColor: colors[1]
            }
        }, {
            id: 'Szczecin',
            marker: {
                radius: 3,
                fillColor: colors[1]
            }
        }, {
            id: 'Gdańsk',
            marker: {
                radius: 3,
                fillColor: colors[1]
            }
        }, {
            id: 'Lublin',
            marker: {
                radius: 3,
                fillColor: colors[1]
            }
        }, {
            id: 'Zielona Góra',
            marker: {
                radius: 3,
                fillColor: colors[1]
            }
        }, {
            id: 'Munich',
            airportCode: 'MUC',
            marker: {
                radius: 22,
                fillColor: colors[2]
            }
        }, {
            id: 'Stuttgart',
            airportCode: 'STR',
            marker: {
                radius: 22,
                fillColor: colors[2]
            }
        }, {
            id: 'Nuremberg',
            marker: {
                radius: 2.1,
                fillColor: colors[2]
            }
        }, {
            id: 'Frankfurt',
            airportCode: 'FRA',
            marker: {
                radius: 33,
                fillColor: colors[2]
            }
        }, {
            id: 'Dusseldorf',
            airportCode: 'DUS',
            marker: {
                radius: 12.3,
                fillColor: colors[2]
            }
        }, {
            id: 'Cologne/Bonn',
            marker: {
                radius: 6,
                fillColor: colors[2]
            }
        }, {
            id: 'Berlin',
            airportCode: 'BER',
            marker: {
                radius: 15,
                fillColor: colors[2]
            }
        }, {
            id: 'Dresden',
            marker: {
                radius: 3,
                fillColor: colors[2]
            }
        }, {
            id: 'Saarbrucken',
            marker: {
                radius: 3,
                fillColor: colors[2]
            }
        }, {
            id: 'Leipzig',
            marker: {
                radius: 3,
                fillColor: colors[2]
            }
        }, {
            id: 'Rostock',
            marker: {
                radius: 3,
                fillColor: colors[2]
            }
        }, {
            id: 'Hamburg',
            marker: {
                radius: 8.5,
                fillColor: colors[2]
            }
        }, {
            id: 'Bremen',
            marker: {
                radius: 3,
                fillColor: colors[2]
            }
        }, {
            id: 'Hanover',
            marker: {
                radius: 3,
                fillColor: colors[2]
            }
        }, {
            id: 'Munster',
            marker: {
                radius: 3,
                fillColor: colors[2]
            }
        }, {
            id: 'Paderborn',
            marker: {
                radius: 3,
                fillColor: colors[2]
            }
        }, {
            id: 'Dortmund',
            marker: {
                radius: 3,
                fillColor: colors[2]
            }
        }, {
            id: 'Manheim',
            marker: {
                radius: 3,
                fillColor: colors[2]
            }
        }, {
            id: 'Baden-baden',
            marker: {
                radius: 3,
                fillColor: colors[2]
            }
        }, {
            id: 'Westerland',
            marker: {
                radius: 3,
                fillColor: colors[2]
            }
        }, {
            id: 'Heringsdorf',
            marker: {
                radius: 3,
                fillColor: colors[2]
            }
        }, {
            id: 'Friedrichshafen',
            marker: {
                radius: 3,
                fillColor: colors[2]
            }
        }, {
            id: 'Padeborn',
            marker: {
                radius: 3,
                fillColor: colors[2]
            }
        }, {
            id: 'London',
            airportCode: 'LON',
            marker: {
                radius: 40.5
            }
        }, {
            id: 'Edinburgh',
            airportCode: 'EDI',
            marker: {
                radius: 5.5
            }
        }, {
            id: 'Glasgow',
            marker: {
                radius: 4.3
            }
        }, {
            id: 'Dundee',
            marker: {
                radius: 3
            }
        }, {
            id: 'Dublin',
            airportCode: 'DUB',
            marker: {
                radius: 14
            }
        }, {
            id: 'Derry',
            marker: {
                radius: 3
            }
        }, {
            id: 'Connacht',
            marker: {
                radius: 3
            }
        }, {
            id: 'Shannon',
            marker: {
                radius: 3
            }
        }, {
            id: 'Kerry',
            marker: {
                radius: 3
            }
        }, {
            id: 'Cork',
            marker: {
                radius: 3
            }
        }, {
            id: 'Inverness',
            marker: {
                radius: 3
            }
        }, {
            id: 'Aberdeen',
            marker: {
                radius: 3
            }
        }, {
            id: 'Isle of Man',
            marker: {
                radius: 3
            }
        }, {
            id: 'Newquay',
            marker: {
                radius: 3
            }
        }, {
            id: 'Exeter',
            marker: {
                radius: 3
            }
        }, {
            id: 'Leeds',
            marker: {
                radius: 3
            }
        }, {
            id: 'Newcastle',
            marker: {
                radius: 3
            }
        }, {
            id: 'Manchester',
            airportCode: 'MAN',
            marker: {
                radius: 14
            }
        }, {
            id: 'Bristol',
            marker: {
                radius: 4.5
            }
        }, {
            id: 'Chester',
            marker: {
                radius: 3
            }
        }, {
            id: 'Nottingham',
            marker: {
                radius: 3
            }
        }, {
            id: 'Southampton',
            marker: {
                radius: 3
            }
        }, {
            id: 'Southend',
            marker: {
                radius: 3
            }
        }, {
            id: 'Cambridge',
            marker: {
                radius: 3
            }
        }, {
            id: 'Norwich',
            marker: {
                radius: 3
            }
        }, {
            id: 'Cardiff',
            marker: {
                radius: 3
            }
        }, {
            id: 'Donegal',
            marker: {
                radius: 3
            }
        }],
        data: [
            ['Warszawa', 'London'],
            ['Warszawa', 'Munich'],
            ['Warszawa', 'Frankfurt'],
            ['London', 'Munich'],
            ['London', 'Stuttgart'],
            ['London', 'Frankfurt'],
            // Poland
            ['Warszawa', 'Rzeszów'],
            ['Warszawa', 'Kraków'],
            ['Warszawa', 'Katowice'],
            ['Warszawa', 'Wrocław'],
            ['Warszawa', 'Zielona Góra'],
            ['Warszawa', 'Poznań'],
            ['Warszawa', 'Szczecin'],
            ['Warszawa', 'Gdańsk'],
            ['Warszawa', 'Lublin'],
            ['Kraków', 'Gdańsk'],
            ['Wrocław', 'Gdańsk'],
            // Germany:

            ['Munich', 'Stuttgart'],
            ['Munich', 'Nuremberg'],
            ['Munich', 'Frankfurt'],
            ['Munich', 'Saarbrucken'],
            ['Munich', 'Dusseldorf'],
            ['Munich', 'Cologne/Bonn'],
            ['Munich', 'Berlin'],
            ['Munich', 'Dresden'],
            ['Munich', 'Leipzig'],
            ['Munich', 'Rostock'],
            ['Munich', 'Hamburg'],
            ['Munich', 'Bremen'],
            ['Munich', 'Hanover'],
            ['Munich', 'Munster'],
            ['Munich', 'Paderborn'],
            ['Munich', 'Dortmund'],

            ['Berlin', 'Dusseldorf'],
            ['Berlin', 'Cologne/Bonn'],
            ['Berlin', 'Frankfurt'],
            ['Berlin', 'Saarbrucken'],
            ['Berlin', 'Manheim'],
            ['Berlin', 'Baden-baden'],
            ['Berlin', 'Stuttgart'],
            ['Berlin', 'Nuremberg'],

            ['Stuttgart', 'Westerland'],
            ['Stuttgart', 'Hamburg'],
            ['Stuttgart', 'Bremen'],
            ['Stuttgart', 'Hanover'],
            ['Stuttgart', 'Rostock'],
            ['Stuttgart', 'Heringsdorf'],
            ['Stuttgart', 'Leipzig'],
            ['Stuttgart', 'Dresden'],
            ['Stuttgart', 'Frankfurt'],
            ['Stuttgart', 'Dusseldorf'],

            ['Nuremberg', 'Frankfurt'],
            ['Nuremberg', 'Hamburg'],
            ['Nuremberg', 'Dusseldorf'],

            ['Frankfurt', 'Dresden'],
            ['Frankfurt', 'Leipzig'],
            ['Frankfurt', 'Munster'],
            ['Frankfurt', 'Bremen'],
            ['Frankfurt', 'Dusseldorf'],
            ['Frankfurt', 'Hamburg'],
            ['Frankfurt', 'Hanover'],
            ['Frankfurt', 'Padeborn'],
            ['Frankfurt', 'Heringsdorf'],
            ['Frankfurt', 'Westerland'],

            ['Cologne/Bonn', 'Hamburg'],
            ['Cologne/Bonn', 'Leipzig'],
            ['Cologne/Bonn', 'Dresden'],

            ['Dusseldorf', 'Hamburg'],
            ['Dusseldorf', 'Leipzig'],
            ['Dusseldorf', 'Dresden'],
            ['Dusseldorf', 'Heringsdorf'],
            ['Dusseldorf', 'Westerland'],

            ['Hamburg', 'Westerland'],
            ['Hamburg', 'Manheim'],
            ['Hamburg', 'Saarbrucken'],
            ['Hamburg', 'Friedrichshafen'],

            ['Westerland', 'Manheim'],

            // UK

            ['London', 'Edinburgh'],
            ['London', 'Glasgow'],
            ['London', 'Dundee'],
            ['London', 'Dublin'],
            ['London', 'Derry'],
            ['London', 'Connacht'],
            ['London', 'Shannon'],
            ['London', 'Kerry'],
            ['London', 'Cork'],
            ['London', 'Inverness'],
            ['London', 'Aberdeen'],
            ['London', 'Isle of Man'],
            ['London', 'Newquay'],
            ['London', 'Exeter'],
            ['London', 'Leeds'],
            ['London', 'Newcastle'],
            ['London', 'Manchester'],

            ['Bristol', 'Chester'],
            ['Bristol', 'Cork'],
            ['Bristol', 'Dublin'],
            ['Bristol', 'Connacht'],
            ['Bristol', 'Isle of Man'],
            ['Bristol', 'Edinburgh'],
            ['Bristol', 'Newcastle'],
            ['Bristol', 'Glasgow'],
            ['Bristol', 'Aberdeen'],
            ['Bristol', 'Inverness'],

            ['Birmingham', 'Newquay'],
            ['Birmingham', 'Cork'],
            ['Birmingham', 'Shannon'],
            ['Birmingham', 'Connacht'],
            ['Birmingham', 'Dublin'],
            ['Birmingham', 'Isle of Man'],
            ['Birmingham', 'Edinburgh'],
            ['Birmingham', 'Glasgow'],
            ['Birmingham', 'Aberdeen'],
            ['Birmingham', 'Inverness'],

            ['Nottingham', 'Inverness'],
            ['Nottingham', 'Connacht'],
            ['Nottingham', 'Dublin'],
            ['Nottingham', 'Edinburgh'],
            ['Nottingham', 'Glasgow'],

            ['Manchester', 'Glasgow'],
            ['Manchester', 'Edinburgh'],
            ['Manchester', 'Cork'],
            ['Manchester', 'Shannon'],
            ['Manchester', 'Connacht'],
            ['Manchester', 'Dublin'],
            ['Manchester', 'Isle of Man'],
            ['Manchester', 'Aberdeen'],
            ['Manchester', 'Inverness'],
            ['Manchester', 'Newquay'],
            ['Manchester', 'Exeter'],
            ['Manchester', 'Southampton'],
            ['Manchester', 'Southend'],
            ['Manchester', 'Cambridge'],
            ['Manchester', 'Norwich'],

            ['Leeds', 'Newquay'],
            ['Leeds', 'Southampton'],
            ['Leeds', 'Dublin'],

            ['Newcastle', 'Dublin'],
            ['Newcastle', 'Aberdeen'],
            ['Newcastle', 'Newquay'],
            ['Newcastle', 'Exeter'],
            ['Newcastle', 'Southampton'],
            ['Newcastle', 'Cardiff'],

            ['Dublin', 'Newquay'],
            ['Dublin', 'Exeter'],
            ['Dublin', 'Southampton'],
            ['Dublin', 'Cardiff'],
            ['Dublin', 'Southend'],
            ['Dublin', 'Isle of Man'],
            ['Dublin', 'Edinburgh'],
            ['Dublin', 'Glasgow'],
            ['Dublin', 'Aberdeen'],
            ['Dublin', 'Inverness'],
            ['Dublin', 'Kerry'],

            ['Edinburgh', 'Kerry'],
            ['Edinburgh', 'Southampton'],
            ['Edinburgh', 'Cardiff'],
            ['Edinburgh', 'Southend'],
            ['Edinburgh', 'Isle of Man'],
            ['Edinburgh', 'Cork'],
            ['Edinburgh', 'Norwich'],
            ['Edinburgh', 'Exeter'],
            ['Edinburgh', 'Shannon'],
            ['Edinburgh', 'Connacht'],

            ['Glasgow', 'Exeter'],
            ['Glasgow', 'Cork'],
            ['Glasgow', 'Shannon'],
            ['Glasgow', 'Connacht'],
            ['Glasgow', 'Newquay'],
            ['Glasgow', 'Donegal']
        ]
    }]
});
