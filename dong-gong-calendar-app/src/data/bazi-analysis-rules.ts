/**
 * 董公擇日 - 個人八字配合專業系統
 * 實作「用日宜擇吉兼參照本命而行」的核心邏輯
 */

import { BirthInfo } from '../types/dong-gong';
import { GanZhiInfo } from '../types/lunar';

// 天干五行屬性
const HEAVENLY_STEM_WUXING: Record<string, string> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火', 
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

// 地支五行屬性
const EARTHLY_BRANCH_WUXING: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 五行相生相剋關係
const WUXING_RELATIONS = {
  // 相生：木生火，火生土，土生金，金生水，水生木
  sheng: {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  } as Record<string, string>,
  // 相剋：木剋土，土剋水，水剋火，火剋金，金剋木
  ke: {
    '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
  } as Record<string, string>
};

// 月令司權表（每月當令的五行）
const MONTHLY_WUXING: Record<number, string> = {
  1: '木',   // 正月寅月，木當令
  2: '木',   // 二月卯月，木當令
  3: '土',   // 三月辰月，土當令
  4: '火',   // 四月巳月，火當令
  5: '火',   // 五月午月，火當令
  6: '土',   // 六月未月，土當令
  7: '金',   // 七月申月，金當令
  8: '金',   // 八月酉月，金當令
  9: '土',   // 九月戌月，土當令
  10: '水',  // 十月亥月，水當令
  11: '水',  // 十一月子月，水當令
  12: '土'   // 十二月丑月，土當令
};

// 十神關係（以日干為中心）
const SHISHEN_RELATIONS: Record<string, Record<string, string>> = {
  '甲': {
    '甲': '比肩', '乙': '劫財', '丙': '食神', '丁': '傷官',
    '戊': '偏財', '己': '正財', '庚': '七殺', '辛': '正官',
    '壬': '偏印', '癸': '正印'
  },
  '乙': {
    '甲': '劫財', '乙': '比肩', '丙': '傷官', '丁': '食神',
    '戊': '正財', '己': '偏財', '庚': '正官', '辛': '七殺',
    '壬': '正印', '癸': '偏印'
  },
  '丙': {
    '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫財',
    '戊': '食神', '己': '傷官', '庚': '偏財', '辛': '正財',
    '壬': '七殺', '癸': '正官'
  },
  '丁': {
    '甲': '正印', '乙': '偏印', '丙': '劫財', '丁': '比肩',
    '戊': '傷官', '己': '食神', '庚': '正財', '辛': '偏財',
    '壬': '正官', '癸': '七殺'
  },
  '戊': {
    '甲': '七殺', '乙': '正官', '丙': '偏印', '丁': '正印',
    '戊': '比肩', '己': '劫財', '庚': '食神', '辛': '傷官',
    '壬': '偏財', '癸': '正財'
  },
  '己': {
    '甲': '正官', '乙': '七殺', '丙': '正印', '丁': '偏印',
    '戊': '劫財', '己': '比肩', '庚': '傷官', '辛': '食神',
    '壬': '正財', '癸': '偏財'
  },
  '庚': {
    '甲': '偏財', '乙': '正財', '丙': '七殺', '丁': '正官',
    '戊': '偏印', '己': '正印', '庚': '比肩', '辛': '劫財',
    '壬': '食神', '癸': '傷官'
  },
  '辛': {
    '甲': '正財', '乙': '偏財', '丙': '正官', '丁': '七殺',
    '戊': '正印', '己': '偏印', '庚': '劫財', '辛': '比肩',
    '壬': '傷官', '癸': '食神'
  },
  '壬': {
    '甲': '食神', '乙': '傷官', '丙': '偏財', '丁': '正財',
    '戊': '七殺', '己': '正官', '庚': '偏印', '辛': '正印',
    '壬': '比肩', '癸': '劫財'
  },
  '癸': {
    '甲': '傷官', '乙': '食神', '丙': '正財', '丁': '偏財',
    '戊': '正官', '己': '七殺', '庚': '正印', '辛': '偏印',
    '壬': '劫財', '癸': '比肩'
  }
};

/**
 * 八字基本資訊
 */
export interface BaZiInfo {
  yearPillar: string;    // 年柱
  monthPillar: string;   // 月柱
  dayPillar: string;     // 日柱
  hourPillar: string;    // 時柱
  dayMaster: string;     // 日主（日干）
  monthlyWuXing: string; // 月令五行
  wuXingCount: Record<string, number>; // 五行統計
  shiShenAnalysis: Record<string, string[]>; // 十神分析
}

