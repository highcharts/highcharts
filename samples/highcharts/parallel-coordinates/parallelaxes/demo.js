Highcharts.chart('container', {
    chart: {
        type: 'line',
        parallelCoordinates: true,
        parallelAxes: {
            tickAmount: 2,
            min: 0
        }
    },
    title: {
        text: 'Car set'
    },

    subtitle: {
        text: 'A demo of setting the same tick amount to all parallel axes'
    },

    plotOptions: {
        series: {
            lineWidth: 1,
            marker: {
                enabled: false
            }
        }
    },
    xAxis: {
        categories: ['Mpg', 'Cylinders', 'Displacement', 'HP', 'Lbs', 'Acceleration', 'Year', 'Origin'],
        gridLineWidth: 0
    },
    colors: ['rgba(200, 200, 200, 0.2)'],
    series: [{
        name: 'chevrolet chevelle malibu',
        data: [18, 8, 307, 130, 3504, 12, 70, 1]
    }, {
        name: 'buick skylark 320',
        data: [15, 8, 350, 165, 3693, 11.5, 70, 1]
    }, {
        name: 'plymouth satellite',
        data: [18, 8, 318, 150, 3436, 11, 70, 1]
    }, {
        name: 'amc rebel sst',
        data: [16, 8, 304, 150, 3433, 12, 70, 1]
    }, {
        name: 'ford torino',
        data: [17, 8, 302, 140, 3449, 10.5, 70, 1]
    }, {
        name: 'fordgalaxie 500',
        data: [15, 8, 429, 198, 4341, 10, 70, 1]
    }, {
        name: 'chevrolet impala',
        data: [14, 8, 454, 220, 4354, 9, 70, 1]
    }, {
        name: 'plymouth fury iii',
        data: [14, 8, 440, 215, 4312, 8.5, 70, 1]
    }, {
        name: 'pontiac catalina',
        data: [14, 8, 455, 225, 4425, 10, 70, 1]
    }, {
        name: 'amc ambassador dpl',
        data: [15, 8, 390, 190, 3850, 8.5, 70, 1]
    }, {
        name: 'citroen ds-21 pallas',
        data: [null, 4, 133, 115, 3090, 17.5, 70, 2]
    }, {
        name: 'chevrolet chevelle concours (sw)',
        data: [null, 8, 350, 165, 4142, 11.5, 70, 1]
    }, {
        name: 'ford torino (sw)',
        data: [null, 8, 351, 153, 4034, 11, 70, 1]
    }, {
        name: 'plymouth satellite (sw)',
        data: [null, 8, 383, 175, 4166, 10.5, 70, 1]
    }, {
        name: 'amc rebel sst (sw)',
        data: [null, 8, 360, 175, 3850, 11, 70, 1]
    }, {
        name: 'dodge challenger se',
        data: [15, 8, 383, 170, 3563, 10, 70, 1]
    }, {
        name: 'plymouth \'cuda 340',
        data: [14, 8, 340, 160, 3609, 8, 70, 1]
    }, {
        name: 'ford mustang boss 302',
        data: [null, 8, 302, 140, 3353, 8, 70, 1]
    }, {
        name: 'chevrolet monte carlo',
        data: [15, 8, 400, 150, 3761, 9.5, 70, 1]
    }, {
        name: 'buick estate wagon (sw)',
        data: [14, 8, 455, 225, 3086, 10, 70, 1]
    }, {
        name: 'toyota corona mark ii',
        data: [24, 4, 113, 95, 2372, 15, 70, 3]
    }, {
        name: 'plymouth duster',
        data: [22, 6, 198, 95, 2833, 15.5, 70, 1]
    }, {
        name: 'amc hornet',
        data: [18, 6, 199, 97, 2774, 15.5, 70, 1]
    }, {
        name: 'ford maverick',
        data: [21, 6, 200, 85, 2587, 16, 70, 1]
    }, {
        name: 'datsun pl510',
        data: [27, 4, 97, 88, 2130, 14.5, 70, 3]
    }, {
        name: 'volkswagen 1131 deluxe sedan',
        data: [26, 4, 97, 46, 1835, 20.5, 70, 2]
    }, {
        name: 'peugeot 504',
        data: [25, 4, 110, 87, 2672, 17.5, 70, 2]
    }, {
        name: 'audi 100 ls',
        data: [24, 4, 107, 90, 2430, 14.5, 70, 2]
    }, {
        name: 'saab 99e',
        data: [25, 4, 104, 95, 2375, 17.5, 70, 2]
    }, {
        name: 'bmw 2002',
        data: [26, 4, 121, 113, 2234, 12.5, 70, 2]
    }, {
        name: 'amc gremlin',
        data: [21, 6, 199, 90, 2648, 15, 70, 1]
    }, {
        name: 'ford f250',
        data: [10, 8, 360, 215, 4615, 14, 70, 1]
    }, {
        name: 'chevy c20',
        data: [10, 8, 307, 200, 4376, 15, 70, 1]
    }, {
        name: 'dodge d200',
        data: [11, 8, 318, 210, 4382, 13.5, 70, 1]
    }, {
        name: 'hi 1200d',
        data: [9, 8, 304, 193, 4732, 18.5, 70, 1]
    }, {
        name: 'datsun pl510',
        data: [27, 4, 97, 88, 2130, 14.5, 71, 3]
    }, {
        name: 'chevrolet vega 2300',
        data: [28, 4, 140, 90, 2264, 15.5, 71, 1]
    }, {
        name: 'toyota corona',
        data: [25, 4, 113, 95, 2228, 14, 71, 3]
    }, {
        name: 'ford pinto',
        data: [25, 4, 98, null, 2046, 19, 71, 1]
    }, {
        name: 'volkswagen super beetle 117',
        data: [null, 4, 97, 48, 1978, 20, 71, 2]
    }, {
        name: 'amc gremlin',
        data: [19, 6, 232, 100, 2634, 13, 71, 1]
    }, {
        name: 'plymouth satellite custom',
        data: [16, 6, 225, 105, 3439, 15.5, 71, 1]
    }, {
        name: 'chevrolet chevelle malibu',
        data: [17, 6, 250, 100, 3329, 15.5, 71, 1]
    }, {
        name: 'ford torino 500',
        data: [19, 6, 250, 88, 3302, 15.5, 71, 1]
    }, {
        name: 'amc matador',
        data: [18, 6, 232, 100, 3288, 15.5, 71, 1]
    }, {
        name: 'chevrolet impala',
        data: [14, 8, 350, 165, 4209, 12, 71, 1]
    }, {
        name: 'pontiac catalina brougham',
        data: [14, 8, 400, 175, 4464, 11.5, 71, 1]
    }, {
        name: 'ford galaxie 500',
        data: [14, 8, 351, 153, 4154, 13.5, 71, 1]
    }, {
        name: 'plymouth fury iii',
        data: [14, 8, 318, 150, 4096, 13, 71, 1]
    }, {
        name: 'dodge monaco (sw)',
        data: [12, 8, 383, 180, 4955, 11.5, 71, 1]
    }, {
        name: 'ford country squire (sw)',
        data: [13, 8, 400, 170, 4746, 12, 71, 1]
    }, {
        name: 'pontiac safari (sw)',
        data: [13, 8, 400, 175, 5140, 12, 71, 1]
    }, {
        name: 'amc hornet sportabout (sw)',
        data: [18, 6, 258, 110, 2962, 13.5, 71, 1]
    }, {
        name: 'chevrolet vega (sw)',
        data: [22, 4, 140, 72, 2408, 19, 71, 1]
    }, {
        name: 'pontiac firebird',
        data: [19, 6, 250, 100, 3282, 15, 71, 1]
    }, {
        name: 'ford mustang',
        data: [18, 6, 250, 88, 3139, 14.5, 71, 1]
    }, {
        name: 'mercury capri 2000',
        data: [23, 4, 122, 86, 2220, 14, 71, 1]
    }, {
        name: 'opel 1900',
        data: [28, 4, 116, 90, 2123, 14, 71, 2]
    }, {
        name: 'peugeot 304',
        data: [30, 4, 79, 70, 2074, 19.5, 71, 2]
    }, {
        name: 'fiat 124b',
        data: [30, 4, 88, 76, 2065, 14.5, 71, 2]
    }, {
        name: 'toyota corolla 1200',
        data: [31, 4, 71, 65, 1773, 19, 71, 3]
    }, {
        name: 'datsun 1200',
        data: [35, 4, 72, 69, 1613, 18, 71, 3]
    }, {
        name: 'volkswagen model 111',
        data: [27, 4, 97, 60, 1834, 19, 71, 2]
    }, {
        name: 'plymouth cricket',
        data: [26, 4, 91, 70, 1955, 20.5, 71, 1]
    }, {
        name: 'toyota corona hardtop',
        data: [24, 4, 113, 95, 2278, 15.5, 72, 3]
    }, {
        name: 'dodge colt hardtop',
        data: [25, 4, 97.5, 80, 2126, 17, 72, 1]
    }, {
        name: 'volkswagen type 3',
        data: [23, 4, 97, 54, 2254, 23.5, 72, 2]
    }, {
        name: 'chevrolet vega',
        data: [20, 4, 140, 90, 2408, 19.5, 72, 1]
    }, {
        name: 'ford pinto runabout',
        data: [21, 4, 122, 86, 2226, 16.5, 72, 1]
    }, {
        name: 'chevrolet impala',
        data: [13, 8, 350, 165, 4274, 12, 72, 1]
    }, {
        name: 'pontiac catalina',
        data: [14, 8, 400, 175, 4385, 12, 72, 1]
    }, {
        name: 'plymouth fury iii',
        data: [15, 8, 318, 150, 4135, 13.5, 72, 1]
    }, {
        name: 'ford galaxie 500',
        data: [14, 8, 351, 153, 4129, 13, 72, 1]
    }, {
        name: 'amc ambassador sst',
        data: [17, 8, 304, 150, 3672, 11.5, 72, 1]
    }, {
        name: 'mercury marquis',
        data: [11, 8, 429, 208, 4633, 11, 72, 1]
    }, {
        name: 'buick lesabre custom',
        data: [13, 8, 350, 155, 4502, 13.5, 72, 1]
    }, {
        name: 'oldsmobile delta 88 royale',
        data: [12, 8, 350, 160, 4456, 13.5, 72, 1]
    }, {
        name: 'chrysler newport royal',
        data: [13, 8, 400, 190, 4422, 12.5, 72, 1]
    }, {
        name: 'mazda rx2 coupe',
        data: [19, 3, 70, 97, 2330, 13.5, 72, 3]
    }, {
        name: 'amc matador (sw)',
        data: [15, 8, 304, 150, 3892, 12.5, 72, 1]
    }, {
        name: 'chevrolet chevelle concours (sw)',
        data: [13, 8, 307, 130, 4098, 14, 72, 1]
    }, {
        name: 'ford gran torino (sw)',
        data: [13, 8, 302, 140, 4294, 16, 72, 1]
    }, {
        name: 'plymouth satellite custom (sw)',
        data: [14, 8, 318, 150, 4077, 14, 72, 1]
    }, {
        name: 'volvo 145e (sw)',
        data: [18, 4, 121, 112, 2933, 14.5, 72, 2]
    }, {
        name: 'volkswagen 411 (sw)',
        data: [22, 4, 121, 76, 2511, 18, 72, 2]
    }, {
        name: 'peugeot 504 (sw)',
        data: [21, 4, 120, 87, 2979, 19.5, 72, 2]
    }, {
        name: 'renault 12 (sw)',
        data: [26, 4, 96, 69, 2189, 18, 72, 2]
    }, {
        name: 'ford pinto (sw)',
        data: [22, 4, 122, 86, 2395, 16, 72, 1]
    }, {
        name: 'datsun 510 (sw)',
        data: [28, 4, 97, 92, 2288, 17, 72, 3]
    }, {
        name: 'toyouta corona mark ii (sw)',
        data: [23, 4, 120, 97, 2506, 14.5, 72, 3]
    }, {
        name: 'dodge colt (sw)',
        data: [28, 4, 98, 80, 2164, 15, 72, 1]
    }, {
        name: 'toyota corolla 1600 (sw)',
        data: [27, 4, 97, 88, 2100, 16.5, 72, 3]
    }, {
        name: 'buick century 350',
        data: [13, 8, 350, 175, 4100, 13, 73, 1]
    }, {
        name: 'amc matador',
        data: [14, 8, 304, 150, 3672, 11.5, 73, 1]
    }, {
        name: 'chevrolet malibu',
        data: [13, 8, 350, 145, 3988, 13, 73, 1]
    }, {
        name: 'ford gran torino',
        data: [14, 8, 302, 137, 4042, 14.5, 73, 1]
    }, {
        name: 'dodge coronet custom',
        data: [15, 8, 318, 150, 3777, 12.5, 73, 1]
    }, {
        name: 'mercury marquis brougham',
        data: [12, 8, 429, 198, 4952, 11.5, 73, 1]
    }, {
        name: 'chevrolet caprice classic',
        data: [13, 8, 400, 150, 4464, 12, 73, 1]
    }, {
        name: 'ford ltd',
        data: [13, 8, 351, 158, 4363, 13, 73, 1]
    }, {
        name: 'plymouth fury gran sedan',
        data: [14, 8, 318, 150, 4237, 14.5, 73, 1]
    }, {
        name: 'chrysler new yorker brougham',
        data: [13, 8, 440, 215, 4735, 11, 73, 1]
    }, {
        name: 'buick electra 225 custom',
        data: [12, 8, 455, 225, 4951, 11, 73, 1]
    }, {
        name: 'amc ambassador brougham',
        data: [13, 8, 360, 175, 3821, 11, 73, 1]
    }, {
        name: 'plymouth valiant',
        data: [18, 6, 225, 105, 3121, 16.5, 73, 1]
    }, {
        name: 'chevrolet nova custom',
        data: [16, 6, 250, 100, 3278, 18, 73, 1]
    }, {
        name: 'amc hornet',
        data: [18, 6, 232, 100, 2945, 16, 73, 1]
    }, {
        name: 'ford maverick',
        data: [18, 6, 250, 88, 3021, 16.5, 73, 1]
    }, {
        name: 'plymouth duster',
        data: [23, 6, 198, 95, 2904, 16, 73, 1]
    }, {
        name: 'volkswagen super beetle',
        data: [26, 4, 97, 46, 1950, 21, 73, 2]
    }, {
        name: 'chevrolet impala',
        data: [11, 8, 400, 150, 4997, 14, 73, 1]
    }, {
        name: 'ford country',
        data: [12, 8, 400, 167, 4906, 12.5, 73, 1]
    }, {
        name: 'plymouth custom suburb',
        data: [13, 8, 360, 170, 4654, 13, 73, 1]
    }, {
        name: 'oldsmobile vista cruiser',
        data: [12, 8, 350, 180, 4499, 12.5, 73, 1]
    }, {
        name: 'amc gremlin',
        data: [18, 6, 232, 100, 2789, 15, 73, 1]
    }, {
        name: 'toyota carina',
        data: [20, 4, 97, 88, 2279, 19, 73, 3]
    }, {
        name: 'chevrolet vega',
        data: [21, 4, 140, 72, 2401, 19.5, 73, 1]
    }, {
        name: 'datsun 610',
        data: [22, 4, 108, 94, 2379, 16.5, 73, 3]
    }, {
        name: 'maxda rx3',
        data: [18, 3, 70, 90, 2124, 13.5, 73, 3]
    }, {
        name: 'ford pinto',
        data: [19, 4, 122, 85, 2310, 18.5, 73, 1]
    }, {
        name: 'mercury capri v6',
        data: [21, 6, 155, 107, 2472, 14, 73, 1]
    }, {
        name: 'fiat 124 sport coupe',
        data: [26, 4, 98, 90, 2265, 15.5, 73, 2]
    }, {
        name: 'chevrolet monte carlo s',
        data: [15, 8, 350, 145, 4082, 13, 73, 1]
    }, {
        name: 'pontiac grand prix',
        data: [16, 8, 400, 230, 4278, 9.5, 73, 1]
    }, {
        name: 'fiat 128',
        data: [29, 4, 68, 49, 1867, 19.5, 73, 2]
    }, {
        name: 'opel manta',
        data: [24, 4, 116, 75, 2158, 15.5, 73, 2]
    }, {
        name: 'audi 100ls',
        data: [20, 4, 114, 91, 2582, 14, 73, 2]
    }, {
        name: 'volvo 144ea',
        data: [19, 4, 121, 112, 2868, 15.5, 73, 2]
    }, {
        name: 'dodge dart custom',
        data: [15, 8, 318, 150, 3399, 11, 73, 1]
    }, {
        name: 'saab 99le',
        data: [24, 4, 121, 110, 2660, 14, 73, 2]
    }, {
        name: 'toyota mark ii',
        data: [20, 6, 156, 122, 2807, 13.5, 73, 3]
    }, {
        name: 'oldsmobile omega',
        data: [11, 8, 350, 180, 3664, 11, 73, 1]
    }, {
        name: 'plymouth duster',
        data: [20, 6, 198, 95, 3102, 16.5, 74, 1]
    }, {
        name: 'ford maverick',
        data: [21, 6, 200, null, 2875, 17, 74, 1]
    }, {
        name: 'amc hornet',
        data: [19, 6, 232, 100, 2901, 16, 74, 1]
    }, {
        name: 'chevrolet nova',
        data: [15, 6, 250, 100, 3336, 17, 74, 1]
    }, {
        name: 'datsun b210',
        data: [31, 4, 79, 67, 1950, 19, 74, 3]
    }, {
        name: 'ford pinto',
        data: [26, 4, 122, 80, 2451, 16.5, 74, 1]
    }, {
        name: 'toyota corolla 1200',
        data: [32, 4, 71, 65, 1836, 21, 74, 3]
    }, {
        name: 'chevrolet vega',
        data: [25, 4, 140, 75, 2542, 17, 74, 1]
    }, {
        name: 'chevrolet chevelle malibu classic',
        data: [16, 6, 250, 100, 3781, 17, 74, 1]
    }, {
        name: 'amc matador',
        data: [16, 6, 258, 110, 3632, 18, 74, 1]
    }, {
        name: 'plymouth satellite sebring',
        data: [18, 6, 225, 105, 3613, 16.5, 74, 1]
    }, {
        name: 'ford gran torino',
        data: [16, 8, 302, 140, 4141, 14, 74, 1]
    }, {
        name: 'buick century luxus (sw)',
        data: [13, 8, 350, 150, 4699, 14.5, 74, 1]
    }, {
        name: 'dodge coronet custom (sw)',
        data: [14, 8, 318, 150, 4457, 13.5, 74, 1]
    }, {
        name: 'ford gran torino (sw)',
        data: [14, 8, 302, 140, 4638, 16, 74, 1]
    }, {
        name: 'amc matador (sw)',
        data: [14, 8, 304, 150, 4257, 15.5, 74, 1]
    }, {
        name: 'audi fox',
        data: [29, 4, 98, 83, 2219, 16.5, 74, 2]
    }, {
        name: 'volkswagen dasher',
        data: [26, 4, 79, 67, 1963, 15.5, 74, 2]
    }, {
        name: 'opel manta',
        data: [26, 4, 97, 78, 2300, 14.5, 74, 2]
    }, {
        name: 'toyota corona',
        data: [31, 4, 76, 52, 1649, 16.5, 74, 3]
    }, {
        name: 'datsun 710',
        data: [32, 4, 83, 61, 2003, 19, 74, 3]
    }, {
        name: 'dodge colt',
        data: [28, 4, 90, 75, 2125, 14.5, 74, 1]
    }, {
        name: 'fiat 128',
        data: [24, 4, 90, 75, 2108, 15.5, 74, 2]
    }, {
        name: 'fiat 124 tc',
        data: [26, 4, 116, 75, 2246, 14, 74, 2]
    }, {
        name: 'honda civic',
        data: [24, 4, 120, 97, 2489, 15, 74, 3]
    }, {
        name: 'subaru',
        data: [26, 4, 108, 93, 2391, 15.5, 74, 3]
    }, {
        name: 'fiat x1.9',
        data: [31, 4, 79, 67, 2000, 16, 74, 2]
    }, {
        name: 'plymouth valiant custom',
        data: [19, 6, 225, 95, 3264, 16, 75, 1]
    }, {
        name: 'chevrolet nova',
        data: [18, 6, 250, 105, 3459, 16, 75, 1]
    }, {
        name: 'mercury monarch',
        data: [15, 6, 250, 72, 3432, 21, 75, 1]
    }, {
        name: 'ford maverick',
        data: [15, 6, 250, 72, 3158, 19.5, 75, 1]
    }, {
        name: 'pontiac catalina',
        data: [16, 8, 400, 170, 4668, 11.5, 75, 1]
    }, {
        name: 'chevrolet bel air',
        data: [15, 8, 350, 145, 4440, 14, 75, 1]
    }, {
        name: 'plymouth grand fury',
        data: [16, 8, 318, 150, 4498, 14.5, 75, 1]
    }, {
        name: 'ford ltd',
        data: [14, 8, 351, 148, 4657, 13.5, 75, 1]
    }, {
        name: 'buick century',
        data: [17, 6, 231, 110, 3907, 21, 75, 1]
    }, {
        name: 'chevroelt chevelle malibu',
        data: [16, 6, 250, 105, 3897, 18.5, 75, 1]
    }, {
        name: 'amc matador',
        data: [15, 6, 258, 110, 3730, 19, 75, 1]
    }, {
        name: 'plymouth fury',
        data: [18, 6, 225, 95, 3785, 19, 75, 1]
    }, {
        name: 'buick skyhawk',
        data: [21, 6, 231, 110, 3039, 15, 75, 1]
    }, {
        name: 'chevrolet monza 2+2',
        data: [20, 8, 262, 110, 3221, 13.5, 75, 1]
    }, {
        name: 'ford mustang ii',
        data: [13, 8, 302, 129, 3169, 12, 75, 1]
    }, {
        name: 'toyota corolla',
        data: [29, 4, 97, 75, 2171, 16, 75, 3]
    }, {
        name: 'ford pinto',
        data: [23, 4, 140, 83, 2639, 17, 75, 1]
    }, {
        name: 'amc gremlin',
        data: [20, 6, 232, 100, 2914, 16, 75, 1]
    }, {
        name: 'pontiac astro',
        data: [23, 4, 140, 78, 2592, 18.5, 75, 1]
    }, {
        name: 'toyota corona',
        data: [24, 4, 134, 96, 2702, 13.5, 75, 3]
    }, {
        name: 'volkswagen dasher',
        data: [25, 4, 90, 71, 2223, 16.5, 75, 2]
    }, {
        name: 'datsun 710',
        data: [24, 4, 119, 97, 2545, 17, 75, 3]
    }, {
        name: 'ford pinto',
        data: [18, 6, 171, 97, 2984, 14.5, 75, 1]
    }, {
        name: 'volkswagen rabbit',
        data: [29, 4, 90, 70, 1937, 14, 75, 2]
    }, {
        name: 'amc pacer',
        data: [19, 6, 232, 90, 3211, 17, 75, 1]
    }, {
        name: 'audi 100ls',
        data: [23, 4, 115, 95, 2694, 15, 75, 2]
    }, {
        name: 'peugeot 504',
        data: [23, 4, 120, 88, 2957, 17, 75, 2]
    }, {
        name: 'volvo 244dl',
        data: [22, 4, 121, 98, 2945, 14.5, 75, 2]
    }, {
        name: 'saab 99le',
        data: [25, 4, 121, 115, 2671, 13.5, 75, 2]
    }, {
        name: 'honda civic cvcc',
        data: [33, 4, 91, 53, 1795, 17.5, 75, 3]
    }, {
        name: 'fiat 131',
        data: [28, 4, 107, 86, 2464, 15.5, 76, 2]
    }, {
        name: 'opel 1900',
        data: [25, 4, 116, 81, 2220, 16.9, 76, 2]
    }, {
        name: 'capri ii',
        data: [25, 4, 140, 92, 2572, 14.9, 76, 1]
    }, {
        name: 'dodge colt',
        data: [26, 4, 98, 79, 2255, 17.7, 76, 1]
    }, {
        name: 'renault 12tl',
        data: [27, 4, 101, 83, 2202, 15.3, 76, 2]
    }, {
        name: 'chevrolet chevelle malibu classic',
        data: [17.5, 8, 305, 140, 4215, 13, 76, 1]
    }, {
        name: 'dodge coronet brougham',
        data: [16, 8, 318, 150, 4190, 13, 76, 1]
    }, {
        name: 'amc matador',
        data: [15.5, 8, 304, 120, 3962, 13.9, 76, 1]
    }, {
        name: 'ford gran torino',
        data: [14.5, 8, 351, 152, 4215, 12.8, 76, 1]
    }, {
        name: 'plymouth valiant',
        data: [22, 6, 225, 100, 3233, 15.4, 76, 1]
    }, {
        name: 'chevrolet nova',
        data: [22, 6, 250, 105, 3353, 14.5, 76, 1]
    }, {
        name: 'ford maverick',
        data: [24, 6, 200, 81, 3012, 17.6, 76, 1]
    }, {
        name: 'amc hornet',
        data: [22.5, 6, 232, 90, 3085, 17.6, 76, 1]
    }, {
        name: 'chevrolet chevette',
        data: [29, 4, 85, 52, 2035, 22.2, 76, 1]
    }, {
        name: 'chevrolet woody',
        data: [24.5, 4, 98, 60, 2164, 22.1, 76, 1]
    }, {
        name: 'vw rabbit',
        data: [29, 4, 90, 70, 1937, 14.2, 76, 2]
    }, {
        name: 'honda civic',
        data: [33, 4, 91, 53, 1795, 17.4, 76, 3]
    }, {
        name: 'dodge aspen se',
        data: [20, 6, 225, 100, 3651, 17.7, 76, 1]
    }, {
        name: 'ford granada ghia',
        data: [18, 6, 250, 78, 3574, 21, 76, 1]
    }, {
        name: 'pontiac ventura sj',
        data: [18.5, 6, 250, 110, 3645, 16.2, 76, 1]
    }, {
        name: 'amc pacer d/l',
        data: [17.5, 6, 258, 95, 3193, 17.8, 76, 1]
    }, {
        name: 'volkswagen rabbit',
        data: [29.5, 4, 97, 71, 1825, 12.2, 76, 2]
    }, {
        name: 'datsun b-210',
        data: [32, 4, 85, 70, 1990, 17, 76, 3]
    }, {
        name: 'toyota corolla',
        data: [28, 4, 97, 75, 2155, 16.4, 76, 3]
    }, {
        name: 'ford pinto',
        data: [26.5, 4, 140, 72, 2565, 13.6, 76, 1]
    }, {
        name: 'volvo 245',
        data: [20, 4, 130, 102, 3150, 15.7, 76, 2]
    }, {
        name: 'plymouth volare premier v8',
        data: [13, 8, 318, 150, 3940, 13.2, 76, 1]
    }, {
        name: 'peugeot 504',
        data: [19, 4, 120, 88, 3270, 21.9, 76, 2]
    }, {
        name: 'toyota mark ii',
        data: [19, 6, 156, 108, 2930, 15.5, 76, 3]
    }, {
        name: 'mercedes-benz 280s',
        data: [16.5, 6, 168, 120, 3820, 16.7, 76, 2]
    }, {
        name: 'cadillac seville',
        data: [16.5, 8, 350, 180, 4380, 12.1, 76, 1]
    }, {
        name: 'chevy c10',
        data: [13, 8, 350, 145, 4055, 12, 76, 1]
    }, {
        name: 'ford f108',
        data: [13, 8, 302, 130, 3870, 15, 76, 1]
    }, {
        name: 'dodge d100',
        data: [13, 8, 318, 150, 3755, 14, 76, 1]
    }, {
        name: 'honda accord cvcc',
        data: [31.5, 4, 98, 68, 2045, 18.5, 77, 3]
    }, {
        name: 'buick opel isuzu deluxe',
        data: [30, 4, 111, 80, 2155, 14.8, 77, 1]
    }, {
        name: 'renault 5 gtl',
        data: [36, 4, 79, 58, 1825, 18.6, 77, 2]
    }, {
        name: 'plymouth arrow gs',
        data: [25.5, 4, 122, 96, 2300, 15.5, 77, 1]
    }, {
        name: 'datsun f-10 hatchback',
        data: [33.5, 4, 85, 70, 1945, 16.8, 77, 3]
    }, {
        name: 'chevrolet caprice classic',
        data: [17.5, 8, 305, 145, 3880, 12.5, 77, 1]
    }, {
        name: 'oldsmobile cutlass supreme',
        data: [17, 8, 260, 110, 4060, 19, 77, 1]
    }, {
        name: 'dodge monaco brougham',
        data: [15.5, 8, 318, 145, 4140, 13.7, 77, 1]
    }, {
        name: 'mercury cougar brougham',
        data: [15, 8, 302, 130, 4295, 14.9, 77, 1]
    }, {
        name: 'chevrolet concours',
        data: [17.5, 6, 250, 110, 3520, 16.4, 77, 1]
    }, {
        name: 'buick skylark',
        data: [20.5, 6, 231, 105, 3425, 16.9, 77, 1]
    }, {
        name: 'plymouth volare custom',
        data: [19, 6, 225, 100, 3630, 17.7, 77, 1]
    }, {
        name: 'ford granada',
        data: [18.5, 6, 250, 98, 3525, 19, 77, 1]
    }, {
        name: 'pontiac grand prix lj',
        data: [16, 8, 400, 180, 4220, 11.1, 77, 1]
    }, {
        name: 'chevrolet monte carlo landau',
        data: [15.5, 8, 350, 170, 4165, 11.4, 77, 1]
    }, {
        name: 'chrysler cordoba',
        data: [15.5, 8, 400, 190, 4325, 12.2, 77, 1]
    }, {
        name: 'ford thunderbird',
        data: [16, 8, 351, 149, 4335, 14.5, 77, 1]
    }, {
        name: 'volkswagen rabbit custom',
        data: [29, 4, 97, 78, 1940, 14.5, 77, 2]
    }, {
        name: 'pontiac sunbird coupe',
        data: [24.5, 4, 151, 88, 2740, 16, 77, 1]
    }, {
        name: 'toyota corolla liftback',
        data: [26, 4, 97, 75, 2265, 18.2, 77, 3]
    }, {
        name: 'ford mustang ii 2+2',
        data: [25.5, 4, 140, 89, 2755, 15.8, 77, 1]
    }, {
        name: 'chevrolet chevette',
        data: [30.5, 4, 98, 63, 2051, 17, 77, 1]
    }, {
        name: 'dodge colt m/m',
        data: [33.5, 4, 98, 83, 2075, 15.9, 77, 1]
    }, {
        name: 'subaru dl',
        data: [30, 4, 97, 67, 1985, 16.4, 77, 3]
    }, {
        name: 'volkswagen dasher',
        data: [30.5, 4, 97, 78, 2190, 14.1, 77, 2]
    }, {
        name: 'datsun 810',
        data: [22, 6, 146, 97, 2815, 14.5, 77, 3]
    }, {
        name: 'bmw 320i',
        data: [21.5, 4, 121, 110, 2600, 12.8, 77, 2]
    }, {
        name: 'mazda rx-4',
        data: [21.5, 3, 80, 110, 2720, 13.5, 77, 3]
    }, {
        name: 'volkswagen rabbit custom diesel',
        data: [43.1, 4, 90, 48, 1985, 21.5, 78, 2]
    }, {
        name: 'ford fiesta',
        data: [36.1, 4, 98, 66, 1800, 14.4, 78, 1]
    }, {
        name: 'mazda glc deluxe',
        data: [32.8, 4, 78, 52, 1985, 19.4, 78, 3]
    }, {
        name: 'datsun b210 gx',
        data: [39.4, 4, 85, 70, 2070, 18.6, 78, 3]
    }, {
        name: 'honda civic cvcc',
        data: [36.1, 4, 91, 60, 1800, 16.4, 78, 3]
    }, {
        name: 'oldsmobile cutlass salon brougham',
        data: [19.9, 8, 260, 110, 3365, 15.5, 78, 1]
    }, {
        name: 'dodge diplomat',
        data: [19.4, 8, 318, 140, 3735, 13.2, 78, 1]
    }, {
        name: 'mercury monarch ghia',
        data: [20.2, 8, 302, 139, 3570, 12.8, 78, 1]
    }, {
        name: 'pontiac phoenix lj',
        data: [19.2, 6, 231, 105, 3535, 19.2, 78, 1]
    }, {
        name: 'chevrolet malibu',
        data: [20.5, 6, 200, 95, 3155, 18.2, 78, 1]
    }, {
        name: 'ford fairmont (auto)',
        data: [20.2, 6, 200, 85, 2965, 15.8, 78, 1]
    }, {
        name: 'ford fairmont (man)',
        data: [25.1, 4, 140, 88, 2720, 15.4, 78, 1]
    }, {
        name: 'plymouth volare',
        data: [20.5, 6, 225, 100, 3430, 17.2, 78, 1]
    }, {
        name: 'amc concord',
        data: [19.4, 6, 232, 90, 3210, 17.2, 78, 1]
    }, {
        name: 'buick century special',
        data: [20.6, 6, 231, 105, 3380, 15.8, 78, 1]
    }, {
        name: 'mercury zephyr',
        data: [20.8, 6, 200, 85, 3070, 16.7, 78, 1]
    }, {
        name: 'dodge aspen',
        data: [18.6, 6, 225, 110, 3620, 18.7, 78, 1]
    }, {
        name: 'amc concord d/l',
        data: [18.1, 6, 258, 120, 3410, 15.1, 78, 1]
    }, {
        name: 'chevrolet monte carlo landau',
        data: [19.2, 8, 305, 145, 3425, 13.2, 78, 1]
    }, {
        name: 'buick regal sport coupe (turbo)',
        data: [17.7, 6, 231, 165, 3445, 13.4, 78, 1]
    }, {
        name: 'ford futura',
        data: [18.1, 8, 302, 139, 3205, 11.2, 78, 1]
    }, {
        name: 'dodge magnum xe',
        data: [17.5, 8, 318, 140, 4080, 13.7, 78, 1]
    }, {
        name: 'chevrolet chevette',
        data: [30, 4, 98, 68, 2155, 16.5, 78, 1]
    }, {
        name: 'toyota corona',
        data: [27.5, 4, 134, 95, 2560, 14.2, 78, 3]
    }, {
        name: 'datsun 510',
        data: [27.2, 4, 119, 97, 2300, 14.7, 78, 3]
    }, {
        name: 'dodge omni',
        data: [30.9, 4, 105, 75, 2230, 14.5, 78, 1]
    }, {
        name: 'toyota celica gt liftback',
        data: [21.1, 4, 134, 95, 2515, 14.8, 78, 3]
    }, {
        name: 'plymouth sapporo',
        data: [23.2, 4, 156, 105, 2745, 16.7, 78, 1]
    }, {
        name: 'oldsmobile starfire sx',
        data: [23.8, 4, 151, 85, 2855, 17.6, 78, 1]
    }, {
        name: 'datsun 200-sx',
        data: [23.9, 4, 119, 97, 2405, 14.9, 78, 3]
    }, {
        name: 'audi 5000',
        data: [20.3, 5, 131, 103, 2830, 15.9, 78, 2]
    }, {
        name: 'volvo 264gl',
        data: [17, 6, 163, 125, 3140, 13.6, 78, 2]
    }, {
        name: 'saab 99gle',
        data: [21.6, 4, 121, 115, 2795, 15.7, 78, 2]
    }, {
        name: 'peugeot 604sl',
        data: [16.2, 6, 163, 133, 3410, 15.8, 78, 2]
    }, {
        name: 'volkswagen scirocco',
        data: [31.5, 4, 89, 71, 1990, 14.9, 78, 2]
    }, {
        name: 'honda accord lx',
        data: [29.5, 4, 98, 68, 2135, 16.6, 78, 3]
    }, {
        name: 'pontiac lemans v6',
        data: [21.5, 6, 231, 115, 3245, 15.4, 79, 1]
    }, {
        name: 'mercury zephyr 6',
        data: [19.8, 6, 200, 85, 2990, 18.2, 79, 1]
    }, {
        name: 'ford fairmont 4',
        data: [22.3, 4, 140, 88, 2890, 17.3, 79, 1]
    }, {
        name: 'amc concord dl 6',
        data: [20.2, 6, 232, 90, 3265, 18.2, 79, 1]
    }, {
        name: 'dodge aspen 6',
        data: [20.6, 6, 225, 110, 3360, 16.6, 79, 1]
    }, {
        name: 'chevrolet caprice classic',
        data: [17, 8, 305, 130, 3840, 15.4, 79, 1]
    }, {
        name: 'ford ltd landau',
        data: [17.6, 8, 302, 129, 3725, 13.4, 79, 1]
    }, {
        name: 'mercury grand marquis',
        data: [16.5, 8, 351, 138, 3955, 13.2, 79, 1]
    }, {
        name: 'dodge st. regis',
        data: [18.2, 8, 318, 135, 3830, 15.2, 79, 1]
    }, {
        name: 'buick estate wagon (sw)',
        data: [16.9, 8, 350, 155, 4360, 14.9, 79, 1]
    }, {
        name: 'ford country squire (sw)',
        data: [15.5, 8, 351, 142, 4054, 14.3, 79, 1]
    }, {
        name: 'chevrolet malibu classic (sw)',
        data: [19.2, 8, 267, 125, 3605, 15, 79, 1]
    }, {
        name: 'chrysler lebaron town @ country (sw)',
        data: [18.5, 8, 360, 150, 3940, 13, 79, 1]
    }, {
        name: 'vw rabbit custom',
        data: [31.9, 4, 89, 71, 1925, 14, 79, 2]
    }, {
        name: 'maxda glc deluxe',
        data: [34.1, 4, 86, 65, 1975, 15.2, 79, 3]
    }, {
        name: 'dodge colt hatchback custom',
        data: [35.7, 4, 98, 80, 1915, 14.4, 79, 1]
    }, {
        name: 'amc spirit dl',
        data: [27.4, 4, 121, 80, 2670, 15, 79, 1]
    }, {
        name: 'mercedes benz 300d',
        data: [25.4, 5, 183, 77, 3530, 20.1, 79, 2]
    }, {
        name: 'cadillac eldorado',
        data: [23, 8, 350, 125, 3900, 17.4, 79, 1]
    }, {
        name: 'peugeot 504',
        data: [27.2, 4, 141, 71, 3190, 24.8, 79, 2]
    }, {
        name: 'oldsmobile cutlass salon brougham',
        data: [23.9, 8, 260, 90, 3420, 22.2, 79, 1]
    }, {
        name: 'plymouth horizon',
        data: [34.2, 4, 105, 70, 2200, 13.2, 79, 1]
    }, {
        name: 'plymouth horizon tc3',
        data: [34.5, 4, 105, 70, 2150, 14.9, 79, 1]
    }, {
        name: 'datsun 210',
        data: [31.8, 4, 85, 65, 2020, 19.2, 79, 3]
    }, {
        name: 'fiat strada custom',
        data: [37.3, 4, 91, 69, 2130, 14.7, 79, 2]
    }, {
        name: 'buick skylark limited',
        data: [28.4, 4, 151, 90, 2670, 16, 79, 1]
    }, {
        name: 'chevrolet citation',
        data: [28.8, 6, 173, 115, 2595, 11.3, 79, 1]
    }, {
        name: 'oldsmobile omega brougham',
        data: [26.8, 6, 173, 115, 2700, 12.9, 79, 1]
    }, {
        name: 'pontiac phoenix',
        data: [33.5, 4, 151, 90, 2556, 13.2, 79, 1]
    }, {
        name: 'vw rabbit',
        data: [41.5, 4, 98, 76, 2144, 14.7, 80, 2]
    }, {
        name: 'toyota corolla tercel',
        data: [38.1, 4, 89, 60, 1968, 18.8, 80, 3]
    }, {
        name: 'chevrolet chevette',
        data: [32.1, 4, 98, 70, 2120, 15.5, 80, 1]
    }, {
        name: 'datsun 310',
        data: [37.2, 4, 86, 65, 2019, 16.4, 80, 3]
    }, {
        name: 'chevrolet citation',
        data: [28, 4, 151, 90, 2678, 16.5, 80, 1]
    }, {
        name: 'ford fairmont',
        data: [26.4, 4, 140, 88, 2870, 18.1, 80, 1]
    }, {
        name: 'amc concord',
        data: [24.3, 4, 151, 90, 3003, 20.1, 80, 1]
    }, {
        name: 'dodge aspen',
        data: [19.1, 6, 225, 90, 3381, 18.7, 80, 1]
    }, {
        name: 'audi 4000',
        data: [34.3, 4, 97, 78, 2188, 15.8, 80, 2]
    }, {
        name: 'toyota corona liftback',
        data: [29.8, 4, 134, 90, 2711, 15.5, 80, 3]
    }, {
        name: 'mazda 626',
        data: [31.3, 4, 120, 75, 2542, 17.5, 80, 3]
    }, {
        name: 'datsun 510 hatchback',
        data: [37, 4, 119, 92, 2434, 15, 80, 3]
    }, {
        name: 'toyota corolla',
        data: [32.2, 4, 108, 75, 2265, 15.2, 80, 3]
    }, {
        name: 'mazda glc',
        data: [46.6, 4, 86, 65, 2110, 17.9, 80, 3]
    }, {
        name: 'dodge colt',
        data: [27.9, 4, 156, 105, 2800, 14.4, 80, 1]
    }, {
        name: 'datsun 210',
        data: [40.8, 4, 85, 65, 2110, 19.2, 80, 3]
    }, {
        name: 'vw rabbit c (diesel)',
        data: [44.3, 4, 90, 48, 2085, 21.7, 80, 2]
    }, {
        name: 'vw dasher (diesel)',
        data: [43.4, 4, 90, 48, 2335, 23.7, 80, 2]
    }, {
        name: 'audi 5000s (diesel)',
        data: [36.4, 5, 121, 67, 2950, 19.9, 80, 2]
    }, {
        name: 'mercedes-benz 240d',
        data: [30, 4, 146, 67, 3250, 21.8, 80, 2]
    }, {
        name: 'honda civic 1500 gl',
        data: [44.6, 4, 91, 67, 1850, 13.8, 80, 3]
    }, {
        name: 'renault lecar deluxe',
        data: [40.9, 4, 85, null, 1835, 17.3, 80, 2]
    }, {
        name: 'subaru dl',
        data: [33.8, 4, 97, 67, 2145, 18, 80, 3]
    }, {
        name: 'vokswagen rabbit',
        data: [29.8, 4, 89, 62, 1845, 15.3, 80, 2]
    }, {
        name: 'datsun 280-zx',
        data: [32.7, 6, 168, 132, 2910, 11.4, 80, 3]
    }, {
        name: 'mazda rx-7 gs',
        data: [23.7, 3, 70, 100, 2420, 12.5, 80, 3]
    }, {
        name: 'triumph tr7 coupe',
        data: [35, 4, 122, 88, 2500, 15.1, 80, 2]
    }, {
        name: 'ford mustang cobra',
        data: [23.6, 4, 140, null, 2905, 14.3, 80, 1]
    }, {
        name: 'honda accord',
        data: [32.4, 4, 107, 72, 2290, 17, 80, 3]
    }, {
        name: 'plymouth reliant',
        data: [27.2, 4, 135, 84, 2490, 15.7, 81, 1]
    }, {
        name: 'buick skylark',
        data: [26.6, 4, 151, 84, 2635, 16.4, 81, 1]
    }, {
        name: 'dodge aries wagon (sw)',
        data: [25.8, 4, 156, 92, 2620, 14.4, 81, 1]
    }, {
        name: 'chevrolet citation',
        data: [23.5, 6, 173, 110, 2725, 12.6, 81, 1]
    }, {
        name: 'plymouth reliant',
        data: [30, 4, 135, 84, 2385, 12.9, 81, 1]
    }, {
        name: 'toyota starlet',
        data: [39.1, 4, 79, 58, 1755, 16.9, 81, 3]
    }, {
        name: 'plymouth champ',
        data: [39, 4, 86, 64, 1875, 16.4, 81, 1]
    }, {
        name: 'honda civic 1300',
        data: [35.1, 4, 81, 60, 1760, 16.1, 81, 3]
    }, {
        name: 'subaru',
        data: [32.3, 4, 97, 67, 2065, 17.8, 81, 3]
    }, {
        name: 'datsun 210 mpg',
        data: [37, 4, 85, 65, 1975, 19.4, 81, 3]
    }, {
        name: 'toyota tercel',
        data: [37.7, 4, 89, 62, 2050, 17.3, 81, 3]
    }, {
        name: 'mazda glc 4',
        data: [34.1, 4, 91, 68, 1985, 16, 81, 3]
    }, {
        name: 'plymouth horizon 4',
        data: [34.7, 4, 105, 63, 2215, 14.9, 81, 1]
    }, {
        name: 'ford escort 4w',
        data: [34.4, 4, 98, 65, 2045, 16.2, 81, 1]
    }, {
        name: 'ford escort 2h',
        data: [29.9, 4, 98, 65, 2380, 20.7, 81, 1]
    }, {
        name: 'volkswagen jetta',
        data: [33, 4, 105, 74, 2190, 14.2, 81, 2]
    }, {
        name: 'renault 18i',
        data: [34.5, 4, 100, null, 2320, 15.8, 81, 2]
    }, {
        name: 'honda prelude',
        data: [33.7, 4, 107, 75, 2210, 14.4, 81, 3]
    }, {
        name: 'toyota corolla',
        data: [32.4, 4, 108, 75, 2350, 16.8, 81, 3]
    }, {
        name: 'datsun 200sx',
        data: [32.9, 4, 119, 100, 2615, 14.8, 81, 3]
    }, {
        name: 'mazda 626',
        data: [31.6, 4, 120, 74, 2635, 18.3, 81, 3]
    }, {
        name: 'peugeot 505s turbo diesel',
        data: [28.1, 4, 141, 80, 3230, 20.4, 81, 2]
    }, {
        name: 'saab 900s',
        data: [null, 4, 121, 110, 2800, 15.4, 81, 2]
    }, {
        name: 'volvo diesel',
        data: [30.7, 6, 145, 76, 3160, 19.6, 81, 2]
    }, {
        name: 'toyota cressida',
        data: [25.4, 6, 168, 116, 2900, 12.6, 81, 3]
    }, {
        name: 'datsun 810 maxima',
        data: [24.2, 6, 146, 120, 2930, 13.8, 81, 3]
    }, {
        name: 'buick century',
        data: [22.4, 6, 231, 110, 3415, 15.8, 81, 1]
    }, {
        name: 'oldsmobile cutlass ls',
        data: [26.6, 8, 350, 105, 3725, 19, 81, 1]
    }, {
        name: 'ford granada gl',
        data: [20.2, 6, 200, 88, 3060, 17.1, 81, 1]
    }, {
        name: 'chrysler lebaron salon',
        data: [17.6, 6, 225, 85, 3465, 16.6, 81, 1]
    }, {
        name: 'chevrolet cavalier',
        data: [28, 4, 112, 88, 2605, 19.6, 82, 1]
    }, {
        name: 'chevrolet cavalier wagon',
        data: [27, 4, 112, 88, 2640, 18.6, 82, 1]
    }, {
        name: 'chevrolet cavalier 2-door',
        data: [34, 4, 112, 88, 2395, 18, 82, 1]
    }, {
        name: 'pontiac j2000 se hatchback',
        data: [31, 4, 112, 85, 2575, 16.2, 82, 1]
    }, {
        name: 'dodge aries se',
        data: [29, 4, 135, 84, 2525, 16, 82, 1]
    }, {
        name: 'pontiac phoenix',
        data: [27, 4, 151, 90, 2735, 18, 82, 1]
    }, {
        name: 'ford fairmont futura',
        data: [24, 4, 140, 92, 2865, 16.4, 82, 1]
    }, {
        name: 'amc concord dl',
        data: [23, 4, 151, null, 3035, 20.5, 82, 1]
    }, {
        name: 'volkswagen rabbit l',
        data: [36, 4, 105, 74, 1980, 15.3, 82, 2]
    }, {
        name: 'mazda glc custom l',
        data: [37, 4, 91, 68, 2025, 18.2, 82, 3]
    }, {
        name: 'mazda glc custom',
        data: [31, 4, 91, 68, 1970, 17.6, 82, 3]
    }, {
        name: 'plymouth horizon miser',
        data: [38, 4, 105, 63, 2125, 14.7, 82, 1]
    }, {
        name: 'mercury lynx l',
        data: [36, 4, 98, 70, 2125, 17.3, 82, 1]
    }, {
        name: 'nissan stanza xe',
        data: [36, 4, 120, 88, 2160, 14.5, 82, 3]
    }, {
        name: 'honda accord',
        data: [36, 4, 107, 75, 2205, 14.5, 82, 3]
    }, {
        name: 'toyota corolla',
        data: [34, 4, 108, 70, 2245, 16.9, 82, 3]
    }, {
        name: 'honda civic',
        data: [38, 4, 91, 67, 1965, 15, 82, 3]
    }, {
        name: 'honda civic (auto)',
        data: [32, 4, 91, 67, 1965, 15.7, 82, 3]
    }, {
        name: 'datsun 310 gx',
        data: [38, 4, 91, 67, 1995, 16.2, 82, 3]
    }, {
        name: 'buick century limited',
        data: [25, 6, 181, 110, 2945, 16.4, 82, 1]
    }, {
        name: 'oldsmobile cutlass ciera (diesel)',
        data: [38, 6, 262, 85, 3015, 17, 82, 1]
    }, {
        name: 'chrysler lebaron medallion',
        data: [26, 4, 156, 92, 2585, 14.5, 82, 1]
    }, {
        name: 'ford granada l',
        data: [22, 6, 232, 112, 2835, 14.7, 82, 1]
    }, {
        name: 'toyota celica gt',
        data: [32, 4, 144, 96, 2665, 13.9, 82, 3]
    }, {
        name: 'dodge charger 2.2',
        data: [36, 4, 135, 84, 2370, 13, 82, 1]
    }, {
        name: 'chevrolet camaro',
        data: [27, 4, 151, 90, 2950, 17.3, 82, 1]
    }, {
        name: 'ford mustang gl',
        data: [27, 4, 140, 86, 2790, 15.6, 82, 1]
    }, {
        name: 'vw pickup',
        data: [44, 4, 97, 52, 2130, 24.6, 82, 2]
    }, {
        name: 'dodge rampage',
        data: [32, 4, 135, 84, 2295, 11.6, 82, 1]
    }, {
        name: 'ford ranger',
        data: [28, 4, 120, 79, 2625, 18.6, 82, 1]
    }, {
        name: 'chevys-10',
        data: [31, 4, 119, 82, 2720, 19.4, 82, 1]
    }]
});
