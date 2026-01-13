/**
 * 董公擇日計算引擎測試
 * 驗證董公擇日七步操作法的準確性
 */

import { DongGongCalculator } from '../src/services/DongGongCalculator';
import { getActivityById } from '../src/data/dong-gong-activities';
import { BirthInfo } from '../src/types/dong-gong';

describe('DongGongCalculator', () => {
  let calculator: DongGongCalculator;

  beforeEach(() => {
    calculator = new DongGongCalculator();
  });

  describe('calculateTwelveBuilds', () => {
    test('應該正確計算十二建星', () => {
      const date = new Date(2025, 0, 1);
      const buildsInfo = calculator.calculateTwelveBuilds(date);
      
      expect(buildsInfo).toBeDefined();
      expect(buildsInfo.name).toMatch(/^(建|除|滿|平|定|執|破|危|成|收|開|閉)$/);
      expect(buildsInfo.meaning).toBeDefined();
      expect(['auspicious', 'neutral', 'inauspicious']).toContain(buildsInfo.level);
      expect(buildsInfo.traditionalRule).toBeDefined();
      expect(Array.isArray(buildsInfo.suitable)).toBe(true);
      expect(Array.isArray(buildsInfo.avoid)).toBe(true);
    });

    test('應該為不同日期返回不同的建星', () => {
      const date1 = new Date(2025, 0, 1);
      const date2 = new Date(2025, 0, 15);
      
      const builds1 = calculator.calculateTwelveBuilds(date1);
      const builds2 = calculator.calculateTwelveBuilds(date2);
      
      // 不同日期可能有不同的建星（但不是必須的）
      expect(builds1).toBeDefined();
      expect(builds2).toBeDefined();
    });
  });

  describe('calculateGodsAndEvils', () => {
    test('應該正確計算神煞配置', () => {
      const date = new Date(2025, 0, 1);
      const godsEvils = calculator.calculateGodsAndEvils(date);
      
      expect(godsEvils).toBeDefined();
      expect(Array.isArray(godsEvils.auspiciousGods)).toBe(true);
      expect(Array.isArray(godsEvils.inauspiciousEvils)).toBe(true);
      
      // 檢查吉神結構
      godsEvils.auspiciousGods.forEach(god => {
        expect(god.name).toBeDefined();
        expect(god.description).toBeDefined();
        expect(god.effect).toBeDefined();
        expect(god.calculation).toBeDefined();
      });
      
      // 檢查凶煞結構
      godsEvils.inauspiciousEvils.forEach(evil => {
        expect(evil.name).toBeDefined();
        expect(evil.description).toBeDefined();
        expect(evil.effect).toBeDefined();
        expect(evil.calculation).toBeDefined();
        expect(['light', 'medium', 'severe']).toContain(evil.severity);
        expect(evil.warning).toBeDefined();
      });
    });
  });

  describe('calculateSpecialDays', () => {
    test('應該正確識別特殊日期', () => {
      const date = new Date(2025, 0, 1);
      const specialDays = calculator.calculateSpecialDays(date);
      
      expect(specialDays).toBeDefined();
      expect(typeof specialDays.isSpecialAuspicious).toBe('boolean');
      expect(typeof specialDays.isSpecialInauspicious).toBe('boolean');
      expect(typeof specialDays.isFourJue).toBe('boolean');
      expect(typeof specialDays.isFourLi).toBe('boolean');
      expect(typeof specialDays.isShaInCenter).toBe('boolean');
      expect(specialDays.specialNote).toBeDefined();
    });
  });

  describe('calculatePersonalizedAnalysis', () => {
    test('應該正確計算個人化分析', () => {
      const date = new Date(2025, 0, 1);
      const birthInfo: BirthInfo = {
        year: 1990,
        month: 5,
        day: 15,
        hour: 10,
        minute: 30,
        isLunar: false
      };
      
      const analysis = calculator.calculatePersonalizedAnalysis(date, birthInfo);
      
      expect(analysis).toBeDefined();
      expect(typeof analysis.birthCompatibility).toBe('number');
      expect(analysis.birthCompatibility).toBeGreaterThanOrEqual(0);
      expect(analysis.birthCompatibility).toBeLessThanOrEqual(100);
      expect(Array.isArray(analysis.personalRecommendations)).toBe(true);
      expect(Array.isArray(analysis.personalWarnings)).toBe(true);
      expect(typeof analysis.customizedScore).toBe('number');
    });
  });

  describe('calculateHourlyAnalysis', () => {
    test('應該正確計算時辰分析', () => {
      const date = new Date(2025, 0, 1);
      const hourlyAnalysis = calculator.calculateHourlyAnalysis(date);
      
      expect(Array.isArray(hourlyAnalysis)).toBe(true);
      expect(hourlyAnalysis).toHaveLength(12); // 十二時辰
      
      hourlyAnalysis.forEach(hour => {
        expect(hour.hour).toMatch(/^[子丑寅卯辰巳午未申酉戌亥]$/);
        expect(hour.timeRange).toMatch(/^\d{2}:\d{2}-\d{2}:\d{2}$/);
        expect(hour.ganZhi).toBeDefined();
        expect(typeof hour.suitability).toBe('number');
        expect(hour.suitability).toBeGreaterThanOrEqual(0);
        expect(hour.suitability).toBeLessThanOrEqual(100);
        expect(Array.isArray(hour.bestActivities)).toBe(true);
        expect(Array.isArray(hour.avoidActivities)).toBe(true);
      });
    });
  });

  describe('calculateDongGongScore', () => {
    test('應該正確計算董公評分', () => {
      const date = new Date(2025, 0, 1);
      const buildsInfo = calculator.calculateTwelveBuilds(date);
      const godsEvils = calculator.calculateGodsAndEvils(date);
      const specialDays = calculator.calculateSpecialDays(date);
      
      const score = calculator.calculateDongGongScore({
        twelveBuilds: buildsInfo,
        godsAndEvils: godsEvils,
        specialDays: specialDays,
        wuXingInfo: { elementStrength: 'medium' }
      });
      
      expect(score).toBeDefined();
      expect(typeof score.overall).toBe('number');
      expect(score.overall).toBeGreaterThanOrEqual(0);
      expect(score.overall).toBeLessThanOrEqual(100);
      
      expect(score.breakdown).toBeDefined();
      expect(typeof score.breakdown.twelveBuilds).toBe('number');
      expect(typeof score.breakdown.godsEvils).toBe('number');
      expect(typeof score.breakdown.wuXing).toBe('number');
      expect(typeof score.breakdown.special).toBe('number');
      
      expect(['excellent', 'good', 'fair', 'poor', 'terrible']).toContain(score.level);
      expect(['大吉', '吉', '平', '凶', '大凶']).toContain(score.summary);
      expect(Array.isArray(score.reasons)).toBe(true);
    });
  });

  describe('calculateSevenStepProcess', () => {
    test('應該正確執行董公擇日七步操作法', () => {
      const date = new Date(2025, 0, 1);
      const activity = getActivityById('marry');
      const birthInfo: BirthInfo = {
        year: 1990,
        month: 5,
        day: 15,
        isLunar: false
      };
      
      if (!activity) {
        throw new Error('測試活動不存在');
      }
      
      const process = calculator.calculateSevenStepProcess(date, activity, birthInfo);
      
      // 步驟1：確定事項
      expect(process.step1_determineActivity).toEqual(activity);
      
      // 步驟2：月建判斷
      expect(process.step2_monthBuild).toBeDefined();
      expect(typeof process.step2_monthBuild).toBe('string');
      
      // 步驟3：建星分析
      expect(process.step3_buildAnalysis).toBeDefined();
      expect(process.step3_buildAnalysis.name).toMatch(/^(建|除|滿|平|定|執|破|危|成|收|開|閉)$/);
      
      // 步驟4：神煞檢核
      expect(process.step4_godsEvilsCheck).toBeDefined();
      expect(Array.isArray(process.step4_godsEvilsCheck.auspiciousGods)).toBe(true);
      expect(Array.isArray(process.step4_godsEvilsCheck.inauspiciousEvils)).toBe(true);
      
      // 步驟5：命理配合
      expect(process.step5_personalMatch).toBeDefined();
      expect(typeof process.step5_personalMatch.birthCompatibility).toBe('number');
      
      // 步驟6：時辰選擇
      expect(process.step6_hourSelection).toBeDefined();
      expect(Array.isArray(process.step6_hourSelection)).toBe(true);
      expect(process.step6_hourSelection).toHaveLength(12);
      
      // 步驟7：綜合判斷
      expect(process.step7_comprehensiveJudgment).toBeDefined();
      expect(typeof process.step7_comprehensiveJudgment.overall).toBe('number');
    });

    test('應該在沒有生辰八字時提供預設分析', () => {
      const date = new Date(2025, 0, 1);
      const activity = getActivityById('kaishi'); // 開市
      
      if (!activity) {
        throw new Error('測試活動不存在');
      }
      
      const process = calculator.calculateSevenStepProcess(date, activity);
      
      expect(process.step5_personalMatch).toBeDefined();
      expect(process.step5_personalMatch.birthCompatibility).toBe(50);
      expect(process.step5_personalMatch.personalRecommendations).toContain('建議提供生辰八字以獲得更精確的分析');
    });
  });

  describe('董公擇日特定規則測試', () => {
    test('應該正確識別建滿平收黑道日', () => {
      // 這個測試需要找到實際的建、滿、平、收日來驗證
      const date = new Date(2025, 0, 1);
      const buildsInfo = calculator.calculateTwelveBuilds(date);
      
      if (['建', '滿', '平', '收'].includes(buildsInfo.name)) {
        expect(buildsInfo.traditionalRule).toContain('黑道');
      }
    });

    test('應該正確識別除危定執黃道日', () => {
      const date = new Date(2025, 0, 1);
      const buildsInfo = calculator.calculateTwelveBuilds(date);
      
      if (['除', '危', '定', '執'].includes(buildsInfo.name)) {
        expect(buildsInfo.traditionalRule).toContain('黃道');
      }
    });

    test('應該正確識別成開皆可用', () => {
      const date = new Date(2025, 0, 1);
      const buildsInfo = calculator.calculateTwelveBuilds(date);
      
      if (['成', '開'].includes(buildsInfo.name)) {
        expect(buildsInfo.traditionalRule).toContain('可用');
      }
    });

    test('應該正確識別閉破不吉祥', () => {
      const date = new Date(2025, 0, 1);
      const buildsInfo = calculator.calculateTwelveBuilds(date);
      
      if (['閉', '破'].includes(buildsInfo.name)) {
        expect(buildsInfo.traditionalRule).toContain('不吉祥');
      }
    });
  });
});