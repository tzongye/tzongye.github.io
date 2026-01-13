#!/usr/bin/env python3
"""
分析董公擇日文案的規律和生成邏輯
理解每個文案背後的原因和規則
"""

import json
import re
from collections import defaultdict, Counter
from datetime import datetime

def analyze_dong_gong_descriptions():
    """分析董公擇日文案的規律"""
    
    print("=== 董公擇日文案分析 ===")
    
    # 載入樣本資料
    try:
        with open('dong_gong_sample_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            daily_data = data.get('daily_data', [])
    except FileNotFoundError:
        print("找不到樣本資料")
        return
    
    # 提取有效的描述文案
    descriptions = []
    for day in daily_data:
        desc = day.get('description', '').strip()
        if desc and len(desc) > 10:  # 過濾掉太短的描述
            descriptions.append({
                'date': day.get('date'),
                'builds': day.get('twelve_builds', ''),
                'ganzhi': day.get('gan_zhi', ''),
                'description': desc
            })
    
    print(f"找到 {len(descriptions)} 個有效文案")
    print()
    
    # 1. 分析文案結構
    analyze_description_structure(descriptions)
    
    # 2. 分析吉星凶煞與文案的關係
    analyze_stars_and_descriptions(descriptions)
    
    # 3. 分析建除與文案的關係
    analyze_builds_and_descriptions(descriptions)
    
    # 4. 分析結果預測模式
    analyze_prediction_patterns(descriptions)
    
    # 5. 生成文案模板
    generate_description_templates(descriptions)

def analyze_description_structure(descriptions):
    """分析文案結構"""
    
    print("📝 文案結構分析:")
    
    # 分析文案的組成部分
    structure_patterns = {
        'stars_mentioned': 0,      # 提到星煞
        'activities_mentioned': 0,  # 提到活動
        'predictions_mentioned': 0, # 提到預測結果
        'time_mentioned': 0,       # 提到時間期限
        'warnings_mentioned': 0    # 提到警告
    }
    
    for desc_info in descriptions:
        desc = desc_info['description']
        
        # 檢查是否提到星煞
        star_patterns = ['天喜', '天德', '天富', '天成', '天賊', '黃羅紫檀', '朱雀勾絞', '螣蛇', '往亡', '煞入中宮']
        if any(star in desc for star in star_patterns):
            structure_patterns['stars_mentioned'] += 1
        
        # 檢查是否提到活動
        activity_patterns = ['嫁娶', '開張', '入宅', '出行', '動土', '埋葬', '起造', '修造']
        if any(activity in desc for activity in activity_patterns):
            structure_patterns['activities_mentioned'] += 1
        
        # 檢查是否提到預測結果
        prediction_patterns = ['生貴子', '進橫財', '家業興旺', '人口興旺', '田產', '貴人接引']
        if any(pred in desc for pred in prediction_patterns):
            structure_patterns['predictions_mentioned'] += 1
        
        # 檢查是否提到時間
        time_patterns = ['六十日', '一百二十日', '三年', '九年']
        if any(time in desc for time in time_patterns):
            structure_patterns['time_mentioned'] += 1
        
        # 檢查是否提到警告
        warning_patterns = ['不宜', '大凶', '忌之', '切不可用', '諸事不宜']
        if any(warning in desc for warning in warning_patterns):
            structure_patterns['warnings_mentioned'] += 1
    
    total = len(descriptions)
    for pattern, count in structure_patterns.items():
        percentage = (count / total) * 100
        print(f"  {pattern}: {count}/{total} ({percentage:.1f}%)")
    
    print()

def analyze_stars_and_descriptions(descriptions):
    """分析吉星凶煞與文案的關係"""
    
    print("⭐ 吉星凶煞與文案關係:")
    
    # 吉星對應的文案模式
    auspicious_patterns = {
        '天喜': [],
        '天德': [],
        '天富': [],
        '天成': [],
        '天賊': [],
        '黃羅紫檀': []
    }
    
    # 凶煞對應的文案模式
    inauspicious_patterns = {
        '朱雀勾絞': [],
        '螣蛇纏繞': [],
        '往亡': [],
        '煞入中宮': [],
        '正四廢': []
    }
    
    for desc_info in descriptions:
        desc = desc_info['description']
        
        # 分析吉星
        for star in auspicious_patterns.keys():
            if star in desc:
                auspicious_patterns[star].append(desc)
        
        # 分析凶煞
        for star in inauspicious_patterns.keys():
            if star in desc or star.replace('纏繞', '') in desc:
                inauspicious_patterns[star].append(desc)
    
    print("  吉星文案模式:")
    for star, descs in auspicious_patterns.items():
        if descs:
            print(f"    {star} ({len(descs)}個):")
            for desc in descs[:2]:  # 只顯示前2個例子
                print(f"      • {desc[:80]}...")
    
    print()
    print("  凶煞文案模式:")
    for star, descs in inauspicious_patterns.items():
        if descs:
            print(f"    {star} ({len(descs)}個):")
            for desc in descs[:2]:  # 只顯示前2個例子
                print(f"      • {desc[:80]}...")
    
    print()

def analyze_builds_and_descriptions(descriptions):
    """分析建除與文案的關係"""
    
    print("🏗️  建除與文案關係:")
    
    builds_patterns = defaultdict(list)
    
    for desc_info in descriptions:
        builds = desc_info['builds']
        desc = desc_info['description']
        
        if builds and desc:
            # 提取建除名稱（去掉地支）
            build_name = builds[0] if builds else ''
            if build_name:
                builds_patterns[build_name].append(desc)
    
    for build, descs in builds_patterns.items():
        if descs:
            print(f"  {build}日 ({len(descs)}個文案):")
            
            # 分析這個建除的文案特點
            positive_count = sum(1 for desc in descs if any(word in desc for word in ['吉', '利', '宜', '次吉', '大吉']))
            negative_count = sum(1 for desc in descs if any(word in desc for word in ['凶', '不宜', '忌', '不利']))
            
            print(f"    正面文案: {positive_count}, 負面文案: {negative_count}")
            
            # 顯示代表性文案
            if descs:
                print(f"    代表文案: {descs[0][:100]}...")
    
    print()

def analyze_prediction_patterns(descriptions):
    """分析預測結果模式"""
    
    print("🔮 預測結果模式分析:")
    
    # 正面預測
    positive_predictions = [
        '生貴子', '進橫財', '家業興旺', '人口興旺', '田產興旺',
        '貴人接引', '富貴雍穆', '招財獲福', '人眷安康', '益子孫'
    ]
    
    # 負面預測
    negative_predictions = [
        '損人口', '退財', '官司', '疾病纏綿', '家門衰敗',
        '橫禍', '人口啾唧', '遭凶', '不離床席'
    ]
    
    # 時間期限
    time_periods = ['六十日', '一百二十日', '三年', '六年', '九年']
    
    positive_count = 0
    negative_count = 0
    time_count = 0
    
    for desc_info in descriptions:
        desc = desc_info['description']
        
        if any(pred in desc for pred in positive_predictions):
            positive_count += 1
        
        if any(pred in desc for pred in negative_predictions):
            negative_count += 1
        
        if any(time in desc for time in time_periods):
            time_count += 1
    
    total = len(descriptions)
    print(f"  正面預測: {positive_count}/{total} ({positive_count/total*100:.1f}%)")
    print(f"  負面預測: {negative_count}/{total} ({negative_count/total*100:.1f}%)")
    print(f"  包含時間期限: {time_count}/{total} ({time_count/total*100:.1f}%)")
    
    print()

def generate_description_templates(descriptions):
    """生成文案模板"""
    
    print("📋 文案生成模板:")
    
    # 分析文案的基本結構
    templates = {
        'auspicious_with_stars': {
            'pattern': '{stars}，{activities}、{predictions}，{level}。',
            'examples': []
        },
        'inauspicious_with_stars': {
            'pattern': '{stars}、{negative_effects}，{warnings}！',
            'examples': []
        },
        'neutral_activities': {
            'pattern': '{condition}，{activities}，{predictions}。',
            'examples': []
        },
        'warning_only': {
            'pattern': '{stars}，{warnings}。',
            'examples': []
        }
    }
    
    # 提取文案組件
    stars_components = {
        'auspicious': ['天喜', '天德', '天富', '天成', '天賊', '黃羅紫檀', '鑾輿寶蓋', '祿蔭馬注', '瓊玉金寶', '天帝聚寶'],
        'inauspicious': ['朱雀勾絞', '螣蛇纏繞', '往亡', '煞入中宮', '正四廢', '白虎入中宮', '九土鬼']
    }
    
    activities_components = {
        'suitable': ['利造作入宅', '開張出行婚姻', '嫁娶修造埋葬', '動土開山斬草', '起造安葬'],
        'unsuitable': ['不利遠行起造入宅婚姻', '諸事不宜', '不宜用事', '切不可用']
    }
    
    predictions_components = {
        'positive': ['主益子孫旺田產', '進橫財增房產生貴子', '家業興旺人口興旺', '貴人接引進產業', '招財獲福田產興旺人眷安康'],
        'negative': ['主官司退財人口啾唧', '損人口遭官司口舌橫禍', '家門衰敗疾病纏綿', '招官司是非']
    }
    
    time_components = ['六十日、一百二十日內', '三、六、九年', '一年內']
    
    level_components = ['次吉', '大吉', '大凶', '凶']
    
    print("  文案組件庫:")
    print(f"    吉星: {len(stars_components['auspicious'])}個")
    print(f"    凶煞: {len(stars_components['inauspicious'])}個")
    print(f"    適宜活動: {len(activities_components['suitable'])}個")
    print(f"    不宜活動: {len(activities_components['unsuitable'])}個")
    print(f"    正面預測: {len(predictions_components['positive'])}個")
    print(f"    負面預測: {len(predictions_components['negative'])}個")
    
    print()
    print("  生成模板示例:")
    
    # 吉日模板
    print("    吉日模板:")
    print("      天喜，有黃羅紫檀鑾輿寶蓋祿蔭馬注並瓊玉金寶天帝聚寶諸吉星照臨、利造作入宅、開張出行婚姻等事、主益子孫旺田產、進橫財、增房產、生貴子、次吉。")
    
    # 凶日模板
    print("    凶日模板:")
    print("      朱雀勾絞、白虎入中宮、用之主招官司是非、家門衰敗損、人口、疾病纏綿、一起一倒、不離床席、大凶忌之！")
    
    # 一般日模板
    print("    一般日模板:")
    print("      如開山埋葬營謀百事，六十日、一百二十日內、生貴子家業興旺、貴人接引進產業，次吉。不利遠行起造入宅婚姻、緣為鬼神凶宅之疑耳。")
    
    return {
        'stars_components': stars_components,
        'activities_components': activities_components,
        'predictions_components': predictions_components,
        'time_components': time_components,
        'level_components': level_components
    }

def understand_description_logic():
    """理解文案背後的邏輯"""
    
    print("\n" + "="*60)
    print("🧠 文案生成邏輯分析")
    print("="*60)
    
    print("董公擇日文案的生成邏輯:")
    print()
    
    print("1. 📊 基礎判斷:")
    print("   • 建除 + 干支 + 星宿 → 確定日子的基本吉凶")
    print("   • 十二建除是主要依據（建除滿平定執破危成收開閉）")
    print("   • 干支組合影響星煞的出現")
    print()
    
    print("2. ⭐ 星煞系統:")
    print("   • 吉星出現 → 正面文案 + 適宜活動 + 正面預測")
    print("   • 凶煞出現 → 負面文案 + 禁忌活動 + 負面預測")
    print("   • 星煞的強弱決定文案的程度（次吉、大吉、大凶等）")
    print()
    
    print("3. 🎯 活動適宜度:")
    print("   • 根據建除特性決定適宜的活動類型")
    print("   • 成日、開日 → 適合開張、嫁娶")
    print("   • 破日、危日 → 諸事不宜")
    print("   • 除日 → 適合清理、醫療")
    print()
    
    print("4. 🔮 預測結果:")
    print("   • 時間期限：六十日、一百二十日（常見）")
    print("   • 正面結果：生貴子、進橫財、家業興旺、貴人接引")
    print("   • 負面結果：損人口、退財、官司、疾病纏綿")
    print()
    
    print("5. 📝 文案結構:")
    print("   • 開頭：星煞名稱或條件描述")
    print("   • 中間：適宜/不宜的活動")
    print("   • 結尾：預測結果 + 時間期限 + 吉凶等級")
    print()
    
    print("6. 🎨 文案風格:")
    print("   • 使用傳統文言文風格")
    print("   • 對仗工整，韻律感強")
    print("   • 具體而生動的描述")
    print("   • 明確的時間和結果預測")

if __name__ == "__main__":
    analyze_dong_gong_descriptions()
    understand_description_logic()