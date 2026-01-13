/**
 * 日曆標題組件
 * 顯示年月資訊和統計數據
 */
import React from 'react';
import { CalendarMonthData } from '../../types/calendar';
interface CalendarHeaderProps {
    year: number;
    month: number;
    monthData: CalendarMonthData;
    onMonthChange: (year: number, month: number) => void;
}
export declare const CalendarHeader: React.FC<CalendarHeaderProps>;
export {};
//# sourceMappingURL=CalendarHeader.d.ts.map