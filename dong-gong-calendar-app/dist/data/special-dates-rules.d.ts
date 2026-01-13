/**
 * 董公擇日 - 特殊日期識別系統
 * 包含四絕四離、特殊大吉日、特殊大凶日、煞入中宮等專業識別
 */
import { TwelveBuild } from '../types/dong-gong';
/**
 * 特殊日期識別結果
 */
export interface SpecialDateResult {
    isSpecial: boolean;
    type: 'auspicious' | 'inauspicious' | 'neutral';
    name: string;
    description: string;
    severity?: 'light' | 'medium' | 'severe' | 'extreme';
    level?: 'good' | 'excellent';
    recommendations: string[];
    warnings: string[];
}
/**
 * 四絕四離日識別結果
 */
export interface SiJueSiLiResult {
    isSiJue: boolean;
    isSiLi: boolean;
    solarTerm?: string;
    description: string;
    warnings: string[];
}
/**
 * 煞入中宮識別結果
 */
export interface ShaRuZhongGongResult {
    isShaRuZhongGong: boolean;
    description: string;
    severity: 'extreme';
    warnings: string[];
    resolutions: string[];
}
/**
 * 三煞方位識別結果
 */
export interface SanShaResult {
    season: string;
    direction: string;
    branches: string[];
    description: string;
    isAffected: boolean;
    warnings: string[];
}
/**
 * 檢查四絕四離日
 */
export declare function checkSiJueSiLi(date: Date): SiJueSiLiResult;
/**
 * 檢查特殊大凶日
 */
export declare function checkSpecialInauspiciousDay(build: TwelveBuild, dayBranch: string): SpecialDateResult;
/**
 * 檢查特殊大吉日
 */
export declare function checkSpecialAuspiciousDay(build: TwelveBuild, dayBranch: string): SpecialDateResult;
/**
 * 檢查煞入中宮
 */
export declare function checkShaRuZhongGong(date: Date): ShaRuZhongGongResult;
/**
 * 檢查三煞方位
 */
export declare function checkSanSha(date: Date, direction?: string): SanShaResult;
/**
 * 綜合特殊日期檢查
 */
export declare function checkAllSpecialDates(date: Date, build: TwelveBuild): {
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
};
//# sourceMappingURL=special-dates-rules.d.ts.map