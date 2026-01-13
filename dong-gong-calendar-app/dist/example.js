"use strict";
/**
 * 董公擇日 - 農曆服務使用示例
 */
Object.defineProperty(exports, "__esModule", { value: true });
const LunarService_1 = require("./services/LunarService");
const lunarService = new LunarService_1.LunarService();
// 測試日期：2025年1月1日
const testDate = new Date(2025, 0, 1);
console.log('=== 董公擇日農曆計算示例 ===');
console.log(`測試日期: ${testDate.toLocaleDateString()}`);
try {
    // 獲取完整農曆資訊
    const lunarInfo = lunarService.getCompleteLunarInfo(testDate);
    console.log('\n📅 農曆日期資訊:');
    console.log(`農曆: ${lunarInfo.lunarDate.yearInChinese}年 ${lunarInfo.lunarDate.monthInChinese}月 ${lunarInfo.lunarDate.dayInChinese}`);
    console.log(`生肖: ${lunarInfo.lunarDate.zodiac}`);
    console.log(`是否閏月: ${lunarInfo.lunarDate.isLeapMonth ? '是' : '否'}`);
    console.log('\n🔮 干支資訊:');
    console.log(`年干支: ${lunarInfo.ganZhi.year}`);
    console.log(`月干支: ${lunarInfo.ganZhi.month}`);
    console.log(`日干支: ${lunarInfo.ganZhi.day}`);
    console.log('\n🌿 五行資訊:');
    console.log(`日干五行: ${lunarInfo.wuXing.dayElement}`);
    console.log(`五行強弱: ${lunarInfo.wuXing.elementStrength}`);
    console.log(`五行關係: ${lunarInfo.wuXing.relationAnalysis}`);
    if (lunarInfo.solarTerm) {
        console.log('\n🌸 節氣資訊:');
        console.log(`當前節氣: ${lunarInfo.solarTerm.name}`);
    }
    // 測試時辰干支
    console.log('\n⏰ 時辰干支示例:');
    const hourGanZhi = lunarService.getHourGanZhi(testDate, 9);
    console.log(`上午9點時干支: ${hourGanZhi}`);
    console.log('\n✅ 農曆計算服務測試完成！');
}
catch (error) {
    console.error('❌ 農曆計算錯誤:', error);
}
//# sourceMappingURL=example.js.map