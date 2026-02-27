Grid.grid('container', {
    data: {
        columns: {
            ID: [1, 2, 3, 4, 5, 6],
            Name: ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'John'],
            Age: [28, 51, 40, 60, 53, 39],
            Department: [
                'HR',
                'Engineering',
                'Sales',
                'Marketing',
                'Finance',
                'Finance'
            ],
            Salary: [50000, 75000, 55000, 85000, 65000, 83000],
            PerformanceScore: [85, 49, 95, 40, 88, 73]
        }
    },
    columnDefaults: {
        cells: {
            /*
            Use the formatter callback function only when needed, for more
            complex formatting. This example wraps numeric values, except the
            first column, inside a span. If value > 50 a highlight CSS class is
            appended. Since inside columnDefaults this applies to all columns in
            the grid. See also CSS comment.
            */
            formatter: function () {
                const value = this.value;
                const id = this.column.id;

                if (typeof value !== 'number' || id === 'ID') {
                    return value;
                }

                const className = value > 50 ? 'highlight' : '';
                return `<span class="box ${className}">${value}</span>`;
            }
        }
    },
    description: {
        text: '* Performance Score'
    },
    columns: [
        /*
        The included hcg-center, hcg-left and hc-right CSS classes can be used
        for text alignment in headers and cells. Observe that column headers can
        be removed by passing an empty string in the columns[].header.format.
        */
        {
            id: 'ID',
            cells: {
                className: 'hcg-center'
            },
            header: {
                format: ''
            },
            width: 60
        },
        /*
        In the Name column a custom CSS class is applied to all cells. See CSS.
        */
        {
            id: 'Name',
            cells: {
                className: 'bold'
            }
        },
        /*
        For simpler formatting with less logic use the format API option instead
        of formatter (see above). Highcharts Grid use the same templating engine
        as Highcharts Core, so read more at https://www.highcharts.com/docs/chart-concepts/templating.
        Note that format, formatter and className options in columns[] overrides
        any values set in columnDefaults, so the Salary column will in this
        example not contain that <span> we injected earlier.
        */
        {
            id: 'Salary',
            cells: {
                className: '{#if (gt value 80000)}highlight-color{/if}',
                format: '${(divide value 1000):.0f}k'
            }
        },
        /*
        This example uses conditional formatting for only part of
        the className template
        */
        {
            id: 'PerformanceScore',
            cells: {
                className: '{#if (gt value 75)}high{else}low{/if}-color bold'
            },
            header: {
                format: 'PS (0-100) *'
            }
        }
    ]
});
