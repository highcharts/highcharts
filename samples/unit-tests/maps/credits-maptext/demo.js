$(function () {

    QUnit.test('Credits', function (assert) {

        var chart = new Highcharts.Map({
            chart: {
                renderTo: 'container'
            },
            credits: {
                mapText: 'Test map credits',
                mapTextFull: 'Test full map credits'
            },
            series: [{
                mapData: Highcharts.maps['countries/bn/bn-all']
            }]
        });

        assert.strictEqual(
            chart.credits.element.textContent,
            Highcharts.getOptions().credits.text + 'Test map creditsTest full map credits',
            'Setting map credits inline'
        );


        // Remove by default

        Highcharts.setOptions({
            credits: {
                mapText: '',
                mapTextFull: ''
            }
        });

        chart = new Highcharts.Map({
            chart: {
                renderTo: 'container'
            },
            series: [{
                mapData: Highcharts.maps['countries/bn/bn-all']
            }]
        });

        assert.strictEqual(
            chart.credits.element.textContent,
            Highcharts.getOptions().credits.text,
            'Removing map credits by default options'
        );


        // Setting default

        Highcharts.setOptions({
            credits: {
                mapText: 'Map credits test',
                mapTextFull: 'Map credits full test'
            }
        });

        chart = new Highcharts.Map({
            chart: {
                renderTo: 'container'
            },
            series: [{
                mapData: Highcharts.maps['countries/bn/bn-all']
            }]
        });

        assert.strictEqual(
            chart.credits.element.textContent,
            Highcharts.getOptions().credits.text + 'Map credits testMap credits full test',
            'Setting map credits default options'
        );


        // Setting both default and inline - text only

        chart = new Highcharts.Map({
            chart: {
                renderTo: 'container'
            },
            credits: {
                text: 'Test'
            },
            series: [{
                mapData: Highcharts.maps['countries/bn/bn-all']
            }]
        });

        assert.strictEqual(
            chart.credits.element.textContent,
            'TestMap credits testMap credits full test',
            'Setting map credits default options as well as inline'
        );


        // Setting both default and overruling by inline

        chart = new Highcharts.Map({
            chart: {
                renderTo: 'container'
            },
            credits: {
                mapText: 'PrecedenceMapText',
                mapTextFull: 'PrecedenceMapTextFull',
                text: 'PrecedenceTest'
            },
            series: [{
                mapData: Highcharts.maps['countries/bn/bn-all']
            }]
        });

        assert.strictEqual(
            chart.credits.element.textContent,
            'PrecedenceTestPrecedenceMapTextPrecedenceMapTextFull',
            'Setting map credits default options as well as inline, inline takes precedence'
        );



    });

});