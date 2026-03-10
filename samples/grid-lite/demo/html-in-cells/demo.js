Grid.AST.allowedTags.push('input');
Grid.AST.allowedAttributes.push('checked');
Grid.grid('container', {
    data: {
        columns: {
            ID: [1, 2, 3],
            Header: ['Title 1', 'Title 2', 'Title 3'],
            Description: [
                `Loreum ipsum dolor sit amet, consectetur adipiscing elit.
                In in nulla euismod, ultrices.`,
                `Loreum ipsum dolor sit amet, consectetur adipiscing elit.
                In in nulla euismod, ultrices.x `,
                `Loreum ipsum dolor sit amet, consectetur adipiscing elit.
                In in nulla euismod, ultrices.x `
            ],
            List: ['item1, item2', 'item3, item4', 'item5, item6'],
            Image: ['sun', 'snow', 'sun'],
            Link: [
                'https://www.github.com',
                'https://www.google.com ',
                'https://developer.mozilla.org/'
            ],
            Checked: [true, false, false]
        }
    },
    rendering: {
        rows: {
            virtualization: false
        }
    },
    columns: [{
        id: 'ID',
        width: 60
    }, {
        id: 'Header',
        cells: {
            format: '<h2>{value}</h2>'
        }
    }, {
        id: 'Description',
        cells: {
            format: '<div class="column-description">{value}</div>'
        }
    }, {
        id: 'List',
        cells: {
            formatter: function () {
                const items = this.value.split(',');
                let list = '';

                items.forEach(el => {
                    list += '<li>' + el + '</li>';
                });

                return '<ul>' + list + '</ul>';
            }
        }
    }, {
        id: 'Image',
        cells: {
            format: '<img src="https://www.highcharts.com/samples/graphics/{value}.png"/>'
        }
    }, {
        id: 'Link',
        cells: {
            format: '<a href="{value}" target="_blank">URL</a>'
        }
    }, {
        id: 'Checked',
        cells: {
            formatter: function () {
                const checked = this.value ? 'checked' : '';

                return `<input type="checkbox" ${checked}></input>`;
            }
        }
    }]
});
