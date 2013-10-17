package com.highcharts.export.pool;

import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;


public class BlockingQueuePool<T> extends AbstractPool<T>{

	LinkedBlockingQueue<T> linkQueue;
	/**
	 * @param factory
	 * @param number
	 * @throws PoolException
	 */

	public BlockingQueuePool(ObjectFactory<T> factory, int number, int maxWait, long retentionTime) throws PoolException {
		super(factory, number, maxWait, retentionTime);
		queue = new LinkedBlockingQueue<T>();
		linkQueue = (LinkedBlockingQueue<T>) queue;
	}


	@Override
	public T borrowObject() throws InterruptedException, PoolException {
		T object = linkQueue.poll(maxWait, TimeUnit.MILLISECONDS);
		if (object == null) {
			throw new PoolException();
		}
		poolSize.getAndDecrement();

		return object;
	}

	@Override
	public void returnObject(T object, boolean validate) throws InterruptedException {
		if (object == null) {
			return;
		}

		boolean valid = ( !validate || objectFactory.validate(object)) ? true : false;

		if (!valid) {
			destroyObject(object);
		} else {
			objectFactory.passivate(object);
			linkQueue.offer(object, maxWait, TimeUnit.MILLISECONDS);
			poolSize.incrementAndGet();
		}
	}


}
