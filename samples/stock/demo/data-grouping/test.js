function test(chart) { // eslint-disable-line no-unused-vars
    chart.getSVG = function () {
        this.setTitle(null, { text: 'Test mode' });
        return this.container.innerHTML;
    };
}