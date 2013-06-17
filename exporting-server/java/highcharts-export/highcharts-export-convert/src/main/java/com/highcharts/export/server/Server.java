package com.highcharts.export.server;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Timer;
import java.util.concurrent.TimeoutException;

import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;

import com.highcharts.export.converter.SVGConverterException;
import com.highcharts.export.pool.ServerObjectFactory;
import static com.highcharts.export.server.Server.logger;

public class Server {
	private Process process;
	private final int port;
	private final String host;
	private final int readTimeout;
	private final int connectTimeout;
	private final int maxTimeout;
	private ServerState state = ServerState.IDLE;

	protected static Logger logger = Logger.getLogger("utils");

	public Server(String exec, String script, String host, int port, int connectTimeout, int readTimeout, int maxTimeout) {

		// assign port and host to this instance
		this.port = port;
		this.host = host;
		this.connectTimeout = connectTimeout;
		this.readTimeout = readTimeout;
		this.maxTimeout = maxTimeout;

		try {
			ArrayList<String> commands = new ArrayList<String>();
			commands.add(exec);
			commands.add(ServerObjectFactory.tmpDir + "phantomjs/" + script);
			commands.add("-host");
			commands.add(host);
			commands.add("-port");
			commands.add("" + port);

			logger.debug(commands.toString());

			process = new ProcessBuilder(commands).start();
			final BufferedReader bufferedReader = new BufferedReader(
					new InputStreamReader(process.getInputStream()));
			String readLine = bufferedReader.readLine();
			if (readLine == null || !readLine.contains("ready")) {
				throw new RuntimeException("Error, PhantomJS couldnot start");
			}

			initialize();

			Runtime.getRuntime().addShutdownHook(new Thread() {
				@Override
				public void run() {
					if (process != null) {
						logger.error("Shutting down PhantomJS instance, kill process directly, " + this.toString());
						try {
							process.getErrorStream().close();
							process.getInputStream().close();
							process.getOutputStream().close();
						} catch (IOException e) {
							logger.error("Error while shutting down process: " + e.getMessage());
						}
						process.destroy();
					}
				}
			});
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public void initialize() {
		logger.debug("Phantom server started on port " + port);
	}

	public String request(String params) throws SocketTimeoutException, SVGConverterException, TimeoutException {
		String response = "";
		Timer _timer = new Timer();
		try {
			URL url = new URL("http://" + host + ":"
					+ port + "/");

			// TEST sockettimeout
			//url = new URL("http://" + host + ":7777/");

			state = ServerState.BUSY;

			_timer.schedule(new TimeOut(this), maxTimeout);

			URLConnection connection = url.openConnection();
			connection.setDoOutput(true);
			connection.setConnectTimeout(connectTimeout);
			connection.setReadTimeout(readTimeout);

			OutputStream out = connection.getOutputStream();
			out.write(params.getBytes());
			out.close();
			InputStream in = connection.getInputStream();
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			IOUtils.copy(in, baos);
			in.close();
			response = new String(baos.toByteArray(), Charset.forName("utf-8"));

			_timer.cancel();
			state = ServerState.IDLE;
		} catch (SocketTimeoutException ste) {
			_timer.cancel();
			throw new SocketTimeoutException(ste.getMessage());
		} catch (Exception e) {
			if(state == ServerState.TIMEDOUT) {
				throw new TimeoutException(e.getMessage());
			}
			_timer.cancel();
			throw new SVGConverterException(e.getMessage());
		}
		return response;
	}

	public void cleanup() {
		try {
			/* It's not enough to only destroy the process, this helps*/
			process.getErrorStream().close();
			process.getInputStream().close();
			process.getOutputStream().close();
		} catch (IOException e) {
			logger.error("Error while shutting down process: " + e.getMessage());
		}

		process.destroy();
		process = null;
		logger.debug("Destroyed phantomJS process running on port " + port);
	}

	public int getPort() {
		return port;
	}

	public String getHost() {
		return host;
	}

	public ServerState getState() {
		return state;
	}

	public void setState(ServerState state) {
		this.state = state;
	}

	@Override
	public String toString() {
		return this.getClass().getName() + "listening to port: " + port;
	}
}
