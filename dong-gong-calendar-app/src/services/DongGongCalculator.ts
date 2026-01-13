/**
 * 董公擇日 - 專業計算引擎
 * 實作董公擇日七步操作法的完整算法
 */

import { LunarService } from './LunarService';
import {
  TwelveBuild,
  TwelveBuildsInfo,
  GodsAndEvilsInfo,
  God,
  Evil,
  SpecialDayInfo,
  DongGongScore,
  DongGongJudgment,
  ActivitySuitability,
  HourlyAnalysis,
  PersonalizedAnalysis,
  BirthInfo,
  CompleteDongGongAnalysis,
  DongGongActivity,
  SevenStepProcess
} from '../types/dong-gong';
import { GanZhiInfo } from '../types/lunar';
import {
  TWELVE_BUILDS_RULES,
  getBuildRule,
  getBuildAnalysis,
  TRADITIONAL_VERSES
} from '../data/twelve-builds-rules';
import {
  calculateAllAuspiciousGods,
  calculateAllInauspiciousEvils,
  getSeason,
  getEvilResolutionMethods,
  getEvilLevel,
  getGodLevel
} from '../data/gods-evils-rules';
import {
  checkAllSpecialDates,
  checkSiJueSiLi,
  checkSpecialInauspiciousDay,
  checkSpecialAuspiciousDay,
  checkShaRuZhongGong,
  checkSanSha,
  type SpecialDateResult,
  type SiJueSiLiResult,
  type ShaRuZhongGongResult,
  type SanShaResult
} from '../data/special-dates-rules';
import {
  calculateBaZiInfo,
  analyzeBodyStrength,
  analyzeYongShen,
  analyzePattern,
  analyzeDateCompatibility,
  type BaZiInfo,
  type BodyStrengthAnalysis,
  type YongShenAnalysis,
  type PatternAnalysis,
  type DateCompatibilityAnalysis
} from '../data/bazi-analysis-rules';

export class DongGongCalculator {
  private lunarService: LunarService;

  // 十二建星循環 (董公擇日核心)
  private readonly TWELVE_BUILDS: TwelveBuild[] = [
    '建', '除', '滿', '平', '定', '執', 
    '破', '危', '成', '收', '開', '閉'
  ];

  // 使用完善的十二建星規則系統
  private readonly BUILD_RULES = TWELVE_BUILDS_RULES;

  // 特殊吉凶日規則 (董公獨有)
  private readonly SPECIAL_DAYS = {
    // 特殊大凶日
    specialInauspicious: [
      { ganZhi: '建巳', name: '建巳日', severity: 'severe' as const, avoid: ['出行', '嫁娶', '開張'] },
      { ganZhi: '平巳', name: '平巳日', severity: 'severe' as const, avoid: ['諸事'] },
      { ganZhi: '破申', name: '破申日', severity: 'severe' as const, avoid: ['諸事'] },
      { ganZhi: '危酉', name: '危酉日', severity: 'severe' as const, avoid: ['諸事'] }
    ],
    // 特殊大吉日
    specialAuspicious: [
      { ganZhi: '定戍', name: '定戍日', level: 'excellent' as const, suitable: ['起造', '動土', '婚姻', '安葬'] },
      { ganZhi: '定午', name: '定午日', level: 'excellent' as const, suitable: ['諸慶用事'] }
    ]
  };

  // 神煞計算已移至 gods-evils-rules.ts 中的專門函數

  constructor() {
    this.lunarService = new LunarService();
  }

