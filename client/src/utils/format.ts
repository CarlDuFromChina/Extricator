import dayjs from "dayjs"
import assert from "./assert";

export default {
  dayjs(input: any, fmtString?: string): string {
    if (assert.isEmpty(fmtString)) {
      fmtString = 'YYYY-MM-DD HH:mm:ss';
    }
    return dayjs(input).format(fmtString);
  }
}

export interface FormatApi {
  dayjs(input: any, fmtString?: string): string
}