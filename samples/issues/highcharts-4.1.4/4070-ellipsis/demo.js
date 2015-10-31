$(function () {
    QUnit.test('Label height and ellipsis on update', function (assert) {
        // series dataLabels can start on or off -- the problem seems to be in the update redraw
        var labelsOn = true;

        function toggle(chart) {
            labelsOn = !labelsOn;
            chart.series[0].update({
                dataLabels: {
                    enabled: labelsOn
                }
            }, false); // false b/c could be a loop across all series... use the whole hc.redraw()
            chart.redraw();
        }

        $('#container').highcharts({
            "legend": {
                "enabled": false
            },
            "xAxis": {
                "title": {
                    "enabled": false
                },
                "categories": [
                    "Not enough to choose from",
                    "Can't edit colors",
                    "I like it so far",
                    "Can't edit icons",
                    "Don't like the content/text",
                    "Don't like the colors",
                    "It worked nicely.",
                    "Don't like the icons",
                    "If I had to make a suggestion. For the most part they seem OK",
                    "For the text frames with images",
                    "the tag with Happy Easter on it would be much more useful if you could take the bunny off of it.",
                    "it would be a great improvement if you could actually delete the image and replace it with another. For example",
                    "this seems like a great feature and would like to see more choices",
                    "Many businesses using this tool have company colors that they need to use",
                    "there needs to be a paint brush option or some way to edit the colors of the icons within the text frames.  Other than that",
                    "much more powerful than powerpoint.",
                    "I think it is great - so easy to use",
                    "I can't find these. Where are they?"]
            },
            "yAxis": [{
                "type": "linear",
                "title": {
                    "enabled": false
                }
            }],
            "series": [{
                "animation": false,
                "type": "bar",
                "dataLabels": {
                    enabled: labelsOn
                },
                "data": [
                    [
                        "Not enough to choose from",
                        21],
                    [
                        "Can't edit colors",
                        19],
                    [
                        "I like it so far",
                        14],
                    [
                        "Can't edit icons",
                        10],
                    [
                        "Don't like the content/text",
                        2],
                    [
                        "Don't like the colors",
                        2],
                    [
                        "It worked nicely.",
                        1],
                    [
                        "Don't like the icons",
                        1],
                    [
                        "If I had to make a suggestion. For the most part they seem OK",
                        1],
                    [
                        "For the text frames with images",
                        1],
                    [
                        "the tag with Happy Easter on it would be much more useful if you could take the bunny off of it.",
                        1],
                    [
                        "it would be a great improvement if you could actually delete the image and replace it with another. For example",
                        1],
                    [
                        "this seems like a great feature and would like to see more choices",
                        1],
                    [
                        "Many businesses using this tool have company colors that they need to use",
                        1],
                    [
                        "there needs to be a paint brush option or some way to edit the colors of the icons within the text frames.  Other than that",
                        1],
                    [
                        "much more powerful than powerpoint.",
                        1],
                    [
                        "I think it is great - so easy to use",
                        1],
                    [
                        "I can't find these. Where are they?",
                        1]
                ]
            }]
        });

        var chart = $('#container').highcharts();
        toggle(chart);

        // After update, long labels should have the same height as short ones because they should have ellipsis
        assert.equal(
            chart.xAxis[0].ticks[10].label.getBBox().height,
            chart.xAxis[0].ticks[0].label.getBBox().height,
            'Label height'
        );
    });

});