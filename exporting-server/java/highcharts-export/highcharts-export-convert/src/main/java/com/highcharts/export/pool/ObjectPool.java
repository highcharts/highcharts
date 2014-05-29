/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.highcharts.export.pool;

/**
 *
 * @author gert
 */
public interface ObjectPool<T> {

	public void createObject();
	public void destroyObject(T object);
	public T borrowObject() throws InterruptedException, PoolException;
	public void returnObject(T object, boolean validate) throws InterruptedException;
	public void poolCleaner() throws PoolException, InterruptedException;
	public void tempDirCleaner();
}
