describe('Updating HTML component.', () => {
    before(()=>{
        cy.visit('dashboards/cypress/component-html');
    });

    it('Should update the HTML component title and caption.', () => {
        cy.get('.highcharts-dashboards-component-title').should('have.text', 'Title (original)');
        cy.get('.highcharts-dashboards-component-caption').should('have.text', 'Caption (original)');

        cy.board().then(dashboard => {
            const htmlComp = dashboard.mountedComponents[0].component;

            htmlComp.update({
                title: 'Changed title',
                caption: 'Changed caption'
            });

            cy.get('.highcharts-dashboards-component-title').should('have.text', 'Changed title');
            cy.get('.highcharts-dashboards-component-caption').should('have.text', 'Changed caption');
        })
    });

    it('HTML content should adjust height when resizing.', () => {
        cy.board().then(dashboard => {
            const mComponents = dashboard.mountedComponents;
            const componentSize =
                mComponents[1].cell.container.getBoundingClientRect().toJSON();
            // resize the window to squeeze the text inside
            cy.viewport(600, 1000);

            cy.get('#dashboard-2').invoke('height').should(
                'be.greaterThan',
                componentSize.height
            );
        })
    });
});
