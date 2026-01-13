#!/usr/bin/env python3
"""
測試 1989年12月7日 的董公擇日分析
"""

from datetime import datetime
from dong_gong_calculator import DongGongCalculator

def test_specific_date():
    """測試 1989年12月7日"""
    
    # 目標日期
    test_date = datetime(1989, 12, 7)
    
    print("=== 董公擇日分析 ===")
    print(f"查詢日期: {test_date.strftime('%Y年%m月%d日')} (西曆)")
    print()
    
    try:
        # 初始化計算器
        calculator = DongGongCalculator('dong_gong_patterns.json')
        
        # 計算董公擇日分析
        result = calculator.calculate_dong_gong_analysis(test_date)
        
        print("📅 基本資訊:")
        print(f"  干支: {result['ganzhi']}")
        print(f"  建除: {result['twelve_builds']}")
        print()
        
        print("⭐ 吉星:")
        if result['auspicious_stars']:
            for star in result['auspicious_stars']:
                print(f"  • {star['name']}: {star['effect']}")
        else:
            print("  無吉星")
        print()
        
        print("💀 凶煞:")
        if result['inauspicious_stars']:
            for star in result['inauspicious_stars']:
                severity_emoji = {'severe': '🔴', 'medium': '🟠', 'light': '🟡'}
                emoji = severity_emoji.get(star.get('severity', 'light'), '🟡')
                print(f"  {emoji} {star['name']}: {star['effect']}")
        else:
            print("  無凶煞")
        print()
        
        print("📊 整體評估:")
        level_emoji = {
            'excellent': '🟢 大吉',
            'good': '🟡 吉', 
            'fair': '🟠 平',
            'poor': '🔴 凶',
            'terrible': '⚫ 大凶'
        }
        
        emoji_summary = level_emoji.get(result['overall_level'], '❓')
        print(f"  評分: {result['overall_score']}分")
        print(f"  等級: {emoji_summary}")
        print()
        
        print("📋 判斷理由:")
        for reason in result['reasons']:
            print(f"  • {reason}")
        print()
        
        # 測試各種活動的適合度
        activities = [
            '嫁娶', '開張', '入宅', '出行', '安葬', 
            '動土', '修造', '開市', '祭祀', '求財'
        ]
        
        print("🎯 活動適合度分析:")
        
        suitable_activities = []
        unsuitable_activities = []
        
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
            
            if suitability['suitable']:
                suitable_activities.append(activity)
            else:
                unsuitable_activities.append(activity)
        
        print()
        print("✅ 適合的活動:")
        if suitable_activities:
            for activity in suitable_activities:
                print(f"  • {activity}")
        else:
            print("  今日諸事不宜")
        
        print()
        print("❌ 不適合的活動:")
        if unsuitable_activities:
            for activity in unsuitable_activities:
                print(f"  • {activity}")
        else:
            print("  無特別禁忌")
        
        print()
        print("💡 董公建議:")
        if result['overall_score'] >= 70:
            print("  今日為吉日，可進行重要事務")
        elif result['overall_score'] >= 50:
            print("  今日平常，可處理一般事務")
        elif result['overall_score'] >= 30:
            print("  今日不佳，宜謹慎行事")
        else:
            print("  今日大凶，宜靜養休息")
        
        return result
        
    except Exception as e:
        print(f"❌ 計算失敗: {e}")
        return None

def main():
    """主程式"""
    result = test_specific_date()
    
    if result:
        print("\n" + "="*50)
        print("🎯 分析完成！")
        print(f"1989年12月7日 的董公擇日分析已完成")
        print("以上分析基於董公擇日的傳統規則和我們建立的計算引擎")

if __name__ == "__main__":
    main()