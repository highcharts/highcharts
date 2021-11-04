import type SankeySeries from './Sankey/SankeySeries';


namespace SoCalledColumn {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class PointComposition extends SankeyPoint {
        // add
    }

    export declare class SoCalledColumnArray<T extends PointComposition = PointComposition> extends Array<T> {
        soCalledColumn: SoCalledColumnAdditions;
        soCalledColumnCompose();
    }

    function compose(
        array: Array<any>
    ): SoCalledColumnArray {
        const soCalledColumnArray = array as SoCalledColumnArray;
        soCalledColumnArray.soCalledColumn = new SoCalledColumnAdditions(soCalledColumnArray);
        return soCalledColumnArray;
    }


    class SoCalledColumnAdditions {
        constructor(array: SoCalledColumnArray) {
            this.array = array;
        }
        array: SoCalledColumnArray;
        getTranslationFactor(this: SankeySeries.ColumnArray, series: SankeySeries): number;
        offset(node: PointComposition, factor: number): (Record<string, number>|undefined);
        sum(): number;
        top(factor: number): number;
    }
}

export default SoCalledColumn;
