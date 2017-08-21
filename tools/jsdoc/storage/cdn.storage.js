/*******************************************************************************

Highcharts Cloud

Copyright (c), Highsoft AS 2017
All rights reserved.

This application may only be used with a valid license.

Original Authors: Christer Vasseng, Lars Carbera

Used for CDN pushing.

Sample:

const cdn = require('cdn.storage');
const s3 = cdn.strategy.s3({
  Filename: '...',
  Bucket: '...',
  ACL: '...'
});

cdn.push(s3, <Buffer>)
   .catch(err => {

   })
   .then(data => {

   })
;

******************************************************************************/

const error = require('./errors');

const builtIns = {
  s3: (config) => {
    return (filename, data, mime) => {
      var s3 = new (require('aws-sdk').S3)();

      return new Promise((resolve, reject) => {
        s3.putObject({
            Bucket: config.Bucket,
            Key: filename,
            Body: data,
            ContentType: mime,
            ACL: config.ACL || 'public-read'
          }, (err, data) => {
            if (err) return reject(error.exceptionPacket(err, error.cdnError));
            return resolve(data);
        });
      });
    };
  },

  filesystem: (config) => {
    const fs = require('fs');

    config = config || {};
    config.path = config.path || __dirname + '/cdn/';

    if (config.path[config.path.length - 1] !== '/') {
      config.path += '/';
    }

    return (filename, data) => {
      filename = config.path + filename;
      return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, (err) => {
          if (err) return reject(error.exceptionPacket(err, error.cdnError));
          resolve();
        });
      });
    };
  }
};

module.exports = {
  /**
   * Push a file to a CDN
   * @param {function} strategy - The strategy to use for the push
   * @param {binary} data - The data to push
   * @param {string} mime - The mime type of the data being pushed
   * @return {promise}
   */
  push: (strategy, filename, data, mime) => {
    return strategy && strategy(filename, data, mime);
  },

  /* Namespace for built-in strategies */
  strategy: builtIns
};

