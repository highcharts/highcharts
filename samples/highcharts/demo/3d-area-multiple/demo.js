Highcharts.chart('container', {
    chart: {
        type: 'area',
        options3d: {
            enabled: true,
            alpha: 15,
            beta: 30,
            depth: 200
        }
    },
    title: {
        text: 'Visual comparison of Mountains Panorama'
    },
    accessibility: {
        description: 'The chart is showing the shapes of three mountain ' +
            'ranges as three area line series laid out in 3D behind each ' +
            'other.',
        keyboardNavigation: {
            seriesNavigation: {
                mode: 'serialize'
            }
        }
    },
    lang: {
        accessibility: {
            axis: {
                xAxisDescriptionPlural: 'The chart has 3 unlabelled X axes, ' +
                    'one for each series.'
            }
        }
    },
    yAxis: {
        title: {
            text: 'Height Above Sea Level',
            x: -40
        },
        labels: {
            format: '{value:,.0f} MAMSL'
        },
        gridLineDashStyle: 'Dash'
    },
    xAxis: [{
        visible: false
    }, {
        visible: false
    }, {
        visible: false
    }],
    plotOptions: {
        area: {
            depth: 100,
            marker: {
                enabled: false
            },
            states: {
                inactive: {
                    enabled: false
                }
            }
        }
    },
    tooltip: {
        valueSuffix: ' MAMSL'
    },
    series: [{
        name: 'Tatra Mountains visible from Rusinowa polana',
        lineColor: 'rgb(180,90,50)',
        color: 'rgb(200,110,50)',
        fillColor: 'rgb(200,110,50)',
        data: [
            ['Murań', 1890],
            ['Nowy Wierch', 2009],
            ['Hawrań', 2152],
            ['Płaczliwa Skała', 2142],
            ['Szalony Wierch', 2061],
            ['Karczmarski Wierch', 1438],
            ['Jagnięcy Szczyt', 2230],
            ['Czerwona Turnia', 2284],
            ['Kołowy Szczyt', 2418],
            ['Czarny Szczyt', 2429],
            ['Baranie Rogi', 2526],
            ['Śnieżny Szczyt', 2465],
            ['Lodowy Szczyt', 2627],
            ['Lodowa Kopa', 2602],
            ['Szeroka Jaworzyńska', 2210],
            ['Horwacki Wierch', 1902],
            ['Spismichałowa Czuba', 2012],
            ['Zielona Czuba', 2130],
            ['Wielicki Szczyt', 2318],
            ['Gerlach', 2655],
            ['Batyżowiecki Szczyt', 2448],
            ['Kaczy Szczyt', 2395],
            ['Zmarzły Szczyt', 2390],
            ['Kończysta', 2538],
            ['Młynarz', 2170],
            ['Ganek', 2462],
            ['Wysoka', 2547],
            ['Ciężki Szczyt', 2520],
            ['Rysy', 2503],
            ['Żabi Mnich', 2146],
            ['Żabi Koń', 2291],
            ['Żabia Turnia Mięguszowiecka', 2335],
            ['Wołowa Turnia', 2373]
        ]
    }, {
        xAxis: 1,
        lineColor: 'rgb(120,160,180)',
        color: 'rgb(140,180,200)',
        fillColor: 'rgb(140,180,200)',
        name: 'Dachstein panorama seen from Krippenstein',
        data: [
            ['Kufstein', 2049],
            ['Hohe Wildstelle', 2746],
            ['Kleiner Miesberg', 2173],
            ['Großer Miesberg', 2202],
            ['Hochstein', 2543],
            ['Lackner Miesberg', 2232],
            ['Wasenspitze', 2257],
            ['Sinabell', 2349],
            ['Feister Scharte', 2198],
            ['Eselstein', 2556],
            ['Landfriedstein', 2536],
            ['Scheichenspitz', 2667],
            ['Schmiedstock', 2634],
            ['Gamsfeldspitze', 2611],
            ['Edelgriess', 2305],
            ['Koppenkarstein', 2863],
            ['Niederer Gjaidstein', 2483],
            ['Hoher Gjaidstein', 2794],
            ['Hoher Dachstein', 2995],
            ['Niederer Dachstein', 2934],
            ['Hohes Kreuz', 2837],
            ['Hoher Ochsenkogel', 2513]
        ]
    }, {
        xAxis: 2,
        lineColor: 'rgb(200, 190, 140)',
        color: 'rgb(200, 190, 140)',
        fillColor: 'rgb(230, 220, 180)',
        name: 'Panorama from Col Des Mines',
        data: [
            ['Combin de la Tsessette', 4141],
            ['Grand Combin de Grafeneire', 4314],
            ['Combin de Corbassière', 3716],
            ['Petit Combin', 3672],
            ['Pointe de Boveire', 3212],
            ['Grand Aget', 3133],
            ['Mont Rogneux', 3084],
            ['Dents du Grand Lé', 2884],
            ['Monts Telliers', 2951],
            ['Grand Golliat', 3238],
            ['Mont Grande Rochère', 3326],
            ['Mont de la Fouly', 2871],
            ['Tête de la Payanne', 2452],
            ['Pointe Allobrogia', 3172],
            ['Six Blanc', 2334],
            ['Mont Dolent', 3820],
            ['Aiguille de Triolet', 3870],
            ['Le Tour Noir', 3836],
            ['Aiguille de l\'A Neuve', 3753],
            ['Aiguille d\'Argentière', 3900],
            ['Aiguille du Chardonnet', 3824],
            ['Aiguille du Tour', 3540],
            ['Aiguille du Pissoir', 3440],
            ['Le Catogne', 2598],
            ['Pointe de Prosom', 2762],
            ['Pointe Ronde', 2700],
            ['Mont Buet', 3096],
            ['Le Cheval Blanc', 2831],
            ['Pointe de la Finive', 2838],
            ['Pic de Tenneverge', 2985],
            ['Pointe d\'Aboillon', 2819],
            ['Tour Sallière', 3220],
            ['Le Dôme', 3138],
            ['Haute Cime', 3257],
            ['Pierre Avoi', 2473],
            ['Cime de l\'Est', 3178]
        ]
    }]
});
