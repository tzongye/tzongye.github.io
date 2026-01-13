/**
 * 測試特殊日期識別系統
 */

const { DongGongCalculator } = require('./dist/services/DongGongCalculator');

const calculator = new DongGongCalculator();

console.log('=== 董公擇日特殊日期識別系統測試 ===');
console.log('');

// 測試日期列表
const testDates = [
  { date: new Date(2025, 1, 3), desc: '2025年2月3日 (立春前一日，可能是四絕日)' },
  { date: new Date(2025, 1, 4), desc: '2025年2月4日 (立春當日，可能是四離日)' },
  { date: new Date(2025, 4, 5), desc: '2025年5月5日 (立夏前一日)' },
  { date: new Date(2025, 4, 6), desc: '2025年5月6日 (立夏當日)' },
  { date: new Date(2025, 0, 15), desc: '2025年1月15日 (危申日)' },
  { date: new Date(2030, 7, 1), desc: '2030年8月1日 (收辰日)' },
  { date: new Date(2025, 2, 15), desc: '2025年3月15日 (一般日期)' },
];

testDates.forEach(({ date, desc }) => {
  console.log(`📅 ${desc}`);
  console.log(`測試日期: ${date.toLocaleDateString()}`);
  
  try {
    // 1. 完整特殊日期分析
    const specialAnalysis = calculator.getCompleteSpecialDatesAnalysis(date);
    
    console.log('🔍 完整特殊日期分析:');
    console.log(`總體評估: ${specialAnalysis.overallAssessment.summary} (${specialAnalysis.overallAssessment.type})`);
    
    // 2. 四絕四離日檢查
    if (specialAnalysis.siJueSiLi.isSiJue || specialAnalysis.siJueSiLi.isSiLi) {
      console.log('📊 四絕四離日:');
      console.log(`  四絕日: ${specialAnalysis.siJueSiLi.isSiJue ? '是' : '否'}`);
      console.log(`  四離日: ${specialAnalysis.siJueSiLi.isSiLi ? '是' : '否'}`);
      if (specialAnalysis.siJueSiLi.solarTerm) {
        console.log(`  相關節氣: ${specialAnalysis.siJueSiLi.solarTerm}`);
      }
      console.log(`  說明: ${specialAnalysis.siJueSiLi.description}`);
      if (specialAnalysis.siJueSiLi.warnings.length > 0) {
        console.log('  警告:');
        specialAnalysis.siJueSiLi.warnings.forEach(warning => {
          console.log(`    • ${warning}`);
        });
      }
    }
    
    // 3. 特殊大凶日檢查
    if (specialAnalysis.specialInauspicious.isSpecial) {
      console.log('⚠️  特殊大凶日:');
      console.log(`  名稱: ${specialAnalysis.specialInauspicious.name}`);
      console.log(`  嚴重程度: ${specialAnalysis.specialInauspicious.severity}`);
      console.log(`  說明: ${specialAnalysis.specialInauspicious.description}`);
      if (specialAnalysis.specialInauspicious.warnings.length > 0) {
        console.log('  警告:');
        specialAnalysis.specialInauspicious.warnings.forEach(warning => {
          console.log(`    • ${warning}`);
        });
      }
    }
    
    // 4. 特殊大吉日檢查
    if (specialAnalysis.specialAuspicious.isSpecial) {
      console.log('✅ 特殊大吉日:');
      console.log(`  名稱: ${specialAnalysis.specialAuspicious.name}`);
      console.log(`  吉利程度: ${specialAnalysis.specialAuspicious.level}`);
      console.log(`  說明: ${specialAnalysis.specialAuspicious.description}`);
      if (specialAnalysis.specialAuspicious.recommendations.length > 0) {
        console.log('  建議:');
        specialAnalysis.specialAuspicious.recommendations.forEach(rec => {
          console.log(`    • ${rec}`);
        });
      }
    }
    
    // 5. 煞入中宮檢查
    if (specialAnalysis.shaRuZhongGong.isShaRuZhongGong) {
      console.log('🚨 煞入中宮:');
      console.log(`  說明: ${specialAnalysis.shaRuZhongGong.description}`);
      console.log('  警告:');
      specialAnalysis.shaRuZhongGong.warnings.forEach(warning => {
        console.log(`    • ${warning}`);
      });
      console.log('  化解方法:');
      specialAnalysis.shaRuZhongGong.resolutions.forEach(resolution => {
        console.log(`    • ${resolution}`);
      });
    }
    
    // 6. 三煞方位檢查
    console.log('🧭 三煞方位:');
    console.log(`  季節: ${specialAnalysis.sanSha.season}`);
    console.log(`  三煞方位: ${specialAnalysis.sanSha.direction}`);
    console.log(`  影響地支: ${specialAnalysis.sanSha.branches.join('、')}`);
    console.log(`  是否受影響: ${specialAnalysis.sanSha.isAffected ? '是' : '否'}`);
    if (specialAnalysis.sanSha.warnings.length > 0) {
      console.log('  警告:');
      specialAnalysis.sanSha.warnings.forEach(warning => {
        console.log(`    • ${warning}`);
      });
    }
    
    // 7. 綜合建議和警告
    if (specialAnalysis.overallAssessment.recommendations.length > 0) {
      console.log('💡 綜合建議:');
      specialAnalysis.overallAssessment.recommendations.forEach(rec => {
        console.log(`  • ${rec}`);
      });
    }
    
    if (specialAnalysis.overallAssessment.warnings.length > 0) {
      console.log('⚠️  綜合警告:');
      specialAnalysis.overallAssessment.warnings.forEach(warning => {
        console.log(`  • ${warning}`);
      });
    }
    
  } catch (error) {
    console.error(`❌ 分析錯誤: ${error.message}`);
  }
  
  console.log('');
  console.log('─'.repeat(60));
  console.log('');
});

