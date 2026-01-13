/**
 * 深度調試 2025年1月15日 的計算差異
 */

const { DongGongCalculator } = require('./dist/services/DongGongCalculator');

const calculator = new DongGongCalculator();

// 測試日期：2025年1月15日
const testDate = new Date(2025, 0, 15);

console.log('=== 深度調試 2025年1月15日 計算差異 ===');
console.log(`測試日期: ${testDate.toLocaleDateString()}`);
console.log('');

try {
  // 1. 基本農曆資訊
  console.log('📅 基本農曆資訊:');
  const solar = require('lunar-javascript').Solar.fromDate(testDate);
  const lunar = solar.getLunar();
  
  console.log(`公曆: ${testDate.getFullYear()}年${testDate.getMonth() + 1}月${testDate.getDate()}日`);
  console.log(`農曆: ${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`);
  console.log(`干支: ${lunar.getYearInGanZhi()} ${lunar.getMonthInGanZhi()} ${lunar.getDayInGanZhi()}`);
  console.log(`生肖: ${lunar.getYearShengXiao()}`);
  console.log(`建星: ${lunar.getZhiXing()}`);
  console.log('');

  // 2. 十二建星詳細分析
  console.log('⭐ 十二建星詳細分析:');
  const buildsInfo = calculator.calculateTwelveBuilds(testDate);
  console.log(`建星名稱: ${buildsInfo.name}日`);
  console.log(`建星意義: ${buildsInfo.meaning}`);
  console.log(`吉凶等級: ${buildsInfo.level}`);
  console.log(`傳統規則: ${buildsInfo.traditionalRule}`);
  console.log(`適宜事項: ${buildsInfo.suitable.join('、')}`);
  console.log(`避忌事項: ${buildsInfo.avoid.join('、') || '無特別禁忌'}`);
  console.log('');

  // 3. 神煞配置詳細分析
  console.log('🔮 神煞配置詳細分析:');
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

  // 4. 特殊日期檢查
  console.log('🌟 特殊日期檢查:');
  const specialDays = calculator.calculateSpecialDays(testDate);
  console.log(`特殊吉日: ${specialDays.isSpecialAuspicious ? '是' : '否'}`);
  console.log(`特殊凶日: ${specialDays.isSpecialInauspicious ? '是' : '否'}`);
  console.log(`四絕日: ${specialDays.isFourJue ? '是' : '否'}`);
  console.log(`四離日: ${specialDays.isFourLi ? '是' : '否'}`);
  console.log(`煞入中宮: ${specialDays.isShaInCenter ? '是' : '否'}`);
  console.log(`特殊說明: ${specialDays.specialNote}`);
  console.log('');

  // 5. 詳細評分分析
  console.log('📊 詳細評分分析:');
  const score = calculator.calculateDongGongScore({
    twelveBuilds: buildsInfo,
    godsAndEvils: godsAndEvils,
    specialDays: specialDays,
    wuXingInfo: { elementStrength: 'medium' }
  }, testDate);

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

  // 6. 沖煞分析
  console.log('🧭 沖煞分析:');
  const dayZhi = lunar.getDayInGanZhi().charAt(1); // 日支
  const yearZhi = lunar.getYearInGanZhi().charAt(1); // 年支
  
  console.log(`年支: ${yearZhi}`);
  console.log(`日支: ${dayZhi}`);
  
  // 沖的計算
  const chongMap = {
    '子': '午', '丑': '未', '寅': '申', '卯': '酉',
    '辰': '戌', '巳': '亥', '午': '子', '未': '丑',
    '申': '寅', '酉': '卯', '戌': '辰', '亥': '巳'
  };
  
  const chongZhi = chongMap[dayZhi];
  const chongShengXiao = {
    '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔',
    '辰': '龍', '巳': '蛇', '午': '馬', '未': '羊',
    '申': '猴', '酉': '雞', '戌': '狗', '亥': '豬'
  };
  
  console.log(`日支${dayZhi}沖${chongZhi} (沖${chongShengXiao[chongZhi]})`);
  
  // 煞方計算
  const shaMap = {
    '子': '南', '丑': '東', '寅': '北', '卯': '西',
    '辰': '南', '巳': '東', '午': '北', '未': '西',
    '申': '南', '酉': '東', '戌': '北', '亥': '西'
  };
  
  const shaFang = shaMap[dayZhi];
  console.log(`煞方: 煞${shaFang}`);
  console.log('');

  // 7. 網站資料對比
  console.log('🌐 與網站資料對比:');
  console.log('網站資料: 危申日，起造安葬吉');
  console.log('我們的計算:');
  console.log(`  建星: ${buildsInfo.name}日 ✅`);
  console.log(`  日支: ${dayZhi} ✅`);
  console.log(`  沖煞: 煞${shaFang} 沖${chongShengXiao[chongZhi]} ✅`);
  console.log(`  評語: ${score.summary} ❌`);
  console.log('');

  // 8. 問題分析
  console.log('🔍 問題分析:');
  console.log('網站評為「起造安葬吉」的可能原因:');
  console.log('1. 危日本身是黃道吉日，除危定執黃');
  console.log('2. 危日適宜「起造、安葬」等事項');
  console.log('3. 可能我們的神煞權重過高，影響了總體評分');
  console.log('');
  
  console.log('我們評為「凶」的原因:');
  console.log(`1. 有${godsAndEvils.inauspiciousEvils.length}個凶煞影響評分`);
  console.log('2. 可能評分算法需要調整');
  console.log('3. 可能需要考慮具體事項的適宜性');
  console.log('');

  // 9. 建議改進方案
  console.log('💡 建議改進方案:');
  console.log('1. 調整評分權重，降低神煞對黃道吉日的負面影響');
  console.log('2. 加入事項適宜性的考量');
  console.log('3. 危日雖有凶煞，但本身為黃道吉日，應該給予更高評分');
  console.log('4. 考慮傳統董公擇日更注重建星本身的吉凶');

} catch (error) {
  console.error('❌ 分析過程中發生錯誤:', error.message);
}

console.log('');
console.log('✅ 2025年1月15日深度調試完成！');