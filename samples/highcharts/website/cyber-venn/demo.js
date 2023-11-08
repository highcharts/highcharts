const tooltipTexts = [
    'If you\'ve been holding out for a deal on a particular Highcharts data visualization libraries, you\'ll want to check out our Cyber Week Deal.',
    'We provide official integrations for Angular, React, Vue and more. Check out our <a href="https://www.highcharts.com/integrations/">full list of supported frameworks.</a>',
    null,
    'We\'ve added several new exciting products and integrations to our offerings  this year. <a href="https://www.highcharts.com">Check out our Roadmap for details.</a>',
    'Easily style your data visualizations via our simple options-structure using JavaScript or CSS.',
    'We do more than just charts. Elevate your data visualizations with our advanced Stock, Maps, and Gantt libraries.',
    'All of our products are SVG based and use the same simple JavaScript  configuration options, so it\'s easy to add and implement new libraries.',
    null,
    'With a low learning curve and detailed API, our products help developers work smarter and faster, saving time and money.',
    'Check back on November 27, 2023 for the big reveal',
    null,
    'Filled with helpful examples, our API reference will have you customizing your data visualizations in no time and make maintaining them a breeze.'
];

const images = [
    'core.svg',
    'cyber-frameworks.svg',
    null,
    'cyber-products.svg',
    'cyber-customize.svg',
    'cyber-dataviz.svg',
    'cyber-creativity.svg',
    null,
    'cyber-money.svg',
    null,
    null,
    'cyber-curve.svg',
    null,
    null,
    null
];

const titles = [
    'Add to your Highcharts Collection',
    'Integrate with your favorite frameworks',
    null,
    'Explore our latest products',
    'Customize to fit<br>your brand',
    'Up you<br>data viz game',
    'Unleash<br>your creativity',
    null,
    'Save time<br>and money',
    null,
    null,
    'Dive in without a learning curve',
    null,
    null,
    null
];

