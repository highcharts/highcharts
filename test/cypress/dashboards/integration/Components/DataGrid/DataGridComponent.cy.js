describe('layout resize on window changes', () => {
    before(()=>{
        cy.visit('/dashboards/cypress/component-datagrid');
    });

    it('The columnAssignment and visibleColumns should be respected', () =>{
        cy.get('.highcharts-datagrid-column-header').should('have.length', 2);
        cy.chart().then(chart =>{
            assert.strictEqual(
                chart.series.length,
                1,
                'The chart should have only one series.'
            )
        });
    })

    it('Chart and DataGridComponent should have synced hover events.', () => {
        const firstDataGridRow = cy.get('.highcharts-datagrid-cell').eq(0)

        // Hover over DataGridComponent.
        firstDataGridRow.trigger('mouseover');
        firstDataGridRow.parent().should('have.class', 'highcharts-datagrid-row hovered');
        cy.chart().then(chart =>{
            assert.notOk(
                chart.tooltip.isHidden,
                'When hovering over DataGrid, chart should have tooltip.'
            )
        })

        // Hover over the chart.
        cy.get('.highcharts-point').eq(1).trigger('mouseover');
        firstDataGridRow.parent().should('not.have.class', 'highcharts-datagrid-row hovered');
        cy.get('.highcharts-datagrid-row').eq(1).should('have.class', 'highcharts-datagrid-row hovered');

        // Hover over the first point
        cy.get('.highcharts-point').eq(0).trigger('mouseover');
        firstDataGridRow.parent().should('not.have.class', 'highcharts-datagrid-row hovered');
        cy.get('.highcharts-datagrid-row').eq(0).should('have.class', 'highcharts-datagrid-row hovered');
    });

    it('Updating of the store should work by changing chart and datagrid', () =>{
        cy.get('.highcharts-datagrid-row').eq(1).children().eq(1)
            .type('{backspace}{backspace}{backspace}000');

        cy.chart().then(chart =>{
            assert.strictEqual(
                chart.series[0].points[1].y,
                2000,
                'After updating the Data Grid the chart should be updated.'
            )
        })

        cy.get('input.highcharts-datagrid-cell-input').should('have.focus');
    })

    it('Chart and DataGridComponent should have synced extremes events.', () => {
        let containerTop;

        cy.get('.highcharts-datagrid-outer-container')
            .invoke('scrollTop')
            .then((scrollTopValue) => {
                containerTop = scrollTopValue;
            });

        cy.get('.highcharts-dashboards-component-highcharts-content').eq(0)
            .trigger('mousedown', 300)
            .trigger('mousemove', 300, 100)
            .trigger('mouseup');

        cy.get('.highcharts-datagrid-outer-container').then($container =>{
            assert.ok(
                $container.scrollTop() > containerTop,
                'When selecting a range in the chart, the DataGridComponent should scroll.'
            )
        })
    });

    it('Toggling series visibility should change hide/show column in DataGridComponent', () => {
        cy.get('.highcharts-legend-item').eq(0).click();
        cy.get('.highcharts-datagrid-column-headers').children().should('have.length', 1);
        cy.get('.highcharts-legend-item').eq(0).click();
        cy.get('.highcharts-datagrid-column-headers').children().should('have.length', 2);
    });

    it('DataGridComponent should not throw error when dragging point on chart.', () => {
        cy.board().then((board) => {
            const hcComponent = board.mountedComponents[0].component,
                points = hcComponent.chart.series[0].points,
                lastPointIndex = points.length - 1;
            let error = false;

            // simulate dragging
            points[lastPointIndex].update(2000);
            // datagrid component
            try {
                board.mountedComponents[1].component.connector.table.emit({
                    type: 'afterSetCell'
                });
            }
            catch (e) {
                error = true;
            }

            assert.ok(
                !error,
                'Error in reference to cells should not be thrown.'
            )
        });
    });

    it('The dataGridOptions should be applied to the component.', () => {
        cy.get('.highcharts-datagrid-column-header').eq(1).should('have.text', 'Vitamin A (IU)');
    });
});
