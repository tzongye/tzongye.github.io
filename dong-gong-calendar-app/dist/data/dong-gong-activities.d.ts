/**
 * 董公擇日 - 傳統事項資料庫
 * 基於正統董公規則的完整事項清單
 */
import { DongGongActivity, TwelveBuild } from '../types/dong-gong';
export declare const DONG_GONG_ACTIVITIES: DongGongActivity[];
export declare const DONG_GONG_CATEGORIES: {
    人事: {
        name: string;
        description: string;
        activities: string[];
        color: string;
    };
    營建: {
        name: string;
        description: string;
        activities: string[];
        color: string;
    };
    遷移: {
        name: string;
        description: string;
        activities: string[];
        color: string;
    };
    商業: {
        name: string;
        description: string;
        activities: string[];
        color: string;
    };
    祭祀: {
        name: string;
        description: string;
        activities: string[];
        color: string;
    };
    喪葬: {
        name: string;
        description: string;
        activities: string[];
        color: string;
    };
    醫療: {
        name: string;
        description: string;
        activities: string[];
        color: string;
    };
    農事: {
        name: string;
        description: string;
        activities: string[];
        color: string;
    };
};
export declare const MODERN_ACTIVITY_MAPPING: {
    嫁娶: string[];
    納采: string[];
    動土: string[];
    入宅: string[];
    出行: string[];
    開市: string[];
    立券: string[];
    祭祀: string[];
    安葬: string[];
    療病: string[];
};
export declare function getActivityById(id: string): DongGongActivity | undefined;
export declare function getActivitiesByCategory(category: string): DongGongActivity[];
export declare function getAllCategories(): string[];
export declare function getActivitiesByBuild(build: TwelveBuild): DongGongActivity[];
export declare function getAvoidActivitiesByBuild(build: TwelveBuild): DongGongActivity[];
//# sourceMappingURL=dong-gong-activities.d.ts.map