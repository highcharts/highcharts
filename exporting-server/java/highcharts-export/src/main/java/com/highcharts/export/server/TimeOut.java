package com.highcharts.export.server;

import java.util.TimerTask;

import org.apache.log4j.Logger;


public class TimeOut extends TimerTask {
    private final Server server;
    protected static Logger logger = Logger.getLogger("utils");

    public TimeOut(Server server) {
        this.server = server;
    }

    @Override
    public void run(){
        logger.debug("Timed out while downloading.");
        server.setState(ServerState.TIMEDOUT);
    }
};
