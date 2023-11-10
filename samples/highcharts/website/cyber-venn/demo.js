// title, tip, image
const collection = ['Add to your Highcharts Collection', 'If you\'ve been holding out for a deal on a particular Highcharts data visualization libraries, you\'ll want to check out our Cyber Week Deal.', 'core.svg'];

const frameworks = ['Integrate with your favorite frameworks', 'We provide official integrations for Angular, React, Vue and more. Check out our <a href="https://www.highcharts.com/integrations/">full list of supported frameworks.</a>', 'cyber-frameworks.svg'];

const products = ['Explore our latest products', 'We\'ve added several new exciting products and integrations to our offerings  this year. <a href="https://www.highcharts.com">Check out our Roadmap for details.</a>', 'cyber-products.svg'];

const customize = ['Customize to fit<br>your brand', 'Easily style your data visualizations via our simple options-structure using JavaScript or CSS.', 'cyber-customize.svg'];

const dataviz = ['Up you<br>data viz game',  'We do more than just charts. Elevate your data visualizations with our advanced Stock, Maps, and Gantt libraries.', 'cyber-dataviz.svg'];

const creativity = ['Unleash<br>your creativity', 'All of our products are SVG based and use the same simple JavaScript  configuration options, so it\'s easy to add and implement new libraries.', 'cyber-creativity.svg'];

const money = ['Save time<br>and money', 'With a low learning curve and detailed API, our products help developers work smarter and faster, saving time and money.', 'cyber-money.svg'];

const curve = ['Dive in without a learning curve',  'Filled with helpful examples, our API reference will have you customizing your data visualizations in no time and make maintaining them a breeze.',  'cyber-curve.svg'];

const terms = ['Offer Terms', 'Get 70% off Highcharts Dashboards when you purchase of any Highcharts Charting Library.', null];


const presaleTips = [
    collection[1], frameworks[1], null, products[1],
    customize[1], dataviz[1], creativity[1],
    null, money[1], null, null, curve[1]
];

const presaleImages = [
    collection[2], frameworks[2], null, products[2],
    customize[2], dataviz[2], creativity[2],
    null, money[2], null, null, curve[2]
];

const presaleTitles = [
    collection[0], frameworks[0], null, products[0],
    customize[0], dataviz[0], creativity[0],
    null, money[0], null, null, curve[0]
];


const saleTips = [
    collection[1], frameworks[1], null, products[1],
    customize[1], dataviz[1], creativity[1],
    null, money[1], null, null, null, curve[1], null, terms[1]
];

const saleImages = [
    collection[2], frameworks[2], null, products[2],
    customize[2], dataviz[2], creativity[2],
    null, money[2], null, null, null, curve[2], null, terms[2]
];

const saleTitles = [
    collection[0], frameworks[0], null, products[0],
    customize[0], dataviz[0], creativity[0],
    null, money[0], null, null, null, curve[0], null, terms[0]
];


const imgPath = 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@c954a915b117ed0a80dbb48a08d9ade98da49bee/samples/graphics/cyber-monday/';

const countDownDate = new Date('2023-11-07T07:00:00Z').getTime();
const now = new Date().getTime();
const distance = countDownDate - now;


const presale = {
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
            const tiptext = presaleTips[this.point.index];
            const img = presaleImages[this.point.index];
            const title = presaleTitles[this.point.index];

            const html = '<div class="venntip">' +
            '<div id="tip-title"><img src="' + imgPath + img + '"></img>' +
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
            accessibility: {
                description: 'Add to your Highcharts Collection'
            },
            dataLabels: {
                format: '<div id="collection" class="labels"><img src="' + imgPath + 'cyber-collection.svg"><span class="text"><br>Add to your Highcharts Collection</span></div>',
                y: -10

            }
        }, {
            sets: ['3'],
            value: 5,
            name: 'frameworks',
            accessibility: {
                description: 'Integrate with your favorite frameworks'
            },
            dataLabels: {
                format: '<div id="frameworks" class="labels"><img src="' + imgPath + 'cyber-frameworks.svg"><span class="text"><br>Integrate with<br>your favorite<br>frameworks</span></div>'
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
                format: '<div id="products" class="labels"><img src="' + imgPath + 'cyber-products.svg"><span class="text"><br>Explore<br>our latest<br>products</span></div>',
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
                format: '<div id="customize" class="labels"><img src="' + imgPath + 'cyber-customize.svg"><span class="text"><br>Customize to<br>fit your brand</span></div>'
            }
        }, {
            sets: ['3', '2'],
            value: 3,
            accessibility: {
                description: 'Up your data viz game'
            },
            name: 'dataviz',
            dataLabels: {
                format: '<div id="dataviz" class="labels"><img src="' + imgPath + 'cyber-dataviz.svg"><span class="text"><br>Up your<br>data viz game</span></div>',
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
                format: '<div id="creativity" class="labels"><img src="' + imgPath + 'cyber-creativity.svg"><span class="text"><br>Unleash your<br>creativity</span></div>'
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
                format: '<div id="money" class="labels"><img src="' + imgPath + 'cyber-money.svg"><span class="text"><br>Save time<br>and money</div>'
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
                format: '<div id="bigdeal" class="labels"><img src="' + imgPath + 'bigdeal.svg"><span class="text"><br>Check back on November 27, 2023 for the big reveal.</span></div>',
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
                format: '<div id="curve" class="labels"><img src="' + imgPath + 'cyber-curve.svg"><span class="text"><br>Dive in without a<br>learning curve</div>'
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
            }
        }]
    }],
    title: {
        text: ''
    }
};

