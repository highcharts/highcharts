// const imgPath = 'http://192.168.1.176:3030/';
const imgPath = 'https://www.highcharts.com/samples/graphics/cyber-monday/';

// title, tip, image
const collection = ['Add to your Highcharts Collection', 'If you\'ve been holding out for a deal on a particular Highcharts data visualization libraries, you\'ll want to check out our Cyber Week Deal.', 'core.svg'];

const frameworks = ['Integrate with your favorite frameworks', 'We provide official integrations for Angular, React, Vue and more.', 'cyber-frameworks.svg'];

const products = ['Explore our latest products', 'We\'ve added several new exciting products and integrations to our offerings  this year. <a href="https://www.highcharts.com">Check out our Roadmap for details.</a>', 'cyber-products.svg'];

const customize = ['Customize to fit your brand', 'Easily style your data visualizations via our simple options-structure using JavaScript or CSS.', 'cyber-customize.svg'];

const dataviz = ['Up your data viz game',  'We do more than just charts. Elevate your data visualizations with our advanced Stock, Maps, and Gantt libraries.', 'cyber-dataviz.svg'];

const creativity = ['Unleash your creativity', 'All of our products are SVG based and use the same simple JavaScript  configuration options, so it\'s easy to add and implement new libraries.', 'cyber-creativity.svg'];

const money = ['Save time and money', 'With a low learning curve and detailed API, our products help developers work smarter and faster, saving time and money.', 'cyber-money.svg'];

const curve = ['Dive in without a learning curve',  'Filled with helpful examples, our API reference will have you customizing your data visualizations in no time and make maintaining them a breeze.',  'cyber-curve.svg'];

const terms = ['Offer Terms', 'Get 70% off Highcharts Dashboards with the purchase of any Highcharts Charting Library. The discount applies to the first year only. Licenses must be purchased in our webshop. Only one discount per purchase.', null];

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

// const saleImages = [
//     collection[2], frameworks[2], null, products[2],
//     customize[2], dataviz[2], creativity[2],
//     null, money[2], null, null, null, curve[2], null, terms[2]
// ];

const saleTitles = [
    collection[0], frameworks[0], null, products[0],
    customize[0], dataviz[0], creativity[0],
    null, money[0], null, null, null, curve[0], null, terms[0]
];

const countDownDate = new Date('2023-11-27T07:00:00Z').getTime();
const now = new Date().getTime();
const distance = countDownDate - now;


