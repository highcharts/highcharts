/* eslint-disable no-undef */
const stripHTMLRecurse = o => {
    if (typeof o === 'string') {
        return DOMPurify.sanitize(o);
    }

    Object.keys(o).forEach(key => {
        if (typeof o[key] === 'string') {
            o[key] = DOMPurify.sanitize(o[key]);
        } else if (Array.isArray(o[key])) {
            o[key].forEach((item, i) => {
                o[key][i] = stripHTMLRecurse(item);
            });
        } else if (typeof o[key] === 'object') {
            o[key] = stripHTMLRecurse(o[key]);
        }
    });
    return o;
};

const options = stripHTMLRecurse({
    xAxis: {
        categories: [
            'Apples',
            '<a href="javascript:console.log(document.domain)">Click me</a>',
            'Bananas',
            '<span style="color: orange">Oranges</span>'
        ],
        labels: {
            useHTML: true
        }
    },
    title: {
        text: '<a href="java\x09cript:console.log(document.domain)">Click me</a>',
        useHTML: true
    },
    series: [{
        data: [1, 4, 3, 5],
        type: 'column'
    }]
});


Highcharts.chart('container', options);
