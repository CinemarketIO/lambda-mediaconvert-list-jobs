// @format
'use strict';

const AWS = require('aws-sdk');

module.exports.jobs = async event => {
  const params = {
    MaxResults: 10,
    Order: 'DESCENDING',
    Queue: 'Default',
  };

  const endpointPromise = new AWS.MediaConvert({
    endpoint: process.env.MEDIACONVERT_ACCESS_POINT,
    apiVersion: '2017-08-29',
  })
    .listJobs(params)
    .promise();

  let data;
  try {
    data = await endpointPromise;
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({error: err.message}),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }

  // Remove data from jobs endpoint
  const jobs = [];
  for (let job of data.Jobs) {
    const {Settings, JobPercentComplete, ErrorCode, Status, ErrorMessage} = job;

    // NOTE: For us Mediaconvert can only have a single input
    const fileInput = Settings.Inputs[0].FileInput;
    const fileSplit = fileInput.split('/');

    const cleanJob = {
      jobPercentComplete: JobPercentComplete,
      errorCode: ErrorCode,
      status: Status,
      errorMessage: ErrorMessage,
      fileInput: fileSplit[fileSplit.length - 1],
    };
    jobs.push(cleanJob);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({jobs}),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  };
};
