/**
 * 董公擇日 - 神煞計算規則系統
 * 基於傳統董公擇日的完整神煞規則
 */

import { God, Evil } from '../types/dong-gong';
import { GanZhiInfo, LunarDate } from '../types/lunar';

// 天干地支對應表
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 月份對應的天德貴人
const TIAN_DE_MONTHLY: Record<number, string> = {
  1: '丁',   // 正月天德在丁
  2: '申',   // 二月天德在申
  3: '壬',   // 三月天德在壬
  4: '辛',   // 四月天德在辛
  5: '亥',   // 五月天德在亥
  6: '甲',   // 六月天德在甲
  7: '癸',   // 七月天德在癸
  8: '寅',   // 八月天德在寅
  9: '丙',   // 九月天德在丙
  10: '乙',  // 十月天德在乙
  11: '巳',  // 十一月天德在巳
  12: '庚'   // 十二月天德在庚
};

// 月份對應的月德貴人
const YUE_DE_MONTHLY: Record<number, string> = {
  1: '丙',   // 正月月德在丙
  2: '甲',   // 二月月德在甲
  3: '壬',   // 三月月德在壬
  4: '庚',   // 四月月德在庚
  5: '丙',   // 五月月德在丙
  6: '甲',   // 六月月德在甲
  7: '壬',   // 七月月德在壬
  8: '庚',   // 八月月德在庚
  9: '丙',   // 九月月德在丙
  10: '甲',  // 十月月德在甲
  11: '壬',  // 十一月月德在壬
  12: '庚'   // 十二月月德在庚
};

// 年支對應的天喜位置
const TIAN_XI_YEARLY: Record<string, string> = {
  '子': '酉',  // 子年天喜在酉
  '丑': '戌',  // 丑年天喜在戌
  '寅': '亥',  // 寅年天喜在亥
  '卯': '子',  // 卯年天喜在子
  '辰': '丑',  // 辰年天喜在丑
  '巳': '寅',  // 巳年天喜在寅
  '午': '卯',  // 午年天喜在卯
  '未': '辰',  // 未年天喜在辰
  '申': '巳',  // 申年天喜在巳
  '酉': '午',  // 酉年天喜在午
  '戌': '未',  // 戌年天喜在未
  '亥': '申'   // 亥年天喜在申
};

// 年支對應的紅鸞位置
const HONG_LUAN_YEARLY: Record<string, string> = {
  '子': '卯', '丑': '寅', '寅': '丑', '卯': '子',
  '辰': '亥', '巳': '戌', '午': '酉', '未': '申',
  '申': '未', '酉': '午', '戌': '巳', '亥': '辰'
};

// 季節對應的死符位置
const SI_FU_SEASONAL: Record<string, string> = {
  '春': '未',  // 春季死符在未
  '夏': '戌',  // 夏季死符在戌
  '秋': '丑',  // 秋季死符在丑
  '冬': '辰'   // 冬季死符在辰
};

// 日干對應的五鬼
const WU_GUI_DAILY: Record<string, string> = {
  '甲': '己',  // 甲日五鬼在己
  '乙': '庚',  // 乙日五鬼在庚
  '丙': '辛',  // 丙日五鬼在辛
  '丁': '壬',  // 丁日五鬼在壬
  '戊': '癸',  // 戊日五鬼在癸
  '己': '甲',  // 己日五鬼在甲
  '庚': '乙',  // 庚日五鬼在乙
  '辛': '丙',  // 辛日五鬼在丙
  '壬': '丁',  // 壬日五鬼在丁
  '癸': '戊'   // 癸日五鬼在戊
};

