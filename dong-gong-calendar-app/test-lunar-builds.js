// 測試 lunar-javascript 庫的建星計算功能
const { Lunar, Solar } = require('lunar-javascript');

const date = new Date(2025, 0, 15); // 2025年1月15日
console.log('測試日期:', date.toLocaleDateString());

try {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  
  console.log('Lunar 對象的所有方法:');
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(lunar));
  const buildMethods = methods.filter(method => 
    method.toLowerCase().includes('zhi') || 
    method.toLowerCase().includes('build') ||
    method.toLowerCase().includes('star') ||
    method.toLowerCase().includes('twelve')
  );
  
  console.log('可能的建星相關方法:', buildMethods);
  
  // 測試一些可能的方法
  console.log('\n測試各種方法:');
  
  try {
    console.log('getZhiXing():', lunar.getZhiXing());
  } catch (e) {
    console.log('getZhiXing() 不存在');
  }
  
  try {
    console.log('getDayZhi():', lunar.getDayZhi());
  } catch (e) {
    console.log('getDayZhi() 錯誤:', e.message);
  }
  
  try {
    console.log('getZhi():', lunar.getZhi());
  } catch (e) {
    console.log('getZhi() 錯誤:', e.message);
  }
  
  // 檢查是否有建除十二神的方法
  const allMethods = Object.getOwnPropertyNames(lunar);
  console.log('\n所有屬性和方法數量:', allMethods.length);
  
  // 搜尋包含特定關鍵字的方法
  const keywords = ['zhi', 'build', 'star', 'twelve', 'jian', 'chu'];
  keywords.forEach(keyword => {
    const matchingMethods = methods.filter(method => 
      method.toLowerCase().includes(keyword)
    );
    if (matchingMethods.length > 0) {
      console.log(`包含 "${keyword}" 的方法:`, matchingMethods);
    }
  });
  
} catch (error) {
  console.error('錯誤:', error);
}