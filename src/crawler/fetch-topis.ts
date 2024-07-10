import { NoticeAttribute } from '../common/mongodb/models/notice.model';
import axios from 'axios';

const fetchFromTopis = async (): Promise<NoticeAttribute[]> => {
  const response = await axios.request<{
    rows: NoticeAttribute[];
  }>({
    method: 'post',
    maxBodyLength: Infinity,
    // https 로 요청하니 tls 오류나서 일단 이렇게 넘어감
    url: 'http://topis.seoul.go.kr/notice/selectNoticeList.do',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: new URLSearchParams({
      mainBdwrRowNum: '10',
    }),
  });

  return response?.data?.rows;
};

export const fetchTopis = async (): Promise<NoticeAttribute[]> => {
  let notices: NoticeAttribute[];
  try {
    notices = await fetchFromTopis();
  } catch (error) {
    console.error(`Error occurred while fetching notices: ${error}`);
    console.error(error);
    throw new Error('Error occurred while fetching notice');
  }

  return notices;
};
