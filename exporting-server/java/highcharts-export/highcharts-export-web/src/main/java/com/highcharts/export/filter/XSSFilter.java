package com.highcharts.export.filter;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.owasp.esapi.ESAPI;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by gert on 20/01/15. Inspired by http://codehustler.org/blog/jersey-cross-site-scripting-xss-filter-for-java-web-apps/ and http://stackoverflow.com/questions/1413129/modify-request-parameter-with-servlet-filter
 */
public class XSSFilter implements Filter {

	static class XssFilteredRequest extends HttpServletRequestWrapper {

		/**
		 * Constructs a request object wrapping the given request.
		 *
		 * @param request
		 * @throws IllegalArgumentException if the request is null
		 */
		public XssFilteredRequest(HttpServletRequest request) {
			super(request);
		}

		public String getParameter(String name) {
			String value = super.getParameter(name);
			return stripXSS(value);
		}

		public Map<String, String[]> getParameterMap() {
			Map<String, String[]> filtered = new HashMap<>();
			for( Map.Entry<String, String[]> params : super.getParameterMap().entrySet() ) {
				String key = params.getKey();
				String[] values = params.getValue();

				List<String> cleaned = new ArrayList<>();
				for( String value : values )
				{
					cleaned.add( stripXSS(value));
				}
				String[] arr = new String[cleaned.size()];

				filtered.put(key, cleaned.toArray(arr));
			}

			return filtered;
		}

		@Override
		public String[] getParameterValues(String name) {
			List<String> filtered = new ArrayList<>();

			String[] values = super.getParameterValues(name);
			if (null == values) {
				return super.getParameterValues(name);
			}

			for (String value : values) {
				filtered.add(stripXSS(value));
			}

			String[] arr = new String[filtered.size()];
			filtered.toArray(arr);

			return arr;
		}

		public String stripXSS(String value)
		{
			if( value == null )
				return null;

			// Use the ESAPI library to avoid encoded attacks.
			value = ESAPI.encoder().canonicalize(value);

			// Avoid null characters
			value = value.replaceAll("\0", "");

			// Clean out HTML
			value = Jsoup.clean(value, Whitelist.none());

			return value;
		}
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		if (request.getParameterMap().isEmpty()) {
			chain.doFilter(request, response);
		} else {
			chain.doFilter(new XssFilteredRequest((HttpServletRequest) request), response);
		}
	}

	@Override
	public void destroy() {
	}

}
