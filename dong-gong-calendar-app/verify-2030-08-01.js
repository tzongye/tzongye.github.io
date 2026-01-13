/**
 * 驗證 2030年8月1日 的董公擇日計算準確性
 * 對比網站資料：8月1日星期四農曆7月3日(火山旅) 收辰日 9運 庚戌年(6白) 癸未月(9紫) 戊辰日 大暑 夏季 肖狗 煞南 沖狗
 */

const { DongGongCalculator } = require('./dist/services/DongGongCalculator');

const calculator = new DongGongCalculator();

// 測試日期：2030年8月1日
const testDate = new Date(2030, 7, 1);

console.log('=== 驗證董公擇日計算準確性：2030年8月1日 ===');
console.log(`測試日期: ${testDate.toLocaleDateString()}`);
console.log('');

// 網站實際資料
console.log('📊 網站實際資料:');
console.log('日期: 8月1日 星期四');
console.log('農曆: 7月3日');
console.log('建星: 收辰日');
console.log('干支: 庚戌年 癸未月 戊辰日');
console.log('節氣: 大暑');
console.log('季節: 夏季');
console.log('生肖: 肖狗');
console.log('沖煞: 煞南 沖狗');
console.log('太陰太陽: 太陰(午時) 太陽(卯時)');
console.log('胎神: 房床栖外正南');
console.log('修方: 戌(沖)、未(刑)、南(煞)、卯(死)、辰(墓)、巳(絕)');
console.log('總評: 不吉');
console.log('');

// 我們的計算結果
console.log('🔍 我們的計算結果:');

try {
  // 1. 基本農曆資訊驗證
  const solar = require('lunar-javascript').Solar.fromDate(testDate);
  const lunar = solar.getLunar();
  
  console.log('基本資訊對比:');
  console.log(`日期: ${testDate.getMonth() + 1}月${testDate.getDate()}日 ${solar.getWeekInChinese()}`);
  console.log(`農曆: ${lunar.getMonth()}月${lunar.getDay()}日`);
  console.log(`干支: ${lunar.getYearInGanZhi()} ${lunar.getMonthInGanZhi()} ${lunar.getDayInGanZhi()}`);
  console.log(`生肖: 肖${lunar.getYearShengXiao()}`);
  
  // 2. 建星驗證
  const buildsInfo = calculator.calculateTwelveBuilds(testDate);
  console.log(`建星: ${buildsInfo.name}${lunar.getDayInGanZhi().charAt(1)}日`);
  
  // 3. 節氣驗證
  const jieQi = lunar.getJieQi();
  console.log(`節氣: ${jieQi || '無特殊節氣'}`);
  
  // 4. 季節驗證
  const season = testDate.getMonth() >= 5 && testDate.getMonth() <= 7 ? '夏季' : 
                testDate.getMonth() >= 8 && testDate.getMonth() <= 10 ? '秋季' :
                testDate.getMonth() >= 11 || testDate.getMonth() <= 1 ? '冬季' : '春季';
  console.log(`季節: ${season}`);
  
  console.log('');
  
  // 5. 沖煞分析
  console.log('沖煞分析:');
  const dayZhi = lunar.getDayInGanZhi().charAt(1); // 日支
  const yearZhi = lunar.getYearInGanZhi().charAt(1); // 年支
  
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
  
  console.log(`日支: ${dayZhi}，沖: ${chongZhi} (沖${chongShengXiao[chongZhi]})`);
  
  // 煞方計算
  const shaMap = {
    '子': '南', '丑': '東', '寅': '北', '卯': '西',
    '辰': '南', '巳': '東', '午': '北', '未': '西',
    '申': '南', '酉': '東', '戌': '北', '亥': '西'
  };
  
  const shaFang = shaMap[dayZhi];
  console.log(`煞方: 煞${shaFang}`);
  
  console.log('');
  
  // 6. 神煞配置
  console.log('神煞配置:');
  const godsAndEvils = calculator.calculateGodsAndEvils(testDate);
  console.log(`吉神: ${godsAndEvils.auspiciousGods.map(g => g.name).join('、') || '無'}`);
  console.log(`凶煞: ${godsAndEvils.inauspiciousEvils.map(e => e.name).join('、') || '無'}`);
  
  // 7. 修方分析
  console.log('修方分析:');
  console.log('不宜修造方位:');
  console.log(`戌方(沖): 與日支${dayZhi}相沖`);
  console.log(`未方(刑): 刑煞方位`);
  console.log(`南方(煞): 煞方`);
  console.log(`卯方(死): 死氣方位`);
  console.log(`辰方(墓): 墓庫方位`);
  console.log(`巳方(絕): 絕地方位`);
  
  console.log('');
  
  // 8. 綜合評分對比
  const score = calculator.calculateDongGongScore({
    twelveBuilds: buildsInfo,
    godsAndEvils: godsAndEvils,
    specialDays: calculator.calculateSpecialDays(testDate),
    wuXingInfo: { elementStrength: 'medium' }
  });
  
  console.log('綜合評分對比:');
  console.log(`我們的評分: ${score.overall.toFixed(1)}分 (${score.summary})`);
  console.log(`網站評語: 不吉`);
  
  console.log('');
  
  // 9. 準確性分析
  console.log('❌ 發現的差異:');
  const differences = [];
  
  // 檢查基本資訊
  if (lunar.getMonth() !== 7 || lunar.getDay() !== 3) {
    differences.push(`農曆日期: 我們計算${lunar.getMonth()}月${lunar.getDay()}日，網站顯示7月3日`);
  }
  
  if (buildsInfo.name !== '收') {
    differences.push(`建星: 我們計算${buildsInfo.name}日，網站顯示收日`);
  }
  
  if (chongShengXiao[chongZhi] !== '狗') {
    differences.push(`沖煞: 我們計算沖${chongShengXiao[chongZhi]}，網站顯示沖狗`);
  }
  
  if (shaFang !== '南') {
    differences.push(`煞方: 我們計算煞${shaFang}，網站顯示煞南`);
  }
  
  // 評語對比
  const ourJudgment = score.overall >= 70 ? '吉' : score.overall >= 50 ? '平' : '凶';
  if (ourJudgment !== '凶') {
    differences.push(`總評: 我們評為${ourJudgment}，網站評為不吉`);
  }
  
  if (differences.length === 0) {
    console.log('✅ 所有計算結果與網站資料完全一致！');
  } else {
    differences.forEach(diff => {
      console.log(`  • ${diff}`);
    });
  }
  
  console.log('');
  
  // 10. 修正建議
  console.log('🔧 需要修正的問題:');
  console.log('1. 我們的評分系統可能需要調整，以更準確反映傳統董公擇日的判斷');
  console.log('2. 需要加入更多傳統的凶煞因素，如修方禁忌');
  console.log('3. 沖煞的影響權重可能需要增加');
  console.log('4. 需要整合胎神、太陰太陽等傳統要素');
  
} catch (error) {
  console.error('計算過程中發生錯誤:', error);
}

console.log('');
console.log('✅ 2030年8月1日驗證完成！');