/**
 * 董公擇日 - 專業計算引擎
 * 實作董公擇日七步操作法的完整算法
 */
import { TwelveBuildsInfo, GodsAndEvilsInfo, SpecialDayInfo, DongGongJudgment, HourlyAnalysis, PersonalizedAnalysis, BirthInfo, DongGongActivity, SevenStepProcess } from '../types/dong-gong';
import { type SpecialDateResult, type SiJueSiLiResult, type ShaRuZhongGongResult, type SanShaResult } from '../data/special-dates-rules';
import { type BaZiInfo, type BodyStrengthAnalysis, type YongShenAnalysis, type PatternAnalysis, type DateCompatibilityAnalysis } from '../data/bazi-analysis-rules';
export declare class DongGongCalculator {
    private lunarService;
    private readonly TWELVE_BUILDS;
    private readonly BUILD_RULES;
    private readonly SPECIAL_DAYS;
    constructor();
    /**
     * 董公擇日七步操作法 - 主要入口
     */
    calculateSevenStepProcess(date: Date, activity: DongGongActivity, birthInfo?: BirthInfo): SevenStepProcess;
    /**
     * 計算十二建星
     */
    calculateTwelveBuilds(date: Date): TwelveBuildsInfo;
    /**
     * 計算神煞配置
     */
    calculateGodsAndEvils(date: Date): GodsAndEvilsInfo;
    /**
     * 計算特殊日期
     */
    calculateSpecialDays(date: Date): SpecialDayInfo;
    /**
     * 計算個人化分析
     */
    calculatePersonalizedAnalysis(date: Date, birthInfo: BirthInfo): PersonalizedAnalysis;
    /**
     * 計算時辰分析
     */
    calculateHourlyAnalysis(date: Date): HourlyAnalysis[];
    /**
     * 計算董公評分
     */
    calculateDongGongScore(analysis: {
        twelveBuilds: TwelveBuildsInfo;
        godsAndEvils: GodsAndEvilsInfo;
        specialDays: SpecialDayInfo;
        wuXingInfo: any;
    }, date?: Date): DongGongJudgment;
    private getMonthBuild;
    private calculateDayBuild;
    private getBuildTraditionalRule;
    private generateAdvancedPersonalRecommendations;
    private generateAdvancedPersonalWarnings;
    private generateWuXingRelationDescription;
    private getDefaultPersonalizedAnalysis;
    private calculateHourGanZhi;
    private calculateHourSuitability;
    private getTimeRange;
    private getBestActivitiesForHour;
    private getAvoidActivitiesForHour;
    private calculateGodsEvilsScore;
    private calculateWuXingScore;
    private calculateSpecialScore;
    private checkChongSha;
    private getScoreLevel;
    private getScoreSummary;
    private generateScoreReasons;
    /**
     * 獲取神煞化解建議
     */
    getEvilResolutionAdvice(date: Date): string[];
    /**
     * 獲取神煞詳細分析
     */
    getGodsEvilsDetailedAnalysis(date: Date): {
        godLevel: string;
        evilLevel: string;
        recommendations: string[];
        warnings: string[];
        resolutions: string[];
    };
    /**
     * 獲取完整的八字分析
     */
    getCompleteBaZiAnalysis(birthInfo: BirthInfo): {
        baZiInfo: BaZiInfo;
        bodyStrength: BodyStrengthAnalysis;
        yongShen: YongShenAnalysis;
        pattern: PatternAnalysis;
    };
    /**
     * 獲取日期與八字的詳細配合分析
     */
    getDateBaZiCompatibility(date: Date, birthInfo: BirthInfo): DateCompatibilityAnalysis;
    /**
     * 獲取完整的特殊日期分析
     */
    getCompleteSpecialDatesAnalysis(date: Date): {
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
    /**
     * 檢查四絕四離日
     */
    checkSiJueSiLiDays(date: Date): SiJueSiLiResult;
    /**
     * 檢查煞入中宮
     */
    checkShaRuZhongGongDay(date: Date): ShaRuZhongGongResult;
    /**
     * 檢查三煞方位
     */
    checkSanShaDirection(date: Date, direction?: string): SanShaResult;
}
//# sourceMappingURL=DongGongCalculator.d.ts.map