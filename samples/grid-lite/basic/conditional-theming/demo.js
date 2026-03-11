/* eslint-disable max-len */
const { merge } = Grid;

const config = {
    data: {
        columns: {
            ID: [1, 2, 3, 4, 5],
            Name: ['John', 'Alex', 'Chris', 'Katie', 'Jane'],
            Department: ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance'],
            Position: [
                'Manager',
                'Software Developer',
                'Sales Executive',
                'Marketing Specialist',
                'Financial Analyst'
            ]
        }
    },
    columns: [
        {
            id: 'ID',
            width: 80
        }
    ]
};

Grid.grid('table_1', merge(config, {
    rendering: {
        theme: 'hcg-theme-default theme-conditional-cells'
    },
    caption: {
        text: 'Individual cells'
    }
}));

Grid.grid('table_2', merge(config, {
    rendering: {
        theme: 'hcg-theme-default theme-conditional-rows'
    },
    caption: {
        text: 'Individual rows'
    }
}));

Grid.grid('table_3', merge(config, {
    rendering: {
        theme: 'hcg-theme-default theme-conditional-columns'
    },
    caption: {
        text: 'Individual columns and headers'
    }
}));
