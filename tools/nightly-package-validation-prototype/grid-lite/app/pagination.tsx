import { Column, Data, Grid, Pagination } from '@highcharts/grid-lite-react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('app')!).render(
    <Grid>
        <Data columns={{ fruit: ['Pear', 'Apple', 'Peach'] }} />
        <Column id="fruit" headerFormat="Fruit" />
        <Pagination pageSize={2} />
    </Grid>
);
