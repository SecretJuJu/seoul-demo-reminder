import { dynamodb } from '../common/dynamodb';
import { getEnv } from '../common/utils';
import { ItemList } from 'aws-sdk/clients/dynamodb';
import { NoticeAttribute } from './type';

const getDynamoDBKeys = (notices: NoticeAttribute[]) => {
  return notices.map((notice) => ({
    bdwrSeq: { S: notice.bdwrSeq },
    createDate: { S: notice.createDate },
  }));
};

const fetchStoredNotices = async (
  keys: { [key: string]: { S: string } }[],
  tableName: string,
): Promise<string[]> => {
  let items: ItemList;
  try {
    const result = await dynamodb
      .batchGetItem({
        RequestItems: {
          [tableName]: {
            Keys: keys,
          },
        },
      })
      .promise();

    if (!result.Responses) {
      throw new Error('No response from DynamoDB');
    }

    items = result.Responses[tableName] || [];
  } catch (error) {
    console.error('Error fetching stored notices:', error.message);
    throw error;
  }

  return items.map((item) => item.bdwrSeq.S as string);
};

export const filterNewNotices = async (
  currentNotices: NoticeAttribute[],
): Promise<NoticeAttribute[]> => {
  const tableName = getEnv('DYNAMO_DB_NOTICE_TABLE');
  const keys = getDynamoDBKeys(currentNotices);
  // 이미 저장된 공지를 조회
  const storedNoticesIds = await fetchStoredNotices(keys, tableName);

  // 이미 저장된 공지를 제외한 신규 공지 필터링
  return currentNotices.filter((notice) => !storedNoticesIds.includes(notice.bdwrSeq));
};
