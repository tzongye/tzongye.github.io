#!/usr/bin/env python3
"""
調試星煞計算邏輯
找出為什麼我們的星煞判斷與網站不符
"""

from datetime import datetime
from final_dong_gong_calculator import FinalDongGongCalculator

def debug_star_calculation():
    """調試星煞計算"""
    
    print("=== 調試星煞計算邏輯 ===")
    
    calculator = FinalDongGongCalculator()
    
    # 測試兩個有問題的日期
    test_cases = [
        {
            'date': datetime(2025, 8, 15),
            'expected_stars': ['天喜'],
            'expected_description': "天喜，葬日次吉。俱不宜大用。"
        },
        {
            'date': datetime(2025, 8, 13),
            'expected_stars': ['正四廢'],
            'expected_description': "正四廢不吉、諸事不宜，主官司退財、人口啾唧。"
        }
    ]
    
    for i, case in enumerate(test_cases, 1):
        date = case['date']
        expected_stars = case['expected_stars']
        expected_desc = case['expected_description']
        
        print(f"\n📅 測試案例 {i}: {date.strftime('%Y年%m月%d日')}")
        print(f"預期星煞: {expected_stars}")
        print(f"預期文案: {expected_desc}")
        
        # 獲取我們的計算結果
        analysis = calculator.calculate_complete_analysis(date)
        
        if 'error' not in analysis:
            basic = analysis['basic_info']
            dong_gong = analysis['dong_gong_analysis']
            
            print(f"\n🔍 我們的計算結果:")
            print(f"  農曆: {basic['lunar_date']['display']}")
            print(f"  干支: {basic['ganzhi']['display']}")
            print(f"  建除: {basic['twelve_builds']['display']}")
            print(f"  吉星: {[star['name'] for star in dong_gong['auspicious_stars']]}")
            print(f"  凶煞: {[star['name'] for star in dong_gong['inauspicious_stars']]}")
            
            # 檢查星煞匹配度
            our_auspicious = [star['name'] for star in dong_gong['auspicious_stars']]
            our_inauspicious = [star['name'] for star in dong_gong['inauspicious_stars']]
            our_all_stars = our_auspicious + our_inauspicious
            
            matches = set(expected_stars) & set(our_all_stars)
            missing = set(expected_stars) - set(our_all_stars)
            extra = set(our_all_stars) - set(expected_stars)
            
            print(f"\n📊 星煞比對:")
            print(f"  匹配: {list(matches)} {'✅' if matches else '❌'}")
            print(f"  遺漏: {list(missing)} {'❌' if missing else '✅'}")
            print(f"  多餘: {list(extra)} {'⚠️' if extra else '✅'}")
            
            # 分析為什麼會有差異
            print(f"\n🔍 差異分析:")
            
            if missing:
                for star in missing:
                    print(f"  為什麼沒有識別出 '{star}'?")
                    analyze_missing_star(star, basic, dong_gong)
            
            if extra:
                for star in extra:
                    print(f"  為什麼多出了 '{star}'?")
                    analyze_extra_star(star, basic, dong_gong)
        
        else:
            print(f"❌ 計算失敗: {analysis['error']}")

def analyze_missing_star(star_name: str, basic_info: dict, dong_gong_analysis: dict):
    """分析為什麼遺漏了某個星煞"""
    
    twelve_builds = basic_info.get('twelve_builds', {}).get('name', '')
    day_ganzhi = basic_info.get('ganzhi', {}).get('day', '')
    
    print(f"    當前建除: {twelve_builds}")
    print(f"    當前日干支: {day_ganzhi}")
    
    # 分析可能的規則
    if star_name == '天喜':
        print(f"    天喜可能的出現條件:")
        print(f"      - 特定建除日？")
        print(f"      - 特定干支組合？")
        print(f"      - 特定月份或節氣？")
        
    elif star_name == '正四廢':
        print(f"    正四廢可能的出現條件:")
        print(f"      - 破日？(當前是{twelve_builds})")
        print(f"      - 特定季節的特定干支？")
        print(f"      - 立春、立夏、立秋、立冬前後？")

def analyze_extra_star(star_name: str, basic_info: dict, dong_gong_analysis: dict):
    """分析為什麼多出了某個星煞"""
    
    print(f"    我們的判斷條件可能過於寬鬆")
    print(f"    需要檢查 '{star_name}' 的出現規則")

def research_star_rules():
    """研究星煞出現的真實規則"""
    
    print(f"\n" + "="*60)
    print(f"🔬 星煞規則研究")
    print(f"="*60)
    
    print(f"需要研究的問題:")
    print(f"1. 天喜星的出現規律:")
    print(f"   - 是否與特定建除相關？")
    print(f"   - 是否與干支組合相關？")
    print(f"   - 是否與農曆月份相關？")
    
    print(f"\n2. 正四廢的出現規律:")
    print(f"   - 是否只在破日出現？")
    print(f"   - 是否與四立（立春夏秋冬）相關？")
    print(f"   - 是否與特定干支相關？")
    
    print(f"\n3. 其他星煞的準確規則:")
    print(f"   - 我們目前的規則可能是基於統計分析")
    print(f"   - 但真實的董公擇日可能有更精確的計算公式")
    print(f"   - 需要找到真正的董公擇日計算規則")
    
    print(f"\n💡 解決方案:")
    print(f"1. 收集更多真實資料進行比對")
    print(f"2. 研究傳統董公擇日的計算方法")
    print(f"3. 調整我們的星煞判斷邏輯")
    print(f"4. 建立驗證機制，持續改進準確度")

if __name__ == "__main__":
    debug_star_calculation()
    research_star_rules()