import * as Highcharts from 'highcharts';
import SeriesLabelModule from "highcharts/modules/series-label";

SeriesLabelModule(Highcharts);

Highcharts.setOptions({
    plotOptions: {
        series: {
            label: {
                boxesToAvoid: [
                    {
                        bottom: 10,
                        left: 0,
                        right: 10,
                        top: 0
                    } as Highcharts.LabelIntersectBoxObject
                ]
            }
        }
    }
});
