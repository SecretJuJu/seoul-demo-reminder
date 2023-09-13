// serverless handler call by sqs
import { SQSEvent, SQSRecord } from 'aws-lambda';
import { NoticeEmailItem } from '@functions/store-demo-infos/store-demo-infos';
import { sendSES } from '../../common/ses';

const getMessageFromEvent = (event: SQSEvent): string[] => {
  return event.Records.map((record: SQSRecord) => record.body);
};

export const handler = async (event: SQSEvent) => {
  const messages: string[] = getMessageFromEvent(event);

  for (const message of messages) {
    const notices: NoticeEmailItem[] = JSON.parse(message);

    // make as html email
    const html = notices
      .map((notice) => {
        return `
        <div>
          <h1>{${notice.bdwrSeq}} ${notice.bdwrTtlNm}</h1>
          <p>${notice.bdwrCts}</p>
          <p>${notice.createDate}</p>
        </div>
      `;
      })
      .join('');

    // send email
    await sendSES(html);
  }
};
