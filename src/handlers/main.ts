import { fetchTopis } from '../crawler/fetch-topis';
import { filterNewNotices } from '../notice/filter-new-notices';
import { sendToDivideEmailQueue } from '../common/sqs';
import { storeNewNotices } from '../notice/store-new-notices';

export interface MainHandlerResponse {
  statusCode: number;
  body: string;
}

export const handler = async (): Promise<MainHandlerResponse> => {
  const notices = await fetchTopis();

  const newNotices = await filterNewNotices(notices);

  if (newNotices.length === 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        newNotices,
        message: 'success',
      }),
    };
  }

  const messages = newNotices.map((notice) => {
    return {
      bdwrSeq: notice.bdwrSeq,
      bdwrTtlNm: notice.bdwrTtlNm,
      bdwrCts: notice.bdwrCts,
      createDate: notice.createDate,
    };
  });
  await sendToDivideEmailQueue(JSON.stringify(messages));
  await storeNewNotices(newNotices);

  return {
    statusCode: 200,
    body: JSON.stringify({
      newNotices,
      message: 'success',
    }),
  };
};