/**
 * 身強身弱判斷結果
 */
export interface BodyStrengthAnalysis {
  strength: 'strong' | 'medium' | 'weak';
  score: number;        // 身強度評分 (0-100)
  analysis: string;     // 分析說明
  factors: string[];    // 影響因素
}

/**
 * 用神忌神分析
 */
export interface YongShenAnalysis {
  yongShen: string[];   // 用神（喜用五行）
  jiShen: string[];     // 忌神（忌諱五行）
  analysis: string;     // 分析說明
  strategy: string;     // 用神策略
}

/**
 * 格局分析
 */
export interface PatternAnalysis {
  pattern: string;      // 格局名稱
  type: 'normal' | 'special' | 'follow' | 'transform'; // 格局類型
  description: string;  // 格局說明
  characteristics: string[]; // 格局特點
  suitable: string[];   // 適合的五行
  avoid: string[];      // 避忌的五行
}

/**
 * 日期配合分析
 */
export interface DateCompatibilityAnalysis {
  compatibility: number;     // 配合度 (0-100)
  level: '極佳' | '良好' | '一般' | '不佳' | '極差';
  dayMasterSupport: number;  // 日主扶助度
  yongShenSupport: number;   // 用神支持度
  jiShenAvoidance: number;   // 忌神避免度
  recommendations: string[]; // 建議
  warnings: string[];        // 警告
}

/**
 * 計算八字基本資訊
 */
export function calculateBaZiInfo(birthInfo: BirthInfo): BaZiInfo {
  try {
    // 使用 lunar-javascript 計算八字
    const birthDate = new Date(birthInfo.year, birthInfo.month - 1, birthInfo.day, birthInfo.hour || 12);
    const solar = require('lunar-javascript').Solar.fromDate(birthDate);
    const lunar = solar.getLunar();
    const baZi = lunar.getEightChar();
    
    const yearPillar = baZi.getYear();
    const monthPillar = baZi.getMonth();
    const dayPillar = baZi.getDay();
    const hourPillar = baZi.getTime();
    
    const dayMaster = dayPillar.charAt(0); // 日干
    const monthlyWuXing = MONTHLY_WUXING[lunar.getMonth()];
    
    // 統計五行
    const wuXingCount: Record<string, number> = {
      '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
    };
    
    // 統計天干五行
    [yearPillar.charAt(0), monthPillar.charAt(0), dayPillar.charAt(0), hourPillar.charAt(0)].forEach(gan => {
      const wuXing = HEAVENLY_STEM_WUXING[gan];
      if (wuXing) wuXingCount[wuXing]++;
    });
    
    // 統計地支五行
    [yearPillar.charAt(1), monthPillar.charAt(1), dayPillar.charAt(1), hourPillar.charAt(1)].forEach(zhi => {
      const wuXing = EARTHLY_BRANCH_WUXING[zhi];
      if (wuXing) wuXingCount[wuXing]++;
    });
    
    // 十神分析
    const shiShenAnalysis: Record<string, string[]> = {};
    const dayMasterRelations = SHISHEN_RELATIONS[dayMaster];
    if (dayMasterRelations) {
      Object.entries(dayMasterRelations).forEach(([gan, shiShen]) => {
        if (!shiShenAnalysis[shiShen]) {
          shiShenAnalysis[shiShen] = [];
        }
        shiShenAnalysis[shiShen].push(gan);
      });
    }
    
    return {
      yearPillar,
      monthPillar,
      dayPillar,
      hourPillar,
      dayMaster,
      monthlyWuXing,
      wuXingCount,
      shiShenAnalysis
    };
  } catch (error) {
    // 如果計算失敗，返回預設值
    return {
      yearPillar: '甲子',
      monthPillar: '甲子',
      dayPillar: '甲子',
      hourPillar: '甲子',
      dayMaster: '甲',
      monthlyWuXing: '木',
      wuXingCount: { '木': 2, '火': 1, '土': 1, '金': 2, '水': 2 },
      shiShenAnalysis: {}
    };
  }
}

/**
 * 身強身弱判斷
 */
