#!/usr/bin/env python3
"""
分析我們樣本資料的覆蓋範圍和局限性
"""

import json
from collections import defaultdict, Counter

def analyze_sample_coverage():
    """分析樣本資料的覆蓋範圍"""
    
    print("=== 分析樣本資料覆蓋範圍 ===")
    
    # 載入樣本資料
    try:
        with open('dong_gong_sample_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            daily_data = data.get('daily_data', [])
    except FileNotFoundError:
        print("找不到樣本資料檔案")
        return
    
    print(f"總資料量: {len(daily_data)} 天")
    
    # 分析日期範圍
    dates = []
    lunar_months = []
    seasons = []
    builds = []
    
    for day in daily_data:
        date_str = day.get('date', '')
        lunar_date = day.get('lunar_date', '')
        season = day.get('season', '')
        twelve_builds = day.get('twelve_builds', '')
        
        if date_str:
            dates.append(date_str)
        
        if lunar_date:
            # 提取農曆月份
            import re
            month_match = re.search(r'(\d+)月', lunar_date)
            if month_match:
                lunar_months.append(int(month_match.group(1)))
        
        if season:
            seasons.append(season)
        
        if twelve_builds:
            build_name = twelve_builds[0] if twelve_builds else ''
            if build_name:
                builds.append(build_name)
    
    print(f"\n📅 日期範圍:")
    if dates:
        dates.sort()
        print(f"  最早: {dates[0]}")
        print(f"  最晚: {dates[-1]}")
        
        # 分析月份分布
        months = defaultdict(int)
        for date in dates:
            month = date.split('-')[1]
            months[month] += 1
        
        print(f"  月份分布:")
        for month, count in sorted(months.items()):
            print(f"    {month}月: {count}天")
    
    print(f"\n🌙 農曆月份分布:")
    lunar_month_counter = Counter(lunar_months)
    for month, count in sorted(lunar_month_counter.items()):
        print(f"  {month}月: {count}天")
    
    print(f"\n🌸 季節分布:")
    season_counter = Counter(seasons)
    for season, count in season_counter.items():
        print(f"  {season}: {count}天")
    
    print(f"\n🏗️  建除分布:")
    builds_counter = Counter(builds)
    for build, count in builds_counter.items():
        print(f"  {build}日: {count}天")
    
    # 分析問題
    print(f"\n❌ 發現的問題:")
    
    # 檢查是否只有特定月份
    unique_lunar_months = set(lunar_months)
    if len(unique_lunar_months) <= 2:
        print(f"  1. 農曆月份覆蓋太少: 只有 {unique_lunar_months}")
    
    # 檢查季節覆蓋
    unique_seasons = set(seasons)
    if len(unique_seasons) <= 2:
        print(f"  2. 季節覆蓋不足: 只有 {unique_seasons}")
    
    # 檢查西曆月份覆蓋
    unique_months = set([date.split('-')[1] for date in dates])
    if len(unique_months) <= 2:
        print(f"  3. 西曆月份覆蓋太少: 只有 {unique_months}")
    
    print(f"\n💡 建議:")
    print(f"  1. 需要收集更多不同月份的資料")
    print(f"  2. 需要涵蓋四季的資料")
    print(f"  3. 需要更多不同農曆月份的資料")
    print(f"  4. 考慮建立基於建除的基礎規則，而不是依賴特定月份")

def analyze_failed_cases():
    """分析失敗案例，找出規律"""
    
    print(f"\n" + "="*60)
    print(f"🔍 分析失敗案例")
    print(f"="*60)
    
    failed_cases = [
        {
            'date': '2025-06-15',
            'builds': '收',
            'ganzhi_day': '乙卯',
            'lunar_month': 5,
            'season': '夏季',
            'website_stars': ['往亡', '朱雀勾絞'],
            'website_level': '大凶'
        },
        {
            'date': '2025-07-20',
            'builds': '危',
            'ganzhi_day': '庚寅',
            'lunar_month': 6,
            'season': '夏季',
            'website_stars': [],
            'website_level': '吉'
        }
    ]
    
    print(f"分析失敗案例，看看是否能找出新的規律:")
    
    for case in failed_cases:
        print(f"\n📅 {case['date']}:")
        print(f"  建除: {case['builds']}")
        print(f"  日干支: {case['ganzhi_day']}")
        print(f"  農曆月: {case['lunar_month']}")
        print(f"  季節: {case['season']}")
        print(f"  網站星煞: {case['website_stars']}")
        print(f"  網站等級: {case['website_level']}")
        
        # 分析可能的規律
        if '往亡' in case['website_stars']:
            print(f"  往亡規律: 收日 + 乙卯 + 5月 + 夏季")
        
        if '朱雀勾絞' in case['website_stars']:
            print(f"  朱雀勾絞規律: 收日 + 乙卯 + 5月 + 夏季")
        
        if case['builds'] == '危' and case['website_level'] == '吉':
            print(f"  危日可能是吉: 危日 + 庚寅 + 6月 + 夏季")

def suggest_improvements():
    """建議改進方案"""
    
    print(f"\n" + "="*60)
    print(f"💡 改進建議")
    print(f"="*60)
    
    print(f"1. 🎯 短期解決方案:")
    print(f"   - 承認我們的規則有限制，只適用於特定時間範圍")
    print(f"   - 對於規則外的情況，使用建除的基礎判斷")
    print(f"   - 添加免責聲明，說明準確度限制")
    
    print(f"\n2. 🔧 中期改進:")
    print(f"   - 收集更多不同月份的網站資料")
    print(f"   - 重新分析星煞規律，建立更通用的規則")
    print(f"   - 建立基於多重條件的判斷邏輯")
    
    print(f"\n3. 🚀 長期目標:")
    print(f"   - 找到董公擇日的真正計算公式")
    print(f"   - 建立完整的星煞計算系統")
    print(f"   - 達到商業級的準確度")
    
    print(f"\n4. 🎨 實用建議:")
    print(f"   - 先專注於建除的基礎判斷（這個相對準確）")
    print(f"   - 星煞系統作為輔助功能")
    print(f"   - 提供多種資訊來源的比對")

if __name__ == "__main__":
    analyze_sample_coverage()
    analyze_failed_cases()
    suggest_improvements()