/**
 * 測試計算驗證和準確性保證機制
 */

const { AccuracyValidator } = require('./dist/services/AccuracyValidator');

async function runAccuracyValidation() {
  console.log('=== 董公擇日計算驗證和準確性保證機制測試 ===');
  console.log('');

  const validator = new AccuracyValidator();

  try {
    // 1. 執行完整的準確性驗證
    console.log('🔍 執行完整的準確性驗證...');
    const completeValidation = await validator.runCompleteValidation();
    
    console.log('📊 驗證結果總覽:');
    console.log(`總體準確度: ${completeValidation.overallAccuracy.toFixed(1)}%`);
    console.log(`信心指數: ${completeValidation.confidenceAssessment.overall}分 (${completeValidation.confidenceAssessment.reliability})`);
    console.log(`錯誤統計: 總計${completeValidation.errorSummary.totalErrors}個，嚴重${completeValidation.errorSummary.criticalErrors}個`);
    console.log('');

    // 2. 詳細驗證結果
    console.log('📋 詳細驗證結果:');
    completeValidation.validationResults.forEach((result, index) => {
      console.log(`測試案例 ${index + 1}: ${result.testCase}`);
      console.log(`  日期: ${result.date}`);
      console.log(`  通過: ${result.passed ? '✅' : '❌'}`);
      console.log(`  準確度: ${result.accuracy.toFixed(1)}%`);
      
      console.log('  詳細對比:');
      console.log(`    農曆: ${result.details.lunarDate.expected} vs ${result.details.lunarDate.actual} ${result.details.lunarDate.match ? '✅' : '❌'}`);
      console.log(`    年干支: ${result.details.ganZhi.expected.year} vs ${result.details.ganZhi.actual.year} ${result.details.ganZhi.expected.year === result.details.ganZhi.actual.year ? '✅' : '❌'}`);
      console.log(`    月干支: ${result.details.ganZhi.expected.month} vs ${result.details.ganZhi.actual.month} ${result.details.ganZhi.expected.month === result.details.ganZhi.actual.month ? '✅' : '❌'}`);
      console.log(`    日干支: ${result.details.ganZhi.expected.day} vs ${result.details.ganZhi.actual.day} ${result.details.ganZhi.expected.day === result.details.ganZhi.actual.day ? '✅' : '❌'}`);
      console.log(`    建星: ${result.details.build.expected} vs ${result.details.build.actual} ${result.details.build.match ? '✅' : '❌'}`);
      console.log(`    生肖: ${result.details.zodiac.expected} vs ${result.details.zodiac.actual} ${result.details.zodiac.match ? '✅' : '❌'}`);
      console.log(`    評語: ${result.details.evaluation.expected} vs ${result.details.evaluation.actual} ${result.details.evaluation.match ? '✅' : '❌'}`);
      
      if (result.errors.length > 0) {
        console.log('  錯誤:');
        result.errors.forEach(error => {
          console.log(`    ❌ ${error}`);
        });
      }
      
      if (result.warnings.length > 0) {
        console.log('  警告:');
        result.warnings.forEach(warning => {
          console.log(`    ⚠️  ${warning}`);
        });
      }
      
      console.log('');
    });

    // 3. 信心指數詳細分析
    console.log('🎯 信心指數詳細分析:');
    console.log(`總體信心指數: ${completeValidation.confidenceAssessment.overall}分`);
    console.log(`可靠性等級: ${completeValidation.confidenceAssessment.reliability}`);
    console.log('各組件信心指數:');
    console.log(`  農曆計算: ${completeValidation.confidenceAssessment.components.lunarCalculation}分`);
    console.log(`  干支計算: ${completeValidation.confidenceAssessment.components.ganZhiCalculation}分`);
    console.log(`  建星計算: ${completeValidation.confidenceAssessment.components.buildCalculation}分`);
    console.log(`  神煞計算: ${completeValidation.confidenceAssessment.components.godsEvilsCalculation}分`);
    console.log(`  特殊日期: ${completeValidation.confidenceAssessment.components.specialDatesCalculation}分`);
    
    if (completeValidation.confidenceAssessment.recommendations.length > 0) {
      console.log('改進建議:');
      completeValidation.confidenceAssessment.recommendations.forEach(rec => {
        console.log(`  💡 ${rec}`);
      });
    }
    console.log('');

    // 4. 執行自動化測試
    console.log('🧪 執行自動化測試...');
    const automatedTests = await validator.runAutomatedTests();
    
    console.log('自動化測試結果:');
    console.log(`  通過: ${automatedTests.testsPassed}個`);
    console.log(`  失敗: ${automatedTests.testsFailed}個`);
    console.log(`  覆蓋率: ${automatedTests.coverage.toFixed(1)}%`);
    
    console.log('測試詳情:');
    automatedTests.details.forEach(test => {
      console.log(`  ${test.testName}: ${test.passed ? '✅' : '❌'}`);
      if (test.error) {
        console.log(`    錯誤: ${test.error}`);
      }
      if (test.details) {
        console.log(`    詳情: ${JSON.stringify(test.details, null, 2).replace(/\\n/g, '\\n    ')}`);
      }
    });
    console.log('');

    // 5. 生成準確性報告
    console.log('📄 生成準確性報告...');
    const report = validator.generateAccuracyReport(completeValidation.validationResults);
    
    // 將報告寫入文件
    const fs = require('fs');
    fs.writeFileSync('accuracy-report.md', report);
    console.log('✅ 準確性報告已生成: accuracy-report.md');
    console.log('');

    // 6. 總結評估
    console.log('🎯 總結評估:');
    
    if (completeValidation.overallAccuracy >= 90) {
      console.log('✅ 計算準確性優秀，系統可靠性高');
    } else if (completeValidation.overallAccuracy >= 80) {
      console.log('✅ 計算準確性良好，系統基本可靠');
    } else if (completeValidation.overallAccuracy >= 70) {
      console.log('⚠️  計算準確性一般，需要改進');
    } else {
      console.log('❌ 計算準確性不足，需要重大改進');
    }
    
    if (automatedTests.coverage >= 90) {
      console.log('✅ 測試覆蓋率優秀');
    } else if (automatedTests.coverage >= 80) {
      console.log('✅ 測試覆蓋率良好');
    } else {
      console.log('⚠️  測試覆蓋率需要提升');
    }
    
    if (completeValidation.confidenceAssessment.reliability === 'excellent') {
      console.log('✅ 系統信心指數優秀，可以投入生產使用');
    } else if (completeValidation.confidenceAssessment.reliability === 'good') {
      console.log('✅ 系統信心指數良好，可以謹慎使用');
    } else {
      console.log('⚠️  系統信心指數需要提升');
    }

  } catch (error) {
    console.error('❌ 驗證過程中發生錯誤:', error.message);
    console.error(error.stack);
  }

  console.log('');
  console.log('✅ 計算驗證和準確性保證機制測試完成！');
}

// 執行測試
runAccuracyValidation().catch(console.error);