// 三吉星計算規則
const SAN_JI_XING_RULES = {
  '煞貢': {
    calculation: 'monthBased',
    rule: '正月在子，二月在丑，三月在寅...',
    effect: '煞貢星照臨，主貴人扶持'
  },
  '直星': {
    calculation: 'dayBased', 
    rule: '甲己日在子，乙庚日在丑...',
    effect: '直星當值，主事業順遂'
  },
  '人專': {
    calculation: 'yearBased',
    rule: '子年在午，丑年在未...',
    effect: '人專星動，主人緣佳'
  }
};

// 貴顯吉星計算規則
const GUI_XIAN_JI_XING_RULES = {
  '黃羅': {
    calculation: 'complex',
    rule: '依據年月日時綜合計算',
    effect: '黃羅星照，主富貴榮華'
  },
  '紫檀': {
    calculation: 'complex', 
    rule: '依據年月日時綜合計算',
    effect: '紫檀星動，主文昌顯達'
  },
  '天皇': {
    calculation: 'yearBased',
    rule: '子年在午，丑年在未...',
    effect: '天皇照臨，主帝王之氣'
  },
  '地皇': {
    calculation: 'monthBased',
    rule: '正月在子，二月在丑...',
    effect: '地皇當值，主土地豐收'
  },
  '金銀庫': {
    calculation: 'dayBased',
    rule: '甲日在辰，乙日在巳...',
    effect: '金銀庫開，主財源廣進'
  },
  '樓庫': {
    calculation: 'complex',
    rule: '依據干支配合計算',
    effect: '樓庫星動，主置業興旺'
  }
};

// 重大凶煞計算規則
const ZHONG_DA_XIONG_SHA_RULES = {
  '白虎入中宮': {
    calculation: 'complex',
    rule: '特定年月日時白虎星入中宮',
    severity: 'severe' as const,
    effect: '白虎入中宮，主血光之災',
    warning: '白虎入中宮，忌動土修造，防意外傷害'
  },
  '金神七煞': {
    calculation: 'dayBased',
    rule: '乙丑、乙未、己巳、己酉、癸巳、癸酉、癸丑日',
    severity: 'severe' as const,
    effect: '金神七煞，主刑傷破敗',
    warning: '金神七煞當頭，諸事不宜'
  },
  '煞入中宮': {
    calculation: 'complex',
    rule: '年月日時煞氣聚集中宮',
    severity: 'severe' as const,
    effect: '煞入中宮，主大凶大險',
    warning: '煞入中宮，百事皆凶，宜避之'
  }
};

// 常見凶煞計算規則
const CHANG_JIAN_XIONG_SHA_RULES = {
  '朱雀': {
    calculation: 'dayBased',
    rule: '丙午、丁未、戊申、己酉日',
    severity: 'medium' as const,
    effect: '朱雀煞星，主口舌是非',
    warning: '朱雀當頭，防口舌官司'
  },
  '勾絞': {
    calculation: 'monthBased',
    rule: '正月在戌亥，二月在子丑...',
    severity: 'medium' as const,
    effect: '勾絞煞星，主糾纏不清',
    warning: '勾絞纏身，諸事不順'
  },
  '螣蛇': {
    calculation: 'dayBased',
    rule: '己巳、己亥、辛巳、辛亥日',
    severity: 'medium' as const,
    effect: '螣蛇煞星，主虛驚怪異',
    warning: '螣蛇作怪，防虛驚詐騙'
  },
  '天賊': {
    calculation: 'yearBased',
    rule: '子年在巳，丑年在午...',
    severity: 'medium' as const,
    effect: '天賊煞星，主盜賊破財',
    warning: '天賊當頭，防盜賊破財'
  },
  '月厭': {
    calculation: 'monthBased',
    rule: '正月在戌，二月在酉...',
    severity: 'light' as const,
    effect: '月厭煞星，主心情煩悶',
    warning: '月厭當頭，心情不佳'
  },
  '往亡': {
    calculation: 'monthBased',
    rule: '正月在戌，二月在酉...',
    severity: 'light' as const,
    effect: '往亡煞星，主出行不利',
    warning: '往亡當頭，不宜遠行'
  }
};

