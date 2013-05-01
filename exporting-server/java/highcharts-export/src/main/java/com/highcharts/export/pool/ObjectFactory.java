package com.highcharts.export.pool;

public interface ObjectFactory<T>{
	public T makeObject();
	public void removeObject(T object);
	public boolean validateObject(T object);
}
