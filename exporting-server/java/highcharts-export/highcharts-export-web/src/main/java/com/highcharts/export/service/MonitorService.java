/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.highcharts.export.service;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Logger;
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
    
    private long calculateRatePerMinute() {
        long rate = 1; // prevent dividing by zero
        long elapsedMinutes = calculateElapsedMinutes();
		if (this.getCount() > 0 && elapsedMinutes > 0) {
			rate = this.getCount() / elapsedMinutes;
		}
        return rate;
    }
    
    private long calculateElapsedMinutes() {
        return (System.currentTimeMillis() - start)/60000;
    }
    
    public String report() {
        long elapsedMinutes = calculateElapsedMinutes();
        String report;
        
        if (elapsedMinutes > 60) {
			report = String.format("##### HOURLY REPORT request count: %d Error count: %d #####", this.getCount(), this.getCountError());
			// resetting
			count.set(0);
			error.set(0);
			start = System.currentTimeMillis();
		} else {
            report = String.format("request count: %d, Error count: %d, Elapsed time (min): %d, Rate: %d",
                this.getCount(), this.getCountError(), elapsedMinutes, calculateRatePerMinute());
        }
        
        return report;
    }
}
