/* eslint-disable max-len */
const { merge } = Grid;

const config = {
    dataTable: {
        columns: {
            firstName: [
                'Alice', 'Bob', 'Charlie', 'Diana', 'Evan', 'Fiona', 'George',
                'Hannah', 'Ian', 'Julia', 'Kevin', 'Laura', 'Michael', 'Nina',
                'Oscar', 'Paula', 'Quincy', 'Rachel', 'Steven', 'Tina'
            ],
            lastName: [
                'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller',
                'Davis', 'Garcia', 'Rodriguez', 'Martinez', 'Hernandez',
                'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
                'Moore', 'Jackson', 'Martin'
            ],
            email: [
                'alice.smith@example.com', 'bob.johnson@example.com',
                'charlie.williams@example.com', 'diana.brown@example.com',
                'evan.jones@example.com', 'fiona.miller@example.com',
                'george.davis@example.com', 'hannah.garcia@example.com',
                'ian.rodriguez@example.com', 'julia.martinez@example.com',
                'kevin.hernandez@example.com', 'laura.lopez@example.com',
                'michael.gonzalez@example.com', 'nina.wilson@example.com',
                'oscar.anderson@example.com', 'paula.thomas@example.com',
                'quincy.taylor@example.com', 'rachel.moore@example.com',
                'steven.jackson@example.com', 'tina.martin@example.com'
            ],
            age: [
                28, 34, 45, 22, 31, 39, 50, 27, 36, 29,
                41, 33, 52, 40, 38, 26, 44, 32, 37, 30
            ],
            department: [
                'Engineering', 'Marketing', 'Finance', 'HR', 'Operations',
                'Sales', 'IT', 'Customer Support', 'Research', 'Development',
                'Engineering', 'Marketing', 'Finance', 'HR', 'Operations',
                'Sales', 'IT', 'Customer Support', 'Research', 'Development'
            ]
        }
    },
    rendering: {
        rows: {
            strictHeights: true
        }
    },
    caption: {
        text: 'Default theme'
    },
    description: {
        text: 'If the <code>theme</code> API option is not specified the grid is ' +
            'rendered using the default theme, <code>hcg-theme-default</code>.'
    }
};

Grid.grid('table_0', config);

Grid.grid('table_1', merge(config, {
    rendering: {
        theme: 'hcg-theme-default theme-compact'
    },
    caption: {
        text: 'Compact variant of default theme'
    },
    description: {
        text: 'Extend the default theme by adding new and/or ' +
            'overriding the default variables inside a custom CSS selector. ' +
            'In this case <code>theme-compact</code> by setting ' +
            '<code>theme: \'hcg-theme-default theme-compact\'</code>.'
    }
}));

Grid.grid('table_2', merge(config, {
    rendering: {
        theme: 'theme-base my-theme'
    },
    caption: {
        text: 'Custom theme with more hover states'
    },
    description: {
        text: 'To create a completely custom theme omit ' +
            '<code>hcg-theme-default</code> and only specify the custom theme, ' +
            'in this case <code>theme: \'theme-base my-theme\'</code>. ' +
            'Here we also include a base theme that is shared between multiple ' +
            'grids. When starting from scratch remember to also include a ' +
            'dark variant for dark mode and also high contrast if needed.'
    }
}));

Grid.grid('table_3', merge(config, {
    rendering: {
        theme: 'theme-base opacity-theme'
    },
    caption: {
        text: 'Theme using --hcg-hover-opacity'
    },
    description: {
        text: 'By using the <code>--hcg-hover-opacity</code> variable ' +
            'on row, column, header and cell hover states you can limit the ' +
            'number of different colors needed to produce a nice, coherent theme. ' +
            'Just use e.g. <code>#fff</code> and adjust opacity instead of color.'
    }
}));
