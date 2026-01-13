/**
 * 日曆單日組件
 * 顯示單個日期的董公擇日資訊
 */
import React from 'react';
import { CalendarDayInfo, CalendarViewConfig, CalendarColorCode } from '../../types/calendar';
interface CalendarDayProps {
    date: Date;
    dayInfo: CalendarDayInfo | null;
    isCurrentMonth: boolean;
    isSelected: boolean;
    isHovered: boolean;
    config: CalendarViewConfig;
    colorTheme: Record<CalendarColorCode, string>;
    onClick?: () => void;
    onHover?: () => void;
    onHoverEnd?: () => void;
}
export declare const CalendarDay: React.FC<CalendarDayProps>;
export {};
//# sourceMappingURL=CalendarDay.d.ts.map