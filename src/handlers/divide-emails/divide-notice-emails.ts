import { SQSEvent } from 'aws-lambda';
import { getMessageFromEvent, sendToSendEmailQueue } from '../../common/sqs';
import { NoticeEmailItem } from '../store-demo-infos/store-demo-infos';
import { listAllEnabledUserEmails } from '../../common/cognito';
import * as lodash from 'lodash';

const formatToEmail = (messages: string[]) => {
  return messages.map((message) => {
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
};

export interface DividedNoticeEmailChunk {
  emails: string[];
  contents: string;
}

/**
 * 1. sqs 로 새로운 공지사항을 전달받고, cognito 를 통해 유저의 이메일을 불러옴
 * 2. 보내야하는 이메일을 10개씩 나누어 SQS 로 전달
 */
export const handler = async (event: SQSEvent) => {
  const messages = getMessageFromEvent(event);
  // 전송해야할 이메일 내용
  const contents = formatToEmail(messages);

  // 전송 대상들
  const emails = await listAllEnabledUserEmails();

  const chunkMaxSize = 30;
  const chunks: DividedNoticeEmailChunk[] = [];

  const emailChunks = lodash.chunk(emails, chunkMaxSize);
  contents.forEach((content) => {
    emailChunks.forEach((emails) => {
      chunks.push({
        emails,
        contents: content,
      });
    });
  });

  // chunks 를 SQS 로 전송
  const sendSQSPromises = chunks.map((chunk) => {
    return sendToSendEmailQueue(JSON.stringify(chunk));
  });
  await Promise.all(sendSQSPromises);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'success',
    }),
  };
};
