package com.highcharts.export.pool;

public interface ObjectFactory<T>{
	public T create();
	public boolean validate(T object);
	public void destroy(T object);
	public void activate(T object);
	public void passivate(T Object);
}
