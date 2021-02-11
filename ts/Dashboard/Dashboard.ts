import Layout from './layout/Layout';
import U from '../Core/Utilities.js';

const {
  merge
} = U;

class Dashboard {
  /* *
    *
    *  Static Properties
    *
    * */

  protected static readonly defaultOptions: Dashboard.Options = {
    layouts: []
    // components: []
  };

  /* *
    *
    *  Constructors
    *
    * */
  public constructor(
    renderTo: (string|globalThis.HTMLElement),
    options: Dashboard.Options
  ) {
    this.options = merge(Dashboard.defaultOptions, options);
    /*
     * TODO
     *
     * 1. loop over layouts + init
     * 2. Bindings elements
     * 
     */
    
  }

  /* *
    *
    *  Properties
    *
    * */
  public readonly options: Dashboard.Options;
}

namespace Dashboard {
  export interface Options {
    layouts: Array<Layout.Options>;
    // components: Array<>;
  }
}

export default Dashboard;