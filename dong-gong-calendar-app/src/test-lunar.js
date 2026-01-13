// 測試 lunar-javascript 庫的實際 API
const { Lunar, Solar } = require('lunar-javascript');

const date = new Date(2025, 0, 1);
console.log('測試日期:', date);

try {
  const solar = Solar.fromDate(date);
  console.log('Solar 對象:', solar);
  
  const lunar = solar.getLunar();
  console.log('Lunar 對象:', lunar);
  console.log('Lunar 方法:', Object.getOwnPropertyNames(Object.getPrototypeOf(lunar)));
  
  // 測試各種方法
  console.log('年:', lunar.getYear());
  console.log('月:', lunar.getMonth());
  console.log('日:', lunar.getDay());
  console.log('是否閏月:', lunar.getLeapMonth());
  console.log('年中文:', lunar.getYearInChinese());
  console.log('月中文:', lunar.getMonthInChinese());
  console.log('日中文:', lunar.getDayInChinese());
  console.log('生肖:', lunar.getYearShengXiao());
  console.log('年干支:', lunar.getYearInGanZhi());
  console.log('月干支:', lunar.getMonthInGanZhi());
  console.log('日干支:', lunar.getDayInGanZhi());
  
} catch (error) {
  console.error('錯誤:', error);
}