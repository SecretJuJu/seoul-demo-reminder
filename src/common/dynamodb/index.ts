import * as aws from 'aws-sdk';
import { getEnv } from '../utils';

export const dynamodb = new aws.DynamoDB({
  region: getEnv('DYNAMO_DB_REGION'),
});
