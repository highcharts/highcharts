// Age categories
const categories = [
    "0-14",
    "15-24",
    "25-44",
    "45-64",
    "65-84",
    "85+",
    "30-34",
    "35-39",
    "40-44",
    "45-49",
    "50-54",
    "55-59",
    "60-64",
    "65-69",
    "70-74",
    "75-79",
    "80-84",
    "85-89",
    "90-94",
    "95-99",
    "100 + "
];
const maleColor = { patternIndex: 0 },
    femaleColor = { patternIndex: 5 };
Highcharts.chart("container", {
    chart: {
        type: "bar"
    },
    title: {
        text: "Denmark Population Pyramid 2019"
    },
    subtitle: {
        text:
      'Source: <a href="https://www.populationpyramid.net/denmark/2019/">populationpyramid</a>'
    },
    accessibility: {
        point: {
            valueDescriptionFormat: "{index}. Age {xDescription}, {value}%."
        }
    },
    xAxis: [
        {
            categories: categories,
            reversed: false,
            labels: {
                step: 1
            },
            accessibility: {
                description: "Age (male)"
            }
        },
        {
            // mirror axis on right side
            opposite: true,
            reversed: false,
            categories: categories,
            linkedTo: 0,
            labels: {
                step: 1
            },
            accessibility: {
                description: "Age (female)"
            }
        }
    ],
    yAxis: {
        title: {
            text: null
        },
        labels: {
            formatter: function () {
                return Math.abs(this.value) + "%";
            }
        },
        accessibility: {
            description: "Percentage population",
            rangeDescription: "Range: 0 to 5%"
        }
    },

    plotOptions: {
        series: {
            stacking: "normal",
            groupPadding: 0,
            pointPadding: 0
        }
    },

    tooltip: {
        formatter: function () {
            return (
                "<b>" +
        this.series.name +
        ", age " +
        this.point.category +
        "</b><br/>" +
        "Population: " +
        Highcharts.numberFormat(Math.abs(this.point.y), 1) +
        "%"
            );
        }
    },

    series: [
        {
            name: "Male",
            color: maleColor,
            borderColor: "#000000",
            data: [-8.42, -6.39, -12.47, -13.23, -8.44, -0.77]
        },
        {
            name: "Female",
            color: femaleColor,
            borderColor: "#000000",
            data: [7.98, 6.1, 12.21, 13.25, 9.34, 1.41]
        }
    ]
});
