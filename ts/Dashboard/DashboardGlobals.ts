/**
 *
 * Prefix of a GUIElement HTML class name.
 *
 */
const PREFIX = 'highcharts-dashboard-';

const DashboardGlobals: DashboardGlobals = {
    prefix: PREFIX,
    layout: PREFIX + 'layout',
    cell: PREFIX + 'cell',
    row: PREFIX + 'row'
};

interface DashboardGlobals {
    prefix: string;
    layout: string;
    cell: string;
    row: string;
}

export default DashboardGlobals;
