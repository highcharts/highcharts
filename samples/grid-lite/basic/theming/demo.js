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
        columns: generateRandomData(100)
    },
    rendering: {
        rows: {
            strictHeights: true,
            minVisibleRows: 7
        }
    },
    credits: {
        enabled: false
    },
    caption: {
        text: 'hcg-theme-default'
    },
    description: {
        text: 'Default theme with no bells and whistles.'
    },
    columns: [
        {
            id: 'ID',
            width: 80
        }
    ]
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
        text: 'Default theme extended with more hover states for cell, column and header. Also includes special sync state for cell, and utilizes opacity.'
    }
}));

Grid.grid('table_2', merge(config, {
    rendering: {
        theme: 'theme-columns'
    },
    caption: {
        text: 'theme-columns'
    },
    description: {
        text: 'Theme with a column layout focus. No opacity, so only solid colors.'
    }
}));

Grid.grid('table_3', merge(config, {
    rendering: {
        theme: 'theme-columns theme-opacity'
    },
    caption: {
        text: 'theme-columns theme-opacity'
    },
    description: {
        text: 'Same as above, but with opacity on hover states, so a much subtler effect.'
    }
}));

Grid.grid('table_4', merge(config, {
    rendering: {
        theme: 'hcg-theme-default theme-conditional-cells'
    },
    caption: {
        text: 'hcg-theme-default theme-conditional-cells'
    },
    description: {
        text: 'sdfgsdfg'
    }
}));

Grid.grid('table_5', merge(config, {
    rendering: {
        theme: 'hcg-theme-default theme-conditional-rows'
    },
    caption: {
        text: 'hcg-theme-default theme-conditional-rows'
    },
    description: {
        text: 'sdfgsdfg'
    }
}));

Grid.grid('table_6', merge(config, {
    rendering: {
        theme: 'hcg-theme-default theme-conditional-columns'
    },
    caption: {
        text: 'hcg-theme-default theme-conditional-columns'
    },
    description: {
        text: 'sdfgsdfg'
    }
}));
