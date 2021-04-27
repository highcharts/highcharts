var chart = Highcharts.chart('container', {
        series: [
            {
                name: 'Series with table sync'
            }
        ],
        title: {
            text: 'Series table demo'
        },
        tooltip: {
            formatter: function () {
                var point = this.point,
                    row = point.series.table.getRowObject(point.index);

                return Object
                    .keys(row)
                    .sort()
                    .map(
                        function (key) {
                            return key + ': ' + row[key];
                        }
                    )
                    .join('<br />');
            }
        }
    }),
    formTableBody = document.getElementById('table-body'),
    formButtonAdd = document.getElementById('button-add'),
    formButtonReset = document.getElementById('button-reset'),
    formSelectSort = document.getElementById('select-sort');

// change a series row with data from the HTML form
function change() {
    var formInputs = this.getElementsByTagName('input'),
        index = parseInt(this.getAttribute('data-index'), 10),
        name = formInputs[0].value,
        seriesTable = chart.series[0].table,
        y = parseFloat(formInputs[1].value);

    seriesTable.setRow({ name, y }, index);
}

// add a series row with data from the HTML form
function add() {
    var formInputs = this.getElementsByTagName('input'),
        formTableRow = document.createElement('tr'),
        name = formInputs[0].value,
        seriesTable = chart.series[0].table,
        x = seriesTable.getRowCount(),
        y = parseFloat(formInputs[1].value);

    formTableRow.setAttribute('data-index', seriesTable.getRowCount());
    formTableRow.innerHTML = [
        `<td><input type="text" value="${name}"" /></td>`,
        `<td><input type="number" value="${y}"" /></td>`,
        `<td><button type="button">Change</button></td>`
    ].join('');
    formTableRow.childNodes[2].addEventListener('click', change.bind(formTableRow));
    formTableBody.appendChild(formTableRow);

    seriesTable.setRow({ name, x, y });
}
formButtonAdd.addEventListener('click', add.bind(formButtonAdd.parentNode.parentNode));

// reset table
function reset() {
    chart.series[0].table.clear();
    formTableBody.innerHTML = '';
}
formButtonReset.addEventListener('click', reset);

// change sorting options
function sort() {
    var sortKey = this.value,
        series = chart.series[0],
        seriesOptions = series.options;

    if (sortKey) {
        series.remove();
        seriesOptions.dataSorting = {
            enabled: true,
            sortKey: sortKey
        };
    } else {
        var seriesTable = chart.series[0].table.clone();
        series.remove();
        seriesTable.setColumn('x', seriesTable.deleteColumn('index'));
        seriesOptions.data = seriesTable.getRowObjects();
        seriesOptions.dataSorting = false;
    }

    chart.addSeries(seriesOptions);
}
formSelectSort.addEventListener('change', sort.bind(formSelectSort));