/**
 * 董公擇日 - 農曆相關類型定義
 * 基於 6tail/lunar 庫的 TypeScript 類型封裝
 */
export interface LunarDate {
    year: number;
    month: number;
    day: number;
    isLeapMonth: boolean;
    yearInChinese: string;
    monthInChinese: string;
    dayInChinese: string;
    zodiac: string;
}
export interface GanZhiInfo {
    year: string;
    month: string;
    day: string;
    hour?: string;
}
export interface SolarTermInfo {
    name: string;
    date: Date;
    isCurrentTerm: boolean;
}
export type WuXingElement = '木' | '火' | '土' | '金' | '水';
export interface WuXingInfo {
    dayElement: WuXingElement;
    elementStrength: 'strong' | 'medium' | 'weak';
    relationAnalysis: string;
}
export interface CompleteLunarInfo {
    gregorianDate: Date;
    lunarDate: LunarDate;
    ganZhi: GanZhiInfo;
    solarTerm?: SolarTermInfo;
    wuXing: WuXingInfo;
}
//# sourceMappingURL=lunar.d.ts.map