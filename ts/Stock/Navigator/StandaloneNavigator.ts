import type { NavigatorOptions } from './NavigatorOptions';
import type ScrollbarOptions from '../Scrollbar/ScrollbarOptions';
import Chart from '../../Core/Chart/Chart.js';
import Navigator from './Navigator.js';
import G from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
const {
    merge,
    isString,
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
    public navigator: Navigator;
    public initSeries = (G as any).Chart.prototype.initSeries;
    public renderTo: any;
    public container:  any;
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
    }

    public getNavigatorExtremes() {
        // from options or from series extremes
        return this.navigator.xAxis.getExtremes();
    }
}

export default StandaloneNavigator;