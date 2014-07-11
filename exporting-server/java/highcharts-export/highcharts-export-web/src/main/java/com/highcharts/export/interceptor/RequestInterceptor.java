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
            sb.append("\t");
			sb.append(entry.getKey())
				.append("=");
                String[] values = entry.getValue();
                for (int i = 0; i < values.length; i++) {
                    sb.append(values[i]);
                    if (i < values.length) {
                        sb.append(", ");
                    } 
                }
				sb.append(lineSeparator);
		}
		return sb.toString();
	}

	@Override
	public boolean preHandle(HttpServletRequest request,
            HttpServletResponse response, Object handler) throws Exception {        
		request.setAttribute("startTime", System.currentTimeMillis());
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
			monitor.addError();
            logger.log(Level.INFO, "Time={0} :: Time taken(ms) {1}{3} :: RequestMethod {5} :: Status {6} :: Referer={2}{3} :: Request parameters {4}", 
                new Object[]{ new Date().toString(), //0
                    System.currentTimeMillis() - startTime, //1
                    request.getHeader("referer"), //2
                    lineSeparator, //3
                    extractPostRequestBody(request), //4
                    request.getMethod(), //5
                    response.getStatus()}); //6
                    
		} else {
            logger.log(Level.INFO, "Time={0} :: Time taken(ms) {1}{3} :: RequestMethod {4} :: Status {5} :: Referer={2}", 
                new Object[]{ new Date().toString(), //0
                    System.currentTimeMillis() - startTime, //1
                    request.getHeader("referer"), //2
                    lineSeparator, //3
                    request.getMethod(), //4
                    response.getStatus()}); //5
        }
        

        logger.log(Level.INFO, monitor.report());
    }

}
