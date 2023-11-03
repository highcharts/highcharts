const norwegianEditMode = {
    editMode: 'Redigering',
    style: 'Stiler',
    id: 'Id',
    title: 'Tittel',
    caption: 'Caption',
    chartConfig: 'Graf konfigurasjoner',
    chartClassName: 'Graf klassenavn',
    chartID: 'Graf ID',
    chartOptions: 'Graf alternativer',
    chartType: 'Graf type',
    pointFormat: 'Punkt format',
    confirmDestroyRow: 'Vil du ødelegge raden?',
    confirmDestroyCell: 'Vil du ødelegge cellen?',
    confirmButton: 'Bekreft',
    cancelButton: 'Avbryt',
    viewFullscreen: 'Se fullskjerm',
    exitFullscreen: 'Lukk fullskjerm',
    on: 'på',
    off: 'av',
    settings: 'Alternativer',
    addComponent: 'Legg til komponenter',
    dataLabels: 'Data merkelapp',
    small: 'sm',
    medium: 'md',
    large: 'lg'
};

describe('Editable component options', () => {
    beforeEach(() => {
        cy.visit('/dashboards/cypress/options-lang');
        cy.viewport(1200, 1000);
        cy.toggleEditMode();
    });

    it('Lang should be applied on edit toggle and fullscreen', function() {
        cy.get('.highcharts-dashboards-edit-context-menu-item').eq(0)
            .should('have.text', norwegianEditMode.editMode);
        cy.get('.highcharts-dashboards-edit-context-menu-item').eq(1)
            .should('have.text', norwegianEditMode.viewFullscreen);
    });

    it('Lang should be applied on responsive buttons', function() {
        cy.get('.highcharts-dashboards-edit-tools .highcharts-dashboards-edit-tools-btn').eq(0)
            .should('have.text', norwegianEditMode.small);
        cy.get('.highcharts-dashboards-edit-tools .highcharts-dashboards-edit-tools-btn').eq(1)
            .should('have.text', norwegianEditMode.medium);
        cy.get('.highcharts-dashboards-edit-tools .highcharts-dashboards-edit-tools-btn').eq(2)
            .should('have.text', norwegianEditMode.large);
        cy.get('.highcharts-dashboards-edit-tools .highcharts-dashboards-edit-tools-btn').eq(3)
            .should('have.text', norwegianEditMode.addComponent);
    });

    it('Lang should be applied on sidebar options', function() {
        cy.get('.highcharts-dashboards-component').first().click();
        cy.get('.highcharts-dashboards-edit-toolbar-cell > .highcharts-dashboards-edit-toolbar-item:nth-child(2)').click();

        // buttons
        cy.get('.highcharts-dashboards-edit-sidebar .highcharts-dashboards-edit-button').eq(0)
            .should('have.text', norwegianEditMode.confirmButton);
        cy.get('.highcharts-dashboards-edit-sidebar .highcharts-dashboards-edit-button').eq(1)
            .should('have.text', norwegianEditMode.cancelButton);

        // accordion 1 level
        cy.get('.highcharts-dashboards-edit-accordion > .highcharts-dashboards-edit-accordion-header').eq(1)
            .should('have.text', norwegianEditMode.title);
        cy.get('.highcharts-dashboards-edit-accordion > .highcharts-dashboards-edit-accordion-header').eq(2)
            .should('have.text', norwegianEditMode.caption);
        cy.get('.highcharts-dashboards-edit-accordion > .highcharts-dashboards-edit-accordion-header').eq(3)
            .should('have.text', norwegianEditMode.chartOptions);
        cy.get('.highcharts-dashboards-edit-accordion > .highcharts-dashboards-edit-accordion-header').eq(4)
            .should('have.text', norwegianEditMode.chartConfig);
        cy.get('.highcharts-dashboards-edit-accordion > .highcharts-dashboards-edit-accordion-header').eq(5)
            .should('have.text', norwegianEditMode.chartClassName);
        cy.get('.highcharts-dashboards-edit-accordion > .highcharts-dashboards-edit-accordion-header').eq(6)
            .should('have.text', norwegianEditMode.chartID);

        // accordion 2 level - Chart options
        cy.get('.highcharts-dashboards-edit-accordion > .highcharts-dashboards-edit-accordion-header').eq(3)
            .click();

        // toggle
        cy.get('.highcharts-dashboards-edit-toggle-labels').eq(0)
            .should('have.text', norwegianEditMode.off);
        cy.get('.highcharts-dashboards-edit-toggle-labels').eq(1)
            .should('have.text', norwegianEditMode.on);

        // Data labels
        cy.get('.highcharts-dashboards-edit-accordion-nested:nth-child(6) .highcharts-dashboards-edit-accordion-header-btn')
            .should('have.text', norwegianEditMode.dataLabels);
    });

    it('Lang should be applied on confirmation popup (delete cell)', function() {
        cy.get('.highcharts-dashboards-component').first().click();

        // Delete cell
        cy.get('.highcharts-dashboards-edit-toolbar-cell > .highcharts-dashboards-edit-toolbar-item:nth-child(3)').click();
        cy.get('.highcharts-dashboards-edit-confirmation-popup-content > .highcharts-dashboards-edit-label-text')
            .should('have.text', norwegianEditMode.confirmDestroyCell);
        cy.get('.highcharts-dashboards-edit-popup-close').eq(0).click();
    });

    it('Lang should be applied on confirmation popup (delete row)', function() {
        cy.get('.highcharts-dashboards-component').first().click();

        // Delete row
        cy.get('.highcharts-dashboards-edit-toolbar-row > .highcharts-dashboards-edit-toolbar-item:nth-child(3)').click();
        cy.get('.highcharts-dashboards-edit-confirmation-popup-content > .highcharts-dashboards-edit-label-text')
            .should('have.text', norwegianEditMode.confirmDestroyRow);
        cy.get('.highcharts-dashboards-edit-popup-close').eq(0).click();
    });
});