const sale = {
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
            const tiptext = saleTips[this.point.index];
            const img = saleImages[this.point.index];
            const title = saleTitles[this.point.index];

            let html = '<div class="venntip">' +
            '<div id="tip-title">';
            if (img !== null) {
                html = html + '<img src="' + imgPath + img + '"></img>';
            }
            html = html + '<span class="title">' + title + '</span></div>' +
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
            accessibility: {
                description: 'Add to your Highcharts Collection'
            },
            dataLabels: {
                format: '<div id="collection" class="labels"><img src="' + imgPath + 'cyber-collection.svg"><span class="text"><br>Add to your Highcharts Collection</span></div>',
                y: -10

            }
        }, {
            sets: ['3'],
            value: 5,
            name: 'frameworks',
            accessibility: {
                description: 'Integrate with your favorite frameworks'
            },
            dataLabels: {
                format: '<div id="frameworks" class="labels"><img src="' + imgPath + 'cyber-frameworks.svg"><span class="text"><br>Integrate with<br>your favorite<br>frameworks</span></div>'
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
                format: '<div id="products" class="labels"><img src="' + imgPath + 'cyber-products.svg"><span class="text"><br>Explore<br>our latest<br>products</span></div>',
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
                format: '<div id="customize" class="labels"><img src="' + imgPath + 'cyber-customize.svg"><span class="text"><br>Customize to<br>fit your brand</span></div>'
            }
        }, {
            sets: ['3', '2'],
            value: 3,
            accessibility: {
                description: 'Up your data viz game'
            },
            name: 'dataviz',
            dataLabels: {
                format: '<div id="dataviz" class="labels"><img src="' + imgPath + 'cyber-dataviz.svg"><span class="text"><br>Up your<br>data viz game</span></div>',
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
                format: '<div id="creativity" class="labels"><img src="' + imgPath + 'cyber-creativity.svg"><span class="text"><br>Unleash your<br>creativity</span></div>'
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
                format: '<div id="money" class="labels"><img src="' + imgPath + 'cyber-money.svg"><span class="text"><br>Save time<br>and money</div>'
            }
        }, {
            sets: ['2', '4'],
            value: 1,
            accessibility: {
                enabled: false
            },
            name: 'empty3',
            notooltip: true,
            dataLabels: {
                enabled: false
            }
        }, {
            sets: ['3', '5'],
            value: 3,
            accessibility: {
                enabled: false
            },
            name: 'empty4',
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
                enabled: false
            },
            name: 'empty',
            dataLabels: {
                enabled: false
            }
        }, {
            sets: ['2', '3', '5'],
            value: 1,
            accessibility: {
                description: 'Dive in without a learning curve'
            },
            name: 'curve',
            opacity: 1,
            dataLabels: {
                format: '<div id="curve" class="labels"><img src="' + imgPath + 'cyber-curve.svg"><span class="text"><br>Dive in without a<br>learning curve</div>',
                y: -10
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
            name: 'big deal',
            dataLabels: {
                enabled: true,
                format: `<div id="sale">
                <div id="date">Nov 27 - Dec 3</div>
                <img src="http://192.168.1.176:3030/product-logo.png"/>
                <p>Dashboards</p>
                <div id="terms" class="labels"><span class="text">With the purchase of any <br>Highcharts Charting Library</span><a href="#">see terms</a></div>
            </div>`
            }
        }]
    }],
    title: {
        text: ''
    }
};

document.addEventListener('DOMContentLoaded', function () {

    if (distance < 0) {
        document.getElementById('venn').classList.add('sale');
        Highcharts.chart('venn', sale);
    } else {
        Highcharts.chart('venn', presale);
    }
});