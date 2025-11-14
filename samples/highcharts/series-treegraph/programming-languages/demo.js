// --- Demo Data ---
const data = [
    // Root
    {
        id: 'Programming Languages',
        parent: '',
        name: 'Programming Languages'
    },
    // Paradigms
    {
        id: 'Imperative',
        parent: 'Programming Languages',
        name: 'Imperative'
    },
    {
        id: 'Declarative',
        parent: 'Programming Languages',
        name: 'Declarative'
    },
    // Imperative subclasses
    {
        id: 'Procedural',
        parent: 'Imperative',
        name: 'Procedural'
    },
    {
        id: 'Object-Oriented',
        parent: 'Imperative',
        name: 'Object-Oriented'
    },
    {
        id: 'Scripting',
        parent: 'Imperative',
        name: 'Scripting'
    },
    // Declarative subclasses
    {
        id: 'Functional',
        parent: 'Declarative',
        name: 'Functional'
    },
    {
        id: 'Logic-based',
        parent: 'Declarative',
        name: 'Logic-based'
    },
    // Procedural
    {
        id: 'C',
        parent: 'Procedural',
        name: 'C',
        custom: { year: 1972 }
    },
    {
        id: 'Pascal',
        parent: 'Procedural',
        name: 'Pascal',
        custom: { year: 1970 }
    },
    {
        id: 'Go',
        parent: 'Procedural',
        name: 'Go',
        custom: { year: 2009 }
    },
    {
        id: 'Julia',
        parent: 'Procedural',
        name: 'Julia',
        custom: { year: 2012 }
    },
    // Object-Oriented
    {
        id: 'Java',
        parent: 'Object-Oriented',
        name: 'Java',
        custom: { year: 1995 }
    },
    {
        id: 'C++',
        parent: 'Object-Oriented',
        name: 'C++',
        custom: { year: 1985 }
    },
    {
        id: 'C#',
        parent: 'Object-Oriented',
        name: 'C#',
        custom: { year: 2000 }
    },
    {
        id: 'Python',
        parent: 'Object-Oriented',
        name: 'Python',
        custom: { year: 1991 }
    },
    {
        id: 'Kotlin',
        parent: 'Object-Oriented',
        name: 'Kotlin',
        custom: { year: 2011 }
    },
    {
        id: 'Swift',
        parent: 'Object-Oriented',
        name: 'Swift',
        custom: { year: 2014 }
    },
    {
        id: 'Rust',
        parent: 'Object-Oriented',
        name: 'Rust',
        custom: { year: 2010 }
    },
    {
        id: 'Dart',
        parent: 'Object-Oriented',
        name: 'Dart',
        custom: { year: 2011 }
    },
    {
        id: 'Scala',
        parent: 'Object-Oriented',
        name: 'Scala',
        custom: { year: 2004 }
    },
    // Scripting
    {
        id: 'JavaScript',
        parent: 'Scripting',
        name: 'JavaScript',
        custom: { year: 1995 }
    },
    {
        id: 'TypeScript',
        parent: 'Scripting',
        name: 'TypeScript',
        custom: { year: 2012 }
    },
    {
        id: 'PHP',
        parent: 'Scripting',
        name: 'PHP',
        custom: { year: 1995 }
    },
    {
        id: 'Ruby',
        parent: 'Scripting',
        name: 'Ruby',
        custom: { year: 1995 }
    },
    {
        id: 'Perl',
        parent: 'Scripting',
        name: 'Perl',
        custom: { year: 1987 }
    },
    {
        id: 'Bash',
        parent: 'Scripting',
        name: 'Bash',
        custom: { year: 1989 }
    },
    // Functional
    {
        id: 'Haskell',
        parent: 'Functional',
        name: 'Haskell',
        custom: { year: 1990 }
    },
    {
        id: 'Lisp',
        parent: 'Functional',
        name: 'Lisp',
        custom: { year: 1958 }
    },
    {
        id: 'Elm',
        parent: 'Functional',
        name: 'Elm',
        custom: { year: 2012 }
    },
    {
        id: 'Elixir',
        parent: 'Functional',
        name: 'Elixir',
        custom: { year: 2011 }
    },
    {
        id: 'F#',
        parent: 'Functional',
        name: 'F#',
        custom: { year: 2005 }
    },
    // Logic-based
    {
        id: 'Prolog',
        parent: 'Logic-based',
        name: 'Prolog',
        custom: { year: 1972 }
    },
    {
        id: 'Datalog',
        parent: 'Logic-based',
        name: 'Datalog',
        custom: { year: 1977 }
    }
];

Highcharts.chart('container', {
    chart: {
        inverted: true,
        marginBottom: 100
    },
    title: {
        text: 'Programming Languages by Paradigm'
    },
    series: [
        {
            type: 'treegraph',
            data,
            keys: ['id', 'parent', 'name', 'custom'],
            marker: {
                radius: 0
            },
            link: {
                type: 'default',
                radius: 0
            },
            dataLabels: {
                crop: false,
                allowOverlap: true,
                style: {
                    whiteSpace: 'nowrap',
                    color: '#000000',
                    textOutline: '3px contrast'
                },
                verticalAlign: 'middle'
            },
            levels: [
                {
                    level: 1,
                    dataLabels: {
                        overflow: 'allow',
                        y: 10,
                        style: {
                            textOutline: '6px contrast'
                        }
                    },
                    collapseButton: {
                        x: -15
                    }
                },
                {
                    level: 3,
                    colorByPoint: true
                },
                {
                    level: 4,
                    colorVariation: {
                        key: 'brightness',
                        to: -0.5
                    },
                    dataLabels: {
                        verticalAlign: 'top',
                        rotation: 90,
                        y: 20
                    },
                    marker: {
                        radius: 7
                    }
                }
            ]
        }
    ],
    tooltip: {
        pointFormatter: function () {
            return this.custom?.year ?
                `<b>${this.name}</b><br/>Created in: ${this.custom.year}` :
                `<b>${this.name}</b>`;
        },
        useHTML: true
    }
});
