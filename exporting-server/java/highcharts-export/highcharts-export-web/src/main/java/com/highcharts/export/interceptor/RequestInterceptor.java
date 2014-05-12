/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.highcharts.export.interceptor;

import com.highcharts.export.service.MonitorService;
import java.io.IOException;
import java.util.Date;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

/**
 *
 * @author gert
 */
public class RequestInterceptor extends HandlerInterceptorAdapter {
	private static final Logger logger = Logger.getLogger(RequestInterceptor.class.getName());
	private static final String lineSeparator = System.getProperty("line.separator");

	@Autowired MonitorService monitor;


	private String extractPostRequestBody(HttpServletRequest request) throws IOException {
		StringBuilder sb = new StringBuilder();
		Map<String, String[]> paramMap = request.getParameterMap();
		
		for (Map.Entry<String, String[]> entry : paramMap.entrySet()) {
			sb.append(entry.getKey())
				.append("=")
				.append(entry.getValue())
				.append(lineSeparator);
		}
		return sb.toString();
	}

	@Override
	public boolean preHandle(HttpServletRequest request,
            HttpServletResponse response, Object handler) throws Exception {
        long startTime = System.currentTimeMillis();
        logger.log(Level.INFO, "Time={0} Referer={1} Request URL={2}{3}", new Object[]{ new Date().toString(), request.getHeader("referer"), request.getRequestURL().toString(), lineSeparator});
		logger.log(Level.INFO, "Request parameters {0}", new Object[]{extractPostRequestBody(request)});
		request.setAttribute("startTime", startTime);
		monitor.add();
        
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request,
            HttpServletResponse response, Object handler, Exception ex)
            throws Exception {

        long startTime = (Long) request.getAttribute("startTime");
		int httpStatus = response.getStatus();

		if (httpStatus == 500) {
			monito,r.addError();
		}
        logger.log(Level.INFO, "Request URL::{0}:: Time Taken={1} :: HttpStatus: {2}", new Object[]{request.getRequestURL().toString(), System.currentTimeMillis() - startTime, httpStatus});

		logger.log(Level.INFO, Integer.valueOf(monitor.getCount()).toString());

		
    }

}
