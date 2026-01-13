/**
 * 測試神煞系統的完整功能
 */

const { DongGongCalculator } = require('./dist/services/DongGongCalculator');

const calculator = new DongGongCalculator();

// 測試日期：2025年1月15日
const testDate = new Date(2025, 0, 15);

console.log('=== 董公擇日神煞系統測試 ===');
console.log(`測試日期: ${testDate.toLocaleDateString()}`);
console.log('');

// 1. 基本神煞計算
console.log('📊 基本神煞計算:');
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

// 2. 神煞詳細分析
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

// 3. 測試不同日期的神煞
console.log('📅 不同日期神煞對比:');
const testDates = [
  new Date(2025, 0, 15), // 1月15日
  new Date(2025, 1, 14), // 2月14日
  new Date(2025, 2, 15), // 3月15日
];

testDates.forEach((date, index) => {
  const analysis = calculator.getGodsEvilsDetailedAnalysis(date);
  console.log(`${date.toLocaleDateString()}: 吉神${analysis.godLevel} 凶煞${analysis.evilLevel}`);
});

console.log('');
console.log('✅ 神煞系統測試完成！');