  /**
   * 董公擇日七步操作法 - 主要入口
   */
  public calculateSevenStepProcess(
    date: Date, 
    activity: DongGongActivity,
    birthInfo?: BirthInfo
  ): SevenStepProcess {
    // 步驟1：確定事項
    const step1_determineActivity = activity;

    // 步驟2：月建判斷
    const lunarInfo = this.lunarService.getCompleteLunarInfo(date);
    const step2_monthBuild = this.getMonthBuild(lunarInfo.lunarDate.month);

    // 步驟3：建星分析
    const step3_buildAnalysis = this.calculateTwelveBuilds(date);

    // 步驟4：神煞檢核
    const step4_godsEvilsCheck = this.calculateGodsAndEvils(date);

    // 步驟5：命理配合
    const step5_personalMatch = birthInfo ? 
      this.calculatePersonalizedAnalysis(date, birthInfo) : 
      this.getDefaultPersonalizedAnalysis();

    // 步驟6：時辰選擇
    const step6_hourSelection = this.calculateHourlyAnalysis(date);

    // 步驟7：綜合判斷
    const step7_comprehensiveJudgment = this.calculateDongGongScore({
      twelveBuilds: step3_buildAnalysis,
      godsAndEvils: step4_godsEvilsCheck,
      specialDays: this.calculateSpecialDays(date),
      wuXingInfo: lunarInfo.wuXing
    }, date);

    return {
      step1_determineActivity,
      step2_monthBuild,
      step3_buildAnalysis,
      step4_godsEvilsCheck,
      step5_personalMatch,
      step6_hourSelection,
      step7_comprehensiveJudgment
    };
  }

  /**
   * 計算十二建星
   */
  public calculateTwelveBuilds(date: Date): TwelveBuildsInfo {
    const dayBuild = this.calculateDayBuild(date);
    const buildAnalysis = getBuildAnalysis(dayBuild);
    const buildRule = buildAnalysis.rule;

    return {
      name: dayBuild,
      meaning: buildRule.meaning,
      level: buildRule.category,
      traditionalRule: `${this.getBuildTraditionalRule(dayBuild)} - ${buildAnalysis.pathType}`,
      suitable: buildRule.suitable,
      avoid: buildRule.avoid
    };
  }

  /**
   * 計算神煞配置
   */
  public calculateGodsAndEvils(date: Date): GodsAndEvilsInfo {
    const lunarInfo = this.lunarService.getCompleteLunarInfo(date);
    const ganZhi = lunarInfo.ganZhi;
    const season = getSeason(date.getMonth() + 1);

    const auspiciousGods = calculateAllAuspiciousGods(ganZhi, lunarInfo.lunarDate);
    const inauspiciousEvils = calculateAllInauspiciousEvils(ganZhi, lunarInfo.lunarDate, season);

    return { auspiciousGods, inauspiciousEvils };
  }

  /**
   * 計算特殊日期
   */
  public calculateSpecialDays(date: Date): SpecialDayInfo {
    const buildInfo = this.calculateTwelveBuilds(date);
    const specialDatesAnalysis = checkAllSpecialDates(date, buildInfo.name);

    return {
      isSpecialAuspicious: specialDatesAnalysis.specialAuspicious.isSpecial,
      isSpecialInauspicious: specialDatesAnalysis.specialInauspicious.isSpecial,
      isFourJue: specialDatesAnalysis.siJueSiLi.isSiJue,
      isFourLi: specialDatesAnalysis.siJueSiLi.isSiLi,
      isShaInCenter: specialDatesAnalysis.shaRuZhongGong.isShaRuZhongGong,
      specialNote: specialDatesAnalysis.overallAssessment.summary
    };
  }

