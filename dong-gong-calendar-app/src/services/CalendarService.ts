/**
 * 董公日曆服務
 * 負責生成月曆數據和處理日曆相關邏輯
 */

import { DongGongCalculator } from './DongGongCalculator';
import { LunarService } from './LunarService';
import {
  CalendarDayInfo,
  CalendarMonthData,
  CalendarColorCode,
  CalendarViewConfig
} from '../types/calendar';
import { TwelveBuild } from '../types/dong-gong';

export class CalendarService {
  private dongGongCalculator: DongGongCalculator;
  private lunarService: LunarService;

  constructor() {
    this.dongGongCalculator = new DongGongCalculator();
    this.lunarService = new LunarService();
  }

  /**
   * 生成指定月份的日曆數據
   */
  public generateMonthData(year: number, month: number): CalendarMonthData {
    const days: CalendarDayInfo[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    
    let huangDaoCount = 0;
    let heiDaoCount = 0;
    let specialDayCount = 0;

    // 生成該月每一天的數據
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayInfo = this.generateDayInfo(date);
      
      days.push(dayInfo);
      
      // 統計計數
      if (dayInfo.isHuangDao) huangDaoCount++;
      if (dayInfo.isHeiDao) heiDaoCount++;
      if (dayInfo.specialDay.isSpecialAuspicious || dayInfo.specialDay.isSpecialInauspicious) {
        specialDayCount++;
      }
    }

    return {
      year,
      month,
      days,
      huangDaoCount,
      heiDaoCount,
      specialDayCount
    };
  }

  /**
   * 生成單日的日曆資訊
   */
  public generateDayInfo(date: Date): CalendarDayInfo {
    // 獲取農曆資訊
    const lunarInfo = this.lunarService.getCompleteLunarInfo(date);
    
    // 獲取嫁娶活動定義
    const marriageActivity = { id: 'marry', name: '嫁娶', category: '人事' } as any;
    
    // 執行董公擇日分析
    const analysis = this.dongGongCalculator.calculateSevenStepProcess(date, marriageActivity);
    
    // 單獨計算特殊日期
    const specialDays = this.dongGongCalculator.calculateSpecialDays(date);
    
    // 判斷黃道/黑道
    const isHuangDao = this.isHuangDaoDay(analysis.step3_buildAnalysis.name);
    const isHeiDao = !isHuangDao && this.isHeiDaoDay(analysis.step3_buildAnalysis.name);
    
    // 生成快速摘要
    const quickSummary = this.generateQuickSummary(
      analysis.step3_buildAnalysis.name,
      analysis.step7_comprehensiveJudgment.summary
    );
    
    // 確定色彩代碼
    const colorCode = this.determineColorCode(
      analysis.step7_comprehensiveJudgment.level,
      isHuangDao,
      isHeiDao,
      specialDays
    );

    return {
      gregorianDate: date,
      lunarDate: lunarInfo.lunarDate,
      twelveBuild: analysis.step3_buildAnalysis,
      godsEvils: analysis.step4_godsEvilsCheck,
      specialDay: specialDays,
      isHuangDao,
      isHeiDao,
      overallLevel: analysis.step7_comprehensiveJudgment.level,
      quickSummary,
      colorCode
    };
  }

  /**
   * 判斷是否為黃道吉日
   */
  private isHuangDaoDay(build: TwelveBuild): boolean {
    const huangDaoBuilds: TwelveBuild[] = ['建', '除', '定', '執', '危', '成', '開', '閉'];
    return huangDaoBuilds.includes(build);
  }

  /**
   * 判斷是否為黑道凶日
   */
  private isHeiDaoDay(build: TwelveBuild): boolean {
    const heiDaoBuilds: TwelveBuild[] = ['滿', '平', '破', '收'];
    return heiDaoBuilds.includes(build);
  }

  /**
   * 生成快速摘要
   */
  private generateQuickSummary(build: TwelveBuild, summary: string): string {
    return `${build}日 ${summary}`;
  }

  /**
   * 確定色彩代碼
   */
  private determineColorCode(
    level: 'excellent' | 'good' | 'fair' | 'poor' | 'terrible',
    isHuangDao: boolean,
    isHeiDao: boolean,
    specialDay: any
  ): CalendarColorCode {
    // 特殊日期優先
    if (specialDay.isSpecialAuspicious) {
      return 'special-auspicious';
    }
    if (specialDay.isSpecialInauspicious) {
      return 'special-inauspicious';
    }

    // 根據等級和黃道/黑道判斷
    if (isHuangDao) {
      return level === 'excellent' ? 'huang-dao-excellent' : 'huang-dao-good';
    }
    
    if (isHeiDao) {
      return level === 'terrible' ? 'hei-dao-terrible' : 'hei-dao-poor';
    }

    return 'neutral';
  }

  /**
   * 根據配置篩選日期
   */
  public filterDays(days: CalendarDayInfo[], config: CalendarViewConfig): CalendarDayInfo[] {
    return days.filter(day => {
      // 按等級篩選
      if (config.filterByLevel && day.overallLevel !== config.filterByLevel) {
        return false;
      }

      // 按建星篩選
      if (config.filterByBuild && day.twelveBuild.name !== config.filterByBuild) {
        return false;
      }

      // 只顯示特殊日期
      if (config.filterSpecialOnly) {
        return day.specialDay.isSpecialAuspicious || day.specialDay.isSpecialInauspicious;
      }

      return true;
    });
  }

  /**
   * 獲取色彩主題樣式
   */
  public getColorThemeStyles(theme: 'traditional' | 'modern' | 'accessible') {
    const themes = {
      traditional: {
        'huang-dao-excellent': '#FFD700', // 金色
        'huang-dao-good': '#32CD32',      // 綠色
        'neutral': '#808080',             // 灰色
        'hei-dao-poor': '#FF8C00',        // 橙色
        'hei-dao-terrible': '#DC143C',    // 紅色
        'special-auspicious': '#9370DB',  // 紫色
        'special-inauspicious': '#8B0000' // 深紅色
      },
      modern: {
        'huang-dao-excellent': '#4CAF50',
        'huang-dao-good': '#8BC34A',
        'neutral': '#9E9E9E',
        'hei-dao-poor': '#FF9800',
        'hei-dao-terrible': '#F44336',
        'special-auspicious': '#673AB7',
        'special-inauspicious': '#D32F2F'
      },
      accessible: {
        'huang-dao-excellent': '#2E7D32',
        'huang-dao-good': '#388E3C',
        'neutral': '#616161',
        'hei-dao-poor': '#F57C00',
        'hei-dao-terrible': '#C62828',
        'special-auspicious': '#512DA8',
        'special-inauspicious': '#B71C1C'
      }
    };

    return themes[theme];
  }
}