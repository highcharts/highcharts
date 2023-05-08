const input = document.getElementById('input').textContent;
const output = document.getElementById('output');

// Custom, non-block  helper
Highcharts.Templating.helpers.divide = function (value, divisor) {
    return value / divisor;
};

output.innerHTML = Highcharts.format(input, {
    header: 'Hello header',
    items: ['Ein', 'To', 'Tre'],
    persons: [{
        firstName: 'Mick',
        lastName: 'Jagger'
    }, {
        firstName: 'Keith',
        lastName: 'Richards'
    }],
    value: 2000,
    condition: true,
    innerCondition: true,
    falseCondition: false,
    footer: 'Hello footer'
});