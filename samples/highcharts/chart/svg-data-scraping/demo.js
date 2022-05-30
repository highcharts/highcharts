Highcharts.chart('container', {
    title: {
        text: 'Demo of data scraping from SVG attributes'
    },
    subtitle: {
        text: 'Subtitle goes here'
    },
    caption: {
        text: 'Caption goes here'
    },
    accessibility: {
        description: 'Alt text goes here'
    },
    xAxis: {
        type: 'logarithmic'
    },
    yAxis: {
        title: {
            text: 'Index value'
        }
    },
    plotOptions: {
        series: {
            pointStart: 1
        }
    },
    series: [{
        type: 'line',
        data: [19.9, 21.5, 36.4, 39.2, null, 24.0, 26.0, 25.6]
    }, {
        type: 'arearange',
        data: [
            [1, 10, 12],
            [2, 7, 9],
            [6, 6, 12],
            [7, 9, 11],
            [8, 13, 19]
        ]
    }]
});

// Show basic scraping example. Ideally namespaces should be handled better to ensure
// query selects do not pick up identical attributes from other namespaces.

const NS = 'https://highcharts.com/xmlnamespaces/chart',
    svg = document.getElementById('container').querySelector('svg'),
    getElAttr = (el, attr) => el && el.getAttributeNS(NS, attr),
    getGlobalAttribute = attr => getElAttr(
        svg.querySelector(`[*|${attr}]`) || svg,
        attr
    ),
    getAxisData = () => [...svg.querySelectorAll('[*|axisdimension]')]
        .map(el => ({
            dimension: getElAttr(el, 'axisdimension'),
            title: getElAttr(el, 'axistitle'),
            type: getElAttr(el, 'axistype'),
            visualMax: getElAttr(el, 'axisvisualmax'),
            visualMin: getElAttr(el, 'axisvisualmin'),
            dataMax: getElAttr(el, 'axisdatamax'),
            dataMin: getElAttr(el, 'axisdatamin')
        })),
    getSeriesData = () => [...svg.querySelectorAll('[*|seriestype]')]
        .map(el => ({
            name: getElAttr(el, 'seriesname'),
            type: getElAttr(el, 'seriestype'),
            dataFormat: getElAttr(el, 'dataformat'),
            pointsinseries: getElAttr(el, 'pointsinseries'),
            points: [...el.querySelectorAll('[*|pointdata]')].map(p => {
                const isNull = getElAttr(p, 'pointisnull'),
                    res = { data: getElAttr(p, 'pointdata') };
                if (isNull) {
                    res.isNull = true;
                }
                return res;
            })
        }));

document.getElementById('output').textContent = JSON.stringify({
    title: getGlobalAttribute('title'),
    subtitle: getGlobalAttribute('subtitle'),
    caption: getGlobalAttribute('caption'),
    alt: getGlobalAttribute('alt'),
    axes: getAxisData(),
    series: getSeriesData()
}, null, ' ');