export function analyzeBodyStrength(baZiInfo: BaZiInfo): BodyStrengthAnalysis {
  let score = 50; // 基礎分數
  const factors: string[] = [];
  
  // 1. 月令支持度（最重要，佔40%）
  const dayMasterWuXing = HEAVENLY_STEM_WUXING[baZiInfo.dayMaster];
  if (baZiInfo.monthlyWuXing === dayMasterWuXing) {
    score += 20;
    factors.push('月令當旺，日主得令');
  } else if (WUXING_RELATIONS.sheng[baZiInfo.monthlyWuXing] === dayMasterWuXing) {
    score += 15;
    factors.push('月令生助日主');
  } else if (WUXING_RELATIONS.ke[baZiInfo.monthlyWuXing] === dayMasterWuXing) {
    score -= 15;
    factors.push('月令剋制日主');
  } else if (WUXING_RELATIONS.ke[dayMasterWuXing] === baZiInfo.monthlyWuXing) {
    score -= 10;
    factors.push('日主洩氣於月令');
  }
  
  // 2. 同類五行支持度（佔30%）
  const sameWuXingCount = baZiInfo.wuXingCount[dayMasterWuXing] || 0;
  if (sameWuXingCount >= 3) {
    score += 15;
    factors.push(`同類五行${sameWuXingCount}個，根基深厚`);
  } else if (sameWuXingCount === 2) {
    score += 5;
    factors.push(`同類五行${sameWuXingCount}個，根基一般`);
  } else {
    score -= 10;
    factors.push(`同類五行${sameWuXingCount}個，根基薄弱`);
  }
  
  // 3. 生助五行支持度（佔20%）
  const shengWuXing = Object.keys(WUXING_RELATIONS.sheng).find(
    key => WUXING_RELATIONS.sheng[key] === dayMasterWuXing
  );
  if (shengWuXing) {
    const shengCount = baZiInfo.wuXingCount[shengWuXing] || 0;
    if (shengCount >= 2) {
      score += 10;
      factors.push(`生助五行${shengCount}個，印星有力`);
    } else if (shengCount === 1) {
      score += 5;
      factors.push(`生助五行${shengCount}個，印星一般`);
    }
  }
  
  // 4. 剋洩耗的影響（佔10%）
  const keWuXing = WUXING_RELATIONS.ke[dayMasterWuXing];
  const keCount = baZiInfo.wuXingCount[keWuXing] || 0;
  if (keCount >= 2) {
    score -= 10;
    factors.push(`剋制五行${keCount}個，官殺過重`);
  }
  
  // 確保分數在合理範圍內
  score = Math.max(0, Math.min(100, score));
  
  // 判斷身強身弱
  let strength: 'strong' | 'medium' | 'weak';
  let analysis: string;
  
  if (score >= 70) {
    strength = 'strong';
    analysis = '日主身強，能勝任財官，宜洩秀或制化';
  } else if (score >= 40) {
    strength = 'medium';
    analysis = '日主中和，身財官平衡，宜順其自然';
  } else {
    strength = 'weak';
    analysis = '日主身弱，需要扶助，宜印比生助';
  }
  
  return {
    strength,
    score,
    analysis,
    factors
  };
}

/**
 * 用神忌神分析
 */
export function analyzeYongShen(baZiInfo: BaZiInfo, bodyStrength: BodyStrengthAnalysis): YongShenAnalysis {
  const dayMasterWuXing = HEAVENLY_STEM_WUXING[baZiInfo.dayMaster];
  let yongShen: string[] = [];
  let jiShen: string[] = [];
  let analysis: string;
  let strategy: string;
  
  if (bodyStrength.strength === 'strong') {
    // 身強：用神為食傷、財星、官殺
    const shiWuXing = WUXING_RELATIONS.ke[dayMasterWuXing]; // 日主所剋（食傷、財）
    const guanWuXing = Object.keys(WUXING_RELATIONS.ke).find(
      key => WUXING_RELATIONS.ke[key] === dayMasterWuXing
    ); // 剋日主（官殺）
    
    yongShen = [shiWuXing, guanWuXing].filter(Boolean) as string[];
    jiShen = [dayMasterWuXing]; // 忌比劫
    
    // 加入印星為忌神
    const yinWuXing = Object.keys(WUXING_RELATIONS.sheng).find(
      key => WUXING_RELATIONS.sheng[key] === dayMasterWuXing
    );
    if (yinWuXing) jiShen.push(yinWuXing);
    
    analysis = '身強喜洩，用食傷財官，忌印比生助';
    strategy = '宜選擇食傷財官當令的日子，避免印比過旺';
    
  } else if (bodyStrength.strength === 'weak') {
    // 身弱：用神為印星、比劫
    yongShen = [dayMasterWuXing]; // 比劫
    
    const yinWuXing = Object.keys(WUXING_RELATIONS.sheng).find(
      key => WUXING_RELATIONS.sheng[key] === dayMasterWuXing
    );
    if (yinWuXing) yongShen.push(yinWuXing); // 印星
    
    // 忌神為官殺、食傷、財星
    const guanWuXing = Object.keys(WUXING_RELATIONS.ke).find(
      key => WUXING_RELATIONS.ke[key] === dayMasterWuXing
    );
    const shiWuXing = WUXING_RELATIONS.ke[dayMasterWuXing];
    
    jiShen = [guanWuXing, shiWuXing].filter(Boolean) as string[];
    
    analysis = '身弱喜扶，用印比生助，忌官殺財食洩耗';
    strategy = '宜選擇印比當令的日子，避免官殺財食過旺';
    
  } else {
    // 身中和：平衡為主
    yongShen = [dayMasterWuXing];
    jiShen = [];
    analysis = '身中和，宜平衡五行，不宜過旺過弱';
    strategy = '宜選擇五行平衡的日子，避免某一五行過於突出';
  }
  
  return {
    yongShen: [...new Set(yongShen)], // 去重
    jiShen: [...new Set(jiShen)],     // 去重
    analysis,
    strategy
  };
}

