/**
 * 董公擇日 - 核心類型定義
 * 基於傳統董公擇日規則的完整類型系統
 */
import { GanZhiInfo, WuXingInfo } from './lunar';
export type TwelveBuild = '建' | '除' | '滿' | '平' | '定' | '執' | '破' | '危' | '成' | '收' | '開' | '閉';
export interface TwelveBuildsInfo {
    name: TwelveBuild;
    meaning: string;
    level: 'auspicious' | 'neutral' | 'inauspicious';
    traditionalRule: string;
    suitable: string[];
    avoid: string[];
}
export interface God {
    name: string;
    description: string;
    effect: string;
    calculation: string;
}
export interface Evil extends God {
    severity: 'light' | 'medium' | 'severe';
    warning: string;
}
export interface GodsAndEvilsInfo {
    auspiciousGods: God[];
    inauspiciousEvils: Evil[];
}
export interface SpecialDayInfo {
    isSpecialAuspicious: boolean;
    isSpecialInauspicious: boolean;
    isFourJue: boolean;
    isFourLi: boolean;
    isShaInCenter: boolean;
    specialNote: string;
}
export interface DongGongScore {
    overall: number;
    breakdown: {
        twelveBuilds: number;
        godsEvils: number;
        wuXing: number;
        special: number;
    };
    level: 'excellent' | 'good' | 'fair' | 'poor' | 'terrible';
    summary: '大吉' | '吉' | '平' | '凶' | '大凶';
    reasons: string[];
}
export interface DongGongJudgment {
    level: 'excellent' | 'good' | 'fair' | 'poor' | 'terrible';
    summary: '大吉' | '吉' | '平' | '凶' | '大凶';
    reasons: string[];
    buildInfluence: string;
    godsInfluence: string;
    specialInfluence: string;
    overall: number;
    breakdown: {
        twelveBuilds: number;
        godsEvils: number;
        wuXing: number;
        special: number;
    };
}
export interface ActivitySuitability {
    activity: string;
    suitable: boolean;
    level: '大吉' | '吉' | '平' | '凶' | '大凶';
    reason: string;
    traditionalBasis: string;
    buildSupport: boolean;
    godsSupport: boolean;
    warnings?: string[];
}
export interface HourlyAnalysis {
    hour: string;
    timeRange: string;
    ganZhi: string;
    nature: '吉時' | '平時' | '凶時';
    suitability: number;
    bestActivities: string[];
    avoidActivities: string[];
    specialNote?: string;
}
export interface PersonalizedAnalysis {
    compatibility: '合' | '不合' | '一般';
    birthCompatibility: number;
    personalRecommendations: string[];
    personalWarnings: string[];
    wuXingRelation: string;
    customizedScore: number;
}
export interface BirthInfo {
    year: number;
    month: number;
    day: number;
    hour?: number;
    minute?: number;
    isLunar: boolean;
    timezone?: string;
}
export interface CompleteDongGongAnalysis {
    dateInfo: {
        gregorianDate: string;
        lunarDate: string;
        weekday: string;
    };
    ganZhiInfo: GanZhiInfo;
    twelveBuilds: TwelveBuildsInfo;
    wuXingInfo: WuXingInfo;
    godsAndEvils: GodsAndEvilsInfo;
    specialDays: SpecialDayInfo;
    dongGongJudgment: DongGongJudgment;
    activities: {
        suitable: ActivitySuitability[];
        unsuitable: ActivitySuitability[];
    };
    personalizedAnalysis?: PersonalizedAnalysis;
    hourlyAnalysis?: HourlyAnalysis[];
}
export interface DongGongActivity {
    id: string;
    name: string;
    traditional: string;
    description: string;
    category: string;
    buildPreference: TwelveBuild[];
    avoidBuilds: TwelveBuild[];
    requiredGods?: string[];
    avoidEvils?: string[];
    specialRules?: string;
}
export interface SevenStepProcess {
    step1_determineActivity: DongGongActivity;
    step2_monthBuild: string;
    step3_buildAnalysis: TwelveBuildsInfo;
    step4_godsEvilsCheck: GodsAndEvilsInfo;
    step5_personalMatch: PersonalizedAnalysis;
    step6_hourSelection: HourlyAnalysis[];
    step7_comprehensiveJudgment: DongGongJudgment;
}
//# sourceMappingURL=dong-gong.d.ts.map