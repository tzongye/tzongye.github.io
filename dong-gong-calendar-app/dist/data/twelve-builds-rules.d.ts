/**
 * 董公擇日 - 十二建星專業規則資料庫
 * 基於傳統「建滿平收黑，除危定執黃，成開皆可用，閉破不吉祥」的完整規則
 */
import { TwelveBuild } from '../types/dong-gong';
export interface TwelveBuildRule {
    name: TwelveBuild;
    category: 'auspicious' | 'neutral' | 'inauspicious';
    type: 'yellow_path' | 'black_path' | 'usable' | 'inauspicious';
    meaning: string;
    description: string;
    score: number;
    suitable: string[];
    avoid: string[];
    specialRules: string[];
    relationships: {
        opposite?: TwelveBuild;
        harmonious?: TwelveBuild[];
        conflicting?: TwelveBuild[];
    };
    hourInfluence: {
        best: string[];
        avoid: string[];
    };
    seasonalEffect: {
        spring: 'enhanced' | 'normal' | 'weakened';
        summer: 'enhanced' | 'normal' | 'weakened';
        autumn: 'enhanced' | 'normal' | 'weakened';
        winter: 'enhanced' | 'normal' | 'weakened';
    };
}
export declare const TWELVE_BUILDS_RULES: Record<TwelveBuild, TwelveBuildRule>;
export declare function getBuildsByCategory(category: 'yellow_path' | 'black_path' | 'usable' | 'inauspicious'): TwelveBuild[];
export declare function getYellowPathBuilds(): TwelveBuild[];
export declare function getBlackPathBuilds(): TwelveBuild[];
export declare function getUsableBuilds(): TwelveBuild[];
export declare function getInauspiciousBuilds(): TwelveBuild[];
export declare function getBuildRule(build: TwelveBuild): TwelveBuildRule;
export declare function getSuitableBuildsForActivity(activity: string): TwelveBuild[];
export declare function getUnsuitableBuildsForActivity(activity: string): TwelveBuild[];
export declare const BUILD_FORMULA: {
    yellow_path: string[];
    black_path: string[];
    usable: string[];
    inauspicious: string[];
};
export declare function validateBuildFormula(): boolean;
export declare const TRADITIONAL_VERSES: {
    main: string;
    explanation: {
        黑道: string;
        黃道: string;
        可用: string;
        不吉: string;
    };
};
export declare function getBuildAnalysis(build: TwelveBuild): {
    rule: TwelveBuildRule;
    pathType: string;
    recommendation: string;
};
//# sourceMappingURL=twelve-builds-rules.d.ts.map