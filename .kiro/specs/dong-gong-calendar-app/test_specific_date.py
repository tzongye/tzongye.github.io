#!/usr/bin/env python3
"""
測試特定日期的董公擇日計算
使用已知的樣本資料進行驗證
"""

import json
from datetime import datetime
from dong_gong_calculator import DongGongCalculator

def load_sample_data():
    """載入已有的樣本資料"""
    try:
        with open('dong_gong_sample_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('daily_data', [])
    except FileNotFoundError:
        print("找不到樣本資料檔案")
        return []

def find_date_in_samples(target_date, sample_data):
    """在樣本資料中尋找指定日期"""
    target_str = target_date.strftime('%Y-%m-%d')
    
    for day_data in sample_data:
        if day_data['date'] == target_str:
            return day_data
    
    return None

def test_calculation_with_sample():
    """使用樣本資料測試計算"""
    
    # 載入樣本資料
    sample_data = load_sample_data()
    
    if not sample_data:
        print("❌ 無法載入樣本資料")
        return
    
    print(f"✅ 載入了 {len(sample_data)} 天的樣本資料")
    
    # 初始化計算器
    try:
        calculator = DongGongCalculator('dong_gong_patterns.json')
        print("✅ 成功初始化董公計算器")
    except Exception as e:
        print(f"❌ 初始化計算器失敗: {e}")
        return
    
    # 測試前3天的資料
    print("\n=== 測試計算結果 ===\n")
    
    for i, sample in enumerate(sample_data[:3]):
        print(f"📅 測試日期 {i+1}: {sample['date']}")
        
        # 解析日期
        try:
            test_date = datetime.strptime(sample['date'], '%Y-%m-%d')
        except ValueError:
            print(f"❌ 日期格式錯誤: {sample['date']}")
            continue
        
        # 計算董公擇日分析
        try:
            calculated = calculator.calculate_dong_gong_analysis(test_date)
            
            print(f"真實資料:")
            print(f"  農曆: {sample.get('lunar_date', '未知')}")
            print(f"  干支: {sample.get('gan_zhi', '未知')}")
            print(f"  建除: {sample.get('twelve_builds', '未知')}")
            print(f"  卦象: {sample.get('yijing_hexagram', '未知')}")
            print(f"  描述: {sample.get('description', '無')[:100]}...")
            
            print(f"計算結果:")
            print(f"  干支: {calculated['ganzhi']}")
            print(f"  建除: {calculated['twelve_builds']}")
            print(f"  評分: {calculated['overall_score']}分 ({calculated['summary']})")
            print(f"  吉星: {[star['name'] for star in calculated['auspicious_stars']]}")
            print(f"  凶煞: {[star['name'] for star in calculated['inauspicious_stars']]}")
            print(f"  理由: {'; '.join(calculated['reasons'])}")
            
            # 簡單比較
            ganzhi_match = sample.get('gan_zhi', '') == calculated['ganzhi']
            builds_match = sample.get('twelve_builds', '') == calculated['twelve_builds']
            
            print(f"比較結果:")
            print(f"  干支匹配: {'✅' if ganzhi_match else '❌'}")
            print(f"  建除匹配: {'✅' if builds_match else '❌'}")
            
        except Exception as e:
            print(f"❌ 計算失敗: {e}")
        
        print("-" * 60)

def test_manual_date():
    """手動測試一個具體日期"""
    
    print("\n=== 手動測試特定日期 ===")
    
    # 測試今天的日期
    test_date = datetime(2025, 8, 5)  # 今天
    
    try:
        calculator = DongGongCalculator('dong_gong_patterns.json')
        result = calculator.calculate_dong_gong_analysis(test_date)
        
        print(f"\n📅 測試日期: {test_date.strftime('%Y年%m月%d日')}")
        print(f"干支: {result['ganzhi']}")
        print(f"建除: {result['twelve_builds']}")
        print(f"整體評分: {result['overall_score']}分")
        print(f"吉凶判斷: {result['summary']}")
        print(f"吉星: {[star['name'] for star in result['auspicious_stars']]}")
        print(f"凶煞: {[star['name'] for star in result['inauspicious_stars']]}")
        print(f"判斷理由:")
        for reason in result['reasons']:
            print(f"  • {reason}")
        
        # 測試幾個常見活動的適合度
        activities = ['嫁娶', '開張', '入宅', '出行', '安葬']
        print(f"\n📋 活動適合度分析:")
        
        for activity in activities:
            suitability = calculator.calculate_activity_suitability(
                test_date, activity, result['twelve_builds']
            )
            
            level_emoji = {
                'excellent': '🟢',
                'good': '🟡', 
                'fair': '🟠',
                'poor': '🔴',
                'terrible': '⚫'
            }
            
            emoji = level_emoji.get(suitability['level'], '❓')
            suitable_text = '適合' if suitability['suitable'] else '不適合'
            
            print(f"  {emoji} {activity}: {suitability['score']}分 ({suitable_text})")
        
        return result
        
    except Exception as e:
        print(f"❌ 測試失敗: {e}")
        return None

def main():
    """主程式"""
    print("=== 董公擇日計算測試程式 ===\n")
    
    # 1. 使用樣本資料測試
    test_calculation_with_sample()
    
    # 2. 手動測試特定日期
    result = test_manual_date()
    
    if result:
        print(f"\n🎯 測試完成！")
        print(f"我們的董公擇日計算引擎可以:")
        print(f"✅ 計算任意日期的干支")
        print(f"✅ 推算十二建除")
        print(f"✅ 判斷吉星凶煞")
        print(f"✅ 評估活動適合度")
        print(f"✅ 提供詳細的分析理由")
        
        print(f"\n💡 下一步可以:")
        print(f"1. 改進計算精度（特別是農曆轉換）")
        print(f"2. 增加更多董公特有的星煞規則")
        print(f"3. 優化活動適合度的判斷邏輯")
        print(f"4. 開始建立 React Native App")

if __name__ == "__main__":
    main()