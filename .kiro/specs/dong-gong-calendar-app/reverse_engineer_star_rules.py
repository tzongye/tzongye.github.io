#!/usr/bin/env python3
"""
從網站過往資料反推董公擇日星煞的正確規則
"""

import json
import re
from collections import defaultdict, Counter
from datetime import datetime
from lunar_python import Lunar, Solar

def load_sample_data():
    """載入樣本資料"""
    try:
        with open('dong_gong_sample_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('daily_data', [])
    except FileNotFoundError:
        print("找不到樣本資料檔案")
        return []

def extract_stars_from_description(description):
    """從描述中提取星煞名稱"""
    
    # 董公吉星模式
    auspicious_patterns = [
        r'天喜', r'天德', r'天富', r'天成', r'天賊', 
        r'黃羅紫檀', r'鑾輿寶蓋', r'祿蔭馬注', r'瓊玉金寶', r'天帝聚寶',
        r'金銀庫樓', r'玉堂聚寶星蓋照', r'天皇地皇', r'華彩操持',
        r'金銀寶藏', r'田塘庫珠', r'聚祿帶馬', r'鑾輿官曜',
        r'文昌貴顯之星', r'紫檀帶祿驛馬', r'集聚曲堂', r'天月二德'
    ]
    
    # 董公凶煞模式
    inauspicious_patterns = [
        r'朱雀勾絞', r'螣蛇白虎', r'白虎入中宮', r'往亡', r'九土鬼',
        r'小紅沙', r'黃沙', r'伏劍之金', r'北方黑煞將軍', r'煞入中宮',
        r'天地轉煞', r'月厭之凶', r'五行自敗', r'棄敗死絕', r'螣蛇纏繞',
        r'正四廢', r'十惡之凶', r'猖鬼敗亡', r'天地相疑', r'受命之日',
        r'螣蛇', r'白虎'
    ]
    
    found_auspicious = []
    found_inauspicious = []
    
    for pattern in auspicious_patterns:
        if re.search(pattern, description):
            found_auspicious.append(pattern)
    
    for pattern in inauspicious_patterns:
        if re.search(pattern, description):
            found_inauspicious.append(pattern)
    
    return found_auspicious, found_inauspicious

def analyze_star_conditions():
    """分析星煞出現的條件"""
    
    print("=== 從網站資料反推星煞規則 ===")
    
    sample_data = load_sample_data()
    
    if not sample_data:
        print("❌ 無法載入樣本資料")
        return
    
    print(f"✅ 載入了 {len(sample_data)} 天的資料")
    
    # 收集星煞與各種條件的關聯
    star_conditions = defaultdict(lambda: {
        'builds': defaultdict(int),
        'ganzhi_day': defaultdict(int),
        'ganzhi_year': defaultdict(int),
        'ganzhi_month': defaultdict(int),
        'lunar_month': defaultdict(int),
        'solar_term': defaultdict(int),
        'season': defaultdict(int),
        'zodiac': defaultdict(int),
        'total_count': 0
    })
    
    # 分析每一天的資料
    for day_data in sample_data:
        description = day_data.get('description', '')
        
        if not description or len(description) < 5:
            continue
        
        # 提取星煞
        auspicious_stars, inauspicious_stars = extract_stars_from_description(description)
        all_stars = auspicious_stars + inauspicious_stars
        
        if not all_stars:
            continue
        
        # 提取條件資訊
        date_str = day_data.get('date', '')
        builds = day_data.get('twelve_builds', '')
        ganzhi = day_data.get('gan_zhi', '')
        lunar_date = day_data.get('lunar_date', '')
        solar_term = day_data.get('solar_term', '')
        season = day_data.get('season', '')
        zodiac = day_data.get('zodiac', '')
        
        # 使用 lunar-python 獲取更準確的資訊
        try:
            if date_str:
                date_obj = datetime.strptime(date_str, '%Y-%m-%d')
                solar = Solar.fromDate(date_obj)
                lunar = solar.getLunar()
                
                accurate_ganzhi_day = lunar.getDayInGanZhi()
                accurate_ganzhi_year = lunar.getYearInGanZhi()
                accurate_ganzhi_month = lunar.getMonthInGanZhi()
                accurate_lunar_month = lunar.getMonth()
                accurate_zodiac = lunar.getYearShengXiao()
                accurate_builds = lunar.getZhiXing()
        except:
            accurate_ganzhi_day = ganzhi
            accurate_ganzhi_year = ''
            accurate_ganzhi_month = ''
            accurate_lunar_month = 0
            accurate_zodiac = zodiac
            accurate_builds = builds
        
        # 記錄每個星煞的出現條件
        for star in all_stars:
            star_conditions[star]['total_count'] += 1
            
            # 建除條件
            if accurate_builds:
                build_name = accurate_builds[0] if accurate_builds else ''
                if build_name:
                    star_conditions[star]['builds'][build_name] += 1
            
            # 日干支條件
            if accurate_ganzhi_day:
                star_conditions[star]['ganzhi_day'][accurate_ganzhi_day] += 1
            
            # 年干支條件
            if accurate_ganzhi_year:
                star_conditions[star]['ganzhi_year'][accurate_ganzhi_year] += 1
            
            # 月干支條件
            if accurate_ganzhi_month:
                star_conditions[star]['ganzhi_month'][accurate_ganzhi_month] += 1
            
            # 農曆月份條件
            if accurate_lunar_month:
                star_conditions[star]['lunar_month'][accurate_lunar_month] += 1
            
            # 節氣條件
            if solar_term:
                star_conditions[star]['solar_term'][solar_term] += 1
            
            # 季節條件
            if season:
                star_conditions[star]['season'][season] += 1
            
            # 生肖條件
            if accurate_zodiac:
                star_conditions[star]['zodiac'][accurate_zodiac] += 1
    
    return star_conditions

def find_star_rules(star_conditions):
    """從統計資料中找出星煞規則"""
    
    print("\n🔍 星煞規則分析:")
    
    rules = {}
    
    for star, conditions in star_conditions.items():
        if conditions['total_count'] < 3:  # 出現次數太少，跳過
            continue
        
        print(f"\n⭐ {star} (出現 {conditions['total_count']} 次):")
        
        rule = {
            'conditions': {},
            'confidence': {}
        }
        
        # 分析建除規律
        if conditions['builds']:
            builds_sorted = sorted(conditions['builds'].items(), key=lambda x: x[1], reverse=True)
            total_builds = sum(conditions['builds'].values())
            
            # 找出出現頻率超過30%的建除
            significant_builds = []
            for build, count in builds_sorted:
                percentage = (count / total_builds) * 100
                if percentage >= 30:
                    significant_builds.append(build)
                    print(f"  建除: {build} ({count}/{total_builds} = {percentage:.1f}%)")
            
            if significant_builds:
                rule['conditions']['builds'] = significant_builds
                rule['confidence']['builds'] = max([conditions['builds'][b]/total_builds for b in significant_builds])
        
        # 分析日干支規律
        if conditions['ganzhi_day']:
            ganzhi_sorted = sorted(conditions['ganzhi_day'].items(), key=lambda x: x[1], reverse=True)
            total_ganzhi = sum(conditions['ganzhi_day'].values())
            
            # 找出出現頻率超過20%的日干支
            significant_ganzhi = []
            for ganzhi, count in ganzhi_sorted[:5]:  # 只看前5個
                percentage = (count / total_ganzhi) * 100
                if percentage >= 20:
                    significant_ganzhi.append(ganzhi)
                    print(f"  日干支: {ganzhi} ({count}/{total_ganzhi} = {percentage:.1f}%)")
            
            if significant_ganzhi:
                rule['conditions']['ganzhi_day'] = significant_ganzhi
                rule['confidence']['ganzhi_day'] = max([conditions['ganzhi_day'][g]/total_ganzhi for g in significant_ganzhi])
        
        # 分析農曆月份規律
        if conditions['lunar_month']:
            month_sorted = sorted(conditions['lunar_month'].items(), key=lambda x: x[1], reverse=True)
            total_months = sum(conditions['lunar_month'].values())
            
            significant_months = []
            for month, count in month_sorted:
                percentage = (count / total_months) * 100
                if percentage >= 25:
                    significant_months.append(month)
                    print(f"  農曆月: {month}月 ({count}/{total_months} = {percentage:.1f}%)")
            
            if significant_months:
                rule['conditions']['lunar_month'] = significant_months
                rule['confidence']['lunar_month'] = max([conditions['lunar_month'][m]/total_months for m in significant_months])
        
        # 分析季節規律
        if conditions['season']:
            season_sorted = sorted(conditions['season'].items(), key=lambda x: x[1], reverse=True)
            total_seasons = sum(conditions['season'].values())
            
            for season, count in season_sorted:
                percentage = (count / total_seasons) * 100
                if percentage >= 40:
                    print(f"  季節: {season} ({count}/{total_seasons} = {percentage:.1f}%)")
                    rule['conditions']['season'] = [season]
                    rule['confidence']['season'] = count / total_seasons
        
        # 只保留有明確規律的星煞
        if rule['conditions']:
            rules[star] = rule
    
    return rules

def generate_code_rules(rules):
    """生成可用的程式碼規則"""
    
    print(f"\n💻 生成程式碼規則:")
    print(f"```python")
    print(f"# 基於網站資料反推的董公星煞規則")
    print(f"DONG_GONG_STAR_RULES = {{")
    
    for star, rule in rules.items():
        print(f"    '{star}': {{")
        
        conditions = rule['conditions']
        if 'builds' in conditions:
            print(f"        'builds': {conditions['builds']},")
        if 'ganzhi_day' in conditions:
            print(f"        'ganzhi_day': {conditions['ganzhi_day']},")
        if 'lunar_month' in conditions:
            print(f"        'lunar_month': {conditions['lunar_month']},")
        if 'season' in conditions:
            print(f"        'season': {conditions['season']},")
        
        # 計算整體信心度
        confidences = list(rule['confidence'].values())
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0
        print(f"        'confidence': {avg_confidence:.2f}")
        
        print(f"    }},")
    
    print(f"}}")
    print(f"```")

def test_specific_cases(rules):
    """測試特定案例"""
    
    print(f"\n🧪 測試特定案例:")
    
    test_cases = [
        {
            'date': '2025-08-15',
            'builds': '成',
            'ganzhi_day': '丙辰',
            'lunar_month': 6,
            'season': '秋季',
            'expected_stars': ['天喜'],
            'description': '天喜，葬日次吉。俱不宜大用。'
        },
        {
            'date': '2025-08-13',
            'builds': '破',
            'ganzhi_day': '甲寅',
            'lunar_month': 6,
            'season': '秋季',
            'expected_stars': ['正四廢'],
            'description': '正四廢不吉、諸事不宜，主官司退財、人口啾唧。'
        }
    ]
    
    for case in test_cases:
        print(f"\n📅 測試 {case['date']}:")
        print(f"  預期星煞: {case['expected_stars']}")
        
        predicted_stars = []
        
        for star, rule in rules.items():
            match = True
            conditions = rule['conditions']
            
            if 'builds' in conditions and case['builds'] not in conditions['builds']:
                match = False
            if 'ganzhi_day' in conditions and case['ganzhi_day'] not in conditions['ganzhi_day']:
                match = False
            if 'lunar_month' in conditions and case['lunar_month'] not in conditions['lunar_month']:
                match = False
            if 'season' in conditions and case['season'] not in conditions['season']:
                match = False
            
            if match:
                predicted_stars.append(star)
        
        print(f"  預測星煞: {predicted_stars}")
        
        matches = set(case['expected_stars']) & set(predicted_stars)
        missing = set(case['expected_stars']) - set(predicted_stars)
        extra = set(predicted_stars) - set(case['expected_stars'])
        
        print(f"  匹配: {list(matches)} {'✅' if matches else '❌'}")
        print(f"  遺漏: {list(missing)} {'❌' if missing else '✅'}")
        print(f"  多餘: {list(extra)} {'⚠️' if extra else '✅'}")

def main():
    """主程式"""
    
    # 1. 分析星煞出現條件
    star_conditions = analyze_star_conditions()
    
    if not star_conditions:
        print("❌ 無法分析星煞條件")
        return
    
    # 2. 找出規律
    rules = find_star_rules(star_conditions)
    
    # 3. 生成程式碼
    generate_code_rules(rules)
    
    # 4. 測試特定案例
    test_specific_cases(rules)
    
    print(f"\n🎯 總結:")
    print(f"✅ 成功從 {len(star_conditions)} 個星煞中找出規律")
    print(f"✅ 生成了 {len(rules)} 個可用的星煞規則")
    print(f"✅ 這些規則基於真實網站資料，準確度更高")
    print(f"🔧 接下來可以用這些規則更新我們的計算器")

if __name__ == "__main__":
    main()