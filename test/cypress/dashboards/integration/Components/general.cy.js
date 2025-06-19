describe('Component loading', () => {
  before(() => {
    cy.visit('/dashboards/cypress/component-loading/', {
    });
  })


  it('image should be within parent cell', () => {
    cy.get('#dashboard-col-3').within(([dashboardCell]) => {
      const cellBox = dashboardCell.getBoundingClientRect().toJSON();
      const image = dashboardCell.querySelector('img');
      const imageBox = image?.getBoundingClientRect().toJSON();

      if (!cellBox || !imageBox) {
        throw new Error('Failed to find the cell and/or image');
      }

      assert.ok(
        cellBox.width > imageBox.width,
        'The width of image is smaller than cell'
      );
      assert.ok(
        cellBox.height > imageBox.height,
        'The height of image is smaller than cell'
      );

    });
  });
});

describe('Caption', () => {
  before(() => {
    cy.visit('/dashboards/component-options/caption/');
  });

  it ('Caption should be visible when title exists (#20557).', () => {
    cy.get('#dashboard-col-0 .highcharts-dashboards-component-caption')
      .should('be.visible');
  });
});

describe('Data polling restarting', () => {
  before(() => {
    cy.visit('dashboards/cypress/connector-polling');
    cy.toggleEditMode();
  });

  it('Should restart the connector polling.', () => {
    cy.board().then(async dashboard => {
      const connector = await dashboard.dataPool.getConnector('fetched-data');
      const signal = connector.pollingController.signal;
      // Component reference should be initially added to the connector.
      expect(connector.components).not.be.empty;
      // Expect request not to be aborted.
      expect(signal.aborted).to.be.false;
      // Connector polling should be run initially.
      expect(connector.polling).to.be.true;

      // Destroy the component.
      const component = dashboard.mountedComponents[0].component;
      component.destroy();

      // Component reference should be removed from the connector.
      expect(connector.components).be.undefined;
      // Expect request to be aborted.
      expect(signal.aborted).to.be.true;
      // Connector polling should be stopped.
      expect(connector.polling).to.be.false;

      // Add a new chart component.
      cy.grabComponent('chart');
      cy.dropComponent('#dashboard-col-0');
    });

    // Wait until all DOM elements are settled from the previous actions.
    cy.board().then(async dashboard => {
      const connector = await dashboard.dataPool.getConnector('fetched-data');
      // Component reference should be added to the connector.
      expect(connector.components).not.be.empty;
      // Expect request not to be aborted.
      expect(connector.pollingController.signal.aborted).to.be.false;
      // Connector polling should be run again.
      expect(connector.polling).to.be.true;
    });
  });
});

describe('Data polling stop', () => {
  before(() => {
    cy.visit('dashboards/cypress/connector-polling');
  });

  it('Connector polling is stopped after the unloaded board is destroyed.', () => {
    cy.board().then(dashboard => {
      const CONNECTOR_ID = 'fetched-data';
      const dataPool = dashboard.dataPool;

      // Let the connector to load synchronously.
      dataPool.getConnector(CONNECTOR_ID);
      // Destroy the dashboard before the connector gets loaded.
      dashboard.destroy();
      // Expect request to be aborted.
      expect(
        dataPool.connectors[CONNECTOR_ID].pollingController.signal.aborted
      ).to.be.true;
    });
  });
});
