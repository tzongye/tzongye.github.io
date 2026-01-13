/**
 * 驗證董公擇日計算的準確性
 * 對比網頁資料：2025年1月15日
 */

const { LunarService } = require('./dist/services/LunarService');
const { DongGongCalculator } = require('./dist/services/DongGongCalculator');

const lunarService = new LunarService();
const calculator = new DongGongCalculator();

// 測試日期：2025年1月15日
const testDate = new Date(2025, 0, 15);

console.log('=== 驗證董公擇日計算準確性 ===');
console.log(`測試日期: ${testDate.toLocaleDateString()}`);

console.log('\n📊 網頁實際資料:');
console.log('農曆: 12月16日');
console.log('建星: 危申日');
console.log('干支: 甲辰年 丁丑月 甲申日');
console.log('節氣: 小寒');
console.log('季節: 冬季');
console.log('生肖: 肖龍');
console.log('沖煞: 煞南 沖虎');
console.log('宜事: 起造安葬吉');

console.log('\n🔍 我們的計算結果:');

try {
  // 農曆計算
  const lunarInfo = lunarService.getCompleteLunarInfo(testDate);
  console.log(`農曆: ${lunarInfo.lunarDate.month}月${lunarInfo.lunarDate.day}日`);
  console.log(`干支: ${lunarInfo.ganZhi.year} ${lunarInfo.ganZhi.month} ${lunarInfo.ganZhi.day}`);
  console.log(`生肖: ${lunarInfo.lunarDate.zodiac}`);
  
  // 董公建星計算
  const buildsInfo = calculator.calculateTwelveBuilds(testDate);
  console.log(`建星: ${buildsInfo.name}日`);
  
  // 節氣資訊
  if (lunarInfo.solarTerm) {
    console.log(`節氣: ${lunarInfo.solarTerm.name}`);
  }
  
  console.log('\n❌ 發現的差異:');
  
  // 農曆日期比較
  if (lunarInfo.lunarDate.month !== 12 || lunarInfo.lunarDate.day !== 16) {
    console.log(`❌ 農曆日期不符: 實際12月16日 vs 計算${lunarInfo.lunarDate.month}月${lunarInfo.lunarDate.day}日`);
  }
  
  // 建星比較
  if (buildsInfo.name !== '危') {
    console.log(`❌ 建星不符: 實際危日 vs 計算${buildsInfo.name}日`);
  }
  
  // 干支比較
  if (lunarInfo.ganZhi.day !== '甲申') {
    console.log(`❌ 日干支不符: 實際甲申日 vs 計算${lunarInfo.ganZhi.day}日`);
  }
  
  if (lunarInfo.ganZhi.month !== '丁丑') {
    console.log(`❌ 月干支不符: 實際丁丑月 vs 計算${lunarInfo.ganZhi.month}月`);
  }
  
  if (lunarInfo.ganZhi.year !== '甲辰') {
    console.log(`❌ 年干支不符: 實際甲辰年 vs 計算${lunarInfo.ganZhi.year}年`);
  }
  
  console.log('\n🔧 需要修正的問題:');
  console.log('1. 農曆日期計算可能有偏差');
  console.log('2. 十二建星計算邏輯需要修正');
  console.log('3. 干支計算可能需要調整');
  console.log('4. 需要整合更準確的農曆庫或算法');
  
} catch (error) {
  console.error('❌ 計算錯誤:', error);
}