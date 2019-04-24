/// <reference path="../code/highcharts.d.ts" />

declare interface Lolex {
    install: () => (LolexClock|undefined);
}

declare interface LolexClock {
    runAll: () => void;
    uninstall: () => void;
}

declare const lolex: Lolex;
