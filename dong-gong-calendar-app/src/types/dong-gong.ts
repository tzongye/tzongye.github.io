/**
 * 董公擇日 - 核心類型定義
 * 基於傳統董公擇日規則的完整類型系統
 */

import { LunarDate, GanZhiInfo, WuXingInfo } from './lunar';

// 十二建星類型
export type TwelveBuild = '建' | '除' | '滿' | '平' | '定' | '執' | '破' | '危' | '成' | '收' | '開' | '閉';

// 十二建星資訊
export interface TwelveBuildsInfo {
  name: TwelveBuild;
  meaning: string;           // 建築意義說明
  level: 'auspicious' | 'neutral' | 'inauspicious';
  traditionalRule: string;   // 傳統規則說明
  suitable: string[];        // 適宜事項
  avoid: string[];          // 避忌事項
}

// 神煞類型
export interface God {
  name: string;              // 神煞名稱
  description: string;       // 神煞說明
  effect: string;           // 對運勢的影響
  calculation: string;       // 計算依據
}

export interface Evil extends God {
  severity: 'light' | 'medium' | 'severe';
  warning: string;          // 警告內容
}

// 神煞配置資訊
export interface GodsAndEvilsInfo {
  auspiciousGods: God[];     // 吉神
  inauspiciousEvils: Evil[]; // 凶煞
}

// 特殊日期資訊
export interface SpecialDayInfo {
  isSpecialAuspicious: boolean;    // 是否為特殊吉日 (如定戍日)
  isSpecialInauspicious: boolean;  // 是否為特殊凶日 (如建巳日)
  isFourJue: boolean;              // 是否為四絕日
  isFourLi: boolean;               // 是否為四離日
  isShaInCenter: boolean;          // 是否煞入中宮
  specialNote: string;             // 特殊日期說明
}

// 董公評分系統
export interface DongGongScore {
  overall: number;                 // 總體評分 (0-100)
  breakdown: {
    twelveBuilds: number;          // 十二建星評分
    godsEvils: number;             // 神煞評分
    wuXing: number;                // 五行評分
    special: number;               // 特殊日期評分
  };
  level: 'excellent' | 'good' | 'fair' | 'poor' | 'terrible';
  summary: '大吉' | '吉' | '平' | '凶' | '大凶';
  reasons: string[];               // 評分理由
}

// 董公吉凶判斷系統
export interface DongGongJudgment {
  level: 'excellent' | 'good' | 'fair' | 'poor' | 'terrible';
  summary: '大吉' | '吉' | '平' | '凶' | '大凶';
  reasons: string[];               // 判斷理由
  buildInfluence: string;          // 建星影響
  godsInfluence: string;           // 神煞影響
  specialInfluence: string;        // 特殊日期影響
  overall: number;                 // 總體評分
  breakdown: {
    twelveBuilds: number;          // 十二建星評分
    godsEvils: number;             // 神煞評分
    wuXing: number;                // 五行評分
    special: number;               // 特殊日期評分
  };
}

// 活動適合度
export interface ActivitySuitability {
  activity: string;              // 活動名稱
  suitable: boolean;             // 是否適合
  level: '大吉' | '吉' | '平' | '凶' | '大凶';
  reason: string;                // 適合的理由
  traditionalBasis: string;      // 傳統依據
  buildSupport: boolean;         // 建星是否支持
  godsSupport: boolean;          // 神煞是否支持
  warnings?: string[];           // 警告事項
}

// 時辰分析
export interface HourlyAnalysis {
  hour: string;                  // 子時、丑時等
  timeRange: string;             // 23:00-01:00
  ganZhi: string;                // 時干支
  nature: '吉時' | '平時' | '凶時';  // 時辰性質
  suitability: number;           // 適合度評分 (0-100)
  bestActivities: string[];      // 最適合的活動
  avoidActivities: string[];     // 應避免的活動
  specialNote?: string;          // 特殊說明
}

// 個人化分析
export interface PersonalizedAnalysis {
  compatibility: '合' | '不合' | '一般';  // 與個人八字的配合
  birthCompatibility: number;      // 八字配合度 (0-100)
  personalRecommendations: string[];
  personalWarnings: string[];
  wuXingRelation: string;          // 五行關係說明
  customizedScore: number;         // 個人化評分 (0-100)
}

// 生辰八字資訊
export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  isLunar: boolean;              // 是否為農曆生日
  timezone?: string;             // 時區
}

// 完整的董公擇日分析
export interface CompleteDongGongAnalysis {
  // 基礎日期資訊
  dateInfo: {
    gregorianDate: string;     // 2025-08-01
    lunarDate: string;         // 農曆六月十五
    weekday: string;           // 星期五
  };
  
  // 干支資訊
  ganZhiInfo: GanZhiInfo;
  
  // 十二建星 (董公擇日核心)
  twelveBuilds: TwelveBuildsInfo;
  
  // 五行分析
  wuXingInfo: WuXingInfo;
  
  // 神煞系統 (董公獨有)
  godsAndEvils: GodsAndEvilsInfo;
  
  // 特殊日期標記
  specialDays: SpecialDayInfo;
  
  // 董公吉凶判斷
  dongGongJudgment: DongGongJudgment;
  
  // 宜忌事項 (基於董公規則)
  activities: {
    suitable: ActivitySuitability[];
    unsuitable: ActivitySuitability[];
  };
  
  // 個人化分析 (如有提供生辰八字)
  personalizedAnalysis?: PersonalizedAnalysis;
  
  // 時辰分析 (日吉不如時吉)
  hourlyAnalysis?: HourlyAnalysis[];
}

// 董公擇日事項類型
export interface DongGongActivity {
  id: string;
  name: string;
  traditional: string;        // 傳統農民曆用詞
  description: string;
  category: string;
  buildPreference: TwelveBuild[];  // 偏好的十二建星
  avoidBuilds: TwelveBuild[];      // 避忌的十二建星
  requiredGods?: string[];         // 需要的吉神
  avoidEvils?: string[];           // 避忌的凶煞
  specialRules?: string;           // 特殊規則說明
}

// 董公擇日七步操作法的步驟
export interface SevenStepProcess {
  step1_determineActivity: DongGongActivity;     // 確定事項
  step2_monthBuild: string;                      // 月建判斷
  step3_buildAnalysis: TwelveBuildsInfo;         // 建星分析
  step4_godsEvilsCheck: GodsAndEvilsInfo;        // 神煞檢核
  step5_personalMatch: PersonalizedAnalysis;     // 命理配合
  step6_hourSelection: HourlyAnalysis[];         // 時辰選擇
  step7_comprehensiveJudgment: DongGongJudgment;    // 綜合判斷
}