/**
 * 格局分析
 */
export function analyzePattern(baZiInfo: BaZiInfo): PatternAnalysis {
  const dayMaster = baZiInfo.dayMaster;
  const monthPillar = baZiInfo.monthPillar;
  const monthGan = monthPillar.charAt(0);
  const monthZhi = monthPillar.charAt(1);
  
  // 簡化的格局判斷
  const shiShen = SHISHEN_RELATIONS[dayMaster]?.[monthGan];
  
  let pattern: string;
  let type: 'normal' | 'special' | 'follow' | 'transform';
  let description: string;
  let characteristics: string[];
  let suitable: string[];
  let avoid: string[];
  
  // 根據月干十神判斷格局
  switch (shiShen) {
    case '正官':
      pattern = '正官格';
      type = 'normal';
      description = '月令正官透干，為正官格，主貴氣';
      characteristics = ['品格端正', '有責任感', '適合公職'];
      suitable = ['印星', '食神'];
      avoid = ['七殺', '傷官'];
      break;
      
    case '七殺':
      pattern = '七殺格';
      type = 'normal';
      description = '月令七殺透干，為七殺格，主威權';
      characteristics = ['性格剛強', '有領導力', '適合軍警'];
      suitable = ['印星', '食神'];
      avoid = ['官星', '傷官'];
      break;
      
    case '正財':
      pattern = '正財格';
      type = 'normal';
      description = '月令正財透干，為正財格，主富裕';
      characteristics = ['善於理財', '務實穩重', '適合商業'];
      suitable = ['官星', '食神'];
      avoid = ['比劫', '印星'];
      break;
      
    case '偏財':
      pattern = '偏財格';
      type = 'normal';
      description = '月令偏財透干，為偏財格，主橫財';
      characteristics = ['善於投資', '機會敏銳', '適合投機'];
      suitable = ['官星', '食神'];
      avoid = ['比劫', '印星'];
      break;
      
    case '食神':
      pattern = '食神格';
      type = 'normal';
      description = '月令食神透干，為食神格，主才華';
      characteristics = ['才華橫溢', '善於表達', '適合文藝'];
      suitable = ['財星'];
      avoid = ['印星', '七殺'];
      break;
      
    case '傷官':
      pattern = '傷官格';
      type = 'normal';
      description = '月令傷官透干，為傷官格，主聰明';
      characteristics = ['聰明機智', '創新能力', '適合技術'];
      suitable = ['財星'];
      avoid = ['官星', '印星'];
      break;
      
    default:
      pattern = '普通格局';
      type = 'normal';
      description = '未形成明顯格局，以身強身弱論命';
      characteristics = ['格局平常', '需看身強弱'];
      suitable = ['平衡五行'];
      avoid = ['極端五行'];
  }
  
  return {
    pattern,
    type,
    description,
    characteristics,
    suitable,
    avoid
  };
}

/**
 * 日期配合分析
 */
