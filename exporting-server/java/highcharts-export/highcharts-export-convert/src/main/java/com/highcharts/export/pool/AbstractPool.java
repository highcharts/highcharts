package com.highcharts.export.pool;

import com.highcharts.export.util.TempDir;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Collection;
import java.util.Date;
import java.util.Queue;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.IOFileFilter;

import org.apache.log4j.Logger;
import org.springframework.scheduling.annotation.Scheduled;

public abstract class AbstractPool<T> implements ObjectPool<T> {

	final ObjectFactory<T> objectFactory;
	Queue<T> queue;
	final AtomicInteger poolSize = new AtomicInteger(0);
	int maxWait;
	final int capacity;
	final long retentionTime;
	protected static Logger logger = Logger.getLogger("pool");

	public AbstractPool(ObjectFactory<T> objectFactory, int number, int maxWait, Long retentionTime) throws PoolException {
		this.objectFactory = objectFactory;
		this.capacity = number;
		this.maxWait = maxWait;
		this.retentionTime = retentionTime;
	}

	@Override
	public void createObject() {
		T object = objectFactory.create();
		queue.add(object);
		poolSize.getAndIncrement();
	}

	@Override
	public void destroyObject(T object) {
		objectFactory.destroy(object);
	}

	@Override
	@Scheduled(initialDelay = 10000, fixedRate = 5000)
	public void poolCleaner() throws InterruptedException, PoolException {

		logger.debug("HC: queue size: " + queue.size() + " poolSize " + poolSize.get());

		int size = poolSize.get();
		// remove invalid objects
		for (int i = 0; i < size; i++) {
			T object = borrowObject();
			if (object == null) {
				logger.debug("HC: object is null");
			} else {
				logger.debug("HC: validating " + object.toString());
				if (!objectFactory.validate(object)) {
					logger.debug("HC: destroying " + object.toString());
					destroyObject(object);
				} else {
					returnObject(object, false);
				}
			}
		}

		int number = poolSize.get() - capacity;
		logger.debug("in cleanpool, the surplus or shortage is: " + number);
		synchronized (this) {
				int iterations = Math.abs(number);
				for (int i = 0; i < iterations; i++) {
					if (number < 1) {
						this.createObject();
					} else {
						T object = borrowObject();
						this.destroyObject(object);
					}
				}
		}
	}

	@Override
	@Scheduled(initialDelay = 15000, fixedRate = 60000)
	public void tempDirCleaner() {
		IOFileFilter filter = new IOFileFilter() {

			@Override
			public boolean accept(File file) {
				try {
					Long now = new Date().getTime();
					Path path = Paths.get(file.getAbsolutePath());
					BasicFileAttributes attrs = Files.readAttributes(path, BasicFileAttributes.class);
					Long inBetween = now - attrs.lastAccessTime().toMillis();

					if (inBetween > retentionTime) {
						return true;
					}

				} catch (IOException ioex) {
					logger.error("Error: while selection files for deletion: "  + ioex.getMessage());
				}
				return false;
			}

			@Override
			public boolean accept(File file, String string) {
				throw new UnsupportedOperationException("Not supported yet."); 
			}
		};

		Collection<File> oldFiles = FileUtils.listFiles(TempDir.outputDir.toFile(),filter, null);
		for (File file : oldFiles) {
			file.delete();
		}
	}


	/*Getter and Setters*/
	public int getMaxWait() {
		return maxWait;
	}

	public void setMaxWait(int maxWait) {
		this.maxWait = maxWait;
	}
}
