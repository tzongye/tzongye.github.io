/**
 * 測試個人八字配合專業系統
 */

const { DongGongCalculator } = require('./dist/services/DongGongCalculator');

const calculator = new DongGongCalculator();

console.log('=== 董公擇日個人八字配合專業系統測試 ===');
console.log('');

// 測試八字資料（示例）
const testBirthInfo = {
  year: 1990,
  month: 5,
  day: 15,
  hour: 14,
  minute: 30,
  isLunar: false,
  timezone: 'Asia/Shanghai'
};

console.log('📊 測試八字資料:');
console.log(`出生日期: ${testBirthInfo.year}年${testBirthInfo.month}月${testBirthInfo.day}日 ${testBirthInfo.hour}:${testBirthInfo.minute}`);
console.log(`曆法: ${testBirthInfo.isLunar ? '農曆' : '公曆'}`);
console.log('');

// 1. 完整八字分析
console.log('🔍 完整八字分析:');
try {
  const baziAnalysis = calculator.getCompleteBaZiAnalysis(testBirthInfo);
  
  console.log('八字四柱:');
  console.log(`  年柱: ${baziAnalysis.baZiInfo.yearPillar}`);
  console.log(`  月柱: ${baziAnalysis.baZiInfo.monthPillar}`);
  console.log(`  日柱: ${baziAnalysis.baZiInfo.dayPillar}`);
  console.log(`  時柱: ${baziAnalysis.baZiInfo.hourPillar}`);
  console.log(`  日主: ${baziAnalysis.baZiInfo.dayMaster}`);
  console.log(`  月令: ${baziAnalysis.baZiInfo.monthlyWuXing}當令`);
  
  console.log('');
  console.log('五行統計:');
  Object.entries(baziAnalysis.baZiInfo.wuXingCount).forEach(([wuxing, count]) => {
    console.log(`  ${wuxing}: ${count}個`);
  });
  
  console.log('');
  console.log('身強身弱分析:');
  console.log(`  身強度: ${baziAnalysis.bodyStrength.strength} (${baziAnalysis.bodyStrength.score}分)`);
  console.log(`  分析: ${baziAnalysis.bodyStrength.analysis}`);
  console.log('  影響因素:');
  baziAnalysis.bodyStrength.factors.forEach(factor => {
    console.log(`    • ${factor}`);
  });
  
  console.log('');
  console.log('用神忌神分析:');
  console.log(`  用神: ${baziAnalysis.yongShen.yongShen.join('、')}`);
  console.log(`  忌神: ${baziAnalysis.yongShen.jiShen.join('、')}`);
  console.log(`  分析: ${baziAnalysis.yongShen.analysis}`);
  console.log(`  策略: ${baziAnalysis.yongShen.strategy}`);
  
  console.log('');
  console.log('格局分析:');
  console.log(`  格局: ${baziAnalysis.pattern.pattern} (${baziAnalysis.pattern.type})`);
  console.log(`  說明: ${baziAnalysis.pattern.description}`);
  console.log('  特點:');
  baziAnalysis.pattern.characteristics.forEach(char => {
    console.log(`    • ${char}`);
  });
  console.log(`  適合五行: ${baziAnalysis.pattern.suitable.join('、')}`);
  console.log(`  避忌五行: ${baziAnalysis.pattern.avoid.join('、')}`);
  
} catch (error) {
  console.error('八字分析錯誤:', error.message);
}

console.log('');

// 2. 日期配合分析
console.log('📅 日期配合分析:');

const testDates = [
  new Date(2025, 0, 15), // 2025年1月15日
  new Date(2025, 1, 14), // 2025年2月14日
  new Date(2025, 2, 15), // 2025年3月15日
  new Date(2030, 7, 1),  // 2030年8月1日
];

testDates.forEach(date => {
  try {
    const compatibility = calculator.getDateBaZiCompatibility(date, testBirthInfo);
    
    console.log(`${date.toLocaleDateString()}:`);
    console.log(`  配合度: ${compatibility.compatibility}分 (${compatibility.level})`);
    console.log(`  日主扶助: ${compatibility.dayMasterSupport.toFixed(1)}分`);
    console.log(`  用神支持: ${compatibility.yongShenSupport.toFixed(1)}分`);
    console.log(`  忌神避免: ${compatibility.jiShenAvoidance.toFixed(1)}分`);
    
    if (compatibility.recommendations.length > 0) {
      console.log('  建議:');
      compatibility.recommendations.slice(0, 2).forEach(rec => {
        console.log(`    • ${rec}`);
      });
    }
    
    if (compatibility.warnings.length > 0) {
      console.log('  警告:');
      compatibility.warnings.slice(0, 2).forEach(warning => {
        console.log(`    • ${warning}`);
      });
    }
    
    console.log('');
  } catch (error) {
    console.log(`${date.toLocaleDateString()}: 分析錯誤 - ${error.message}`);
    console.log('');
  }
});

// 3. 個人化擇日分析
console.log('🎯 個人化擇日分析:');

const testDate = new Date(2025, 0, 15);
try {
  const personalAnalysis = calculator.calculatePersonalizedAnalysis(testDate, testBirthInfo);
  
  console.log(`測試日期: ${testDate.toLocaleDateString()}`);
  console.log(`配合度: ${personalAnalysis.compatibility} (${personalAnalysis.birthCompatibility.toFixed(1)}分)`);
  console.log(`五行關係: ${personalAnalysis.wuXingRelation}`);
  console.log(`個人化評分: ${personalAnalysis.customizedScore.toFixed(1)}分`);
  
  console.log('個人建議:');
  personalAnalysis.personalRecommendations.forEach(rec => {
    console.log(`  • ${rec}`);
  });
  
  if (personalAnalysis.personalWarnings.length > 0) {
    console.log('個人警告:');
    personalAnalysis.personalWarnings.forEach(warning => {
      console.log(`  • ${warning}`);
    });
  }
  
} catch (error) {
  console.error('個人化分析錯誤:', error.message);
}

console.log('');

// 4. 董公七步操作法（含八字配合）
console.log('🎯 董公七步操作法（含八字配合）:');

const { DONG_GONG_ACTIVITIES } = require('./dist/data/dong-gong-activities');
const marriageActivity = DONG_GONG_ACTIVITIES.find(activity => activity.name === '嫁娶');

if (marriageActivity) {
  try {
    const sevenStepProcess = calculator.calculateSevenStepProcess(testDate, marriageActivity, testBirthInfo);
    
    console.log(`事項: ${marriageActivity.name}`);
    console.log(`建星: ${sevenStepProcess.step3_buildAnalysis.name}日`);
    console.log(`神煞: 吉神${sevenStepProcess.step4_godsEvilsCheck.auspiciousGods.length}個，凶煞${sevenStepProcess.step4_godsEvilsCheck.inauspiciousEvils.length}個`);
    console.log(`八字配合: ${sevenStepProcess.step5_personalMatch.compatibility} (${sevenStepProcess.step5_personalMatch.birthCompatibility.toFixed(1)}分)`);
    console.log(`綜合評分: ${sevenStepProcess.step7_comprehensiveJudgment.overall.toFixed(1)}分 (${sevenStepProcess.step7_comprehensiveJudgment.summary})`);
    
    console.log('個人化建議:');
    sevenStepProcess.step5_personalMatch.personalRecommendations.slice(0, 3).forEach(rec => {
      console.log(`  • ${rec}`);
    });
    
  } catch (error) {
    console.error('七步操作法錯誤:', error.message);
  }
}

console.log('');
console.log('✅ 個人八字配合專業系統測試完成！');