// 特殊測試：檢查已知的特殊日期
console.log('🎯 特殊日期專項測試:');
console.log('');

// 測試建巳日（特殊大凶日）
console.log('1. 測試建巳日（特殊大凶日）:');
// 需要找到一個建星為"建"且日支為"巳"的日期
const testDates2 = [
  new Date(2025, 0, 10),
  new Date(2025, 0, 20),
  new Date(2025, 1, 10),
  new Date(2025, 1, 20),
];

testDates2.forEach(date => {
  try {
    const builds = calculator.calculateTwelveBuilds(date);
    const solar = require('lunar-javascript').Solar.fromDate(date);
    const lunar = solar.getLunar();
    const dayBranch = lunar.getDayInGanZhi().charAt(1);
    
    if (builds.name === '建' && dayBranch === '巳') {
      console.log(`找到建巳日: ${date.toLocaleDateString()}`);
      const specialAnalysis = calculator.getCompleteSpecialDatesAnalysis(date);
      console.log(`評估: ${specialAnalysis.overallAssessment.summary}`);
      console.log(`類型: ${specialAnalysis.overallAssessment.type}`);
    }
  } catch (error) {
    // 忽略錯誤，繼續測試
  }
});

console.log('');

// 測試定戌日（特殊大吉日）
console.log('2. 測試定戌日（特殊大吉日）:');
testDates2.forEach(date => {
  try {
    const builds = calculator.calculateTwelveBuilds(date);
    const solar = require('lunar-javascript').Solar.fromDate(date);
    const lunar = solar.getLunar();
    const dayBranch = lunar.getDayInGanZhi().charAt(1);
    
    if (builds.name === '定' && dayBranch === '戌') {
      console.log(`找到定戌日: ${date.toLocaleDateString()}`);
      const specialAnalysis = calculator.getCompleteSpecialDatesAnalysis(date);
      console.log(`評估: ${specialAnalysis.overallAssessment.summary}`);
      console.log(`類型: ${specialAnalysis.overallAssessment.type}`);
    }
  } catch (error) {
    // 忽略錯誤，繼續測試
  }
});

console.log('');

// 測試董公七步操作法中的特殊日期影響
console.log('🎯 董公七步操作法中的特殊日期影響:');

const { DONG_GONG_ACTIVITIES } = require('./dist/data/dong-gong-activities');
const marriageActivity = DONG_GONG_ACTIVITIES.find(activity => activity.name === '嫁娶');

if (marriageActivity) {
  const testDate = new Date(2025, 1, 3); // 可能的四絕日
  
  try {
    const sevenStepProcess = calculator.calculateSevenStepProcess(testDate, marriageActivity);
    const specialAnalysis = calculator.getCompleteSpecialDatesAnalysis(testDate);
    
    console.log(`測試日期: ${testDate.toLocaleDateString()}`);
    console.log(`事項: ${marriageActivity.name}`);
    console.log(`建星: ${sevenStepProcess.step3_buildAnalysis.name}日`);
    console.log(`特殊日期: ${specialAnalysis.overallAssessment.summary}`);
    console.log(`綜合評分: ${sevenStepProcess.step7_comprehensiveJudgment.overall.toFixed(1)}分 (${sevenStepProcess.step7_comprehensiveJudgment.summary})`);
    
    if (specialAnalysis.overallAssessment.warnings.length > 0) {
      console.log('特殊日期警告:');
      specialAnalysis.overallAssessment.warnings.slice(0, 2).forEach(warning => {
        console.log(`  • ${warning}`);
      });
    }
    
  } catch (error) {
    console.error(`七步操作法測試錯誤: ${error.message}`);
  }
}

console.log('');
console.log('✅ 特殊日期識別系統測試完成！');