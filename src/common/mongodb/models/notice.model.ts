/**
 * {
 *             "bdwrSeq": "3605",
 *             "bdwrTtlNm": "[안내] 9/16(토)~9/17(일) 「2023 서리풀페스티벌」 개최에 따른 교통통제 및 버스 임시우회 안내",
 *             "bdwrCts": "<p>「2023 서리풀페스티벌」 개최에 따라 반포대로 일대 교통통제 및 버스 임시우회가 예정되어 있으니 아래 내용 참고하시기 바랍니다.</p><p>&nbsp;</p><p><b>가. 행사개요</b></p><p><b>- 행사명 :</b> 2023 서리풀페스티벌</p><p><b>- 행사일 :</b> 2023.09.16(토) ~ 09.17(일)</p><p><b>- 행사장소 :</b> 반포대로 일대(서초역~서초3동사거리, 약 900m)</p><p><img src=\"//crawler.seoul.go.kr/upload/smarteditor/91bb2710-4b81-11ee-aff5-005056a8bca9.png\" title=\"91bb2710-4b81-11ee-aff5-005056a8bca9.png\"><br style=\"clear:both;\">&nbsp;</p><p><b>나. 교통통제 개요</b></p><p><b>- 통제일시 : <span style=\"color: rgb(0, 117, 200);\">2023.09.16(토) 00시 ~ 09.18(월) 04시</span></b></p><p><b>- 통제구간 :</b> 반포대로(서초역사거리~서초3동사거리, 약 900m 전면통제)</p><p>&nbsp;</p><p><b>다. 임시 운행 노선버스</b></p><p><img src=\"//crawler.seoul.go.kr/upload/smarteditor/adaac0d0-4b80-11ee-aff5-005056a8bca9.jpg\" title=\"adaac0d0-4b80-11ee-aff5-005056a8bca9.jpg\"><br style=\"clear:both;\">&nbsp;</p><br>",
 *             "updateDate": "2023-09-11 10:51:48",
 *             "createDate": "2023-09-05 09:17:30",
 *         }
 */
import mongoose from 'mongoose';

export interface NoticeAttribute {
  bdwrSeq: string;
  bdwrTtlNm: string;
  bdwrCts: string;
  createDate: string;
  updateDate?: string;
}

// mongodb notice 스키마
export const noticeSchema = new mongoose.Schema({
  bdwrSeq: { type: String, required: true, unique: true },
  bdwrTtlNm: { type: String, required: true },
  bdwrCts: { type: String, required: true },
  createDate: { type: String, required: true },
  updateDate: { type: String, required: false },
});

export const noticeModel = mongoose.model('Notice', noticeSchema);