/**
 * 計算天德貴人
 */
export function calculateTianDe(ganZhi: GanZhiInfo, lunarDate: LunarDate): God | null {
  const tianDeGan = TIAN_DE_MONTHLY[lunarDate.month];
  const tianDeZhi = TIAN_DE_MONTHLY[lunarDate.month];
  
  // 檢查日干支是否包含天德
  if (ganZhi.day.includes(tianDeGan) || ganZhi.day.includes(tianDeZhi)) {
    return {
      name: '天德',
      description: '天德貴人照臨',
      effect: '天德照臨，百事吉祥，能化解多數凶煞',
      calculation: `農曆${lunarDate.month}月天德在${tianDeGan}，日干支${ganZhi.day}相合`
    };
  }
  
  return null;
}

/**
 * 計算月德貴人
 */
export function calculateYueDe(ganZhi: GanZhiInfo, lunarDate: LunarDate): God | null {
  const yueDeGan = YUE_DE_MONTHLY[lunarDate.month];
  
  // 檢查日干支是否包含月德
  if (ganZhi.day.includes(yueDeGan)) {
    return {
      name: '月德',
      description: '月德貴人照臨',
      effect: '月德合照，諸事順遂，主貴人相助',
      calculation: `農曆${lunarDate.month}月月德在${yueDeGan}，日干支${ganZhi.day}相合`
    };
  }
  
  return null;
}

/**
 * 計算天喜星
 */
export function calculateTianXi(ganZhi: GanZhiInfo): God | null {
  const yearZhi = ganZhi.year.charAt(1); // 取年支
  const tianXiZhi = TIAN_XI_YEARLY[yearZhi];
  
  // 檢查日支是否為天喜位
  if (ganZhi.day.includes(tianXiZhi)) {
    return {
      name: '天喜',
      description: '天喜星照臨',
      effect: '天喜照臨，喜事連連，特別利於婚姻嫁娶',
      calculation: `${ganZhi.year}年天喜在${tianXiZhi}，日支相合`
    };
  }
  
  return null;
}

/**
 * 計算紅鸞星
 */
export function calculateHongLuan(ganZhi: GanZhiInfo): God | null {
  const yearZhi = ganZhi.year.charAt(1);
  const hongLuanZhi = HONG_LUAN_YEARLY[yearZhi];
  
  if (ganZhi.day.includes(hongLuanZhi)) {
    return {
      name: '紅鸞',
      description: '紅鸞星動',
      effect: '紅鸞星動，主婚姻喜慶，感情美滿',
      calculation: `${ganZhi.year}年紅鸞在${hongLuanZhi}，日支相合`
    };
  }
  
  return null;
}

/**
 * 計算三吉星 - 煞貢星
 */
export function calculateShaGong(ganZhi: GanZhiInfo, lunarDate: LunarDate): God | null {
  // 煞貢星的計算規則（簡化版）
  const shaGongMonthly: Record<number, string> = {
    1: '子', 2: '丑', 3: '寅', 4: '卯', 5: '辰', 6: '巳',
    7: '午', 8: '未', 9: '申', 10: '酉', 11: '戌', 12: '亥'
  };
  
  const shaGongZhi = shaGongMonthly[lunarDate.month];
  
  if (ganZhi.day.includes(shaGongZhi)) {
    return {
      name: '煞貢',
      description: '煞貢星照臨',
      effect: '煞貢星照臨，主貴人扶持，事業順遂',
      calculation: `農曆${lunarDate.month}月煞貢在${shaGongZhi}，日支相合`
    };
  }
  
  return null;
}

/**
 * 計算五鬼煞
 */
