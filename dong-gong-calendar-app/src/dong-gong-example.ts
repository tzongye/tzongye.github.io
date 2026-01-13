/**
 * 董公擇日計算引擎使用示例
 * 展示董公擇日七步操作法的完整流程
 */

import { DongGongCalculator } from './services/DongGongCalculator';
import { getActivityById } from './data/dong-gong-activities';
import { BirthInfo } from './types/dong-gong';

const calculator = new DongGongCalculator();

// 測試日期：2025年1月15日
const testDate = new Date(2025, 0, 15);

// 測試活動：嫁娶
const activity = getActivityById('marry');

// 測試生辰八字
const birthInfo: BirthInfo = {
  year: 1990,
  month: 8,
  day: 15,
  hour: 10,
  minute: 30,
  isLunar: false,
  timezone: 'Asia/Taipei'
};

console.log('=== 董公擇日七步操作法示例 ===');
console.log(`測試日期: ${testDate.toLocaleDateString()}`);
console.log(`測試事項: ${activity?.name} (${activity?.description})`);

if (!activity) {
  console.error('❌ 測試活動不存在');
  process.exit(1);
}

try {
  // 執行董公擇日七步操作法
  const sevenStepProcess = calculator.calculateSevenStepProcess(testDate, activity, birthInfo);
  
  console.log('\n📋 董公擇日七步操作法分析結果:');
  
  // 步驟1：確定事項
  console.log('\n🎯 步驟1：確定事項');
  console.log(`事項: ${sevenStepProcess.step1_determineActivity.name}`);
  console.log(`分類: ${sevenStepProcess.step1_determineActivity.category}`);
  console.log(`偏好建星: ${sevenStepProcess.step1_determineActivity.buildPreference.join('、')}`);
  console.log(`避忌建星: ${sevenStepProcess.step1_determineActivity.avoidBuilds.join('、')}`);
  
  // 步驟2：月建判斷
  console.log('\n🌙 步驟2：月建判斷');
  console.log(`月建: ${sevenStepProcess.step2_monthBuild}`);
  
  // 步驟3：建星分析
  console.log('\n⭐ 步驟3：建星分析');
  console.log(`建星: ${sevenStepProcess.step3_buildAnalysis.name}日`);
  console.log(`意義: ${sevenStepProcess.step3_buildAnalysis.meaning}`);
  console.log(`吉凶: ${sevenStepProcess.step3_buildAnalysis.level}`);
  console.log(`傳統規則: ${sevenStepProcess.step3_buildAnalysis.traditionalRule}`);
  console.log(`適宜: ${sevenStepProcess.step3_buildAnalysis.suitable.join('、')}`);
  console.log(`避忌: ${sevenStepProcess.step3_buildAnalysis.avoid.join('、')}`);
  
  // 步驟4：神煞檢核
  console.log('\n🔮 步驟4：神煞檢核');
  console.log(`吉神數量: ${sevenStepProcess.step4_godsEvilsCheck.auspiciousGods.length}`);
  sevenStepProcess.step4_godsEvilsCheck.auspiciousGods.forEach(god => {
    console.log(`  ✅ ${god.name}: ${god.effect}`);
  });
  
  console.log(`凶煞數量: ${sevenStepProcess.step4_godsEvilsCheck.inauspiciousEvils.length}`);
  sevenStepProcess.step4_godsEvilsCheck.inauspiciousEvils.forEach(evil => {
    console.log(`  ❌ ${evil.name} (${evil.severity}): ${evil.warning}`);
  });
  
  // 步驟5：命理配合
  console.log('\n🧘 步驟5：命理配合');
  console.log(`八字配合度: ${sevenStepProcess.step5_personalMatch.birthCompatibility.toFixed(1)}%`);
  console.log(`個人化評分: ${sevenStepProcess.step5_personalMatch.customizedScore.toFixed(1)}`);
  console.log('個人建議:');
  sevenStepProcess.step5_personalMatch.personalRecommendations.forEach(rec => {
    console.log(`  💡 ${rec}`);
  });
  if (sevenStepProcess.step5_personalMatch.personalWarnings.length > 0) {
    console.log('個人警告:');
    sevenStepProcess.step5_personalMatch.personalWarnings.forEach(warning => {
      console.log(`  ⚠️  ${warning}`);
    });
  }
  
  // 步驟6：時辰選擇
  console.log('\n⏰ 步驟6：時辰選擇');
  console.log('各時辰適合度:');
  sevenStepProcess.step6_hourSelection.forEach(hour => {
    const suitabilityLevel = hour.suitability >= 80 ? '優' : 
                           hour.suitability >= 60 ? '良' : 
                           hour.suitability >= 40 ? '可' : '差';
    console.log(`  ${hour.hour}時 (${hour.timeRange}): ${hour.suitability.toFixed(1)}分 [${suitabilityLevel}]`);
  });
  
  // 找出最佳時辰
  const bestHour = sevenStepProcess.step6_hourSelection.reduce((best, current) => 
    current.suitability > best.suitability ? current : best
  );
  console.log(`🏆 最佳時辰: ${bestHour.hour}時 (${bestHour.timeRange}) - ${bestHour.suitability.toFixed(1)}分`);
  
  // 步驟7：綜合判斷
  console.log('\n📊 步驟7：綜合判斷');
  console.log(`總體評分: ${sevenStepProcess.step7_comprehensiveJudgment.overall.toFixed(1)}分`);
  console.log(`吉凶等級: ${sevenStepProcess.step7_comprehensiveJudgment.level}`);
  console.log(`董公評語: ${sevenStepProcess.step7_comprehensiveJudgment.summary}`);
  
  console.log('\n📈 評分細項:');
  console.log(`  十二建星: ${sevenStepProcess.step7_comprehensiveJudgment.breakdown.twelveBuilds}分`);
  console.log(`  神煞配置: ${sevenStepProcess.step7_comprehensiveJudgment.breakdown.godsEvils}分`);
  console.log(`  五行分析: ${sevenStepProcess.step7_comprehensiveJudgment.breakdown.wuXing}分`);
  console.log(`  特殊日期: ${sevenStepProcess.step7_comprehensiveJudgment.breakdown.special}分`);
  
  console.log('\n📝 評分理由:');
  sevenStepProcess.step7_comprehensiveJudgment.reasons.forEach(reason => {
    console.log(`  • ${reason}`);
  });
  
  // 最終建議
  console.log('\n🎯 最終建議:');
  if (sevenStepProcess.step7_comprehensiveJudgment.overall >= 70) {
    console.log(`✅ 此日適合${activity.name}，建議在${bestHour.hour}時進行`);
  } else if (sevenStepProcess.step7_comprehensiveJudgment.overall >= 50) {
    console.log(`⚠️  此日進行${activity.name}需謹慎，建議選擇更好的日期`);
  } else {
    console.log(`❌ 此日不宜${activity.name}，強烈建議另擇吉日`);
  }
  
  console.log('\n✅ 董公擇日七步操作法分析完成！');
  
} catch (error) {
  console.error('❌ 董公擇日計算錯誤:', error);
}