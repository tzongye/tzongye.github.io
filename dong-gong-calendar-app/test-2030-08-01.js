/**
 * 測試 2030年8月1日 的董公擇日分析
 */

const { DongGongCalculator } = require('./dist/services/DongGongCalculator');
const { DONG_GONG_ACTIVITIES } = require('./dist/data/dong-gong-activities');

const calculator = new DongGongCalculator();

// 測試日期：2030年8月1日
const testDate = new Date(2030, 7, 1); // 注意：月份從0開始，所以7代表8月

console.log('=== 董公擇日分析：2030年8月1日 ===');
console.log(`測試日期: ${testDate.toLocaleDateString()}`);
console.log('');

// 1. 基本農曆資訊
console.log('📅 基本日期資訊:');
try {
  const solar = require('lunar-javascript').Solar.fromDate(testDate);
  const lunar = solar.getLunar();
  
  console.log(`公曆: ${testDate.getFullYear()}年${testDate.getMonth() + 1}月${testDate.getDate()}日`);
  console.log(`農曆: ${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`);
  console.log(`干支: ${lunar.getYearInGanZhi()} ${lunar.getMonthInGanZhi()} ${lunar.getDayInGanZhi()}`);
  console.log(`生肖: ${lunar.getYearShengXiao()}`);
  console.log(`星期: ${solar.getWeekInChinese()}`);
} catch (error) {
  console.log('農曆資訊計算錯誤:', error.message);
}

console.log('');

// 2. 十二建星分析
console.log('⭐ 十二建星分析:');
const buildsInfo = calculator.calculateTwelveBuilds(testDate);
console.log(`建星: ${buildsInfo.name}日`);
console.log(`意義: ${buildsInfo.meaning}`);
console.log(`吉凶: ${buildsInfo.level}`);
console.log(`傳統規則: ${buildsInfo.traditionalRule}`);
console.log(`適宜: ${buildsInfo.suitable.join('、')}`);
console.log(`避忌: ${buildsInfo.avoid.join('、') || '無特別禁忌'}`);

console.log('');

// 3. 神煞配置分析
console.log('🔮 神煞配置分析:');
const godsAndEvils = calculator.calculateGodsAndEvils(testDate);

console.log(`吉神數量: ${godsAndEvils.auspiciousGods.length}`);
godsAndEvils.auspiciousGods.forEach(god => {
  console.log(`  ✅ ${god.name}: ${god.effect}`);
  console.log(`     計算依據: ${god.calculation}`);
});

console.log(`凶煞數量: ${godsAndEvils.inauspiciousEvils.length}`);
godsAndEvils.inauspiciousEvils.forEach(evil => {
  console.log(`  ❌ ${evil.name} (${evil.severity}): ${evil.warning}`);
  console.log(`     計算依據: ${evil.calculation}`);
});

console.log('');

// 4. 神煞詳細分析
console.log('🔍 神煞詳細分析:');
const detailedAnalysis = calculator.getGodsEvilsDetailedAnalysis(testDate);
console.log(`吉神層級: ${detailedAnalysis.godLevel}`);
console.log(`凶煞層級: ${detailedAnalysis.evilLevel}`);

if (detailedAnalysis.recommendations.length > 0) {
  console.log('💡 吉神建議:');
  detailedAnalysis.recommendations.forEach(rec => {
    console.log(`  • ${rec}`);
  });
}

if (detailedAnalysis.warnings.length > 0) {
  console.log('⚠️  凶煞警告:');
  detailedAnalysis.warnings.forEach(warning => {
    console.log(`  • ${warning}`);
  });
}

if (detailedAnalysis.resolutions.length > 0) {
  console.log('🛡️  化解方法:');
  detailedAnalysis.resolutions.forEach(resolution => {
    console.log(`  • ${resolution}`);
  });
}

console.log('');

// 5. 特殊日期檢查
console.log('🌟 特殊日期檢查:');
const specialDays = calculator.calculateSpecialDays(testDate);
console.log(`特殊吉日: ${specialDays.isSpecialAuspicious ? '是' : '否'}`);
console.log(`特殊凶日: ${specialDays.isSpecialInauspicious ? '是' : '否'}`);
console.log(`四絕日: ${specialDays.isFourJue ? '是' : '否'}`);
console.log(`四離日: ${specialDays.isFourLi ? '是' : '否'}`);
console.log(`煞入中宮: ${specialDays.isShaInCenter ? '是' : '否'}`);
console.log(`特殊說明: ${specialDays.specialNote}`);