export function calculateWuGui(ganZhi: GanZhiInfo): Evil | null {
  const dayGan = ganZhi.day.charAt(0); // 取日干
  const wuGuiGan = WU_GUI_DAILY[dayGan];
  
  // 檢查是否遇到五鬼
  if (ganZhi.day.includes(wuGuiGan)) {
    return {
      name: '五鬼',
      description: '五鬼煞星',
      effect: '主口舌是非，小人作祟',
      calculation: `${dayGan}日五鬼在${wuGuiGan}，日干支相犯`,
      severity: 'severe',
      warning: '五鬼作祟，諸事不宜，特別忌諱重要決策'
    };
  }
  
  return null;
}

/**
 * 計算死符煞
 */
export function calculateSiFu(ganZhi: GanZhiInfo, season: string): Evil | null {
  const siFuZhi = SI_FU_SEASONAL[season];
  
  if (siFuZhi && ganZhi.day.includes(siFuZhi)) {
    return {
      name: '死符',
      description: '死符煞星',
      effect: '主疾病死亡，極為不利',
      calculation: `${season}季死符在${siFuZhi}，日支相犯`,
      severity: 'severe',
      warning: '死符當頭，忌動土安葬，諸事謹慎'
    };
  }
  
  return null;
}

/**
 * 計算歲破煞
 */
export function calculateSuiPo(ganZhi: GanZhiInfo): Evil | null {
  const yearZhi = ganZhi.year.charAt(1);
  
  // 歲破對沖表
  const suiPoMap: Record<string, string> = {
    '子': '午', '丑': '未', '寅': '申', '卯': '酉',
    '辰': '戌', '巳': '亥', '午': '子', '未': '丑',
    '申': '寅', '酉': '卯', '戌': '辰', '亥': '巳'
  };
  
  const suiPoZhi = suiPoMap[yearZhi];
  
  if (ganZhi.day.includes(suiPoZhi)) {
    return {
      name: '歲破',
      description: '歲破大煞',
      effect: '與太歲相沖，主破敗損失',
      calculation: `${ganZhi.year}年太歲在${yearZhi}，沖${suiPoZhi}為歲破`,
      severity: 'severe',
      warning: '歲破大凶，忌修造動土，諸事不利'
    };
  }
  
  return null;
}

/**
 * 計算白虎煞
 */
export function calculateBaiHu(ganZhi: GanZhiInfo): Evil | null {
  // 白虎煞的計算（簡化版）
  const dayZhi = ganZhi.day.charAt(1);
  
  // 特定日支容易遇白虎
  const baiHuDays = ['申', '酉', '戌'];
  
  if (baiHuDays.includes(dayZhi)) {
    return {
      name: '白虎',
      description: '白虎煞星',
      effect: '主刑傷血光，意外災禍',
      calculation: `日支${dayZhi}遇白虎煞`,
      severity: 'medium',
      warning: '白虎當頭，忌動土修造，防意外傷害'
    };
  }
  
  return null;
}

/**
 * 計算金神七煞
 */
export function calculateJinShenQiSha(ganZhi: GanZhiInfo): Evil | null {
  const jinShenDays = ['乙丑', '乙未', '己巳', '己酉', '癸巳', '癸酉', '癸丑'];
  
  if (jinShenDays.includes(ganZhi.day)) {
    return {
      name: '金神七煞',
      description: '金神七煞大凶',
      effect: '主刑傷破敗，極為不利',
      calculation: `日干支${ganZhi.day}為金神七煞之一`,
      severity: 'severe',
      warning: '金神七煞當頭，諸事大凶，宜避之'
    };
  }
  
  return null;
}

/**
 * 計算朱雀煞
 */
export function calculateZhuQue(ganZhi: GanZhiInfo): Evil | null {
  const zhuQueDays = ['丙午', '丁未', '戊申', '己酉'];
  
  if (zhuQueDays.includes(ganZhi.day)) {
    return {
      name: '朱雀',
      description: '朱雀煞星',
      effect: '主口舌是非，官司糾紛',
      calculation: `日干支${ganZhi.day}遇朱雀煞`,
      severity: 'medium',
      warning: '朱雀當頭，防口舌官司，慎言慎行'
    };
  }
  
  return null;
}

