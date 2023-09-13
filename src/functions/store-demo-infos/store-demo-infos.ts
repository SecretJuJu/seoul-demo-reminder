import axios from 'axios';
import { stringify } from 'qs';
import { sendSqsMessage } from '../../common/sqs';
import { initMongo } from '../../common/mongodb';
import { NoticeAttribute, noticeModel } from '../../common/mongodb/models/notice.model';

export interface NoticeEmailItem {
  bdwrSeq: string;
  bdwrTtlNm: string;
  bdwrCts: string;
  createDate: string;
}

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
  await initMongo();

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

  const alreadyNotices = await noticeModel.find({ bdwrSeq: { $in: noticeSequences } });
  // const alreadyNotices = await Notice.batchGet(noticeSequences);
  // 이미 존재하는 notice 들을 제외하기위해 이미 존재하는 notice 의 sequence 들을 배열로 만듬 (noticeModel 는 mongodb notice 스키마)
  const alreadyNoticeSequences = alreadyNotices.map((notice: NoticeAttribute) => notice.bdwrSeq);

  const newNotices = notices.filter((notice: NoticeAttribute) => {
    const isAlready =
      alreadyNoticeSequences.findIndex((sequence) => {
        return sequence === notice.bdwrSeq;
      }) > -1;
    return !isAlready;
  });

  console.log('new notices count: ', newNotices.length);

  // add new Notices to DynamoDB
  if (newNotices.length > 0) {
    await noticeModel.insertMany(newNotices);

    // send sqs queue
    await sendSqsMessage(
      JSON.stringify(
        newNotices.map((notice): NoticeEmailItem => {
          return {
            bdwrSeq: notice.bdwrSeq,
            bdwrTtlNm: notice.bdwrTtlNm,
            bdwrCts: notice.bdwrCts,
            createDate: notice.createDate,
          };
        }),
      ),
    );
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      newNotices,
      message: 'success',
    }),
  };
};
