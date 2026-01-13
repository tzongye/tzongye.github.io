/**
 * 董公日曆服務單元測試
 * 測試月曆基礎組件架構
 */

import { CalendarService } from '../src/services/CalendarService';
import { CalendarViewConfig } from '../src/types/calendar';

describe('CalendarService', () => {
  let calendarService: CalendarService;

  beforeEach(() => {
    calendarService = new CalendarService();
  });

  describe('generateMonthData', () => {
    test('應該生成正確的月份數據', () => {
      const year = 2025;
      const month = 8;
      
      const monthData = calendarService.generateMonthData(year, month);
      
      expect(monthData.year).toBe(year);
      expect(monthData.month).toBe(month);
      expect(monthData.days).toHaveLength(31); // 8月有31天
      expect(monthData.huangDaoCount).toBeGreaterThan(0);
      expect(monthData.heiDaoCount).toBeGreaterThan(0);
    });

    test('應該正確統計黃道和黑道日期', () => {
      const monthData = calendarService.generateMonthData(2025, 8);
      
      const huangDaoCount = monthData.days.filter(day => day.isHuangDao).length;
      const heiDaoCount = monthData.days.filter(day => day.isHeiDao).length;
      
      expect(monthData.huangDaoCount).toBe(huangDaoCount);
      expect(monthData.heiDaoCount).toBe(heiDaoCount);
      expect(huangDaoCount + heiDaoCount).toBe(31); // 所有日期都應該是黃道或黑道
    });
  });

  describe('generateDayInfo', () => {
    test('應該生成完整的日期資訊', () => {
      const date = new Date(2025, 7, 1); // 2025年8月1日
      
      const dayInfo = calendarService.generateDayInfo(date);
      
      expect(dayInfo.gregorianDate).toEqual(date);
      expect(dayInfo.lunarDate).toBeDefined();
      expect(dayInfo.twelveBuild).toBeDefined();
      expect(dayInfo.godsEvils).toBeDefined();
      expect(dayInfo.specialDay).toBeDefined();
      expect(dayInfo.quickSummary).toBeDefined();
      expect(dayInfo.colorCode).toBeDefined();
      expect(typeof dayInfo.isHuangDao).toBe('boolean');
      expect(typeof dayInfo.isHeiDao).toBe('boolean');
    });

    test('黃道和黑道應該互斥', () => {
      const date = new Date(2025, 7, 1);
      
      const dayInfo = calendarService.generateDayInfo(date);
      
      // 黃道和黑道不能同時為true
      expect(dayInfo.isHuangDao && dayInfo.isHeiDao).toBe(false);
    });
  });

  describe('filterDays', () => {
    let monthData: any;
    
    beforeEach(() => {
      monthData = calendarService.generateMonthData(2025, 8);
    });

    test('應該根據等級篩選日期', () => {
      const config: CalendarViewConfig = {
        showLunarDate: true,
        showTwelveBuild: true,
        showGodsEvils: true,
        showSpecialDays: true,
        filterByLevel: 'excellent',
        filterSpecialOnly: false,
        colorTheme: 'traditional'
      };
      
      const filteredDays = calendarService.filterDays(monthData.days, config);
      
      filteredDays.forEach(day => {
        expect(day.overallLevel).toBe('excellent');
      });
    });

    test('應該篩選特殊日期', () => {
      const config: CalendarViewConfig = {
        showLunarDate: true,
        showTwelveBuild: true,
        showGodsEvils: true,
        showSpecialDays: true,
        filterSpecialOnly: true,
        colorTheme: 'traditional'
      };
      
      const filteredDays = calendarService.filterDays(monthData.days, config);
      
      filteredDays.forEach(day => {
        expect(
          day.specialDay.isSpecialAuspicious || day.specialDay.isSpecialInauspicious
        ).toBe(true);
      });
    });
  });

  describe('getColorThemeStyles', () => {
    test('應該返回正確的色彩主題', () => {
      const traditionalTheme = calendarService.getColorThemeStyles('traditional');
      const modernTheme = calendarService.getColorThemeStyles('modern');
      const accessibleTheme = calendarService.getColorThemeStyles('accessible');
      
      expect(traditionalTheme['huang-dao-excellent']).toBe('#FFD700');
      expect(modernTheme['huang-dao-excellent']).toBe('#4CAF50');
      expect(accessibleTheme['huang-dao-excellent']).toBe('#2E7D32');
    });

    test('所有主題應該包含所有必要的色彩代碼', () => {
      const requiredColors = [
        'huang-dao-excellent',
        'huang-dao-good',
        'neutral',
        'hei-dao-poor',
        'hei-dao-terrible',
        'special-auspicious',
        'special-inauspicious'
      ];
      
      const themes = ['traditional', 'modern', 'accessible'] as const;
      
      themes.forEach(theme => {
        const colors = calendarService.getColorThemeStyles(theme);
        requiredColors.forEach(colorCode => {
          expect(colors[colorCode]).toBeDefined();
          expect(typeof colors[colorCode]).toBe('string');
        });
      });
    });
  });
});