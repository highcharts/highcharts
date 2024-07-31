describe('Updating HTML component.', () => {
    beforeEach(() => {
        cy.visit('dashboards/cypress/component-html');
    });

    it('Should update the HTML component title and caption.', () => {
        cy.get('.highcharts-dashboards-component-title').should('have.text', 'Title (original)');
        cy.get('.highcharts-dashboards-component-caption').should('have.text', 'Caption (original)');

        cy.board().then((dashboard) => {
            const htmlComp = dashboard.mountedComponents[0].component;

            htmlComp.update({
                title: 'Changed title',
                caption: 'Changed caption'
            });

            cy.get('.highcharts-dashboards-component-title').should('have.text', 'Changed title');
            cy.get('.highcharts-dashboards-component-caption').should('have.text', 'Changed caption');
        });
    });

    it('HTML content should adjust height when resizing.', () => {
        cy.board().then((dashboard) => {
            const mComponents = dashboard.mountedComponents;
            const componentSize = mComponents[1].cell.container.getBoundingClientRect().toJSON();
            // resize the window to squeeze the text inside
            cy.viewport(600, 1000);

            cy.get('#dashboard-2').invoke('height').should('be.greaterThan', componentSize.height);
        });
    });

    it('Should edit the HTML component with sidebar.', () => {
        // Arrange- open sidebar
        cy.toggleEditMode();
        cy.openCellEditSidebar('#dashboard-2');

        // Act- edit the HTML component
        cy.get('.highcharts-dashboards-edit-accordion-header-btn')
            .contains('span', 'HTML')
            .closest('.highcharts-dashboards-edit-collapsable-content-header')
            .click();
        cy.get('textarea').clear().type('<h1>New title</h1>');
        cy.get('.highcharts-dashboards-edit-confirmation-popup-confirm-btn').click();

        // Assert- confirm the changes in dashboard and sidebar
        cy.get('#dashboard-2').should('contain', 'New title');
        cy.openCellEditSidebar('#dashboard-2');
        cy.get('.highcharts-dashboards-edit-accordion-header-btn')
            .contains('span', 'HTML')
            .closest('.highcharts-dashboards-edit-collapsable-content-header')
            .click();
        cy.get('textarea').should('have.value', '<h1>New title</h1>');
    });

    it('Sidebar should be populated when adding a component.', () => {
        // Act
        cy.toggleEditMode();
        cy.grabComponent('HTML');
        cy.dropComponent('#dashboard-2');
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(2).as('HTML');
        cy.get('@HTML').click();

        // Assert
        cy.get('@HTML')
            .parent()
            .parent()
            .find('.highcharts-dashboards-edit-accordion-content textarea')
            .should('have.value', '<img src="https://www.highcharts.com/samples/graphics/stock-dark.svg"></img>');
    });

    it('Properties should be reflected in the sidebar.', () => {
        // Act
        cy.toggleEditMode();
        cy.openCellEditSidebar('#dashboard-1');
        cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(0).as('Title');
        cy.get('@Title').click();

        // Assert
        cy.get('@Title')
            .parent()
            .parent()
            .find('.highcharts-dashboards-edit-accordion-content input')
            .as('TitleInput')
            .should('have.value', 'Title (original)');

        // Act
        cy.get('@TitleInput').clear().type('Changed title');
        cy.get('.highcharts-dashboards-edit-confirmation-popup-confirm-btn').click();

        // Assert
        cy.get('#dashboard-1').should('contain', 'Changed title');

        // Act
        cy.openCellEditSidebar('#dashboard-1');
        cy.get('@Title').click();

        // Assert
        cy.get('@TitleInput').should('have.value', 'Changed title');
    });
});