const presale = {
    lang: {
        accessibility: {
            chartContainerLabel: 'Venn diagram of Cyber Week deal benefits'
        }
    },
    accessibility: {
        point: {
            descriptionFormatter: function (point) {
                return point.accessibility.description;
            }
        },
        screenReaderSection: {
            beforeChartFormat: '<p>A venn diagram showing 8 major benefits of our big Cyber Week deal ' +
                'that we will reveal on November 27. </p>'
        },
        landmarkVerbosity: 'one'
    },
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
                description: 'Add to your Highcharts Collection - If you\'ve been holding out for a deal on a particular Highcharts data visualization libraries, you\'ll want to check out our Cyber Week Deal.'
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
                description: 'Integrate with your favorite frameworks - We provide official integrations for Angular, React, Vue and more.'
            },
            dataLabels: {
                format: '<div id="frameworks" class="labels"><img src="' + imgPath + 'cyber-frameworks.svg"><span class="text"><br>Integrate with<br>your favorite<br>frameworks</span></div>'
            }
        }, {
            sets: ['4'],
            value: 5,
            name: 'empty',
            notooltip: true,
            accessibility: {
                enabled: false
            },
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
                description: 'Explore our latest products - We\'ve added several new exciting products and integrations to our offerings  this year. Check out our Roadmap for details.'

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
                description: 'Customize to fit your brand - Easily style your data visualizations via our simple options-structure using JavaScript or CSS.'
            },
            dataLabels: {
                format: '<div id="customize" class="labels"><img src="' + imgPath + 'cyber-customize.svg"><span class="text"><br>Customize to<br>fit your brand</span></div>'
            }
        }, {
            sets: ['3', '2'],
            value: 3,
            accessibility: {
                description: 'Up your data viz game - We do more than just charts. Elevate your data visualizations with our advanced Stock, Maps, and Gantt libraries.'
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
                description: 'Unleash your creativity - All of our products are SVG based and use the same simple JavaScript  configuration options, so it\'s easy to add and implement new libraries.'
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
                description: 'Save time and money - With a low learning curve and detailed API, our products help developers work smarter and faster, saving time and money.'
            },
            name: 'money',
            dataLabels: {
                format: '<div id="money" class="labels"><img src="' + imgPath + 'cyber-money.svg"><span class="text"><br>Save time<br>and money</div>'
            }
        }, {
            sets: ['2', '4'],
            value: 1,
            accessibility: {
                description: 'Our big deal - Get 70% off Highcharts Dashboards with the purchase of any Highcharts Charting Library. The discount applies to the first year only. Licenses must be purchased in our webshop. Only one discount per purchase.'
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
                description: 'Dive in without a learning curve - Filled with helpful examples, our API reference will have you customizing your data visualizations in no time and make maintaining them a breeze.'
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
    lang: {
        accessibility: {
            chartContainerLabel: 'Venn diagram of Cyber Week deal benefits'
        }
    },
    accessibility: {
        point: {
            descriptionFormatter: function (point) {
                return point.accessibility.description;
            }
        },
        screenReaderSection: {
            beforeChartFormat: '<p>A venn diagram showing 8 major benefits of our big Cyber Week deal: ' +
                '70% off Highcharts Dashboards. </p>'
        },
        landmarkVerbosity: 'one'
    },
    chart: {
        backgroundColor: '#fff',
        styledMode: (true),
        margin: 0,
        spacing: 20,
        plotBorderWidth: 1,
        plotBorderColor: 'red'
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
        distance: 80,
        useHTML: true,
        formatter: function () {
            const tiptext = saleTips[this.point.index];
            // const img = saleImages[this.point.index];
            const title = saleTitles[this.point.index];
            const html = `<div class="venntip"><b>${title}</b>
            <br><span>${tiptext}</span></div>`;
            if (this.point.notooltip !== true) {
                return html;
            }
            return false;
        }
    },
    series: [{
        type: 'venn',
        name: 'Our Big Deal',
        point: {
            events: {
                mouseOver: function () {
                    if (this.name === 'creativity' || this.name === 'customize') {
                        this.series.chart.update({
                            tooltip: {
                                distance: 60
                            }
                        });
                    } else {
                        this.series.chart.update({
                            tooltip: {
                                distance: 80
                            }
                        });
                    }
                }
            }
        },
        data: [{
            sets: ['2'],
            value: 5,
            name: 'collection',
            accessibility: {
                description: 'Add to your Highcharts Collection - If you\'ve been holding out for a deal on a particular Highcharts data visualization libraries, you\'ll want to check out our Cyber Week Deal.'
            },
            dataLabels: {
                format: '<div id="collection" class="labels"><img src="' + imgPath + 'cyber-collection.svg" alt="Highcharts collection icon"><span class="text"><br>Add to your Highcharts Collection</span></div>',
                y: -10

            }
        }, {
            sets: ['3'],
            value: 5,
            name: 'frameworks',
            accessibility: {
                description: 'Integrate with your favorite frameworks - We provide official integrations for Angular, React, Vue and more.'
            },
            dataLabels: {
                format: '<div id="frameworks" class="labels"><img src="' + imgPath + 'cyber-frameworks.svg" alt="frameworks icon"><span class="text"><br>Integrate with<br>your favorite<br>frameworks</span></div>'
            }
        }, {
            sets: ['4'],
            value: 5,
            name: 'empty',
            notooltip: true,
            accessibility: {
                enabled: false
            },
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
                description: 'Explore our latest products - We\'ve added several new exciting products and integrations to our offerings  this year. Check out our Roadmap for details.'
            },
            dataLabels: {
                format: '<div id="products" class="labels"><img src="' + imgPath + 'cyber-products.svg" alt="our products icon"><span class="text"><br>Explore<br>our latest<br>products</span></div>',
                y: -10

            }
        }, {
            sets: ['4', '5'],
            value: 3,
            name: 'customize',
            accessibility: {
                description: 'Customize to fit your brand - Easily style your data visualizations via our simple options-structure using JavaScript or CSS.'
            },
            dataLabels: {
                format: '<div id="customize" class="labels"><img src="' + imgPath + 'cyber-customize.svg" alt="customize icon"><span class="text"><br>Customize to<br>fit your brand</span></div>'
            }
        }, {
            sets: ['3', '2'],
            value: 3,
            accessibility: {
                description: 'Up your data viz game - We do more than just charts. Elevate your data visualizations with our advanced Stock, Maps, and Gantt libraries.'
            },
            name: 'dataviz',
            dataLabels: {
                format: '<div id="dataviz" class="labels"><img src="' + imgPath + 'cyber-dataviz.svg" alt="data viz icon"><span class="text"><br>Up your<br>data viz game</span></div>',
                y: -20,
                x: 10
            }
        }, {
            sets: ['3', '4'],
            value: 3,
            accessibility: {
                description: 'Unleash your creativity - All of our products are SVG based and use the same simple JavaScript  configuration options, so it\'s easy to add and implement new libraries.'
            },
            name: 'creativity',
            dataLabels: {
                format: '<div id="creativity" class="labels"><img src="' + imgPath + 'cyber-creativity.svg" alt="creativity icon"><span class="text"><br>Unleash your<br>creativity</span></div>'
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
                description: 'Save time and money - With a low learning curve and detailed API, our products help developers work smarter and faster, saving time and money.'
            },
            name: 'money',
            dataLabels: {
                format: '<div id="money" class="labels"><img src="' + imgPath + 'cyber-money.svg" alt="money icon"><span class="text"><br>Save time<br>and money</div>'
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
            notooltip: true,
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
                description: 'Dive in without a learning curve - Filled with helpful examples, our API reference will have you customizing your data visualizations in no time and make maintaining them a breeze.'
            },
            name: 'curve',
            opacity: 1,
            dataLabels: {
                format: '<div id="curve" class="labels"><img src="' + imgPath + 'cyber-curve.svg" alt="learning curve icon"><span class="text"><br>Dive in without a<br>learning curve</div>',
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
                description: 'Our big deal - Get 70% off Highcharts Dashboards with the purchase of any Highcharts Charting Library. The discount applies to the first year only. Licenses must be purchased in our webshop. Only one discount per purchase.'
            },
            opacity: 1,
            name: 'big deal',
            notooltip: true,
            dataLabels: {
                enabled: true,
                format: `
                <div id="sale">
                <img id="discount" src="${imgPath}discount.svg" alt="70% off"/>
                <img id="icon" src="${imgPath}icon.svg"
                alt="dashboards product icon"/>
                <img id="logo-type" alt="Highcharts"
                src="${imgPath}logo-type.svg"/>
                <p>Dashboards</p>
                <div id="terms" class="labels"><a href="#">see terms</a></div>
                <div id="tip" class="tip"><b>Offer Terms:</b> ${terms[1]}</div>
                <div id="dash-button">
                <a class="Button Button-secondary Button-small" 
                href="https://www.highcharts.com/products/dashboards/" 
                target="_top">
                <div class="Button-content">Explore Dashboards</div></a></div>
            </div>`
            }
        }]
    }],
    title: {
        text: ''
    }
};

let chart;

setTimeout(function () {

    const labels =  document.querySelectorAll('.labels');

    [].forEach.call(labels, function (element) {
        element.addEventListener('mouseout', function () {
            chart.tooltip.hide();
        });
    });

    document.getElementById('terms').addEventListener('mouseover', function (e) {
        document.getElementById('tip').style.opacity = 1;
        document.getElementById('tip').style.visibility = 'visible';
    });

    document.getElementById('terms').addEventListener('mouseout', function () {
        document.getElementById('tip').style.opacity = 0;
        document.getElementById('tip').style.visibility = 'hidden';
    });


}, 100);


document.addEventListener('DOMContentLoaded', function () {

    if (distance < 0) {
        document.getElementById('venn').classList.add('sale');
        chart = Highcharts.chart('venn', sale);
    } else {
        Highcharts.chart('venn', presale);
    }
});
