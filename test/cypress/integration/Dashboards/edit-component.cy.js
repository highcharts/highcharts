describe('Editable component options', () => {
    beforeEach(() => {
        cy.visit('/cypress/dashboards/dashboard-layout');
        cy.viewport(1200, 1000);
        cy.toggleEditMode();
    });

    it.skip('should be able update chart ID via edit mode GUI', function() {
        const newChartID = 'myNewChart';

        cy.get('.highcharts-dashboards-component').first().click();
        cy.get('.highcharts-dashboards-edit-toolbar-cell > .highcharts-dashboards-edit-toolbar-item:nth-child(2)').click();
        
        // type new value
        cy.get('.highcharts-dashboards-edit-accordeon')
            .last().click()
            .find('input[name="chartID"]').clear().type(newChartID);

        // call update
        cy.contains('Confirm').click();
        cy.board().then((board) => {
            assert.equal(
                board.mountedComponents[0].component.options.chartID,
                newChartID,
                'New chartID is applied.'
            );
        });
    });
});