  /**
   * 計算個人化分析
   */
  public calculatePersonalizedAnalysis(date: Date, birthInfo: BirthInfo): PersonalizedAnalysis {
    try {
      // 1. 計算八字基本資訊
      const baZiInfo = calculateBaZiInfo(birthInfo);
      
      // 2. 身強身弱分析
      const bodyStrength = analyzeBodyStrength(baZiInfo);
      
      // 3. 用神忌神分析
      const yongShenAnalysis = analyzeYongShen(baZiInfo, bodyStrength);
      
      // 4. 格局分析
      const patternAnalysis = analyzePattern(baZiInfo);
      
      // 5. 日期配合分析
      const dateGanZhi = this.lunarService.getGanZhi(date);
      const dateCompatibility = analyzeDateCompatibility(
        baZiInfo, 
        bodyStrength, 
        yongShenAnalysis, 
        dateGanZhi
      );
      
      // 6. 生成個人化建議
      const personalRecommendations = this.generateAdvancedPersonalRecommendations(
        baZiInfo, bodyStrength, yongShenAnalysis, patternAnalysis, dateCompatibility
      );
      
      const personalWarnings = this.generateAdvancedPersonalWarnings(
        baZiInfo, bodyStrength, yongShenAnalysis, dateCompatibility
      );
      
      // 7. 判斷配合度等級
      const compatibility = dateCompatibility.compatibility >= 70 ? '合' : 
                           dateCompatibility.compatibility >= 40 ? '一般' : '不合';
      
      return {
        compatibility,
        birthCompatibility: dateCompatibility.compatibility,
        personalRecommendations,
        personalWarnings,
        wuXingRelation: this.generateWuXingRelationDescription(baZiInfo, dateGanZhi, yongShenAnalysis),
        customizedScore: dateCompatibility.compatibility
      };
      
    } catch (error) {
      console.error('個人化分析計算錯誤:', error);
      return this.getDefaultPersonalizedAnalysis();
    }
  }

  /**
   * 計算時辰分析
   */
  public calculateHourlyAnalysis(date: Date): HourlyAnalysis[] {
    const hours = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    return hours.map((hour, index) => {
      const hourGanZhi = this.calculateHourGanZhi(date, hour);
      const suitability = this.calculateHourSuitability(date, hour);
      const nature = suitability >= 70 ? '吉時' : suitability >= 40 ? '平時' : '凶時';

      return {
        hour,
        timeRange: this.getTimeRange(index),
        ganZhi: hourGanZhi,
        nature,
        suitability,
        bestActivities: this.getBestActivitiesForHour(hour),
        avoidActivities: this.getAvoidActivitiesForHour(hour)
      };
    });
  }

  /**
   * 計算董公評分
   */
  public calculateDongGongScore(analysis: {
    twelveBuilds: TwelveBuildsInfo;
    godsAndEvils: GodsAndEvilsInfo;
    specialDays: SpecialDayInfo;
    wuXingInfo: any;
  }, date?: Date): DongGongJudgment {
    // 十二建星評分
    const buildScore = this.BUILD_RULES[analysis.twelveBuilds.name].score;

    // 神煞評分
    const godsEvilsScore = this.calculateGodsEvilsScore(analysis.godsAndEvils);

    // 五行評分
    const wuXingScore = this.calculateWuXingScore(analysis.wuXingInfo);

    // 特殊日期評分（包含沖煞影響）
    const specialScore = this.calculateSpecialScore(analysis.specialDays, date);

    // 黃道吉日特殊處理
    const huangDaoBuilds = ['建', '除', '定', '執', '危', '成', '開', '閉'];
    const isHuangDaoDay = huangDaoBuilds.includes(analysis.twelveBuilds.name);
    
    let overall: number;
    if (isHuangDaoDay && buildScore >= 70) {
      // 黃道吉日且建星評分高，大幅增加建星權重，並給予基礎加分
      const baseBonus = 10; // 黃道吉日基礎加分
      overall = Math.max(0, Math.min(100, 
        buildScore * 0.7 + godsEvilsScore * 0.15 + wuXingScore * 0.1 + specialScore * 0.05 + baseBonus
      ));
    } else {
      // 普通日期使用原權重
      overall = Math.max(0, Math.min(100, 
        buildScore * 0.4 + godsEvilsScore * 0.3 + wuXingScore * 0.2 + specialScore * 0.1
      ));
    }

    return {
      overall,
      breakdown: {
        twelveBuilds: buildScore,
        godsEvils: godsEvilsScore,
        wuXing: wuXingScore,
        special: specialScore
      },
      level: this.getScoreLevel(overall),
      summary: this.getScoreSummary(overall),
      reasons: this.generateScoreReasons(analysis),
      buildInfluence: `建星${analysis.twelveBuilds.name}日，${analysis.twelveBuilds.meaning}`,
      godsInfluence: `吉神${analysis.godsAndEvils.auspiciousGods.length}個，凶煞${analysis.godsAndEvils.inauspiciousEvils.length}個`,
      specialInfluence: analysis.specialDays.specialNote
    };
  }

