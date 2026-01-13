/**
 * 日曆圖例組件
 * 顯示色彩標示和符號說明
 */
import React from 'react';
import { CalendarViewConfig, CalendarColorCode } from '../../types/calendar';
interface CalendarLegendProps {
    config: CalendarViewConfig;
    colorTheme: Record<CalendarColorCode, string>;
}
export declare const CalendarLegend: React.FC<CalendarLegendProps>;
export {};
//# sourceMappingURL=CalendarLegend.d.ts.map