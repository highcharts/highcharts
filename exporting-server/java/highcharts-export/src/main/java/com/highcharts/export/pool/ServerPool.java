package com.highcharts.export.pool;

import com.highcharts.export.server.Server;


public class ServerPool extends Pool<Server>{

	/**
	 * @param factory
	 * @param number
	 * @throws PoolException
	 */
	public ServerPool(ObjectFactory<Server> factory, int number) throws PoolException {
		super(factory, number);
	}

	public ServerPool(ObjectFactory<Server> factory, int number, int maxWait) throws PoolException {
		super(factory, number, maxWait);
	}


}
