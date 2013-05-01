package com.highcharts.export.pool;

import java.util.ArrayList;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;


public abstract class Pool<T> {
	private final ObjectFactory<T> factory;
	private final BlockingQueue<T> cache;
	private int maxWait = 500;

	protected static Logger logger = Logger.getLogger("pool");

	public Pool(ObjectFactory<T> factory, int number, int maxWait) throws PoolException {
		this(factory,number);
		this.maxWait = maxWait;
	}

    public Pool(ObjectFactory<T> factory, int number) throws PoolException {
    	this.factory = factory;
    	ArrayList<T> list = new ArrayList<T>(number);
		for (int i = 0; i < number; i++) {
			try {
				list.add(factory.makeObject());
			} catch (Exception e) {
				logger.error(e.getMessage());
				throw new PoolException(e.getMessage());
			}
		}
		logger.debug("creating pool with size: " + list.size() );
        this.cache = new ArrayBlockingQueue<T>(list.size(), false, list);
        logger.debug("finished: " + cache.toString());
    }

	public T borrow() throws InterruptedException, PoolException {
    	logger.debug("we want to borrow");
    	T object = this.cache.poll(maxWait, TimeUnit.MILLISECONDS);
    	if (object == null) {
    		throw new PoolException();
    	}
    	logger.debug("Borrowed: " + object.toString());
    	return object;
    }

    public void giveBack(T object) throws InterruptedException {
    	logger.debug("giving back: " + object.toString());
    	boolean isValid = factory.validateObject(object);
    	if (isValid) {
    		this.cache.put(object);
    	} else {
    		T newObject;
			try {
				// remove first, cleans up and releases portnumber.
				factory.removeObject(object);
				// make a new one
				newObject = factory.makeObject();
				this.add(newObject);
			} catch (Exception e) {
				logger.error("Failed to create new object for pool");
			}
    	}
    	logger.debug("after return, cache: " + cache.toString());
    }

    public boolean add(T object) {
    	return this.cache.offer(object);
    }

    /*Getter and Setters*/
    public int getMaxWait() {
		return maxWait;
	}

	public void setMaxWait(int maxWait) {
		this.maxWait = maxWait;
	}

}
