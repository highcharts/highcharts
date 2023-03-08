QUnit.test('getSVG', function (assert) {
    var chart = Highcharts.chart('container', {
        accessibility: {
            enabled: false // Adds DOM elements to container
        },

        credits: {
            enabled: false
        },

        xAxis: {
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ]
        },

        series: [
            {
                data: [
                    29.9,
                    71.5,
                    106.4,
                    129.2,
                    144.0,
                    176.0,
                    135.6,
                    148.5,
                    216.4,
                    194.1,
                    95.6,
                    54.4
                ]
            },
            {
                data: [4, 2, 5, 3, 6, 5, 6, 3, 4],
                id: 'second'
            }
        ]
    });

    var initialChartsLength = Highcharts.charts.length,
        svg,
        output,
        isIframe,
        siblings;

    svg = chart.getSVG({
        yAxis: [
            {
                title: {
                    text: 'New yAxis Title'
                }
            }
        ],
        series: [
            {
                name: 'New Series Name'
            }
        ]
    });

    const controller = new TestController(chart);
    controller.pan([100, 100], [200, 100]);

    assert.notOk(
        chart.mouseIsDown,
        '#15845: Selection should be droppable after exporting'
    );

    assert.strictEqual(
        Highcharts.charts.length,
        initialChartsLength,
        'Chart length is still as initial'
    );

    assert.strictEqual(typeof svg, 'string', 'SVG is string');

    assert.strictEqual(svg.indexOf('<svg '), 0, 'Starts correctly');

    assert.strictEqual(svg.indexOf('</svg>'), svg.length - 6, 'Ends correctly');

    assert.strictEqual(svg.length > 1000, true, 'Has some content');

    output = document.getElementById('output');
    output.innerHTML = svg;

    assert.strictEqual(
        output.querySelector(
            '.highcharts-legend .highcharts-series-0 text'
        ).textContent,
        'New Series Name',
        'No reference, series name ok'
    );

    svg = chart.getSVG({
        series: [
            {
                name: 'Second Series Name',
                id: 'second'
            }
        ]
    });

    output = document.getElementById('output');
    output.innerHTML = svg;

    assert.strictEqual(
        output.querySelector(
            '.highcharts-legend .highcharts-series-1 text'
        ).textContent,
        'Second Series Name',
        'Reference by id, series name ok'
    );

    // #14954
    const remove = Element.prototype.remove;
    Element.prototype.remove = void 0;

    chart.getSVG({
        chart: {
            styledMode: true
        }
    });

    siblings = Array.prototype.slice.call(
        chart.container.parentNode.parentNode.childNodes
    );

    isIframe = siblings.some(function (elem) {
        return elem.tagName === 'IFRAME';
    });

    assert.strictEqual(
        // (#12273)
        isIframe,
        false,
        'Iframe should be destroyed in DOM after getSVG().'
    );

    Element.prototype.remove = remove;
});

QUnit.test('Hide label with useHTML', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    style: {
                        color: 'blue',
                        fontSize: '13px'
                    }
                }
            }
        },

        series: [
            {
                data: [1, 2, 3, 4]
            }
        ]
    });

    assert.ok(
        document
            .querySelector('#container .highcharts-data-labels g text')
            .getAttribute('style')
            .indexOf('blue') > -1,
        'Blue text initially'
    );

    // Replace with exported SVG
    document.getElementById('output').innerHTML = chart.getSVGForExport(
        {},
        {
            plotOptions: {
                series: {
                    dataLabels: {
                        backgroundColor: '#bebebe',
                        style: {
                            fontSize: '30px',
                            color: 'red'
                        }
                    }
                }
            }
        }
    );
    assert.ok(
        document
            .querySelector('#output .highcharts-data-labels g text')
            .getAttribute('style')
            .indexOf('red') > -1,
        'Red text in export'
    );
});

