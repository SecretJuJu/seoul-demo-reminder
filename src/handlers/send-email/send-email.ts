// serverless handler call by sqs
import { SQSEvent } from 'aws-lambda';
import * as nodeMailer from 'nodemailer';
import { getEnv } from '../../common/utils';
import { getMessageFromEvent } from '../../common/sqs';
import { DividedNoticeEmailChunk } from '../divide-emails/divide-notice-emails';

export const handler = async (event: SQSEvent) => {
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: getEnv('EMAIL_SENDER_ADDRESS'),
      pass: getEnv('EMAIL_SENDER_PASSWORD'),
    },
  });

  const message = getMessageFromEvent(event)[0];
  const { emails, contents } = JSON.parse(message) as DividedNoticeEmailChunk;

  // contents 별로 각각의 customer 에게 email 보내기
  for (const email of emails) {
    const mailOptions = {
      from: getEnv('EMAIL_SENDER_ADDRESS'),
      to: email,
      subject: '서울시 집회/행사 알림',
      html: contents,
    };

    await transporter.sendMail(mailOptions);
    // sleep for 0.5 sec
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
};
