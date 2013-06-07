package com.highcharts.export.pool;

import java.util.Queue;
import java.util.concurrent.atomic.AtomicInteger;

import org.apache.log4j.Logger;
import org.springframework.scheduling.annotation.Scheduled;

public abstract class AbstractPool<T> implements ObjectPool<T> {

	final ObjectFactory<T> objectFactory;
	Queue<T> queue;
	final AtomicInteger poolSize = new AtomicInteger(0);
	int maxWait;
	final int capacity;
	protected static Logger logger = Logger.getLogger("pool");

	public AbstractPool(ObjectFactory<T> objectFactory, int number, int maxWait) throws PoolException {
		this.objectFactory = objectFactory;
		this.capacity = number;
		this.maxWait = maxWait;
	}

	@Override
	public void createObject() {
		T object = objectFactory.create();
		queue.add(object);
		poolSize.getAndIncrement();
	}

	@Override
	public void destroyObject(T object) {
		objectFactory.destroy(object);
	}

	@Override
	@Scheduled(initialDelay = 10000, fixedRate = 60000)
	public void poolCleaner() throws InterruptedException, PoolException {

		logger.debug("HC: queue size: " + queue.size() + " poolSize " + poolSize.get());

		int size = poolSize.get();
		// remove invalid objects
		for (int i = 0; i < size; i++) {
			T object = borrowObject();
			if (object == null) {
				logger.debug("HC: object is null");
				continue;
			} else {
				logger.debug("HC: validating " + object.toString());
				if (!objectFactory.validate(object)) {
					logger.debug("HC: destroying " + object.toString());
					destroyObject(object);
				} else {
					returnObject(object, false);
				}
			}
		}

		int number = poolSize.get() - capacity;
		logger.debug("in cleanpool, the surplus or shortage is: " + number);
		synchronized (this) {
				int iterations = Math.abs(number);
				for (int i = 0; i < iterations; i++) {
					if (number < 1) {
						this.createObject();
					} else {
						T object = borrowObject();
						this.destroyObject(object);
					}
				}
		}
	}

	/*Getter and Setters*/
	public int getMaxWait() {
		return maxWait;
	}

	public void setMaxWait(int maxWait) {
		this.maxWait = maxWait;
	}
}
