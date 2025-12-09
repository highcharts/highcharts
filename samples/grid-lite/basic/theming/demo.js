/* eslint-disable max-len */
const { merge } = Grid;

function generateRandomData(rows) {
    const names = ['John', 'Jane', 'Alex', 'Chris', 'Katie', 'Michael'];
    const departments = ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance'];
    const positions = [
        'Manager',
        'Software Developer',
        'Sales Executive',
        'Marketing Specialist',
        'Financial Analyst'
    ];
    const columns = {
        ID: [],
        Name: [],
        Department: [],
        Position: [],
        Email: [],
        Phone: []
    };

    for (let i = 0; i < rows; i++) {
        const nameIndex = Math.floor(Math.random() * names.length);
        const departmentIndex = Math.floor(Math.random() * departments.length);
        const positionIndex = Math.floor(Math.random() * positions.length);
        const id = i + 1;
        const email = `${names[nameIndex].toLowerCase()}${id}@example.com`;
        const phone = `123-456-7${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, '0')}`;

        columns.ID.push(id);
        columns.Name.push(names[nameIndex]);
        columns.Department.push(departments[departmentIndex]);
        columns.Position.push(positions[positionIndex]);
        columns.Email.push(email);
        columns.Phone.push(phone);
    }

    return columns;
}

const config = {
    dataTable: {
        columns: generateRandomData(100000)
    },
    rendering: {
        rows: {
            strictHeights: true,
            minVisibleRows: 5
        }
    },
    credits: {
        enabled: false
    },
    caption: {
        text: 'hcg-theme-default'
    },
    description: {
        text: 'If the <code>theme</code> API option is not specified the grid is ' +
            'rendered using the default theme, <code>hcg-theme-default</code>.',
        position: 'top'
    }
};

Grid.grid('table_0', config);

Grid.grid('table_1', merge(config, {
    rendering: {
        theme: 'hcg-theme-default theme-more-hover-states'
    },
    caption: {
        text: 'hcg-theme-default theme-more-hover-states'
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
        theme: 'my-theme-2'
    },
    caption: {
        text: 'Custom theme with more hover states'
    },
    description: {
        text: 'To create a completely custom theme omit ' +
            '<code>hcg-theme-default</code> and only specify the custom theme, ' +
            'in this case <code>theme: \'my-theme\'</code>. When starting from ' +
            'scratch remember to also include a dark variant for dark mode, ' +
            'and also high contrast if needed.'
    }
}));

Grid.grid('table_3', merge(config, {
    rendering: {
        theme: 'opacity-theme'
    },
    caption: {
        text: 'Theme using opacity on hover states'
    },
    description: {
        text: 'By using RGBA opacity on hover states instead of ' +
            'solid colors the overall color scheme can be set using only a base set ' +
            'of custom variables, and hover states etc. can be tweaked by adjusting ' +
            'the opacity.'
    }
}));