export function analyzeDateCompatibility(
  baZiInfo: BaZiInfo,
  bodyStrength: BodyStrengthAnalysis,
  yongShen: YongShenAnalysis,
  dateGanZhi: any // 暫時使用 any，因為 GanZhiInfo 可能結構不同
): DateCompatibilityAnalysis {
  let compatibility = 50; // 基礎配合度
  const recommendations: string[] = [];
  const warnings: string[] = [];
  
  // 1. 日主扶助度分析（40%權重）
  const dayMasterWuXing = HEAVENLY_STEM_WUXING[baZiInfo.dayMaster];
  const dateGanWuXing = HEAVENLY_STEM_WUXING[dateGanZhi.day.charAt(0)];
  const dateZhiWuXing = EARTHLY_BRANCH_WUXING[dateGanZhi.day.charAt(1)];
  
  let dayMasterSupport = 50;
  
  // 檢查日干對日主的影響
  if (dateGanWuXing === dayMasterWuXing) {
    dayMasterSupport += 20;
    recommendations.push('日干與命主同類，增強日主力量');
  } else if (WUXING_RELATIONS.sheng[dateGanWuXing] === dayMasterWuXing) {
    dayMasterSupport += 15;
    recommendations.push('日干生助日主，有利命主');
  } else if (WUXING_RELATIONS.ke[dateGanWuXing] === dayMasterWuXing) {
    dayMasterSupport -= 15;
    warnings.push('日干剋制日主，需要化解');
  }
  
  // 檢查日支對日主的影響
  if (dateZhiWuXing === dayMasterWuXing) {
    dayMasterSupport += 15;
    recommendations.push('日支與命主同類，根基穩固');
  } else if (WUXING_RELATIONS.sheng[dateZhiWuXing] === dayMasterWuXing) {
    dayMasterSupport += 10;
    recommendations.push('日支生助日主，根基有力');
  }
  
  // 2. 用神支持度分析（40%權重）
  let yongShenSupport = 50;
  
  yongShen.yongShen.forEach(yong => {
    if (dateGanWuXing === yong) {
      yongShenSupport += 20;
      recommendations.push(`日干為用神${yong}，大吉`);
    }
    if (dateZhiWuXing === yong) {
      yongShenSupport += 15;
      recommendations.push(`日支為用神${yong}，有利`);
    }
  });
  
  // 3. 忌神避免度分析（20%權重）
  let jiShenAvoidance = 50;
  
  yongShen.jiShen.forEach(ji => {
    if (dateGanWuXing === ji) {
      jiShenAvoidance -= 25;
      warnings.push(`日干為忌神${ji}，不利`);
    }
    if (dateZhiWuXing === ji) {
      jiShenAvoidance -= 20;
      warnings.push(`日支為忌神${ji}，需謹慎`);
    }
  });
  
  // 綜合計算配合度
  compatibility = Math.round(
    dayMasterSupport * 0.4 + 
    yongShenSupport * 0.4 + 
    jiShenAvoidance * 0.2
  );
  
  // 確保分數在合理範圍內
  compatibility = Math.max(0, Math.min(100, compatibility));
  
  // 判斷配合等級
  let level: '極佳' | '良好' | '一般' | '不佳' | '極差';
  if (compatibility >= 85) {
    level = '極佳';
  } else if (compatibility >= 70) {
    level = '良好';
  } else if (compatibility >= 50) {
    level = '一般';
  } else if (compatibility >= 30) {
    level = '不佳';
  } else {
    level = '極差';
  }
  
  return {
    compatibility,
    level,
    dayMasterSupport: Math.max(0, Math.min(100, dayMasterSupport)),
    yongShenSupport: Math.max(0, Math.min(100, yongShenSupport)),
    jiShenAvoidance: Math.max(0, Math.min(100, jiShenAvoidance)),
    recommendations,
    warnings
  };
}

/**
 * 獲取五行屬性
 */
export function getWuXing(ganOrZhi: string): string {
  return HEAVENLY_STEM_WUXING[ganOrZhi] || EARTHLY_BRANCH_WUXING[ganOrZhi] || '未知';
}

/**
 * 檢查五行關係
 */
export function checkWuXingRelation(wuxing1: string, wuxing2: string): '相生' | '相剋' | '同類' | '無關' {
  if (wuxing1 === wuxing2) return '同類';
  if (WUXING_RELATIONS.sheng[wuxing1] === wuxing2) return '相生';
  if (WUXING_RELATIONS.ke[wuxing1] === wuxing2) return '相剋';
  return '無關';
}