/**
 * 董公擇日 - 神煞計算規則系統
 * 基於傳統董公擇日的完整神煞規則
 */
import { God, Evil } from '../types/dong-gong';
import { GanZhiInfo, LunarDate } from '../types/lunar';
/**
 * 計算天德貴人
 */
export declare function calculateTianDe(ganZhi: GanZhiInfo, lunarDate: LunarDate): God | null;
/**
 * 計算月德貴人
 */
export declare function calculateYueDe(ganZhi: GanZhiInfo, lunarDate: LunarDate): God | null;
/**
 * 計算天喜星
 */
export declare function calculateTianXi(ganZhi: GanZhiInfo): God | null;
/**
 * 計算紅鸞星
 */
export declare function calculateHongLuan(ganZhi: GanZhiInfo): God | null;
/**
 * 計算三吉星 - 煞貢星
 */
export declare function calculateShaGong(ganZhi: GanZhiInfo, lunarDate: LunarDate): God | null;
/**
 * 計算五鬼煞
 */
export declare function calculateWuGui(ganZhi: GanZhiInfo): Evil | null;
/**
 * 計算死符煞
 */
export declare function calculateSiFu(ganZhi: GanZhiInfo, season: string): Evil | null;
/**
 * 計算歲破煞
 */
export declare function calculateSuiPo(ganZhi: GanZhiInfo): Evil | null;
/**
 * 計算白虎煞
 */
export declare function calculateBaiHu(ganZhi: GanZhiInfo): Evil | null;
/**
 * 計算金神七煞
 */
export declare function calculateJinShenQiSha(ganZhi: GanZhiInfo): Evil | null;
/**
 * 計算朱雀煞
 */
export declare function calculateZhuQue(ganZhi: GanZhiInfo): Evil | null;
/**
 * 綜合計算所有吉神
 */
export declare function calculateAllAuspiciousGods(ganZhi: GanZhiInfo, lunarDate: LunarDate): God[];
/**
 * 綜合計算所有凶煞
 */
export declare function calculateAllInauspiciousEvils(ganZhi: GanZhiInfo, lunarDate: LunarDate, season?: string): Evil[];
/**
 * 獲取季節
 */
export declare function getSeason(month: number): string;
/**
 * 神煞化解機制
 */
export declare function getEvilResolutionMethods(evil: Evil): string[];
/**
 * 神煞層級判斷
 */
export declare function getEvilLevel(evils: Evil[]): 'light' | 'medium' | 'severe' | 'extreme';
/**
 * 吉神層級判斷
 */
export declare function getGodLevel(gods: God[]): 'none' | 'light' | 'medium' | 'strong' | 'excellent';
//# sourceMappingURL=gods-evils-rules.d.ts.map