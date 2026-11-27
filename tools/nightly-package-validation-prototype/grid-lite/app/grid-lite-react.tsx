import { Grid, type GridOptions } from '@highcharts/grid-lite-react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

const initialOptions: GridOptions = {
    data: {
        columns: {
            fruit: ['Pear', 'Apple'],
            quantity: [2, 5]
        }
    }
};

const updatedOptions: GridOptions = {
    data: {
        columns: {
            fruit: ['Pear', 'Apple', 'Peach'],
            quantity: [2, 7, 3]
        }
    }
};

function FruitInventory() {
    const [options, setOptions] = useState(initialOptions);

    return (
        <>
            <button type="button" onClick={() => setOptions(updatedOptions)}>
                Update inventory
            </button>
            <Grid options={options} />
        </>
    );
}

createRoot(document.getElementById('app')!).render(<FruitInventory />);
