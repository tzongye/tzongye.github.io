/**
 * 董公日曆主組件
 * 基於十二建星的專業擇日日曆
 */

import React, { useState, useEffect, useCallback } from 'react';
import { CalendarService } from '../../services/CalendarService';
import {
  CalendarProps,
  CalendarState,
  CalendarDayInfo,
  CalendarEvent
} from '../../types/calendar';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { CalendarLegend } from './CalendarLegend';

export const DongGongCalendar: React.FC<CalendarProps> = ({
  initialDate = new Date(),
  config,
  onDayClick,
  onDayHover,
  onMonthChange,
  className = '',
  style = {}
}) => {
  const [calendarService] = useState(() => new CalendarService());
  const [state, setState] = useState<CalendarState>({
    currentYear: initialDate.getFullYear(),
    currentMonth: initialDate.getMonth() + 1,
    selectedDate: undefined,
    hoveredDate: undefined,
    monthData: { year: 0, month: 0, days: [], huangDaoCount: 0, heiDaoCount: 0, specialDayCount: 0 },
    loading: true,
    error: undefined
  });

  // 載入月份數據
  const loadMonthData = useCallback(async (year: number, month: number) => {
    setState(prev => ({ ...prev, loading: true, error: undefined }));
    
    try {
      const monthData = calendarService.generateMonthData(year, month);
      setState(prev => ({
        ...prev,
        currentYear: year,
        currentMonth: month,
        monthData,
        loading: false
      }));
      
      onMonthChange?.(year, month);
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '載入日曆數據失敗'
      }));
    }
  }, [calendarService, onMonthChange]);

  // 初始載入
  useEffect(() => {
    loadMonthData(state.currentYear, state.currentMonth);
  }, [loadMonthData, state.currentYear, state.currentMonth]);

  // 處理日期點擊
  const handleDayClick = useCallback((dayInfo: CalendarDayInfo) => {
    setState(prev => ({ ...prev, selectedDate: dayInfo.gregorianDate }));
    
    const event: CalendarEvent = {
      type: 'day-click',
      date: dayInfo.gregorianDate,
      dayInfo
    };
    
    onDayClick?.(event);
  }, [onDayClick]);

  // 處理日期懸停
  const handleDayHover = useCallback((dayInfo: CalendarDayInfo | null) => {
    const hoveredDate = dayInfo?.gregorianDate;
    setState(prev => ({ ...prev, hoveredDate }));
    
    if (dayInfo) {
      const event: CalendarEvent = {
        type: 'day-hover',
        date: dayInfo.gregorianDate,
        dayInfo
      };
      
      onDayHover?.(event);
    }
  }, [onDayHover]);

  // 處理月份切換
  const handleMonthChange = useCallback((year: number, month: number) => {
    loadMonthData(year, month);
  }, [loadMonthData]);

  // 篩選顯示的日期
  const filteredDays = calendarService.filterDays(state.monthData.days, config);

  if (state.loading) {
    return (
      <div className={`dong-gong-calendar loading ${className}`} style={style}>
        <div className="loading-spinner">載入中...</div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className={`dong-gong-calendar error ${className}`} style={style}>
        <div className="error-message">錯誤: {state.error}</div>
      </div>
    );
  }

  return (
    <div className={`dong-gong-calendar ${className}`} style={style}>
      {/* 日曆標題 */}
      <CalendarHeader
        year={state.currentYear}
        month={state.currentMonth}
        monthData={state.monthData}
        onMonthChange={handleMonthChange}
      />

      {/* 日曆網格 */}
      <CalendarGrid
        days={filteredDays}
        config={config}
        selectedDate={state.selectedDate}
        hoveredDate={state.hoveredDate}
        onDayClick={handleDayClick}
        onDayHover={handleDayHover}
        colorTheme={calendarService.getColorThemeStyles(config.colorTheme)}
      />

      {/* 圖例說明 */}
      <CalendarLegend
        config={config}
        colorTheme={calendarService.getColorThemeStyles(config.colorTheme)}
      />
    </div>
  );
};