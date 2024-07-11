import { NoticeAttribute } from '../common/mongodb/models/notice.model';
import { dynamodb } from '../common/dynamodb';
import { getEnv } from '../common/utils';

export const storeNewNotices = async (notices: NoticeAttribute[]) => {
  await dynamodb
    .batchWriteItem({
      RequestItems: {
        [getEnv('DYNAMO_DB_NOTICE_TABLE')]: notices.map((notice) => {
          return {
            PutRequest: {
              Item: {
                bdwrSeq: { S: notice.bdwrSeq },
                bdwrCts: { S: notice.bdwrCts },
                bdwrTtlNm: { S: notice.bdwrTtlNm },
                updateDate: { S: notice.updateDate },
                createDate: { S: notice.createDate },
              },
            },
          };
        }),
      },
    })
    .promise();
};

storeNewNotices([
  {
    bdwrSeq: '4231',
    bdwrTtlNm: '[안내] 7월9일(화) 호우주의보 안내',
    bdwrCts:
      '<p><strike>2024. 7. 9.(화) 20:00 기준 기상청에 따르면 금일 서울시에 호우주의보가 발령됐습니다.<br><br> 발표 시각 : 2024. 7. 9. 19:40 <br> 발효 시각 : 2024. 7. 9. 20:00 <br><br> 안전운행 바라며,&nbsp;가급적 대중교통을 이용해 주시기 바랍니다.&nbsp;</strike>&nbsp;</p><p>&nbsp;</p><p>2024. 7. 10.(수) 02:00 기준 기상청에 따르면 금일 서울시에 호우주의보가 해제됐습니다.&nbsp;</p>',
    createDate: '2024-07-09 03:21:36',
    updateDate: '2024-07-10 02:06:30',
  },
  {
    bdwrSeq: '4230',
    bdwrTtlNm: '[안내] 7월9일(화) 호우주의보 안내',
    bdwrCts:
      '<p><strike>2024. 7. 9.(화) 20:00 기준 기상청에 따르면 금일 서울시에 호우주의보가 발령됐습니다.<br><br> 발표 시각 : 2024. 7. 9. 19:40 <br> 발효 시각 : 2024. 7. 9. 20:00 <br><br> 안전운행 바라며,&nbsp;가급적 대중교통을 이용해 주시기 바랍니다.&nbsp;</strike>&nbsp;</p><p>&nbsp;</p><p>2024. 7. 10.(수) 02:00 기준 기상청에 따르면 금일 서울시에 호우주의보가 해제됐습니다.&nbsp;</p>',
    createDate: '2024-07-10 03:21:36',
    updateDate: '2024-07-10 02:06:30',
  },
]).then((res) => console.log(res));