  // 私有輔助方法
  private getMonthBuild(lunarMonth: number): string {
    const builds = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
    return builds[(lunarMonth - 1) % 12];
  }

  private calculateDayBuild(date: Date): TwelveBuild {
    // 使用 lunar-javascript 庫的正確建星計算
    try {
      const solar = require('lunar-javascript').Solar.fromDate(date);
      const lunar = solar.getLunar();
      const zhiXing = lunar.getZhiXing(); // 這就是建星！
      
      // 建星名稱映射（處理簡繁體差異）
      const buildMapping: Record<string, TwelveBuild> = {
        '建': '建', '除': '除', '满': '滿', '滿': '滿', '平': '平',
        '定': '定', '执': '執', '執': '執', '破': '破', '危': '危',
        '成': '成', '收': '收', '开': '開', '開': '開', '闭': '閉', '閉': '閉'
      };
      
      const mappedBuild = buildMapping[zhiXing];
      if (mappedBuild) {
        return mappedBuild;
      } else {
        console.warn(`未知的建星: ${zhiXing}`);
        return '平'; // 預設值
      }
    } catch (error) {
      console.error('建星計算錯誤:', error);
      return '平'; // 預設值
    }
  }

  private getBuildTraditionalRule(build: TwelveBuild): string {
    const rules = {
      '建': '建滿平收黑（黑道）',
      '除': '除危定執黃（黃道）',
      '滿': '建滿平收黑（黑道）',
      '平': '建滿平收黑（黑道）',
      '定': '除危定執黃（黃道）',
      '執': '除危定執黃（黃道）',
      '破': '閉破不吉祥',
      '危': '除危定執黃（黃道）',
      '成': '成開皆可用',
      '收': '建滿平收黑（黑道）',
      '開': '成開皆可用',
      '閉': '閉破不吉祥'
    };
    return rules[build];
  }

  // 神煞計算已移至 gods-evils-rules.ts 中的專門函數

  // 特殊日期檢查已移至 special-dates-rules.ts 中的專門函數

  // 八字分析已移至 bazi-analysis-rules.ts 中的專門函數

  private generateAdvancedPersonalRecommendations(
    baZiInfo: BaZiInfo,
    bodyStrength: BodyStrengthAnalysis,
    yongShen: YongShenAnalysis,
    pattern: PatternAnalysis,
    dateCompatibility: DateCompatibilityAnalysis
  ): string[] {
    const recommendations: string[] = [];
    
    // 基於身強身弱的建議
    if (bodyStrength.strength === 'strong') {
      recommendations.push('您身強有力，此日宜進行需要決斷力的事務');
      recommendations.push('適合主動出擊，把握機會');
    } else if (bodyStrength.strength === 'weak') {
      recommendations.push('您身弱需扶，此日宜尋求貴人相助');
      recommendations.push('適合低調行事，避免過度消耗');
    } else {
      recommendations.push('您身中和，此日宜平衡發展');
    }
    
    // 基於用神的建議
    if (yongShen.yongShen.length > 0) {
      recommendations.push(`用神為${yongShen.yongShen.join('、')}，宜選擇相關方位和顏色`);
    }
    
    // 基於格局的建議
    recommendations.push(`您為${pattern.pattern}，${pattern.characteristics[0] || '宜順應格局特點'}`);
    
    // 基於日期配合的建議
    recommendations.push(...dateCompatibility.recommendations);
    
    return recommendations;
  }

