Highcharts.chart('container', {

    colors: ['#293462', '#a64942', '#fe5f55', '#fff1c1', '#5bd1d7', '#ff502f', '#004d61', '#ff8a5c', '#fff591', '#f5587b', '#fad3cf', '#a696c8', '#5BE7C4', '#266A2E', '#593E1A'],

    title: {
        text: 'Main train connections in Europe'
    },

    accessibility: {
        description: 'Arc diagram chart with circles of different sizes along the X axis, and connections drawn as arcs between them. From the chart we can see that Paris is the city with the most connections to other cities.',
        point: {
            valueDescriptionFormat: 'Connection from {point.from} to {point.to}.'
        }
    },

    series: [{
        keys: ['from', 'to', 'weight'],
        type: 'arcdiagram',
        name: 'Train connections',
        linkWeight: 1,
        centeredLinks: true,
        dataLabels: {
            rotation: 90,
            y: 30,
            align: 'left',
            color: 'black'
        },
        offset: '65%',
        data: [
            ['Hamburg', 'Stuttgart', 1],
            ['Hamburg', 'Frankfurt', 1],
            ['Hamburg', 'München', 1],
            ['Hannover', 'Wien', 1],
            ['Hannover', 'München', 1],
            ['Berlin', 'Wien', 1],
            ['Berlin', 'München', 1],
            ['Berlin', 'Stuttgart', 1],
            ['Berlin', 'Frankfurt', 1],
            ['Berlin', 'Köln', 1],
            ['Berlin', 'Düsseldorf', 1],
            ['München', 'Düsseldorf', 1],
            ['München', 'Wien', 1],
            ['München', 'Frankfurt', 1],
            ['München', 'Köln', 1],
            ['München', 'Amsterdam', 1],
            ['Stuttgart', 'Wien', 1],
            ['Frankfurt', 'Wien', 1],
            ['Frankfurt', 'Amsterdam', 1],
            ['Frankfurt', 'Paris', 1],
            ['Frankfurt', 'Budapest', 1],
            ['Düsseldorf', 'Wien', 1],
            ['Düsseldorf', 'Hamburg', 1],
            ['Amsterdam', 'Paris', 1],
            ['Paris', 'Brest', 1],
            ['Paris', 'Nantes', 1],
            ['Paris', 'Bayonne', 1],
            ['Paris', 'Bordeaux', 1],
            ['Paris', 'Toulouse', 1],
            ['Paris', 'Montpellier', 1],
            ['Paris', 'Marseille', 1],
            ['Paris', 'Nice', 1],
            ['Paris', 'Milano', 1],
            ['Nantes', 'Nice', 1],
            ['Bordeaux', 'Lyon', 1],
            ['Nantes', 'Lyon', 1],
            ['Milano', 'München', 1],
            ['Milano', 'Roma', 1],
            ['Milano', 'Bari', 1],
            ['Milano', 'Napoli', 1],
            ['Milano', 'Brindisi', 1],
            ['Milano', 'Lamezia Terme', 1],
            ['Torino', 'Roma', 1],
            ['Venezia', 'Napoli', 1],
            ['Roma', 'Bari', 1],
            ['Roma', 'Catania', 1],
            ['Roma', 'Brindisi', 1],
            ['Catania', 'Milano', 1]
        ]
    }]

});
