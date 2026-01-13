/**
 * 董公擇日 - 個人八字配合專業系統
 * 實作「用日宜擇吉兼參照本命而行」的核心邏輯
 */
import { BirthInfo } from '../types/dong-gong';
/**
 * 八字基本資訊
 */
export interface BaZiInfo {
    yearPillar: string;
    monthPillar: string;
    dayPillar: string;
    hourPillar: string;
    dayMaster: string;
    monthlyWuXing: string;
    wuXingCount: Record<string, number>;
    shiShenAnalysis: Record<string, string[]>;
}
/**
 * 身強身弱判斷結果
 */
export interface BodyStrengthAnalysis {
    strength: 'strong' | 'medium' | 'weak';
    score: number;
    analysis: string;
    factors: string[];
}
/**
 * 用神忌神分析
 */
export interface YongShenAnalysis {
    yongShen: string[];
    jiShen: string[];
    analysis: string;
    strategy: string;
}
/**
 * 格局分析
 */
export interface PatternAnalysis {
    pattern: string;
    type: 'normal' | 'special' | 'follow' | 'transform';
    description: string;
    characteristics: string[];
    suitable: string[];
    avoid: string[];
}
/**
 * 日期配合分析
 */
export interface DateCompatibilityAnalysis {
    compatibility: number;
    level: '極佳' | '良好' | '一般' | '不佳' | '極差';
    dayMasterSupport: number;
    yongShenSupport: number;
    jiShenAvoidance: number;
    recommendations: string[];
    warnings: string[];
}
/**
 * 計算八字基本資訊
 */
export declare function calculateBaZiInfo(birthInfo: BirthInfo): BaZiInfo;
/**
 * 身強身弱判斷
 */
export declare function analyzeBodyStrength(baZiInfo: BaZiInfo): BodyStrengthAnalysis;
/**
 * 用神忌神分析
 */
export declare function analyzeYongShen(baZiInfo: BaZiInfo, bodyStrength: BodyStrengthAnalysis): YongShenAnalysis;
/**
 * 格局分析
 */
export declare function analyzePattern(baZiInfo: BaZiInfo): PatternAnalysis;
/**
 * 日期配合分析
 */
export declare function analyzeDateCompatibility(baZiInfo: BaZiInfo, bodyStrength: BodyStrengthAnalysis, yongShen: YongShenAnalysis, dateGanZhi: any): DateCompatibilityAnalysis;
/**
 * 獲取五行屬性
 */
export declare function getWuXing(ganOrZhi: string): string;
/**
 * 檢查五行關係
 */
export declare function checkWuXingRelation(wuxing1: string, wuxing2: string): '相生' | '相剋' | '同類' | '無關';
//# sourceMappingURL=bazi-analysis-rules.d.ts.map