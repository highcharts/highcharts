import Column from './Column.js';

class Row {

}

namespace Row {
    export interface Options {
        id: string;
        columns: Array<Column.Options>;
    }
}

export default Row;
