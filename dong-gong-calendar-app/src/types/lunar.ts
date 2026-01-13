/**
 * 董公擇日 - 農曆相關類型定義
 * 基於 6tail/lunar 庫的 TypeScript 類型封裝
 */

// 基礎農曆日期資訊
export interface LunarDate {
  year: number;           // 農曆年份
  month: number;          // 農曆月份
  day: number;            // 農曆日期
  isLeapMonth: boolean;   // 是否閏月
  yearInChinese: string;  // 中文年份 (如: 甲辰年)
  monthInChinese: string; // 中文月份 (如: 正月)
  dayInChinese: string;   // 中文日期 (如: 初一)
  zodiac: string;         // 生肖
}

// 干支資訊
export interface GanZhiInfo {
  year: string;   // 年干支 (如: 甲辰)
  month: string;  // 月干支 (如: 丙寅)
  day: string;    // 日干支 (如: 戊申)
  hour?: string;  // 時干支 (如: 壬子)
}

// 節氣資訊
export interface SolarTermInfo {
  name: string;           // 節氣名稱
  date: Date;            // 節氣日期
  isCurrentTerm: boolean; // 是否為當前節氣
}

// 五行屬性
export type WuXingElement = '木' | '火' | '土' | '金' | '水';

// 五行資訊
export interface WuXingInfo {
  dayElement: WuXingElement;     // 日干五行
  elementStrength: 'strong' | 'medium' | 'weak'; // 五行強弱
  relationAnalysis: string;      // 五行關係分析
}

// 完整的農曆日期分析
export interface CompleteLunarInfo {
  gregorianDate: Date;
  lunarDate: LunarDate;
  ganZhi: GanZhiInfo;
  solarTerm?: SolarTermInfo;
  wuXing: WuXingInfo;
}