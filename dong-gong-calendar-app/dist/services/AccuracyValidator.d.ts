/**
 * 董公擇日 - 計算驗證和準確性保證機制
 * 實作與權威資料源的比對驗證和自動化測試
 */
import { TwelveBuild } from '../types/dong-gong';
/**
 * 驗證結果
 */
export interface ValidationResult {
    testCase: string;
    date: string;
    passed: boolean;
    accuracy: number;
    details: {
        lunarDate: {
            expected: string;
            actual: string;
            match: boolean;
        };
        ganZhi: {
            expected: any;
            actual: any;
            match: boolean;
        };
        build: {
            expected: TwelveBuild;
            actual: TwelveBuild;
            match: boolean;
        };
        zodiac: {
            expected: string;
            actual: string;
            match: boolean;
        };
        evaluation: {
            expected: string;
            actual: string;
            match: boolean;
        };
    };
    errors: string[];
    warnings: string[];
}
/**
 * 信心指數評估
 */
export interface ConfidenceAssessment {
    overall: number;
    components: {
        lunarCalculation: number;
        ganZhiCalculation: number;
        buildCalculation: number;
        godsEvilsCalculation: number;
        specialDatesCalculation: number;
    };
    reliability: 'excellent' | 'good' | 'fair' | 'poor';
    recommendations: string[];
}
/**
 * 計算錯誤記錄
 */
export interface CalculationError {
    timestamp: Date;
    function: string;
    input: any;
    error: Error;
    severity: 'low' | 'medium' | 'high' | 'critical';
    resolved: boolean;
}
/**
 * 準確性驗證器
 */
export declare class AccuracyValidator {
    private calculator;
    private errorLog;
    constructor();
    /**
     * 執行完整的準確性驗證
     */
    runCompleteValidation(): Promise<{
        overallAccuracy: number;
        validationResults: ValidationResult[];
        confidenceAssessment: ConfidenceAssessment;
        errorSummary: {
            totalErrors: number;
            criticalErrors: number;
            resolvedErrors: number;
        };
    }>;
    /**
     * 與權威資料源比對驗證
     */
    validateAgainstAuthority(): Promise<ValidationResult[]>;
    /**
     * 驗證單個測試案例
     */
    private validateSingleCase;
    /**
     * 計算總體準確度
     */
    private calculateOverallAccuracy;
    /**
     * 評估信心指數
     */
    private assessConfidence;
    /**
     * 計算組件信心指數
     */
    private calculateComponentConfidence;
    /**
     * 記錄計算錯誤
     */
    private logError;
    /**
     * 獲取錯誤統計
     */
    private getErrorSummary;
    /**
     * 執行自動化測試
     */
    runAutomatedTests(): Promise<{
        testsPassed: number;
        testsFailed: number;
        coverage: number;
        details: any[];
    }>;
    /**
     * 測試基本計算功能
     */
    private testBasicCalculations;
    /**
     * 測試特殊日期功能
     */
    private testSpecialDates;
    /**
     * 測試神煞功能
     */
    private testGodsEvils;
    /**
     * 測試八字分析功能
     */
    private testBaziAnalysis;
    /**
     * 測試邊界情況
     */
    private testEdgeCases;
    /**
     * 生成準確性報告
     */
    generateAccuracyReport(validationResults: ValidationResult[]): string;
}
//# sourceMappingURL=AccuracyValidator.d.ts.map