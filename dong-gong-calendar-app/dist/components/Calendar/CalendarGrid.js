"use strict";
/**
 * 日曆網格組件
 * 顯示月曆的主要網格結構
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarGrid = void 0;
const react_1 = __importDefault(require("react"));
const CalendarDay_1 = require("./CalendarDay");
const CalendarGrid = ({ days, config, selectedDate, hoveredDate, onDayClick, onDayHover, colorTheme }) => {
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    // 生成完整的日曆網格（包含前後月份的日期）
    const generateCalendarGrid = () => {
        if (days.length === 0)
            return [];
        const firstDay = days[0].gregorianDate;
        const lastDay = days[days.length - 1].gregorianDate;
        // 計算第一週需要補充的前月日期
        const firstDayOfWeek = firstDay.getDay();
        const prevMonthDays = [];
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const prevDate = new Date(firstDay);
            prevDate.setDate(firstDay.getDate() - (i + 1));
            prevMonthDays.push({
                date: prevDate,
                isCurrentMonth: false,
                dayInfo: null
            });
        }
        // 當月日期
        const currentMonthDays = days.map(dayInfo => ({
            date: dayInfo.gregorianDate,
            isCurrentMonth: true,
            dayInfo
        }));
        // 計算最後一週需要補充的後月日期
        const lastDayOfWeek = lastDay.getDay();
        const nextMonthDays = [];
        for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
            const nextDate = new Date(lastDay);
            nextDate.setDate(lastDay.getDate() + i);
            nextMonthDays.push({
                date: nextDate,
                isCurrentMonth: false,
                dayInfo: null
            });
        }
        return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
    };
    const calendarGrid = generateCalendarGrid();
    // 將日期分組為週
    const weeks = [];
    for (let i = 0; i < calendarGrid.length; i += 7) {
        weeks.push(calendarGrid.slice(i, i + 7));
    }
    const isDateSelected = (date) => {
        return selectedDate &&
            date.getFullYear() === selectedDate.getFullYear() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getDate() === selectedDate.getDate();
    };
    const isDateHovered = (date) => {
        return hoveredDate &&
            date.getFullYear() === hoveredDate.getFullYear() &&
            date.getMonth() === hoveredDate.getMonth() &&
            date.getDate() === hoveredDate.getDate();
    };
    return (<div className="calendar-grid">
      {/* 星期標題 */}
      <div className="week-header">
        {weekDays.map(day => (<div key={day} className="week-day-header">
            {day}
          </div>))}
      </div>

      {/* 日期網格 */}
      <div className="calendar-body">
        {weeks.map((week, weekIndex) => (<div key={weekIndex} className="calendar-week">
            {week.map((dayData, dayIndex) => (<CalendarDay_1.CalendarDay key={`${weekIndex}-${dayIndex}`} date={dayData.date} dayInfo={dayData.dayInfo} isCurrentMonth={dayData.isCurrentMonth} isSelected={isDateSelected(dayData.date)} isHovered={isDateHovered(dayData.date)} config={config} colorTheme={colorTheme} onClick={dayData.dayInfo ? () => onDayClick(dayData.dayInfo) : undefined} onHover={dayData.dayInfo ? () => onDayHover(dayData.dayInfo) : undefined} onHoverEnd={() => onDayHover(null)}/>))}
          </div>))}
      </div>
    </div>);
};
exports.CalendarGrid = CalendarGrid;
//# sourceMappingURL=CalendarGrid.js.map