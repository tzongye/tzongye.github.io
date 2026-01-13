/**
 * 全面測試神煞系統 - 包括各種神煞類型
 */

const { DongGongCalculator } = require('./dist/services/DongGongCalculator');

const calculator = new DongGongCalculator();

console.log('=== 董公擇日神煞系統全面測試 ===');
console.log('');

// 測試一整年的神煞分佈
console.log('📊 2025年神煞分佈統計:');

const godStats = {};
const evilStats = {};
let totalGods = 0;
let totalEvils = 0;

// 測試2025年每個月的15日
for (let month = 0; month < 12; month++) {
  const testDate = new Date(2025, month, 15);
  const godsAndEvils = calculator.calculateGodsAndEvils(testDate);
  
  // 統計吉神
  godsAndEvils.auspiciousGods.forEach(god => {
    godStats[god.name] = (godStats[god.name] || 0) + 1;
    totalGods++;
  });
  
  // 統計凶煞
  godsAndEvils.inauspiciousEvils.forEach(evil => {
    evilStats[evil.name] = (evilStats[evil.name] || 0) + 1;
    totalEvils++;
  });
}

console.log('🌟 吉神出現統計:');
Object.entries(godStats)
  .sort(([,a], [,b]) => b - a)
  .forEach(([name, count]) => {
    console.log(`  ${name}: ${count}次`);
  });

console.log('');
console.log('👹 凶煞出現統計:');
Object.entries(evilStats)
  .sort(([,a], [,b]) => b - a)
  .forEach(([name, count]) => {
    console.log(`  ${name}: ${count}次`);
  });

console.log('');
console.log(`📈 總計: 吉神${totalGods}次，凶煞${totalEvils}次`);

console.log('');

// 測試特定的神煞組合
console.log('🔍 特定神煞組合測試:');

const specialDates = [
  { date: new Date(2025, 0, 1), desc: '元旦' },
  { date: new Date(2025, 1, 10), desc: '春節期間' },
  { date: new Date(2025, 3, 5), desc: '清明期間' },
  { date: new Date(2025, 4, 1), desc: '勞動節' },
  { date: new Date(2025, 7, 15), desc: '中元節' },
  { date: new Date(2025, 8, 15), desc: '中秋節' },
  { date: new Date(2025, 9, 1), desc: '國慶節' },
];

specialDates.forEach(({ date, desc }) => {
  const analysis = calculator.getGodsEvilsDetailedAnalysis(date);
  const godsAndEvils = calculator.calculateGodsAndEvils(date);
  
  console.log(`${desc} (${date.toLocaleDateString()}):`);
  console.log(`  吉神: ${godsAndEvils.auspiciousGods.map(g => g.name).join('、') || '無'}`);
  console.log(`  凶煞: ${godsAndEvils.inauspiciousEvils.map(e => e.name).join('、') || '無'}`);
  console.log(`  層級: 吉神${analysis.godLevel} 凶煞${analysis.evilLevel}`);
  
  if (analysis.resolutions.length > 0) {
    console.log(`  化解: ${analysis.resolutions[0]}`);
  }
  console.log('');
});

// 測試神煞對建星的影響
console.log('⚖️  神煞與建星配合測試:');

const buildTestDates = [
  new Date(2025, 0, 15), // 危日
  new Date(2025, 0, 16), // 成日
  new Date(2025, 0, 17), // 收日
];

buildTestDates.forEach(date => {
  const builds = calculator.calculateTwelveBuilds(date);
  const godsAndEvils = calculator.calculateGodsAndEvils(date);
  const score = calculator.calculateDongGongScore({
    twelveBuilds: builds,
    godsAndEvils: godsAndEvils,
    specialDays: calculator.calculateSpecialDays(date),
    wuXingInfo: { elementStrength: 'medium' }
  });
  
  console.log(`${date.toLocaleDateString()} ${builds.name}日:`);
  console.log(`  建星評分: ${score.breakdown.twelveBuilds}分`);
  console.log(`  神煞評分: ${score.breakdown.godsEvils}分`);
  console.log(`  總體評分: ${score.overall.toFixed(1)}分 (${score.summary})`);
  console.log('');
});

console.log('✅ 神煞系統全面測試完成！');