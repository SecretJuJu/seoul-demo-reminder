import { NoticeAttribute, noticeModel } from '../common/mongodb/models/notice.model';
import { groupBy } from 'lodash';

export const filterNewNotices = async (
  currentNotices: NoticeAttribute[],
): Promise<NoticeAttribute[]> => {
  const currentIds = currentNotices.map((notice) => {
    return notice.bdwrSeq;
  });

  // 새로운 데이터인지 구별하기 위해 이미 저장된 데이터가 있는지 조회
  const alreadyStoredNotices = await noticeModel.find({ bdwrSeq: { $in: currentIds } });

  // 이미 저장된 데이터를 bdwrSeq 로 그룹화 하여 새로운 데이터인지 확인
  const alreadyNoticesById = groupBy(alreadyStoredNotices, 'bdwrSeq');
  return currentNotices.filter((notice) => {
    return !alreadyNoticesById[notice.bdwrSeq];
  });
};
