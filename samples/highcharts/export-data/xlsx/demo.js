// Highcharts plugin for adding better XLS and XLSX support through the third
// party zipcelx library.
(function (H) {
    if (window.zipcelx && H.getOptions().exporting) {
        H.Chart.prototype.downloadXLSX = function () {
            var div = document.createElement('div'),
                name,
                xlsxRows = [],
                rows;
            div.style.display = 'none';
            document.body.appendChild(div);
            rows = this.getDataRows(true);
            xlsxRows = H.map(rows.slice(1), function (row) {
                return H.map(row, function (column) {
                    return {
                        type: typeof column === 'number' ? 'number' : 'string',
                        value: column
                    };
                });
            });

            // Get the filename, copied from the Chart.fileDownload function
            if (this.options.exporting.filename) {
                name = this.options.exporting.filename;
            } else if (this.title && this.title.textStr) {
                name = this.title.textStr.replace(/ /g, '-').toLowerCase();
            } else {
                name = 'chart';
            }

            window.zipcelx({
                filename: name,
                sheet: {
                    data: xlsxRows
                }
            });
        };

        // Default lang string, overridable in i18n options
        H.getOptions().lang.downloadXLSX = 'Download XLSX';

        // Add the menu item handler
        H.getOptions().exporting.menuItemDefinitions.downloadXLSX = {
            textKey: 'downloadXLSX',
            onclick: function () {
                this.downloadXLSX();
            }
        };

        // Replace the menu item
        var menuItems = H.getOptions().exporting.buttons.contextButton.menuItems;
        menuItems[menuItems.indexOf('downloadXLS')] = 'downloadXLSX';
    }

}(Highcharts));

Highcharts.chart('container', {

    title: {
        text: 'Data export with third party XLSX generator'
    },

    subtitle: {
        text: 'Go to menu => download XLSX to test'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
});
