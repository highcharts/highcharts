package com.highcharts.export.pool;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.log4j.Logger;

import com.highcharts.export.server.Server;
import com.highcharts.export.server.ServerState;
import com.highcharts.export.util.TempDir;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Enumeration;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import org.apache.commons.io.IOUtils;

public class ServerObjectFactory implements ObjectFactory<Server> {

	public String exec;
	public String script;
	private String host;
	private int basePort;
	private int readTimeout;
	private int connectTimeout;
	private int maxTimeout;
	private static HashMap<Integer, PortStatus> portUsage = new HashMap<Integer, PortStatus>();
	protected static Logger logger = Logger.getLogger("pool");

	private enum PortStatus {
        BUSY,
        FREE;
	}

	@Override
	public Server create() {
		logger.debug("in makeObject, " + exec + ", " +  script + ", " +  host);
		Integer port = this.getAvailablePort();
		portUsage.put(port, PortStatus.BUSY);
		return new Server(exec, script, host, port, connectTimeout, readTimeout, maxTimeout);
	}

	@Override
	public boolean validate(Server server) {
		boolean isValid = false;
		try {
			if(server.getState() != ServerState.IDLE) {
				logger.debug("server didn\'t pass validation");
				return false;
			}
			String result = server.request("{\"status\":\"isok\"}");
			if(result.indexOf("OK") > -1) {
				isValid = true;
				logger.debug("server passed validation");
			} else {
				logger.debug("server didn\'t pass validation");
			}
		} catch (Exception e) {
			logger.error("Error while validating object in Pool: " + e.getMessage());
		}
		return isValid;
	}

	@Override
	public void destroy(Server server) {
		ServerObjectFactory.releasePort(server.getPort());
		server.cleanup();
	}

	@Override
	public void activate(Server server) {
		server.setState(ServerState.ACTIVE);
	}

	@Override
	public void passivate(Server server) {
		server.setState(ServerState.IDLE);
	}

	public static void releasePort(Integer port) {
		logger.debug("Releasing port " + port);
		portUsage.put(port, PortStatus.FREE);
	}

	public Integer getAvailablePort() {
		for (Map.Entry<Integer, PortStatus> entry : portUsage.entrySet()) {
		   if (PortStatus.FREE == entry.getValue()) {
			   // return available port
			   logger.debug("Portusage " + portUsage.toString());
			   return entry.getKey();
		   }
		}
		// if no port is free
		logger.debug("Nothing free in Portusage " + portUsage.toString());
		return basePort + portUsage.size();
	}

	/*Getters and Setters*/

	public String getExec() {
		return exec;
	}

	public void setExec(String exec) {
		this.exec = exec;
	}

	public String getScript() {
		return script;
	}

	public void setScript(String script) {
		this.script = script;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public int getBasePort() {
		return basePort;
	}

	public void setBasePort(int basePort) {
		this.basePort = basePort;
	}

	public int getReadTimeout() {
		return readTimeout;
	}

	public void setReadTimeout(int readTimeout) {
		this.readTimeout = readTimeout;
	}

	public int getConnectTimeout() {
		return connectTimeout;
	}

	public void setConnectTimeout(int connectTimeout) {
		this.connectTimeout = connectTimeout;
	}

	public int getMaxTimeout() {
		return maxTimeout;
	}

	public void setMaxTimeout(int maxTimeout) {
		this.maxTimeout = maxTimeout;
	}

	@PostConstruct
	public void afterBeanInit() {
		String jarLocation = getClass().getProtectionDomain().getCodeSource().getLocation().getPath().split("!")[0].replace("file:/", "");
		try {
			jarLocation = URLDecoder.decode(jarLocation, "utf-8");
			// get filesystem depend path
			jarLocation = new File(jarLocation).getCanonicalPath();
		} catch (UnsupportedEncodingException ueex) {
			logger.error(ueex);
		} catch (IOException ioex) {
			logger.error(ioex);
		}

		try {
			JarFile jar = new JarFile(jarLocation);
			for (Enumeration<JarEntry> entries = jar.entries(); entries.hasMoreElements();) {
				JarEntry entry = entries.nextElement();
				String name = entry.getName();
				if (name.startsWith("phantomjs/")) {
					Path path = Paths.get(TempDir.getTmpDir().toString(), name);
					if (name.endsWith("/")) {
						Files.createDirectories(path);
					} else {
						File file = Files.createFile(path).toFile();
						InputStream in = jar.getInputStream(entry);
						IOUtils.copy(in, new FileOutputStream(file));
					}
				}
			}
		} catch (IOException ioex) {
			logger.error(ioex);
		}
	}



}
