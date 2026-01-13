/**
 * 董公日曆 - 日曆組件類型定義
 * 基於董公擇日的專業日曆數據結構
 */
import { TwelveBuild, TwelveBuildsInfo, GodsAndEvilsInfo, SpecialDayInfo } from './dong-gong';
import { LunarDate } from './lunar';
export interface CalendarDayInfo {
    gregorianDate: Date;
    lunarDate: LunarDate;
    twelveBuild: TwelveBuildsInfo;
    godsEvils: GodsAndEvilsInfo;
    specialDay: SpecialDayInfo;
    isHuangDao: boolean;
    isHeiDao: boolean;
    overallLevel: 'excellent' | 'good' | 'fair' | 'poor' | 'terrible';
    quickSummary: string;
    colorCode: CalendarColorCode;
}
export type CalendarColorCode = 'huang-dao-excellent' | 'huang-dao-good' | 'neutral' | 'hei-dao-poor' | 'hei-dao-terrible' | 'special-auspicious' | 'special-inauspicious';
export interface CalendarMonthData {
    year: number;
    month: number;
    days: CalendarDayInfo[];
    huangDaoCount: number;
    heiDaoCount: number;
    specialDayCount: number;
}
export interface CalendarViewConfig {
    showLunarDate: boolean;
    showTwelveBuild: boolean;
    showGodsEvils: boolean;
    showSpecialDays: boolean;
    filterByLevel?: 'excellent' | 'good' | 'fair' | 'poor' | 'terrible';
    filterByBuild?: TwelveBuild;
    filterSpecialOnly: boolean;
    colorTheme: 'traditional' | 'modern' | 'accessible';
}
export interface CalendarEvent {
    type: 'day-click' | 'day-hover' | 'month-change';
    date: Date;
    dayInfo?: CalendarDayInfo;
}
export interface CalendarProps {
    initialDate?: Date;
    config: CalendarViewConfig;
    onDayClick?: (event: CalendarEvent) => void;
    onDayHover?: (event: CalendarEvent) => void;
    onMonthChange?: (year: number, month: number) => void;
    className?: string;
    style?: React.CSSProperties;
}
export interface CalendarState {
    currentYear: number;
    currentMonth: number;
    selectedDate?: Date;
    hoveredDate?: Date;
    monthData: CalendarMonthData;
    loading: boolean;
    error?: string;
}
//# sourceMappingURL=calendar.d.ts.map