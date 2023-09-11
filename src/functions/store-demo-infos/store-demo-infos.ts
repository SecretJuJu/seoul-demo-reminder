import axios from 'axios';
import { JSDOM } from 'jsdom';

async function fetchLatestTdData(): Promise<object> {
  const url =
    'https://www.smpa.go.kr/user/nd54882.do?page=1&pageLS=&pageSC=SORT_ORDER&pageSO=DESC&pageST=SUBJECT&pageSV=&itemShCd1=&itemShCd2=&itemShCd3=';
  const response = await axios.get(url);
  const dom = new JSDOM(response.data);
  const document = dom.window.document;

  const table = document.querySelector('.data-list');
  if (!table) {
    throw new Error('Table with class .data-list not found.');
  }

  const latestTd = table.querySelector('tr:first-child td');
  if (!latestTd) {
    throw new Error('No TD elements found in the table.');
  }

  return {
    data: latestTd.textContent?.trim() || '',
  };
}

export const handler = async (): Promise<object> => {
  let latestData;

  try {
    latestData = await fetchLatestTdData();
  } catch (error) {
    console.error(error);
    return {
      error: error.message,
    };
  }

  return latestData;
};
