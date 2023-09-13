import { SQS } from 'aws-sdk';
import { getEnv } from '../utils';

const sqs = new SQS({
  credentials: {
    accessKeyId: getEnv('SQS_AWS_ACCESS_KEY'),
    secretAccessKey: getEnv('SQS_AWS_SECRET_ACCESS_KEY'),
  },
  region: getEnv('SQS_AWS_REGION'),
});

export const sendSqsMessage = async (message: string) => {
  const params = {
    MessageBody: message,
    QueueUrl: getEnv('SQS_URL'),
    MessageGroupId: 'seoul-demo-reminder',
    MessageDeduplicationId: Date.now().toString(),
  };

  await sqs.sendMessage(params).promise();
};
