// serverless handler call by sqs
import { SQSEvent } from 'aws-lambda';
import * as nodeMailer from 'nodemailer';
import { getEnv } from '../../common/utils';
import { getMessageFromEvent } from '../../common/sqs';
import { DividedNoticeEmailChunk } from '../divide-emails/divide-notice-emails';
import { alertError } from '../../common/alert';
import Mail from 'nodemailer/lib/mailer';

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

  const mailOptions: Mail.Options = {
    from: getEnv('EMAIL_SENDER_ADDRESS'),
    to: emails,
    subject: '서울시 집회/행사 알림',
    html: contents,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    await alertError(err);
  }
};
