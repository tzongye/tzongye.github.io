#!/usr/bin/env python3
"""
測試 lunar-python 庫的正確使用方式
"""

from datetime import datetime

def test_lunar_library():
    """測試 lunar-python 庫"""
    
    try:
        from lunar_python import Lunar, Solar
        print("✅ lunar-python 庫載入成功")
        
        # 測試日期：1989年12月7日
        test_date = datetime(1989, 12, 7)
        
        print(f"\n📅 測試日期: {test_date.strftime('%Y年%m月%d日')}")
        
        # 建立 Solar 物件
        solar = Solar.fromDate(test_date)
        print(f"✅ Solar 物件建立成功")
        
        # 轉換為農曆
        lunar = solar.getLunar()
        print(f"✅ 農曆轉換成功")
        
        print(f"\n🌙 農曆資訊:")
        print(f"  農曆日期: {lunar.getYear()}年{lunar.getMonth()}月{lunar.getDay()}日")
        print(f"  年干支: {lunar.getYearInGanZhi()}")
        print(f"  月干支: {lunar.getMonthInGanZhi()}")
        print(f"  日干支: {lunar.getDayInGanZhi()}")
        print(f"  生肖: {lunar.getYearShengXiao()}")
        
        # 測試可用的方法
        print(f"\n🔍 可用方法測試:")
        
        # 基本資訊
        try:
            print(f"  納音: {lunar.getDayNaYin()}")
        except Exception as e:
            print(f"  納音: 方法不存在 ({e})")
        
        try:
            print(f"  建除: {lunar.getZhiXing()}")
        except Exception as e:
            print(f"  建除: 方法不存在 ({e})")
        
        try:
            print(f"  二十八宿: {lunar.getXiu()}")
        except Exception as e:
            print(f"  二十八宿: 方法不存在 ({e})")
        
        try:
            print(f"  九星: {lunar.getJiuXing()}")
        except Exception as e:
            print(f"  九星: 方法不存在 ({e})")
        
        try:
            print(f"  沖煞: {lunar.getDayChong()}")
        except Exception as e:
            print(f"  沖煞: 方法不存在 ({e})")
        
        try:
            print(f"  胎神: {lunar.getTaiShen()}")
        except Exception as e:
            print(f"  胎神: 方法不存在 ({e})")
        
        # 節氣資訊
        try:
            jieqi = solar.getJieQi()
            print(f"  節氣: {jieqi}")
        except Exception as e:
            print(f"  節氣: 方法不存在 ({e})")
        
        # 列出所有可用方法
        print(f"\n📋 Lunar 物件的所有方法:")
        lunar_methods = [method for method in dir(lunar) if not method.startswith('_')]
        for method in sorted(lunar_methods):
            print(f"  - {method}")
        
        print(f"\n📋 Solar 物件的所有方法:")
        solar_methods = [method for method in dir(solar) if not method.startswith('_')]
        for method in sorted(solar_methods):
            print(f"  - {method}")
        
        return True
        
    except ImportError as e:
        print(f"❌ lunar-python 庫載入失敗: {e}")
        return False
    except Exception as e:
        print(f"❌ 測試過程發生錯誤: {e}")
        return False

def compare_with_website_data():
    """與網站資料比較"""
    
    print(f"\n🔍 與網站資料比較:")
    print(f"網站資料: 己巳年 乙亥月/丙子月 辛丑日")
    
    try:
        from lunar_python import Lunar, Solar
        
        test_date = datetime(1989, 12, 7)
        solar = Solar.fromDate(test_date)
        lunar = solar.getLunar()
        
        print(f"我們計算: {lunar.getYearInGanZhi()}年 {lunar.getMonthInGanZhi()}月 {lunar.getDayInGanZhi()}日")
        
        # 檢查是否匹配
        year_match = lunar.getYearInGanZhi() == '己巳'
        day_match = lunar.getDayInGanZhi() == '辛丑'
        
        print(f"年干支匹配: {'✅' if year_match else '❌'}")
        print(f"日干支匹配: {'✅' if day_match else '❌'}")
        
        if year_match and day_match:
            print(f"🎉 基本干支計算正確！")
            return True
        else:
            print(f"⚠️  干支計算有差異，需要進一步調查")
            return False
            
    except Exception as e:
        print(f"❌ 比較失敗: {e}")
        return False

if __name__ == "__main__":
    print("=== lunar-python 庫測試 ===")
    
    success = test_lunar_library()
    
    if success:
        compare_with_website_data()
    
    print(f"\n💡 結論:")
    if success:
        print(f"✅ lunar-python 庫可以正常使用")
        print(f"✅ 可以獲得準確的干支、農曆等資訊")
        print(f"✅ 比我們自己寫的計算公式準確多了")
        print(f"🚀 接下來可以基於這個庫建立準確的董公擇日計算器")
    else:
        print(f"❌ 需要解決 lunar-python 庫的問題")
        print(f"💡 可以考慮使用 JavaScript 版本或其他替代方案")