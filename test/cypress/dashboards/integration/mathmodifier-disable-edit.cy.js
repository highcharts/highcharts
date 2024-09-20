describe('MathModifier created columns and interaction.', () => {
    before(() => {
        cy.visit('/dashboards/cypress/datagrid-mathmodifier/');
    })

    it('DataGrid and HC component should disable changing the mathmodifier column.', () => {
        cy.board().then((board) => {
        const mComponents = board.mountedComponents,
            hcComponent = mComponents[0].component,
            dgComponent = mComponents[1].component;
            assert.deepEqual(
                dgComponent.dataGrid.options.columns,
                [{
                    id: 'USD',
                    cells: {
                        editable: false
                    }
                }],
                'USD column is not editable'
            );
            hcComponent.chart.series.forEach(series => {
                const draggableY = series.options.dragDrop.draggableY;
                if (series.name === 'USD') {
                    assert.equal(
                        draggableY,
                        false,
                        'Series created out of mathmodifier column is not draggable'
                    );
                } else {
                    assert.equal(
                        draggableY,
                        true,
                        'Other series are draggable.'
                    );
                }

            });
        });
    });

});
