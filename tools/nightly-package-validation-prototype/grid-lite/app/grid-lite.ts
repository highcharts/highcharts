import * as Grid from '@highcharts/grid-lite';
import '@highcharts/grid-lite/css/grid-lite.css';

Grid.grid('grid', {
    data: {
        columns: {
            fruit: ['Pear', 'Apple'],
            quantity: [2, 5]
        }
    },
    columns: [{
        id: 'fruit',
        sorting: { enabled: true }
    }]
});
