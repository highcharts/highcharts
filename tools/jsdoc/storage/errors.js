/*******************************************************************************

Highcharts Cloud

Copyright (c), Highsoft AS 2017
All rights reserved.

This application may only be used with a valid license.

Original Author: Christer Vasseng

Contains error strings for the API

******************************************************************************/

const tc = require('./utils');

/**
 * @module errors
 */

module.exports = {

  generic: [
    'An unknown error has occured. Please try again later'
  ],

  authTokenMissing: [
    'You are not authenticated.',
    'Make sure you are sending the auth token with your request.',
    'The token must be passed EITHER in the sessionid query arg, OR in X-Auth-Token.'
  ],

  insertError: [
    'Could not insert the data.',
    'Make sure you are sending a payload with your request'
  ],

  noPermission: [
    'You do not have permission to access this resource.',
    'If you think this is a mistake, please contact your team admin.',
    'If you are the team admin, check your team group permissions.'
  ],

  generalDB: [
    'Something went wrong when trying to use the database'
  ],

  notFound: [
    'The specified resource could not be found'
  ],

  invalidLogin: [
    'Could not log you in.',
    'Check username and/or password.'
  ],

  accountCreationError: [
    'Could not create the account.'
  ],

  loginError: [
    'Unable to log you in. Please try again in a few minutes.'
  ],

  logoutError: [
    'Unable to log you out. Please check your token and try again.'
  ],

  badUsernameOrPwd: [
    'Bad username and/or password'
  ],

  teamCreationFail: [
    'Unable to create the team. Please try again later.'
  ],

  teamUpdateFail: [
    'Unable to update the team. Please try again later'
  ],

  collabAddFail: [
    'Could not add the user as a collaborator.',
    'Maybe the user is allready a collaborator?'
  ],

  invalidInviation: [
    'The inviation code is invalid.',
    'It may have expired, or revoked by the team administrator.',
    'If you think this is a mistake, please contact the team administrator to have the inviation re-issued.'
  ],

  invalidUser: [
    'The requested user does not exist'
  ],

  invalidToken: [
    'The token you supplied is not valid'
  ],

  allreadyCollaborator: [
    'The user is already a collaborator on the chart'
  ],

  allreadyMember: [
    'The user is allready a member of the team'
  ],

  userCountSaturated: [
    'You have reached the maxium amount of users for your plan. Consider upgrading.',
    'Note that pending invitations also counts towards this.'
  ],

  invalidJSON: [
    'The input is not valid JSON'
  ],

  cdnError: [
    'Something went wrong when pushing static content'
  ],

  hashError: [
    'An error occured while generating a hash. Please try again'
  ],

  thumbnailError: [
    'Unable to create the thumbnail for the chart'
  ],

  captchaError: [
    'No robots allowed!',
    'The captcha was not valid.'
  ]

};

////////////////////////////////////////////////////////////////////////////////

let full = {};

Object.keys(module.exports).forEach((key) => {
  full[key] = {
    error: true,
    message: module.exports[key]
  };
});

module.exports.full = full;

let ecount = 0;

/**
 * Create an exception package
 */
module.exports.exceptionPacket = (intMsg, pubMsg) => {

  let id = (++ecount);

  let pub = {
    error: true,
    id: id,
    message: module.exports.generic
  };

  let pri = {
    id: id
  };

  if (tc.isBasic(pubMsg) || tc.isArr(pubMsg)) {
    pub.message = pubMsg;
  } else if (pubMsg && typeof pubMsg !== 'undefined') {
    pub = Object.assign(pub, pubMsg);
  }

  if (tc.isBasic(intMsg)) {
    pri.message = intMsg;
  } else if (intMsg && typeof intMsg !== 'undefined') {
    pri = Object.assign(pri, intMsg);
  }

  return {
    internal: pri,
    public: pub
  };
};