/**
 * 綜合計算所有吉神
 */
export function calculateAllAuspiciousGods(
  ganZhi: GanZhiInfo, 
  lunarDate: LunarDate
): God[] {
  const gods: God[] = [];
  
  // 計算各種吉神
  const tianDe = calculateTianDe(ganZhi, lunarDate);
  if (tianDe) gods.push(tianDe);
  
  const yueDe = calculateYueDe(ganZhi, lunarDate);
  if (yueDe) gods.push(yueDe);
  
  const tianXi = calculateTianXi(ganZhi);
  if (tianXi) gods.push(tianXi);
  
  const hongLuan = calculateHongLuan(ganZhi);
  if (hongLuan) gods.push(hongLuan);
  
  const shaGong = calculateShaGong(ganZhi, lunarDate);
  if (shaGong) gods.push(shaGong);
  
  return gods;
}

/**
 * 綜合計算所有凶煞
 */
export function calculateAllInauspiciousEvils(
  ganZhi: GanZhiInfo, 
  lunarDate: LunarDate,
  season: string = '冬'
): Evil[] {
  const evils: Evil[] = [];
  
  // 計算各種凶煞
  const wuGui = calculateWuGui(ganZhi);
  if (wuGui) evils.push(wuGui);
  
  const siFu = calculateSiFu(ganZhi, season);
  if (siFu) evils.push(siFu);
  
  const suiPo = calculateSuiPo(ganZhi);
  if (suiPo) evils.push(suiPo);
  
  const baiHu = calculateBaiHu(ganZhi);
  if (baiHu) evils.push(baiHu);
  
  const jinShenQiSha = calculateJinShenQiSha(ganZhi);
  if (jinShenQiSha) evils.push(jinShenQiSha);
  
  const zhuQue = calculateZhuQue(ganZhi);
  if (zhuQue) evils.push(zhuQue);
  
  return evils;
}

/**
 * 獲取季節
 */
export function getSeason(month: number): string {
  if (month >= 2 && month <= 4) return '春';
  if (month >= 5 && month <= 7) return '夏';
  if (month >= 8 && month <= 10) return '秋';
  return '冬';
}

/**
 * 神煞化解機制
 */
export function getEvilResolutionMethods(evil: Evil): string[] {
  const resolutions: Record<string, string[]> = {
    '五鬼': ['佩戴五帝錢', '擺放葫蘆', '避免重要決策'],
    '死符': ['延後動土', '佩戴護身符', '多行善事'],
    '歲破': ['避免修造', '不宜搬遷', '謹慎投資'],
    '白虎': ['佩戴朱砂', '避免動土', '防意外傷害'],
    '金神七煞': ['延後重要事務', '多行善事', '佩戴護身符'],
    '朱雀': ['謹慎言行', '避免爭執', '多行善事']
  };
  
  return resolutions[evil.name] || ['多行善事', '謹慎行事'];
}

/**
 * 神煞層級判斷
 */
export function getEvilLevel(evils: Evil[]): 'light' | 'medium' | 'severe' | 'extreme' {
  if (evils.length === 0) return 'light';
  
  const severeCount = evils.filter(e => e.severity === 'severe').length;
  const mediumCount = evils.filter(e => e.severity === 'medium').length;
  
  if (severeCount >= 2) return 'extreme';
  if (severeCount >= 1) return 'severe';
  if (mediumCount >= 2) return 'medium';
  return 'light';
}

/**
 * 吉神層級判斷
 */
export function getGodLevel(gods: God[]): 'none' | 'light' | 'medium' | 'strong' | 'excellent' {
  if (gods.length === 0) return 'none';
  if (gods.length === 1) return 'light';
  if (gods.length === 2) return 'medium';
  if (gods.length === 3) return 'strong';
  return 'excellent';
}