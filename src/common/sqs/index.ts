import { SQS } from 'aws-sdk';
import { getEnv } from '../utils';
import { SQSEvent, SQSRecord } from 'aws-lambda';

const sqs = new SQS({
  region: getEnv('SQS_AWS_REGION'),
});

export const sendToDivideEmailQueue = async (message: string) => {
  const params = {
    MessageBody: message,
    QueueUrl: getEnv('DIVIDE_EMAIL_SQS_URL'),
    MessageGroupId: 'seoul-demo-reminder',
    MessageDeduplicationId: Date.now().toString(),
  };

  await sqs.sendMessage(params).promise();
};

export const sendToSendEmailQueue = async (message: string) => {
  const params = {
    MessageBody: message,
    QueueUrl: getEnv('SEND_EMAIL_SQS_URL'),
    MessageGroupId: 'seoul-demo-reminder',
    MessageDeduplicationId: Date.now().toString(),
  };

  await sqs.sendMessage(params).promise();
};

export const getMessageFromEvent = (event: SQSEvent): string[] => {
  return event.Records.map((record: SQSRecord) => record.body);
};