QUnit.test('getSVGForExport XHTML', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        exporting: {
            enabled: true,
            allowHTML: true
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    useHTML: true,
                    format:
                        '<img width="20" height="20" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNjRweCIgaGVpZ2h0PSI2NHB4IiB2aWV3Qm94PSIwIDAgNjQgNjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU5LjEgKDg2MTQ0KSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT5wZXJzb25hbGludGVyZXN0cy1hcnRlbnRodXNpYXN0PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IkRBU0hCT0FSRFMtLS1hdWRpZW5jZXMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJEZXNrdG9wLUhELUNvcHktMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQzNy4wMDAwMDAsIC0xOTUuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJwZXJzb25hbGludGVyZXN0cy1hcnRlbnRodXNpYXN0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MzcuMDAwMDAwLCAxOTUuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLUNvcHktNyIgZmlsbD0iI0VEQzdERSIgY3g9IjMyIiBjeT0iMzIiIHI9IjMyIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQuMDAwMDAwLCAxMy4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTMuNDQyMDgxMiwyLjQ4Njg5OTU4ZS0xNCBDMTkuMTg5MTM4OSwyLjQ4Njg5OTU4ZS0xNCAyNi43MzE0MjM1LDQuMDI1MzM3NyAyOS42MjE3NzU1LDEyLjEyMTkzNzYgQzI2LjkzOTU0MSwxNC42NDA2NDggMjMuNzM3MTQwMSwxNy44NzU0MDY0IDIwLjAxNDQ2MzYsMjEuODI2OTA0NSBDMTguODc0MTE3OCwyMS45MDgxNjI0IDE3LjY1NzY1ODksMjIuMjUxMDk4NCAxNi4zNjUwODcyLDIyLjg1NTcxMjYgQzE0LjU1NTQ4NjcsMjMuNzAyMTcyMyAxNC40MzQ4NDY3LDI2LjYwMTU4NjUgMTQuNDI2ODA0LDI3LjQwMzAxNzMgTDE0LjQyNjIyOTUsMjcuNTQxMTI3NyBDMTQuNDI2MjI5NSwzMC4wMzc2MjU2IDExLjI5NjExMzYsMjguOTUxMjkzOSAxMS4yOTYxMTM2LDMwLjMwMzU1MzYgQzExLjI5NjExMzYsMzEuNjU1ODEzNCAxNi4yMDAxMzc5LDMyLjEzMTIzODEgMTkuMDM1MzI1NywzMS40OTczNTQgQzIwLjkyNTQ1MDksMzEuMDc0NzY0NyAyMi41MjM3MjM1LDI5LjEwOTIzMDEgMjMuODMwMTQzNCwyNS42MDA3NTAyIEMyNi40ODU0NTk3LDIzLjAyNTEzMDYgMjguODExNjQ4NCwyMC42OTU3OTY1IDMwLjgwODcwOTYsMTguNjEyNzQ3OCBDMzAuODE1OTUyNCwxOC44NTYzMjIyIDMwLjgxOTY3MjEsMTkuMTAxODMyMSAzMC44MTk2NzIxLDE5LjM0OTczNTQgQzMwLjgxOTY3MjEsMzIuMjgwMzg1OSAyMC4yMTc3ODIsMzYuNDcwMzMwNSAxMy40NDIwODEyLDM2LjQ3MDMzMDUgQzYuNjY2MzgwNDcsMzYuNDcwMzMwNSAwLDMzLjMxNzYzMjMgMCwyNy40Mjk0NzkyIEMwLDIxLjU0MTMyNiA1LjA0MzY0NTM3LDI0LjMyNzQ4MzggNS4wNDM2NDUzNywxNy43ODE4MDU5IEM1LjA0MzY0NTM3LDExLjIzNjEyOCAwLDE0LjgwNjIxMDIgMCw4LjEzNjI5NjYyIEMwLDEuNDY2MzgzIDYuMTg0NjgyOTYsMi40ODY4OTk1OGUtMTQgMTMuNDQyMDgxMiwyLjQ4Njg5OTU4ZS0xNCBaIiBpZD0iQ29tYmluZWQtU2hhcGUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTIwLjAxNDQ2MzYsMjEuODI2OTA0NSBDMzEuNTUzMTI5LDkuNTc4OTkyMzcgMzguMDkzMzU5OCw0LjIxNzAwMTYyIDM5LjYzNTE1NjEsNS43NDA5MzIyMSBDNDEuMTc2OTUyMyw3LjI2NDg2MjggMzUuOTA4NjE0OCwxMy44ODQ4MDIxIDIzLjgzMDE0MzQsMjUuNjAwNzUwMiBDMjIuNTIzNzIzNSwyOS4xMDkyMzAxIDIwLjkyNTQ1MDksMzEuMDc0NzY0NyAxOS4wMzUzMjU3LDMxLjQ5NzM1NCBDMTYuMjAwMTM3OSwzMi4xMzEyMzgxIDExLjI5NjExMzYsMzEuNjU1ODEzNCAxMS4yOTYxMTM2LDMwLjMwMzU1MzYgQzExLjI5NjExMzYsMjguOTUxMjkzOSAxNC40MjYyMjk1LDMwLjAzNzYyNTYgMTQuNDI2MjI5NSwyNy41NDExMjc3IEMxNC40MjYyMjk1LDI3LjAyNjI2MjggMTQuNDI2MjI5NSwyMy43NjI2MzM3IDE2LjM2NTA4NzIsMjIuODU1NzEyNiBDMTcuNjU3NjU4OSwyMi4yNTEwOTg0IDE4Ljg3NDExNzgsMjEuOTA4MTYyNCAyMC4wMTQ0NjM2LDIxLjgyNjkwNDUgWiIgaWQ9IlJlY3RhbmdsZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsIiBmaWxsPSIjRkZGRkZGIiBjeD0iNy4yMTMxMTQ3NSIgY3k9IjEwLjI0MDgyMjMiIHI9IjIuNjIyOTUwODIiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtQ29weS0zIiBmaWxsPSIjRkZGRkZGIiBjeD0iNy44Njg4NTI0NiIgY3k9IjI2LjYzNDI2NDkiIHI9IjIuNjIyOTUwODIiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtQ29weSIgZmlsbD0iI0ZGRkZGRiIgY3g9IjE1LjczNzcwNDkiIGN5PSI3LjYxNzg3MTUiIHI9IjIuNjIyOTUwODIiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtQ29weS0yIiBmaWxsPSIjRkZGRkZGIiBjeD0iMjIuOTUwODE5NyIgY3k9IjEyLjIwODAzNTQiIHI9IjIuNjIyOTUwODIiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" /><br>Draw',
                    style: {
                        color: 'blue',
                        fontSize: '13px'
                    }
                }
            }
        },

        series: [
            {
                data: [1, 2, 3, 4]
            }
        ]
    });

    const svg = chart.getSVGForExport();

    assert.strictEqual(
        (svg.match(/<img.*?(?=\/>)/gm) || []).length,
        chart.series[0].data.length,
        'Should export one self-closing <img /> for each point'
    );
    assert.strictEqual(
        (svg.match(/<br \/>/gm) || []).length,
        chart.series[0].data.length,
        'Should export one self-closing <br /> for each point'
    );
});
