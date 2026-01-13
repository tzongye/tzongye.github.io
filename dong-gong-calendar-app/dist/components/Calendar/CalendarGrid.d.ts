/**
 * 日曆網格組件
 * 顯示月曆的主要網格結構
 */
import React from 'react';
import { CalendarDayInfo, CalendarViewConfig, CalendarColorCode } from '../../types/calendar';
interface CalendarGridProps {
    days: CalendarDayInfo[];
    config: CalendarViewConfig;
    selectedDate?: Date;
    hoveredDate?: Date;
    onDayClick: (dayInfo: CalendarDayInfo) => void;
    onDayHover: (dayInfo: CalendarDayInfo | null) => void;
    colorTheme: Record<CalendarColorCode, string>;
}
export declare const CalendarGrid: React.FC<CalendarGridProps>;
export {};
//# sourceMappingURL=CalendarGrid.d.ts.map