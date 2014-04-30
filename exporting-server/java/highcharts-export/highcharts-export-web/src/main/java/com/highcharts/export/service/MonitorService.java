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
public class MonitorService {

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

	@Scheduled(initialDelay = 60000, fixedRate = 15000)
	public void reporter() {
		// reset after hour	
		long elapsedMinutes = (System.currentTimeMillis() - start)/60000;
		long rate = 1; // prevent dividing by zero
		if (this.getCount() > 0) {
			rate = this.getCount() / elapsedMinutes;
		}

		logger.log(Level.INFO, "request count: {0}, Error count: {1}, Elapsed time (min): {2}, Rate: {3}", new Object[]{this.getCount(), this.getCountError(), elapsedMinutes, rate});

		// report hourly and reset counters
		if (elapsedMinutes > 60) {
			logger.log(Level.INFO, "##### HOURLY REPORT request count: {0} Error count: {1} #####", new Object[]{this.getCount(), this.getCountError()});
			// resetting
			count.set(0);
			error.set(0);
			start = System.currentTimeMillis();
		}
	}
}