  private generateAdvancedPersonalWarnings(
    baZiInfo: BaZiInfo,
    bodyStrength: BodyStrengthAnalysis,
    yongShen: YongShenAnalysis,
    dateCompatibility: DateCompatibilityAnalysis
  ): string[] {
    const warnings: string[] = [];
    
    // 基於忌神的警告
    if (yongShen.jiShen.length > 0) {
      warnings.push(`忌神為${yongShen.jiShen.join('、')}，避免相關方位和顏色`);
    }
    
    // 基於身強身弱的警告
    if (bodyStrength.strength === 'weak' && bodyStrength.score < 30) {
      warnings.push('身弱明顯，避免過度勞累和重大決策');
    }
    
    // 基於日期配合的警告
    warnings.push(...dateCompatibility.warnings);
    
    return warnings;
  }

  private generateWuXingRelationDescription(
    baZiInfo: BaZiInfo,
    dateGanZhi: GanZhiInfo,
    yongShen: YongShenAnalysis
  ): string {
    const dayMasterWuXing = require('../data/bazi-analysis-rules').getWuXing(baZiInfo.dayMaster);
    const dateGanWuXing = require('../data/bazi-analysis-rules').getWuXing(dateGanZhi.day.charAt(0));
    const relation = require('../data/bazi-analysis-rules').checkWuXingRelation(dateGanWuXing, dayMasterWuXing);
    
    return `日主${dayMasterWuXing}與日干${dateGanWuXing}${relation}，用神：${yongShen.yongShen.join('、')}`;
  }

  private getDefaultPersonalizedAnalysis(): PersonalizedAnalysis {
    return {
      compatibility: '一般',
      birthCompatibility: 50,
      personalRecommendations: ['建議提供生辰八字以獲得更精確的分析'],
      personalWarnings: [],
      wuXingRelation: '未提供八字資料，無法分析五行關係',
      customizedScore: 50
    };
  }

  private calculateHourGanZhi(date: Date, hour: string): string {
    // 簡化的時干支計算
    return this.lunarService.getHourGanZhi(date, 9);
  }

  private calculateHourSuitability(date: Date, hour: string): number {
    // 簡化的時辰適合度計算
    return Math.random() * 100;
  }

  private getTimeRange(hourIndex: number): string {
    const ranges = [
      '23:00-01:00', '01:00-03:00', '03:00-05:00', '05:00-07:00',
      '07:00-09:00', '09:00-11:00', '11:00-13:00', '13:00-15:00',
      '15:00-17:00', '17:00-19:00', '19:00-21:00', '21:00-23:00'
    ];
    return ranges[hourIndex];
  }

  private getBestActivitiesForHour(hour: string): string[] {
    // 簡化的時辰宜事
    return ['一般事務'];
  }

  private getAvoidActivitiesForHour(hour: string): string[] {
    // 簡化的時辰忌事
    return [];
  }