console.log('');

// 6. 綜合評分
console.log('📊 綜合評分:');
const score = calculator.calculateDongGongScore({
  twelveBuilds: buildsInfo,
  godsAndEvils: godsAndEvils,
  specialDays: specialDays,
  wuXingInfo: { elementStrength: 'medium' }
});

console.log(`總體評分: ${score.overall.toFixed(1)}分`);
console.log(`吉凶等級: ${score.level}`);
console.log(`董公評語: ${score.summary}`);

console.log('📈 評分細項:');
console.log(`  十二建星: ${score.breakdown.twelveBuilds}分`);
console.log(`  神煞配置: ${score.breakdown.godsEvils}分`);
console.log(`  五行分析: ${score.breakdown.wuXing}分`);
console.log(`  特殊日期: ${score.breakdown.special}分`);

console.log('📝 評分理由:');
score.reasons.forEach(reason => {
  console.log(`  • ${reason}`);
});

console.log('');

// 7. 時辰分析
console.log('⏰ 時辰分析:');
const hourlyAnalysis = calculator.calculateHourlyAnalysis(testDate);

console.log('各時辰適合度:');
hourlyAnalysis.forEach(hour => {
  const suitabilityLevel = hour.suitability >= 80 ? '優' :
                          hour.suitability >= 60 ? '良' :
                          hour.suitability >= 40 ? '可' : '差';
  console.log(`  ${hour.hour}時 (${hour.timeRange}): ${hour.suitability.toFixed(1)}分 [${suitabilityLevel}] ${hour.nature}`);
});

// 找出最佳時辰
const bestHour = hourlyAnalysis.reduce((best, current) =>
  current.suitability > best.suitability ? current : best
);
console.log(`🏆 最佳時辰: ${bestHour.hour}時 (${bestHour.timeRange}) - ${bestHour.suitability.toFixed(1)}分`);

console.log('');

// 8. 董公七步操作法完整分析（以嫁娶為例）
console.log('🎯 董公七步操作法分析 (以嫁娶為例):');
const marriageActivity = DONG_GONG_ACTIVITIES.find(activity => activity.name === '嫁娶');

if (marriageActivity) {
  const sevenStepProcess = calculator.calculateSevenStepProcess(testDate, marriageActivity);
  
  console.log('步驟1 - 確定事項: 嫁娶');
  console.log(`步驟2 - 月建判斷: ${sevenStepProcess.step2_monthBuild}`);
  console.log(`步驟3 - 建星分析: ${sevenStepProcess.step3_buildAnalysis.name}日 (${sevenStepProcess.step3_buildAnalysis.level})`);
  console.log(`步驟4 - 神煞檢核: 吉神${sevenStepProcess.step4_godsEvilsCheck.auspiciousGods.length}個，凶煞${sevenStepProcess.step4_godsEvilsCheck.inauspiciousEvils.length}個`);
  console.log(`步驟5 - 命理配合: ${sevenStepProcess.step5_personalMatch.compatibility} (${sevenStepProcess.step5_personalMatch.birthCompatibility.toFixed(1)}%)`);
  console.log(`步驟6 - 時辰選擇: 最佳${bestHour.hour}時`);
  console.log(`步驟7 - 綜合判斷: ${sevenStepProcess.step7_comprehensiveJudgment.summary} (${sevenStepProcess.step7_comprehensiveJudgment.overall.toFixed(1)}分)`);
}

console.log('');

// 9. 最終建議
console.log('🎯 最終建議:');
if (score.overall >= 70) {
  console.log('✅ 此日為吉日，適合進行重要事務');
  console.log(`✅ 建議在${bestHour.hour}時進行，效果最佳`);
} else if (score.overall >= 50) {
  console.log('⚠️  此日為平日，可進行一般事務，但需謹慎');
  console.log(`⚠️  建議在${bestHour.hour}時進行，並注意化解凶煞`);
} else {
  console.log('❌ 此日不宜進行重要事務，建議另擇吉日');
  if (detailedAnalysis.resolutions.length > 0) {
    console.log('❌ 如必須進行，請採取化解措施');
  }
}

console.log('');
console.log('✅ 2030年8月1日董公擇日分析完成！');