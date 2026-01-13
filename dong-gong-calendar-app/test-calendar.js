/**
 * 董公日曆服務測試
 * 測試月曆基礎功能和數據生成（不涉及React組件）
 */

// 先編譯TypeScript，然後測試服務層
const { execSync } = require('child_process');

console.log('🔄 編譯TypeScript服務層...');
try {
  // 只編譯服務層，跳過React組件
  execSync('npx tsc --skipLibCheck --target es2017 --module commonjs --outDir dist-test src/services/*.ts src/types/*.ts src/data/*.ts', { stdio: 'inherit' });
  console.log('✅ 服務層編譯成功！\n');
} catch (error) {
  console.error('❌ 編譯失敗:', error.message);
  process.exit(1);
}

const { CalendarService } = require('./dist-test/services/CalendarService');

async function testCalendarService() {
  console.log('=== 董公日曆服務測試 ===\n');

  try {
    const calendarService = new CalendarService();
    
    // 測試生成當月數據
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    console.log(`📅 測試月份: ${year}年${month}月\n`);
    
    // 生成月份數據
    console.log('🔄 生成月份數據...');
    const monthData = calendarService.generateMonthData(year, month);
    
    console.log('✅ 月份數據生成成功！');
    console.log(`📊 統計資訊:`);
    console.log(`  總天數: ${monthData.days.length}`);
    console.log(`  黃道吉日: ${monthData.huangDaoCount}天`);
    console.log(`  黑道凶日: ${monthData.heiDaoCount}天`);
    console.log(`  特殊日期: ${monthData.specialDayCount}天\n`);
    
    // 測試前5天的詳細資訊
    console.log('📋 前5天詳細資訊:');
    monthData.days.slice(0, 5).forEach((dayInfo, index) => {
      const date = dayInfo.gregorianDate;
      console.log(`${index + 1}. ${date.getMonth() + 1}/${date.getDate()}`);
      console.log(`   農曆: ${dayInfo.lunarDate.monthInChinese}${dayInfo.lunarDate.dayInChinese}`);
      console.log(`   建星: ${dayInfo.twelveBuild.name}日 (${dayInfo.twelveBuild.meaning})`);
      console.log(`   等級: ${dayInfo.overallLevel}`);
      console.log(`   摘要: ${dayInfo.quickSummary}`);
      console.log(`   色彩: ${dayInfo.colorCode}`);
      console.log(`   黃道: ${dayInfo.isHuangDao ? '是' : '否'}`);
      console.log(`   黑道: ${dayInfo.isHeiDao ? '是' : '否'}`);
      console.log(`   吉神: ${dayInfo.godsEvils.auspiciousGods.length}個`);
      console.log(`   凶煞: ${dayInfo.godsEvils.inauspiciousEvils.length}個`);
      
      if (dayInfo.specialDay.isSpecialAuspicious || dayInfo.specialDay.isSpecialInauspicious) {
        console.log(`   特殊: ${dayInfo.specialDay.specialNote}`);
      }
      console.log('');
    });
    
    // 測試色彩主題
    console.log('🎨 色彩主題測試:');
    const themes = ['traditional', 'modern', 'accessible'];
    themes.forEach(theme => {
      console.log(`\n${theme} 主題:`);
      const colors = calendarService.getColorThemeStyles(theme);
      Object.entries(colors).forEach(([code, color]) => {
        console.log(`  ${code}: ${color}`);
      });
    });
    
    // 測試篩選功能
    console.log('\n🔍 篩選功能測試:');
    
    const config1 = {
      showLunarDate: true,
      showTwelveBuild: true,
      showGodsEvils: true,
      showSpecialDays: true,
      filterSpecialOnly: true,
      colorTheme: 'traditional'
    };
    
    const specialDays = calendarService.filterDays(monthData.days, config1);
    console.log(`特殊日期篩選: ${specialDays.length}天`);
    
    const config2 = {
      showLunarDate: true,
      showTwelveBuild: true,
      showGodsEvils: true,
      showSpecialDays: true,
      filterByLevel: 'excellent',
      filterSpecialOnly: false,
      colorTheme: 'traditional'
    };
    
    const excellentDays = calendarService.filterDays(monthData.days, config2);
    console.log(`優秀等級篩選: ${excellentDays.length}天`);
    
    console.log('\n✅ 董公日曆服務測試完成！');
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
    console.error(error.stack);
  }
}

// 執行測試
testCalendarService();