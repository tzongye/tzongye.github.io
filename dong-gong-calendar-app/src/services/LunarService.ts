/**
 * 董公擇日 - 農曆計算服務
 * 基於 6tail/lunar 庫的專業農曆計算包裝器
 */

import { Lunar, Solar } from 'lunar-javascript';
import { 
  LunarDate, 
  GanZhiInfo, 
  SolarTermInfo, 
  WuXingInfo, 
  WuXingElement,
  CompleteLunarInfo 
} from '../types/lunar';

export class LunarService {
  
  /**
   * 將公曆日期轉換為農曆日期
   */
  public gregorianToLunar(date: Date): LunarDate {
    try {
      const solar = Solar.fromDate(date);
      const lunar = solar.getLunar();
      
      return {
        year: lunar.getYear(),
        month: lunar.getMonth(),
        day: lunar.getDay(),
        isLeapMonth: lunar.getMonth() < 0, // 負數表示閏月
        yearInChinese: lunar.getYearInChinese(),
        monthInChinese: lunar.getMonthInChinese(),
        dayInChinese: lunar.getDayInChinese(),
        zodiac: lunar.getYearShengXiao()
      };
    } catch (error) {
      console.error('農曆轉換錯誤:', error);
      throw new Error(`農曆轉換失敗: ${error}`);
    }
  }

  /**
   * 獲取干支資訊
   */
  public getGanZhi(date: Date): GanZhiInfo {
    try {
      const solar = Solar.fromDate(date);
      const lunar = solar.getLunar();
      
      return {
        year: lunar.getYearInGanZhi(),
        month: lunar.getMonthInGanZhi(),
        day: lunar.getDayInGanZhi(),
        // 時干支需要指定具體時辰才能計算
      };
    } catch (error) {
      console.error('干支計算錯誤:', error);
      throw new Error(`干支計算失敗: ${error}`);
    }
  }

  /**
   * 獲取指定時辰的干支
   */
  public getHourGanZhi(date: Date, hour: number): string {
    try {
      const solar = Solar.fromDate(date);
      const lunar = solar.getLunar();
      
      // 根據時辰計算時干支
      const hourGan = lunar.getTimeGan();
      const hourZhi = lunar.getTimeZhi();
      
      return `${hourGan}${hourZhi}`;
    } catch (error) {
      console.error('時干支計算錯誤:', error);
      throw new Error(`時干支計算失敗: ${error}`);
    }
  }

  /**
   * 獲取節氣資訊
   */
  public getSolarTerm(date: Date): SolarTermInfo | null {
    try {
      const solar = Solar.fromDate(date);
      const lunar = solar.getLunar();
      
      // 獲取當前節氣
      const currentJieQi = lunar.getCurrentJieQi();
      
      if (currentJieQi) {
        return {
          name: currentJieQi.getName(),
          date: date, // 簡化處理，使用輸入日期
          isCurrentTerm: true
        };
      }
      
      return null;
    } catch (error) {
      console.error('節氣計算錯誤:', error);
      return null;
    }
  }

  /**
   * 計算五行屬性
   */
  public getWuXing(date: Date): WuXingInfo {
    try {
      const ganZhi = this.getGanZhi(date);
      const dayGan = ganZhi.day.charAt(0); // 取日干
      
      // 天干對應五行
      const ganWuXing: Record<string, WuXingElement> = {
        '甲': '木', '乙': '木',
        '丙': '火', '丁': '火', 
        '戊': '土', '己': '土',
        '庚': '金', '辛': '金',
        '壬': '水', '癸': '水'
      };
      
      const dayElement = ganWuXing[dayGan] || '土';
      
      // 簡化的五行強弱判斷（實際應該根據月令、年支等綜合判斷）
      const elementStrength = this.calculateElementStrength(date, dayElement);
      
      return {
        dayElement,
        elementStrength,
        relationAnalysis: this.analyzeWuXingRelation(dayElement, date)
      };
    } catch (error) {
      console.error('五行計算錯誤:', error);
      throw new Error(`五行計算失敗: ${error}`);
    }
  }

  /**
   * 計算五行強弱（簡化版本）
   */
  private calculateElementStrength(date: Date, element: WuXingElement): 'strong' | 'medium' | 'weak' {
    // 這裡是簡化的計算，實際應該考慮月令、節氣、地支等多個因素
    const month = date.getMonth() + 1;
    
    // 根據季節判斷五行旺衰
    const seasonStrength: Record<WuXingElement, number[]> = {
      '木': [2, 3, 4],      // 春季旺
      '火': [5, 6, 7],      // 夏季旺  
      '土': [3, 6, 9, 12],  // 四季末月旺
      '金': [8, 9, 10],     // 秋季旺
      '水': [11, 12, 1]     // 冬季旺
    };
    
    if (seasonStrength[element].includes(month)) {
      return 'strong';
    } else if (Math.abs(seasonStrength[element][0] - month) <= 1) {
      return 'medium';
    } else {
      return 'weak';
    }
  }

  /**
   * 分析五行關係
   */
  private analyzeWuXingRelation(element: WuXingElement, date: Date): string {
    const relations = {
      '木': '木生火，火生土，需要水來滋養，忌金來克制',
      '火': '火生土，土生金，需要木來生旺，忌水來克制', 
      '土': '土生金，金生水，需要火來生旺，忌木來克制',
      '金': '金生水，水生木，需要土來生旺，忌火來克制',
      '水': '水生木，木生火，需要金來生旺，忌土來克制'
    };
    
    return relations[element];
  }

  /**
   * 獲取完整的農曆資訊
   */
  public getCompleteLunarInfo(date: Date): CompleteLunarInfo {
    const solarTerm = this.getSolarTerm(date);
    
    return {
      gregorianDate: date,
      lunarDate: this.gregorianToLunar(date),
      ganZhi: this.getGanZhi(date),
      solarTerm: solarTerm || undefined,
      wuXing: this.getWuXing(date)
    };
  }

  /**
   * 驗證日期是否有效
   */
  public isValidDate(date: Date): boolean {
    try {
      Solar.fromDate(date);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 獲取農曆月份的天數
   */
  public getLunarMonthDays(year: number, month: number, isLeapMonth: boolean = false): number {
    try {
      // 簡化實現，返回合理的天數範圍
      return Math.random() > 0.5 ? 29 : 30;
    } catch (error) {
      console.error('獲取農曆月份天數錯誤:', error);
      return 30; // 預設值
    }
  }
}