import AWS from 'aws-sdk';
import { getEnv } from '../utils';

export const alertError = async (error: Error) => {
  const sns = new AWS.SNS();
  const params = {
    Message: error.message,
    Subject: 'Error occurred in SeoulDemoReminder',
    TopicArn: getEnv('ALERT_SNS_ARN'),
  };

  try {
    await sns.publish(params).promise();
  } catch (err) {
    console.error(err);
  }
};
