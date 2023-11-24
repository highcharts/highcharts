import type { NavigatorOptions } from './NavigatorOptions';
import Chart from '../../Core/Chart/Chart.js';
import Navigator from './Navigator.js';
import G from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
import Axis from '../../Core/Axis/Axis.js';
const {
    merge,
    isString,
    addEvent
} = U;

type StandaloneNavigatorOptions = {
    navigator: NavigatorOptions,
    width: number,
    height: number,
    colors: []
}

const defaultNavOptions = {
	width: 400,
	height: 50,
    tooltip: {
        enabled: false
    },
	navigator: {
        enabled: true
    },
	scrollbar: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    yAxis: {
        height: 0,
        visible: false
    },
    xAxis: {
        visible: false
    },
    title: {
        text: null
    },
    chart: {
        spacing: [0, 0, 0, 0],
        margin: [0, 0, 0, 0]
    }
};

declare module "../../Core/GlobalsLike.d.ts" {
	interface GlobalsLike {
		navigators: Array<StandaloneNavigator>;
	}
}
const forcedNavOptions = {
    navigator: {
        enabled: true
    },
    xAxis: {

    },
    yAxis: {

    }
}
class StandaloneNavigator {

    public time = G.time;
    public eventsToUnbind: Array<Function> = [];
    public navigator: Navigator;
    public initSeries = (G as any).Chart.prototype.initSeries;
    public renderTo: any;
    public container:  any;
    public boundAxes: Array<Axis> = [];
    public numberFormatter = (G as any).numberFormat;
    public pointer = {
        normalize: (e: any) => {
            e.chartX = e.pageX;
            e.chartY = e.pageY;
            return e;
        }
    };
    public options: StandaloneNavigatorOptions;
    public userOptions = {}

    public static navigator(
        renderTo: (string|globalThis.HTMLElement),
        options: DeepPartial<StandaloneNavigatorOptions>
    ): StandaloneNavigator {
        const mergedOptions = merge(
        (G as any).getOptions(),
            defaultNavOptions,
            options,
            forcedNavOptions
        ) as StandaloneNavigatorOptions

        let nav =  new StandaloneNavigator(renderTo, mergedOptions);
        if (!G.navigators) {
            G.navigators = [nav]
        } else {
            G.navigators.push(nav);
        }
        return nav;
    }

    public bind(axisOrChart: Axis | Chart): void {
        const axis = (axisOrChart instanceof Chart) ?
            axisOrChart.xAxis[0] :
            axisOrChart;

        if (!(axis instanceof Axis)) return;

        const { min, max } = this.navigator.xAxis;

        this.boundAxes.push(axis);
        axis.setExtremes(min, max);
    }

    public destroy() {
        // TODO: destroy other stuff too
        this.eventsToUnbind.forEach((f) => {
            f();
        });
    }

    public unbind(axisOrChart?: Chart | Axis) {
        if (!axisOrChart) {
            this.boundAxes.length = 0;
            return;
        }

        const axis = (axisOrChart instanceof Axis) ?
            axisOrChart :
            axisOrChart.xAxis[0];

        this.boundAxes = this.boundAxes.filter(a => a !== axis);
    }

    constructor(element: (string|globalThis.HTMLElement), options: StandaloneNavigatorOptions) {
        this.options = options;
        const chart = new Chart(element, options);

        this.navigator = new Navigator(chart);
        chart.navigator = this.navigator;
        this.initNavigator();
    }

    public initNavigator() {
        const nav = this.navigator;
        nav.top = 0;
        nav.xAxis.setScale();
        nav.yAxis.setScale();
        nav.xAxis.render();
        nav.yAxis.render();
        nav.series?.forEach(s => {
            s.translate();
            s.render();
            s.redraw();
        });

        let { min, max } = this.getNavigatorExtremes();
        nav.render(min, max);

        this.eventsToUnbind.push(addEvent(this.navigator.chart.xAxis[0], 'setExtremes', (e) => {
            const {min, max} = e as {min: number, max: number};
            this.boundAxes.forEach(axis => {
                axis.setExtremes(min, max)
            })
        }));
    }

    public getNavigatorExtremes() {
        // TODO: from options or from series extremes
        return this.navigator.xAxis.getExtremes();
    }
}

export default StandaloneNavigator;