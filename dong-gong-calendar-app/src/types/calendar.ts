/**
 * 董公日曆 - 日曆組件類型定義
 * 基於董公擇日的專業日曆數據結構
 */

import { TwelveBuild, TwelveBuildsInfo, GodsAndEvilsInfo, SpecialDayInfo } from './dong-gong';
import { LunarDate } from './lunar';

// 日曆日期資訊
export interface CalendarDayInfo {
  // 基本日期資訊
  gregorianDate: Date;           // 公曆日期
  lunarDate: LunarDate;         // 農曆日期
  
  // 董公擇日核心資訊
  twelveBuild: TwelveBuildsInfo; // 十二建星
  godsEvils: GodsAndEvilsInfo;   // 神煞配置
  specialDay: SpecialDayInfo;    // 特殊日期
  
  // 視覺化標示
  isHuangDao: boolean;           // 是否黃道吉日
  isHeiDao: boolean;             // 是否黑道凶日
  overallLevel: 'excellent' | 'good' | 'fair' | 'poor' | 'terrible';
  
  // 快速預覽
  quickSummary: string;          // 快速摘要 (如: "危日 吉")
  colorCode: CalendarColorCode;  // 色彩標示代碼
}

// 色彩標示系統
export type CalendarColorCode = 
  | 'huang-dao-excellent'    // 黃道大吉 (金色)
  | 'huang-dao-good'         // 黃道吉 (綠色)
  | 'neutral'                // 平 (灰色)
  | 'hei-dao-poor'          // 黑道凶 (橙色)
  | 'hei-dao-terrible'      // 黑道大凶 (紅色)
  | 'special-auspicious'    // 特殊吉日 (紫色)
  | 'special-inauspicious'; // 特殊凶日 (深紅色)

// 月曆數據結構
export interface CalendarMonthData {
  year: number;              // 年份
  month: number;             // 月份 (1-12)
  days: CalendarDayInfo[];   // 該月所有日期資訊
  
  // 月份統計
  huangDaoCount: number;     // 黃道吉日數量
  heiDaoCount: number;       // 黑道凶日數量
  specialDayCount: number;   // 特殊日期數量
}

// 日曆檢視配置
export interface CalendarViewConfig {
  // 顯示選項
  showLunarDate: boolean;        // 顯示農曆日期
  showTwelveBuild: boolean;      // 顯示十二建星
  showGodsEvils: boolean;        // 顯示神煞
  showSpecialDays: boolean;      // 顯示特殊日期
  
  // 篩選選項
  filterByLevel?: 'excellent' | 'good' | 'fair' | 'poor' | 'terrible';
  filterByBuild?: TwelveBuild;
  filterSpecialOnly: boolean;    // 只顯示特殊日期
  
  // 色彩主題
  colorTheme: 'traditional' | 'modern' | 'accessible';
}

// 日曆事件
export interface CalendarEvent {
  type: 'day-click' | 'day-hover' | 'month-change';
  date: Date;
  dayInfo?: CalendarDayInfo;
}

// 日曆組件 Props
export interface CalendarProps {
  // 基本配置
  initialDate?: Date;            // 初始顯示日期
  config: CalendarViewConfig;    // 檢視配置
  
  // 事件處理
  onDayClick?: (event: CalendarEvent) => void;
  onDayHover?: (event: CalendarEvent) => void;
  onMonthChange?: (year: number, month: number) => void;
  
  // 樣式
  className?: string;
  style?: { [key: string]: any };
}

// 日曆狀態
export interface CalendarState {
  currentYear: number;
  currentMonth: number;
  selectedDate?: Date;
  hoveredDate?: Date;
  monthData: CalendarMonthData;
  loading: boolean;
  error?: string;
}