$(function () {
    // the button handler
    var chart,
        $anim_false = $("#anim_false"),
        $anim_true = $("#anim_true"),
        $anim_dur_100 = $("#anim_dur_100"),
        $anim_dur_1000 = $("#anim_dur_1000");

    // create the chart
    chart = $('#container').highcharts({
        chart: {
            type: "pie",
            animation: false,
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0,
                depth: 100
            },
        },
        series: [{
            animation: false,
            depth: 45,
            data: [29.9, 71.5, 106.4]
        }]
    }).highcharts();

    $anim_true.click(function () {
        chart.setSize(300, 400, false);
        chart.setSize(200, 200, true);
    });
    $anim_false.click(function () {
        chart.setSize(300, 400, false);
        chart.setSize(200, 200, false);
    });
    $anim_dur_100.click(function () {
        chart.setSize(300, 400, false);
        chart.setSize(200, 200, { duration: 100 });
    });
    $anim_dur_1000.click(function () {
        chart.setSize(300, 400, false);
        chart.setSize(200, 200, { duration: 1000 });
    });
});