/**
 * 董公日曆服務
 * 負責生成月曆數據和處理日曆相關邏輯
 */
import { CalendarDayInfo, CalendarMonthData, CalendarViewConfig } from '../types/calendar';
export declare class CalendarService {
    private dongGongCalculator;
    private lunarService;
    constructor();
    /**
     * 生成指定月份的日曆數據
     */
    generateMonthData(year: number, month: number): CalendarMonthData;
    /**
     * 生成單日的日曆資訊
     */
    generateDayInfo(date: Date): CalendarDayInfo;
    /**
     * 判斷是否為黃道吉日
     */
    private isHuangDaoDay;
    /**
     * 判斷是否為黑道凶日
     */
    private isHeiDaoDay;
    /**
     * 生成快速摘要
     */
    private generateQuickSummary;
    /**
     * 確定色彩代碼
     */
    private determineColorCode;
    /**
     * 根據配置篩選日期
     */
    filterDays(days: CalendarDayInfo[], config: CalendarViewConfig): CalendarDayInfo[];
    /**
     * 獲取色彩主題樣式
     */
    getColorThemeStyles(theme: 'traditional' | 'modern' | 'accessible'): {
        'huang-dao-excellent': string;
        'huang-dao-good': string;
        neutral: string;
        'hei-dao-poor': string;
        'hei-dao-terrible': string;
        'special-auspicious': string;
        'special-inauspicious': string;
    } | {
        'huang-dao-excellent': string;
        'huang-dao-good': string;
        neutral: string;
        'hei-dao-poor': string;
        'hei-dao-terrible': string;
        'special-auspicious': string;
        'special-inauspicious': string;
    } | {
        'huang-dao-excellent': string;
        'huang-dao-good': string;
        neutral: string;
        'hei-dao-poor': string;
        'hei-dao-terrible': string;
        'special-auspicious': string;
        'special-inauspicious': string;
    };
}
//# sourceMappingURL=CalendarService.d.ts.map