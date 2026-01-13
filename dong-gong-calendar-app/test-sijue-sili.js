/**
 * 專門測試四絕四離日識別
 */

const { DongGongCalculator } = require('./dist/services/DongGongCalculator');

const calculator = new DongGongCalculator();

console.log('=== 四絕四離日專門測試 ===');
console.log('');

// 2025年的四立節氣日期（大概日期）
const seasonalDates = [
  { name: '立春', date: new Date(2025, 1, 4), desc: '2025年立春' },
  { name: '立夏', date: new Date(2025, 4, 5), desc: '2025年立夏' },
  { name: '立秋', date: new Date(2025, 7, 7), desc: '2025年立秋' },
  { name: '立冬', date: new Date(2025, 10, 7), desc: '2025年立冬' },
];

seasonalDates.forEach(({ name, date, desc }) => {
  console.log(`🌸 ${desc} (${name})`);
  
  // 測試前一日（四絕日）
  const dayBefore = new Date(date);
  dayBefore.setDate(date.getDate() - 1);
  
  console.log(`前一日 (${dayBefore.toLocaleDateString()}) - 可能的四絕日:`);
  try {
    const siJueSiLi = calculator.checkSiJueSiLiDays(dayBefore);
    console.log(`  四絕日: ${siJueSiLi.isSiJue ? '是' : '否'}`);
    console.log(`  四離日: ${siJueSiLi.isSiLi ? '是' : '否'}`);
    console.log(`  說明: ${siJueSiLi.description}`);
    if (siJueSiLi.warnings.length > 0) {
      console.log('  警告:');
      siJueSiLi.warnings.forEach(warning => {
        console.log(`    • ${warning}`);
      });
    }
  } catch (error) {
    console.log(`  檢查錯誤: ${error.message}`);
  }
  
  // 測試當日（四離日）
  console.log(`當日 (${date.toLocaleDateString()}) - 可能的四離日:`);
  try {
    const siJueSiLi = calculator.checkSiJueSiLiDays(date);
    console.log(`  四絕日: ${siJueSiLi.isSiJue ? '是' : '否'}`);
    console.log(`  四離日: ${siJueSiLi.isSiLi ? '是' : '否'}`);
    console.log(`  說明: ${siJueSiLi.description}`);
    if (siJueSiLi.warnings.length > 0) {
      console.log('  警告:');
      siJueSiLi.warnings.forEach(warning => {
        console.log(`    • ${warning}`);
      });
    }
  } catch (error) {
    console.log(`  檢查錯誤: ${error.message}`);
  }
  
  console.log('');
});

// 測試煞入中宮
console.log('🚨 煞入中宮專門測試:');
console.log('');

// 測試一些可能的煞入中宮日期
const testDatesForSha = [
  new Date(2025, 0, 15), // 乙巳年
  new Date(2025, 2, 20),
  new Date(2025, 5, 10),
  new Date(2024, 0, 15), // 甲辰年
  new Date(2024, 2, 20),
];

testDatesForSha.forEach(date => {
  try {
    const shaResult = calculator.checkShaRuZhongGongDay(date);
    
    if (shaResult.isShaRuZhongGong) {
      console.log(`找到煞入中宮日: ${date.toLocaleDateString()}`);
      console.log(`  說明: ${shaResult.description}`);
      console.log('  警告:');
      shaResult.warnings.forEach(warning => {
        console.log(`    • ${warning}`);
      });
      console.log('  化解方法:');
      shaResult.resolutions.forEach(resolution => {
        console.log(`    • ${resolution}`);
      });
      console.log('');
    }
  } catch (error) {
    // 忽略錯誤
  }
});

// 測試特殊建星日組合
console.log('⭐ 特殊建星日組合測試:');
console.log('');

// 生成一些測試日期來尋找特殊組合
const testRange = [];
for (let i = 0; i < 60; i++) {
  const testDate = new Date(2025, 0, 1);
  testDate.setDate(testDate.getDate() + i);
  testRange.push(testDate);
}

const foundSpecialDays = [];

testRange.forEach(date => {
  try {
    const specialAnalysis = calculator.getCompleteSpecialDatesAnalysis(date);
    
    if (specialAnalysis.specialAuspicious.isSpecial || 
        specialAnalysis.specialInauspicious.isSpecial ||
        specialAnalysis.siJueSiLi.isSiJue ||
        specialAnalysis.siJueSiLi.isSiLi ||
        specialAnalysis.shaRuZhongGong.isShaRuZhongGong) {
      
      foundSpecialDays.push({
        date: date.toLocaleDateString(),
        type: specialAnalysis.overallAssessment.type,
        summary: specialAnalysis.overallAssessment.summary,
        details: {
          specialAuspicious: specialAnalysis.specialAuspicious.name,
          specialInauspicious: specialAnalysis.specialInauspicious.name,
          siJue: specialAnalysis.siJueSiLi.isSiJue,
          siLi: specialAnalysis.siJueSiLi.isSiLi,
          shaRuZhongGong: specialAnalysis.shaRuZhongGong.isShaRuZhongGong
        }
      });
    }
  } catch (error) {
    // 忽略錯誤
  }
});

if (foundSpecialDays.length > 0) {
  console.log(`在2025年前60天中找到 ${foundSpecialDays.length} 個特殊日期:`);
  foundSpecialDays.forEach(day => {
    console.log(`${day.date}: ${day.summary} (${day.type})`);
    if (day.details.specialAuspicious !== '普通日期') {
      console.log(`  特殊吉日: ${day.details.specialAuspicious}`);
    }
    if (day.details.specialInauspicious !== '普通日期') {
      console.log(`  特殊凶日: ${day.details.specialInauspicious}`);
    }
    if (day.details.siJue) {
      console.log(`  四絕日: 是`);
    }
    if (day.details.siLi) {
      console.log(`  四離日: 是`);
    }
    if (day.details.shaRuZhongGong) {
      console.log(`  煞入中宮: 是`);
    }
  });
} else {
  console.log('在測試範圍內未找到特殊日期');
}

console.log('');
console.log('✅ 四絕四離日專門測試完成！');