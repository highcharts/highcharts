$(function () {
    QUnit.test("Call labelFormatter when hiding/showing series." , function (assert) {
        var iterator = 0,
            chart = $('#container').highcharts('Chart', {
                legend: {
                    labelFormatter: function(){
                        iterator ++;
                        return '<span style="color:' + (this.visible ? this.color : "yellow") + ';">' + this.name + '</span>';
                    }
                },
                series: [{
                    data: [1,2,3]
                }, {
                    data: [3,2,1],
                    visible: false
                }]
            }).highcharts();

        chart.series[0].hide();
        assert.strictEqual(
            iterator, 
            4,
            'labelFormatter called on hide.'
        );

        chart.series[1].show();
        assert.strictEqual(
            iterator, 
            6,
            'labelFormatter called on show.'
        );
    });
});