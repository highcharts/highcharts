const desktopConfig = {
  formFactor: "desktop",
  screenEmulation: {
    width: 1350,
    height: 940,
    deviceScaleRatio: 1,
    mobile: false,
    disable: false,
  },
  throttling: {
    rttMs: 40,
    throughputKbps: 11024,
    cpuSlowdownMultiplier: 1,
    requestLatencyMs: 0,
    downloadThroughputKbps: 0,
    uploadThroughputKbps: 0,
  },
};

describe('Lighthouse tests', () => {
    it('Minimal demo', () => {
        cy.visit('/dashboards/demo/minimal');
        cy.lighthouse(
            {
                performance: 0
            },
            desktopConfig
        )
    })

});

