"use strict";
/**
 * 日曆標題組件
 * 顯示年月資訊和統計數據
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarHeader = void 0;
const react_1 = __importDefault(require("react"));
const CalendarHeader = ({ year, month, monthData, onMonthChange }) => {
    const monthNames = [
        '一月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'
    ];
    const handlePrevMonth = () => {
        if (month === 1) {
            onMonthChange(year - 1, 12);
        }
        else {
            onMonthChange(year, month - 1);
        }
    };
    const handleNextMonth = () => {
        if (month === 12) {
            onMonthChange(year + 1, 1);
        }
        else {
            onMonthChange(year, month + 1);
        }
    };
    const handleToday = () => {
        const today = new Date();
        onMonthChange(today.getFullYear(), today.getMonth() + 1);
    };
    return (<div className="calendar-header">
      {/* 月份導航 */}
      <div className="month-navigation">
        <button className="nav-button prev" onClick={handlePrevMonth} aria-label="上個月">
          ‹
        </button>
        
        <div className="month-year-display">
          <h2 className="month-year">
            {year}年 {monthNames[month - 1]}
          </h2>
        </div>
        
        <button className="nav-button next" onClick={handleNextMonth} aria-label="下個月">
          ›
        </button>
      </div>

      {/* 快速導航 */}
      <div className="quick-navigation">
        <button className="today-button" onClick={handleToday}>
          今日
        </button>
      </div>

      {/* 月份統計 */}
      <div className="month-statistics">
        <div className="stat-item huang-dao">
          <span className="stat-label">黃道吉日</span>
          <span className="stat-value">{monthData.huangDaoCount}</span>
        </div>
        
        <div className="stat-item hei-dao">
          <span className="stat-label">黑道凶日</span>
          <span className="stat-value">{monthData.heiDaoCount}</span>
        </div>
        
        <div className="stat-item special">
          <span className="stat-label">特殊日期</span>
          <span className="stat-value">{monthData.specialDayCount}</span>
        </div>
      </div>
    </div>);
};
exports.CalendarHeader = CalendarHeader;
//# sourceMappingURL=CalendarHeader.js.map