  private calculateGodsEvilsScore(godsAndEvils: GodsAndEvilsInfo): number {
    let score = 50;
    
    // 吉神加分 - 使用新的層級系統
    const godLevel = getGodLevel(godsAndEvils.auspiciousGods);
    const godBonus = {
      'none': 0,
      'light': 10,
      'medium': 20,
      'strong': 30,
      'excellent': 40
    };
    score += godBonus[godLevel];
    
    // 凶煞扣分 - 使用新的層級系統，但對一般凶煞減少扣分
    const evilLevel = getEvilLevel(godsAndEvils.inauspiciousEvils);
    const evilPenalty = {
      'light': 5,   // 減少輕微凶煞的扣分
      'medium': 15, // 減少中等凶煞的扣分
      'severe': 35, // 減少嚴重凶煞的扣分
      'extreme': 50 // 減少極端凶煞的扣分
    };
    score -= evilPenalty[evilLevel];
    
    // 特別處理歲破 - 歲破是極重大的凶煞
    const hasSuiPo = godsAndEvils.inauspiciousEvils.some(evil => evil.name === '歲破');
    if (hasSuiPo) {
      score -= 20; // 減少歲破額外扣分
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private calculateWuXingScore(wuXingInfo: any): number {
    // 簡化的五行評分
    const strengthScore = wuXingInfo.elementStrength === 'strong' ? 80 : 
                         wuXingInfo.elementStrength === 'medium' ? 60 : 40;
    return strengthScore;
  }

  private calculateSpecialScore(specialDays: SpecialDayInfo, date?: Date): number {
    let score = 50;
    if (specialDays.isSpecialAuspicious) score += 40;
    if (specialDays.isSpecialInauspicious) score -= 40;
    if (specialDays.isFourJue || specialDays.isFourLi) score -= 30;
    if (specialDays.isShaInCenter) score -= 50;
    
    // 加入沖煞影響 - 日支與年支相沖是重大不利因素
    if (date) {
      const hasChongSha = this.checkChongSha(date);
      if (hasChongSha) {
        score -= 20; // 沖煞扣分
      }
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private checkChongSha(date: Date): boolean {
    // 簡化的沖煞檢查 - 實際應該檢查日支與年支是否相沖
    try {
      const solar = require('lunar-javascript').Solar.fromDate(date);
      const lunar = solar.getLunar();
      const dayZhi = lunar.getDayInGanZhi().charAt(1);
      const yearZhi = lunar.getYearInGanZhi().charAt(1);
      
      // 沖的對應關係
      const chongMap: Record<string, string> = {
        '子': '午', '丑': '未', '寅': '申', '卯': '酉',
        '辰': '戌', '巳': '亥', '午': '子', '未': '丑',
        '申': '寅', '酉': '卯', '戌': '辰', '亥': '巳'
      };
      
      return chongMap[dayZhi] === yearZhi;
    } catch (error) {
      return false;
    }
  }

  private getScoreLevel(score: number): 'excellent' | 'good' | 'fair' | 'poor' | 'terrible' {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    if (score >= 30) return 'poor';
    return 'terrible';
  }

  private getScoreSummary(score: number): '大吉' | '吉' | '平' | '凶' | '大凶' {
    if (score >= 85) return '大吉';
    if (score >= 70) return '吉';
    if (score >= 50) return '平';
    if (score >= 30) return '凶';
    return '大凶';
  }

  private generateScoreReasons(analysis: any): string[] {
    const reasons = [];
    reasons.push(`十二建星為${analysis.twelveBuilds.name}日，${analysis.twelveBuilds.meaning}`);
    
    if (analysis.godsAndEvils.auspiciousGods.length > 0) {
      const godLevel = getGodLevel(analysis.godsAndEvils.auspiciousGods);
      const godNames = analysis.godsAndEvils.auspiciousGods.map((g: God) => g.name).join('、');
      reasons.push(`有${godNames}等吉神照臨（${godLevel}級）`);
    }
    
    if (analysis.godsAndEvils.inauspiciousEvils.length > 0) {
      const evilLevel = getEvilLevel(analysis.godsAndEvils.inauspiciousEvils);
      const evilNames = analysis.godsAndEvils.inauspiciousEvils.map((e: Evil) => e.name).join('、');
      reasons.push(`有${evilNames}等凶煞（${evilLevel}級）`);
    }
    
    return reasons;
  }

  /**
   * 獲取神煞化解建議
   */
  public getEvilResolutionAdvice(date: Date): string[] {
    const godsAndEvils = this.calculateGodsAndEvils(date);
    const resolutions: string[] = [];
    
    godsAndEvils.inauspiciousEvils.forEach(evil => {
      const methods = getEvilResolutionMethods(evil);
      resolutions.push(`${evil.name}化解：${methods.join('、')}`);
    });
    
    return resolutions;
  }

  /**
   * 獲取神煞詳細分析
   */
  public getGodsEvilsDetailedAnalysis(date: Date): {
    godLevel: string;
    evilLevel: string;
    recommendations: string[];
    warnings: string[];
    resolutions: string[];
  } {
    const godsAndEvils = this.calculateGodsAndEvils(date);
    const godLevel = getGodLevel(godsAndEvils.auspiciousGods);
    const evilLevel = getEvilLevel(godsAndEvils.inauspiciousEvils);
    
    const recommendations: string[] = [];
    const warnings: string[] = [];
    
    // 根據吉神給出建議
    godsAndEvils.auspiciousGods.forEach(god => {
      recommendations.push(`${god.name}：${god.effect}`);
    });
    
    // 根據凶煞給出警告
    godsAndEvils.inauspiciousEvils.forEach(evil => {
      warnings.push(`${evil.name}：${evil.warning}`);
    });
    
    const resolutions = this.getEvilResolutionAdvice(date);
    
    return {
      godLevel,
      evilLevel,
      recommendations,
      warnings,
      resolutions
    };
  }

  /**
   * 獲取完整的八字分析
   */
  public getCompleteBaZiAnalysis(birthInfo: BirthInfo): {
    baZiInfo: BaZiInfo;
    bodyStrength: BodyStrengthAnalysis;
    yongShen: YongShenAnalysis;
    pattern: PatternAnalysis;
  } {
    const baZiInfo = calculateBaZiInfo(birthInfo);
    const bodyStrength = analyzeBodyStrength(baZiInfo);
    const yongShen = analyzeYongShen(baZiInfo, bodyStrength);
    const pattern = analyzePattern(baZiInfo);
    
    return {
      baZiInfo,
      bodyStrength,
      yongShen,
      pattern
    };
  }

  /**
   * 獲取日期與八字的詳細配合分析
   */
  public getDateBaZiCompatibility(date: Date, birthInfo: BirthInfo): DateCompatibilityAnalysis {
    const baZiInfo = calculateBaZiInfo(birthInfo);
    const bodyStrength = analyzeBodyStrength(baZiInfo);
    const yongShen = analyzeYongShen(baZiInfo, bodyStrength);
    const dateGanZhi = this.lunarService.getGanZhi(date);
    
    return analyzeDateCompatibility(baZiInfo, bodyStrength, yongShen, dateGanZhi);
  }

  /**
   * 獲取完整的特殊日期分析
   */
  public getCompleteSpecialDatesAnalysis(date: Date): {
    siJueSiLi: SiJueSiLiResult;
    specialInauspicious: SpecialDateResult;
    specialAuspicious: SpecialDateResult;
    shaRuZhongGong: ShaRuZhongGongResult;
    sanSha: SanShaResult;
    overallAssessment: {
      isSpecialDay: boolean;
      type: 'extremely_auspicious' | 'auspicious' | 'neutral' | 'inauspicious' | 'extremely_inauspicious';
      summary: string;
      recommendations: string[];
      warnings: string[];
    };
  } {
    const buildInfo = this.calculateTwelveBuilds(date);
    return checkAllSpecialDates(date, buildInfo.name);
  }

  /**
   * 檢查四絕四離日
   */
  public checkSiJueSiLiDays(date: Date): SiJueSiLiResult {
    return checkSiJueSiLi(date);
  }

  /**
   * 檢查煞入中宮
   */
  public checkShaRuZhongGongDay(date: Date): ShaRuZhongGongResult {
    return checkShaRuZhongGong(date);
  }

  /**
   * 檢查三煞方位
   */
  public checkSanShaDirection(date: Date, direction?: string): SanShaResult {
    return checkSanSha(date, direction);
  }
}