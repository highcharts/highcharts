/// <reference path="../code/highcharts.d.ts" />

declare interface Lolex {
    install: (lolexConfig? : any) => (LolexClock|undefined);
}

declare interface LolexClock {
    runAll: () => void;
    uninstall: () => void;
}

declare const lolex: Lolex;
