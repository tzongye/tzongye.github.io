/**
 * lunar-javascript 庫的 TypeScript 聲明文件
 */

declare module 'lunar-javascript' {
  export class Solar {
    static fromDate(date: Date): Solar;
    getLunar(): Lunar;
    toDate(): Date;
  }

  export class Lunar {
    static fromYmd(year: number, month: number, day: number): Lunar;
    
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    
    getYearInChinese(): string;
    getMonthInChinese(): string;
    getDayInChinese(): string;
    getYearShengXiao(): string;
    
    getYearInGanZhi(): string;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
    
    getTimeZhi(): string;
    getTimeGan(): string;
    
    // 建星計算 (董公擇日核心)
    getZhiXing(): string;
    getDayZhi(): string;
    getZhi(): string;
    
    getCurrentJieQi(): JieQi | null;
    getJieQiTable(): any;
  }

  export class JieQi {
    getName(): string;
    getSolar(): Solar;
  }
}