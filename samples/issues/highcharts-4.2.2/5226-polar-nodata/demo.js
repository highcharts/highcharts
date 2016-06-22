jQuery(function () {
     QUnit.test('Polar chart with no data', function (assert) {
          assert.expect(0);
          var chart = Highcharts.chart('container', {
                    chart: {
                    polar: true
               },

               series: [{
                    type: 'line',
                    name: 'Line',
                    data: []
               }]
          });
     });
});
