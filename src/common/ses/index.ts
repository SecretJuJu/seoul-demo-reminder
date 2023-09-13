import { SES } from 'aws-sdk';
import { getEnv } from '../utils';
import { customerModel } from '../mongodb/models/customer.model';

const index = new SES({
  credentials: {
    accessKeyId: getEnv('SES_AWS_ACCESS_KEY'),
    secretAccessKey: getEnv('SES_AWS_SECRET_ACCESS_KEY'),
  },
  region: getEnv('SES_AWS_REGION'),
});

export const sendSES = async (html: string) => {
  // mongodb 에서 customers 정보 가져오기
  const customers = await customerModel.find({});

  // customers 정보를 이용해서 index 로 email 보내기
  for (const customer of customers) {
    const params = {
      Destination: {
        ToAddresses: [customer.email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: html,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: '서울시 집회/행사 알림',
        },
      },
      Source: getEnv('SES_SENDER_ADDRESS'),
    };

    await index.sendEmail(params).promise();
  }
};
