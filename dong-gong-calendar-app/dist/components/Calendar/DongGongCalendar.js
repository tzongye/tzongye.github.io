"use strict";
/**
 * 董公日曆主組件
 * 基於十二建星的專業擇日日曆
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DongGongCalendar = void 0;
const react_1 = __importStar(require("react"));
const CalendarService_1 = require("../../services/CalendarService");
const CalendarHeader_1 = require("./CalendarHeader");
const CalendarGrid_1 = require("./CalendarGrid");
const CalendarLegend_1 = require("./CalendarLegend");
const DongGongCalendar = ({ initialDate = new Date(), config, onDayClick, onDayHover, onMonthChange, className = '', style = {} }) => {
    const [calendarService] = (0, react_1.useState)(() => new CalendarService_1.CalendarService());
    const [state, setState] = (0, react_1.useState)({
        currentYear: initialDate.getFullYear(),
        currentMonth: initialDate.getMonth() + 1,
        selectedDate: undefined,
        hoveredDate: undefined,
        monthData: { year: 0, month: 0, days: [], huangDaoCount: 0, heiDaoCount: 0, specialDayCount: 0 },
        loading: true,
        error: undefined
    });
    // 載入月份數據
    const loadMonthData = (0, react_1.useCallback)(async (year, month) => {
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
        }
        catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : '載入日曆數據失敗'
            }));
        }
    }, [calendarService, onMonthChange]);
    // 初始載入
    (0, react_1.useEffect)(() => {
        loadMonthData(state.currentYear, state.currentMonth);
    }, [loadMonthData, state.currentYear, state.currentMonth]);
    // 處理日期點擊
    const handleDayClick = (0, react_1.useCallback)((dayInfo) => {
        setState(prev => ({ ...prev, selectedDate: dayInfo.gregorianDate }));
        const event = {
            type: 'day-click',
            date: dayInfo.gregorianDate,
            dayInfo
        };
        onDayClick?.(event);
    }, [onDayClick]);
    // 處理日期懸停
    const handleDayHover = (0, react_1.useCallback)((dayInfo) => {
        const hoveredDate = dayInfo?.gregorianDate;
        setState(prev => ({ ...prev, hoveredDate }));
        if (dayInfo) {
            const event = {
                type: 'day-hover',
                date: dayInfo.gregorianDate,
                dayInfo
            };
            onDayHover?.(event);
        }
    }, [onDayHover]);
    // 處理月份切換
    const handleMonthChange = (0, react_1.useCallback)((year, month) => {
        loadMonthData(year, month);
    }, [loadMonthData]);
    // 篩選顯示的日期
    const filteredDays = calendarService.filterDays(state.monthData.days, config);
    if (state.loading) {
        return (<div className={`dong-gong-calendar loading ${className}`} style={style}>
        <div className="loading-spinner">載入中...</div>
      </div>);
    }
    if (state.error) {
        return (<div className={`dong-gong-calendar error ${className}`} style={style}>
        <div className="error-message">錯誤: {state.error}</div>
      </div>);
    }
    return (<div className={`dong-gong-calendar ${className}`} style={style}>
      {/* 日曆標題 */}
      <CalendarHeader_1.CalendarHeader year={state.currentYear} month={state.currentMonth} monthData={state.monthData} onMonthChange={handleMonthChange}/>

      {/* 日曆網格 */}
      <CalendarGrid_1.CalendarGrid days={filteredDays} config={config} selectedDate={state.selectedDate} hoveredDate={state.hoveredDate} onDayClick={handleDayClick} onDayHover={handleDayHover} colorTheme={calendarService.getColorThemeStyles(config.colorTheme)}/>

      {/* 圖例說明 */}
      <CalendarLegend_1.CalendarLegend config={config} colorTheme={calendarService.getColorThemeStyles(config.colorTheme)}/>
    </div>);
};
exports.DongGongCalendar = DongGongCalendar;
//# sourceMappingURL=DongGongCalendar.js.map