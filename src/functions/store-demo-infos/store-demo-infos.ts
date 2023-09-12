import axios from 'axios';
import { Notice, NoticeAttribute } from '../../common/dynamodb';
import { stringify } from 'qs';

async function fetchNotices(): Promise<NoticeAttribute[]> {
  const response = await axios.request({
    method: 'post',
    maxBodyLength: Infinity,
    // https 로 요청하니 tls 오류나서 일단 이렇게 넘어감
    url: 'http://topis.seoul.go.kr/notice/selectNoticeList.do',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: stringify({
      mainBdwrRowNum: '10',
    }),
  });

  return response.data.rows as NoticeAttribute[];
}

export const handler = async (): Promise<object> => {
  let notices: NoticeAttribute[] = [];
  try {
    notices = await fetchNotices();
  } catch (err) {
    console.log(`Error occurred while fetching notices: ${err}`);
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error occurred while fetching notices',
      }),
    };
  }

  const noticeSequences = notices.map((notice: NoticeAttribute) => notice.bdwrSeq);

  const alreadyNotices = await Notice.batchGet(noticeSequences);
  const alreadyNoticeSequences = alreadyNotices.map((notice) => {
    return notice.bdwrSeq;
  });

  const newNotices = notices.filter((notice: NoticeAttribute) => {
    const isAlready =
      alreadyNoticeSequences.findIndex((sequence) => {
        return sequence === notice.bdwrSeq;
      }) > -1;
    return !isAlready;
  });

  console.log('new notices count: ', newNotices.length);

  // add new Notices to DynamoDB
  // 100개씩 나눠서 put
  if (newNotices.length > 0) {
    await Notice.batchPut(newNotices);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      newNotices,
      message: 'success',
    }),
  };
};
