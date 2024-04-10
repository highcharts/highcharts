const characterAllowList = /[^0-9a-zA-Z\.: ]/g;
const stripHTML = s => s.replace(characterAllowList, '');
const stripHTMLRecurse = o => {
    if (typeof o === 'string') {
        return stripHTML(o);
    }

    Object.keys(o).forEach(key => {
        if (typeof o[key] === 'string') {
            o[key] = stripHTML(o[key]);
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
            'Oranges'
        ],
        labels: {
            useHTML: true
        }
    },
    title: {
        text: '<a href="javascript:console.log(document.domain)">Click me</a>',
        useHTML: true
    },
    series: [{
        data: [1, 4, 3, 5],
        type: 'column'
    }]
});


Highcharts.chart('container', options);
