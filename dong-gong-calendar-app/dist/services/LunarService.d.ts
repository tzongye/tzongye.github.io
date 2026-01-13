/**
 * 董公擇日 - 農曆計算服務
 * 基於 6tail/lunar 庫的專業農曆計算包裝器
 */
import { LunarDate, GanZhiInfo, SolarTermInfo, WuXingInfo, CompleteLunarInfo } from '../types/lunar';
export declare class LunarService {
    /**
     * 將公曆日期轉換為農曆日期
     */
    gregorianToLunar(date: Date): LunarDate;
    /**
     * 獲取干支資訊
     */
    getGanZhi(date: Date): GanZhiInfo;
    /**
     * 獲取指定時辰的干支
     */
    getHourGanZhi(date: Date, hour: number): string;
    /**
     * 獲取節氣資訊
     */
    getSolarTerm(date: Date): SolarTermInfo | null;
    /**
     * 計算五行屬性
     */
    getWuXing(date: Date): WuXingInfo;
    /**
     * 計算五行強弱（簡化版本）
     */
    private calculateElementStrength;
    /**
     * 分析五行關係
     */
    private analyzeWuXingRelation;
    /**
     * 獲取完整的農曆資訊
     */
    getCompleteLunarInfo(date: Date): CompleteLunarInfo;
    /**
     * 驗證日期是否有效
     */
    isValidDate(date: Date): boolean;
    /**
     * 獲取農曆月份的天數
     */
    getLunarMonthDays(year: number, month: number, isLeapMonth?: boolean): number;
}
//# sourceMappingURL=LunarService.d.ts.map