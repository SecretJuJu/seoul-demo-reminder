// serverless handler call by sqs
import { SQSEvent, SQSRecord } from 'aws-lambda';
import { NoticeEmailItem } from '@functions/store-demo-infos/store-demo-infos';
import { initMongo } from '../../common/mongodb';
import * as nodeMailer from 'nodemailer';
import { getEnv } from '../../common/utils';
import { customerModel } from '../../common/mongodb/models/customer.model';

const getMessageFromEvent = (event: SQSEvent): string[] => {
  return event.Records.map((record: SQSRecord) => record.body);
};

export const handler = async (event: SQSEvent) => {
  await initMongo();
  const messages: string[] = getMessageFromEvent(event);

  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: getEnv('EMAIL_SENDER_ADDRESS'),
      pass: getEnv('EMAIL_SENDER_PASSWORD'),
    },
  });

  const contents = messages.map((message) => {
    const notices: NoticeEmailItem[] = JSON.parse(message);

    const html = notices
      .map((notice) => {
        return `
        <hr />
        <div>
          <h3>{${notice.bdwrSeq}} ${notice.bdwrTtlNm}</h3>
          <p>${notice.bdwrCts}</p>
          <p>${notice.createDate}</p>
        </div>
      `;
      })
      .join('');

    return `
    <h1>서울시 집회/행사 알림</h1>
    <div>
      ${html}
    </div>
    `;
  });

  const customers = await customerModel.find({});

  // contents 별로 각각의 customer 에게 email 보내기
  for (const content of contents) {
    const sendMails = customers.map(async (customer) => {
      const mailOptions = {
        from: getEnv('EMAIL_SENDER_ADDRESS'),
        to: customer.email,
        subject: '서울시 집회/행사 알림',
        html: content,
      };

      await transporter.sendMail(mailOptions);
    });

    await Promise.all(sendMails);
  }
};