Highcharts.chart('venn', {
    chart: {
        backgroundColor: '#fff',
        styledMode: (true),
        margin: 0,
        spacing: 0
    },
    plotOptions: {
        venn: {
            enableMouseTracking: true,
            animation: false,
            opacity: 0.8,
            dataLabels: {
                allowOverlap: true,
                useHTML: true,
                className: 'labels',
                enabled: true,
                style: {
                    textOutline: 'none',
                    fontWeight: '200',
                    fontSize: '18px'
                }
            },
            states: {
                inactive: {
                    enabled: false
                },
                hover: {
                    enabled: false
                }
            }
        }
    },
    exporting: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    tooltip: {
        outside: true,
        useHTML: true,
        formatter: function () {
            console.log(this.point.notooltip);
            const tiptext = tooltipTexts[this.point.index];
            const img = images[this.point.index];
            const title = titles[this.point.index];

            const html = '<div class="venntip">' +
            '<div id="tip-title"><img src="http://192.168.1.176:3030/' + img + '"></img>' +
            '<span class="title">' + title + '</span></div>' +
            '<span>' + tiptext + '</span></div>';
            if (this.point.notooltip !== true) {
                return html;
            }
            return false;
        }
    },
    series: [{
        type: 'venn',
        name: 'Our Big Deal',
        data: [{
            sets: ['2'],
            value: 5,
            name: 'collection',
            dataLabels: {
                format: '<div id="collection" class="labels"><img src="http://192.168.1.176:3030/cyber-collection.svg"><span class="text"><br>Add to your Highcharts Collection</span></div>',
                y: -10

            }
        }, {
            sets: ['3'],
            value: 5,
            name: 'frameworks',
            dataLabels: {
                format: '<div id="frameworks" class="labels"><img src="http://192.168.1.176:3030/cyber-frameworks.svg"><span class="text"><br>Integrate with<br>your favorite<br>frameworks</span></div>'
            }
        }, {
            sets: ['4'],
            value: 5,
            name: 'empty',
            notooltip: true,
            dataLabels: {
                enabled: false
            },
            tooltip: {
                enabled: false
            }
        }, {
            sets: ['5'],
            value: 5,
            name: 'products',
            accessibility: {
                description: 'Explore our latest products'
            },
            dataLabels: {
                format: '<div id="products" class="labels"><img src="http://192.168.1.176:3030/cyber-products.svg"><span class="text"><br>Explore<br>our latest<br>products</span></div>',
                y: -10

            }
        }, {
            sets: ['4', '5'],
            value: 3,
            name: 'customize',
            accessibility: {
                description: 'Customize to fit your brand'
            },
            dataLabels: {
                format: '<div id="customize" class="labels"><img src="http://192.168.1.176:3030/cyber-customize.svg"><span class="text"><br>Customize to<br>fit your brand</span></div>'
            }
        }, {
            sets: ['3', '2'],
            value: 3,
            accessibility: {
                description: 'Up your data viz game'
            },
            name: 'dataviz',
            dataLabels: {
                format: '<div id="dataviz" class="labels"><img src="http://192.168.1.176:3030/cyber-dataviz.svg"><span class="text"><br>Up your<br>data viz game</span></div>',
                y: -20,
                x: 10
            }
        }, {
            sets: ['3', '4'],
            value: 3,
            accessibility: {
                description: 'Unleash your creativity'
            },
            name: 'creativity',
            dataLabels: {
                format: '<div id="creativity" class="labels"><img src="http://192.168.1.176:3030/cyber-creativity.svg"><span class="text"><br>Unleash your<br>creativity</span></div>'
            }
        }, {
            sets: ['2', '4', '5'],
            value: 2,
            accessibility: {
                enabled: false
            },
            name: 'empty2',
            notooltip: true,
            dataLabels: {
                enabled: false
            },
            tooltip: {
                enabled: false
            }
        }, {
            sets: ['5', '2'],
            value: 3,
            accessibility: {
                description: 'Save time and money'
            },
            name: 'money',
            dataLabels: {
                format: '<div id="money" class="labels"><img src="http://192.168.1.176:3030/cyber-money.svg"><span class="text"><br>Save time<br>and money</div>'
            }
        }, {
            sets: ['2', '4'],
            value: 1,
            accessibility: {
                description: 'Our big offer'
            },
            name: 'bigdeal',
            notooltip: true,
            dataLabels: {
                format: '<div id="bigdeal" class="labels"><img src="http://192.168.1.176:3030/bigdeal.svg"><span class="text"><br>Check back on November 27, 2023 for the big reveal.</span></div>',
                className: 'big-offer',
                y: 40,
                x: -5
            }
        }, {
            sets: ['3', '5'],
            value: 3,
            accessibility: {
                enabled: false
            },
            name: 'empty3',
            notooltip: true,
            dataLabels: {
                enabled: false,
                format: 'none'
            },
            tooltip: {
                enabled: false
            }
        }, {
            sets: ['3', '4', '5'],
            value: 2,
            accessibility: {
                description: 'Dive in without a learning curve'
            },
            name: 'curve',
            dataLabels: {
                format: '<div id="curve" class="labels"><img src="http://192.168.1.176:3030/cyber-curve.svg"><span class="text"><br>Dive in without a<br>learning curve</div>'
            }
        }, {
            sets: ['2', '3', '5'],
            value: 1,
            accessibility: {
                enabled: false
            },
            name: 'empty4',
            opacity: 1,
            notooltip: true,
            dataLabels: {
                enabled: false
            },
            tooltip: {
                enabled: false
            }
        }, {
            sets: ['2', '3', '4'],
            value: 2,
            accessibility: {
                enabled: false
            },
            name: 'empty5',
            dataLabels: {
                enabled: false,
                format: 'empty5'
            },
            notooltip: true,
            tooltip: {
                enabled: false
            }
        }, {
            sets: ['2', '3', '4', '5'],
            value: 3,
            accessibility: {
                enabled: false
            },
            opacity: 1,
            name: 'empty6',
            notooltip: true,
            dataLabels: {
                enabled: false,
                format: '11'
            },
            tooltip: {
                format: 'asdasdas'
            }
        }]
    }],
    title: {
        text: ''
    }
});