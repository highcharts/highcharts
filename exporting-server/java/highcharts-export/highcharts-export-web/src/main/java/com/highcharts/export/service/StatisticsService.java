/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.highcharts.export.service;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

/**
 *
 * @author gert
 */
@Service
public class StatisticsService {

	private AtomicInteger count = new AtomicInteger(0);
	private AtomicInteger error = new AtomicInteger(0);
	private long start = System.currentTimeMillis();
	protected static final Logger logger = Logger.getLogger("statistics");

	public int add() {
		return count.incrementAndGet();
	}

	public int addError() {
		return error.incrementAndGet();
	}

	public int getCount() {
		return count.get();
	}

	public int getCountError() {
		return error.get();
	}

	@Scheduled(initialDelay = 10000, fixedRate = 60000)
	public void reporter() {
		// reset after hour
		logger.log(Level.INFO, "request count: {0} Error count: {1}", new Object[]{this.getCount(), this.getCountError()});		
		long elapsed = System.currentTimeMillis() - start;
		if (elapsed > 3600000) {		
			logger.log(Level.INFO, "##### HOURLY REPORT request count: {0} Error count: {1} #####", new Object[]{this.getCount(), this.getCountError()});
			count.set(0);
			error.set(0);
		}
	}
}
