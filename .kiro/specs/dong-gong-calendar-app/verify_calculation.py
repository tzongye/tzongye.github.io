#!/usr/bin/env python3
"""
董公擇日計算驗證程式
比較我們的計算結果與 yju.tw 的真實資料
"""

import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
import time
from dong_gong_calculator import DongGongCalculator

def scrape_specific_date(year, month, day):
    """爬取特定日期的董公擇日資料"""
    url = "https://yju.tw/?disp=datesel&q=q"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
    
    form_data = {
        'Y': str(year),
        'M': str(month)
    }
    
    try:
        print(f"正在爬取 {year}年{month}月{day}日 的真實資料...")
        response = requests.post(url, data=form_data, headers=headers)
        response.raise_for_status()
        
        # 解析 HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 尋找指定日期的資料
        tables = soup.find_all('table')
        
        for table in tables:
            rows = table.find_all('tr')
            
            for row in rows:
                cells = row.find_all('td')
                
                if len(cells) >= 2:
                    date_cell = cells[0]
                    content_cell = cells[1]
                    
                    date_text = date_cell.get_text(strip=True)
                    content_text = content_cell.get_text(strip=True)
                    
                    # 檢查是否為目標日期
                    date_match = re.search(rf'{month}月{day}星期\w+', date_text)
                    
                    if date_match and content_text:
                        # 解析董公資料
                        data = {
                            'date': f"{year}-{month:02d}-{day:02d}",
                            'raw_text': content_text,
                            'lunar_date': '',
                            'twelve_builds': '',
                            'gan_zhi': '',
                            'yijing_hexagram': '',
                            'season': '',
                            'solar_term': '',
                            'zodiac': '',
                            'clash_direction': '',
                            'clash_animal': '',
                            'description': '',
                            'auspicious_stars': [],
                            'inauspicious_stars': []
                        }
                        
                        # 提取農曆日期
                        lunar_match = re.search(r'農曆.*?(\d+)\s*月\s*(\d+)\s*日', content_text)
                        if lunar_match:
                            data['lunar_date'] = f"{lunar_match.group(1)}月{lunar_match.group(2)}日"
                        
                        # 提取易經卦象
                        hexagram_match = re.search(r'\(([^)]+)\)', content_text)
                        if hexagram_match:
                            data['yijing_hexagram'] = hexagram_match.group(1)
                        
                        # 提取十二建除
                        builds_match = re.search(r'(建|除|滿|平|定|執|破|危|成|收|開|閉)(\w+)日', content_text)
                        if builds_match:
                            data['twelve_builds'] = builds_match.group(1) + builds_match.group(2) + '日'
                        
                        # 提取干支
                        ganzhi_match = re.search(r'([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])日', content_text)
                        if ganzhi_match:
                            data['gan_zhi'] = ganzhi_match.group(1) + '日'
                        
                        # 提取季節
                        season_match = re.search(r'(春季|夏季|秋季|冬季)', content_text)
                        if season_match:
                            data['season'] = season_match.group(1)
                        
                        # 提取節氣
                        term_match = re.search(r'(立春|雨水|驚蟄|春分|清明|穀雨|立夏|小滿|芒種|夏至|小暑|大暑|立秋|處暑|白露|秋分|寒露|霜降|立冬|小雪|大雪|冬至|小寒|大寒)', content_text)
                        if term_match:
                            data['solar_term'] = term_match.group(1)
                        
                        # 提取生肖
                        zodiac_match = re.search(r'肖(\w+)', content_text)
                        if zodiac_match:
                            data['zodiac'] = '肖' + zodiac_match.group(1)
                        
                        # 提取沖煞
                        clash_match = re.search(r'煞(\w+)\s*沖(\w+)', content_text)
                        if clash_match:
                            data['clash_direction'] = '煞' + clash_match.group(1)
                            data['clash_animal'] = '沖' + clash_match.group(2)
                        
                        # 提取吉星
                        auspicious_patterns = [
                            r'黃羅紫檀', r'鑾輿寶蓋', r'祿蔭馬注', r'瓊玉金寶', r'天帝聚寶',
                            r'金銀庫樓', r'玉堂聚寶星蓋照', r'天皇地皇', r'華彩操持',
                            r'金銀寶藏', r'田塘庫珠', r'聚祿帶馬', r'鑾輿官曜',
                            r'文昌貴顯之星', r'紫檀帶祿驛馬', r'集聚曲堂', r'天德', r'天喜',
                            r'天富', r'天成', r'天月二德', r'天賊'
                        ]
                        
                        for pattern in auspicious_patterns:
                            if re.search(pattern, content_text):
                                data['auspicious_stars'].append(pattern)
                        
                        # 提取凶煞
                        inauspicious_patterns = [
                            r'朱雀勾絞', r'螣蛇白虎', r'白虎入中宮', r'往亡', r'九土鬼',
                            r'小紅沙', r'黃沙', r'伏劍之金', r'北方黑煞將軍', r'煞入中宮',
                            r'天地轉煞', r'月厭之凶', r'五行自敗', r'棄敗死絕', r'螣蛇纏繞',
                            r'正四廢', r'十惡之凶', r'猖鬼敗亡', r'天地相疑', r'受命之日'
                        ]
                        
                        for pattern in inauspicious_patterns:
                            if re.search(pattern, content_text):
                                data['inauspicious_stars'].append(pattern)
                        
                        # 提取描述
                        desc_match = re.search(r'修方：.*?。(.+)', content_text)
                        if desc_match:
                            data['description'] = desc_match.group(1).strip()
                        elif '。' in content_text:
                            parts = content_text.split('。')
                            if len(parts) > 1:
                                data['description'] = parts[-1].strip()
                        
                        return data
        
        print(f"未找到 {year}年{month}月{day}日 的資料")
        return None
        
    except Exception as e:
        print(f"爬取失敗: {e}")
        return None

def compare_results(real_data, calculated_data):
    """比較真實資料與計算結果"""
    
    print("=== 比較結果 ===\n")
    
    # 基本資訊比較
    print("📅 基本資訊比較:")
    print(f"日期: {real_data['date']}")
    print(f"真實干支: {real_data['gan_zhi']}")
    print(f"計算干支: {calculated_data['ganzhi']}")
    print(f"干支匹配: {'✅' if real_data['gan_zhi'] == calculated_data['ganzhi'] else '❌'}")
    
    print(f"真實建除: {real_data['twelve_builds']}")
    print(f"計算建除: {calculated_data['twelve_builds']}")
    print(f"建除匹配: {'✅' if real_data['twelve_builds'] == calculated_data['twelve_builds'] else '❌'}")
    
    # 吉星比較
    print(f"\n⭐ 吉星比較:")
    real_auspicious = set(real_data['auspicious_stars'])
    calc_auspicious = set([star['name'] for star in calculated_data['auspicious_stars']])
    
    print(f"真實吉星: {list(real_auspicious)}")
    print(f"計算吉星: {list(calc_auspicious)}")
    
    common_auspicious = real_auspicious & calc_auspicious
    missing_auspicious = real_auspicious - calc_auspicious
    extra_auspicious = calc_auspicious - real_auspicious
    
    print(f"匹配吉星: {list(common_auspicious)} ({'✅' if common_auspicious else '❌'})")
    if missing_auspicious:
        print(f"遺漏吉星: {list(missing_auspicious)} ❌")
    if extra_auspicious:
        print(f"多餘吉星: {list(extra_auspicious)} ⚠️")
    
    # 凶煞比較
    print(f"\n💀 凶煞比較:")
    real_inauspicious = set(real_data['inauspicious_stars'])
    calc_inauspicious = set([star['name'] for star in calculated_data['inauspicious_stars']])
    
    print(f"真實凶煞: {list(real_inauspicious)}")
    print(f"計算凶煞: {list(calc_inauspicious)}")
    
    common_inauspicious = real_inauspicious & calc_inauspicious
    missing_inauspicious = real_inauspicious - calc_inauspicious
    extra_inauspicious = calc_inauspicious - real_inauspicious
    
    print(f"匹配凶煞: {list(common_inauspicious)} ({'✅' if common_inauspicious else '❌'})")
    if missing_inauspicious:
        print(f"遺漏凶煞: {list(missing_inauspicious)} ❌")
    if extra_inauspicious:
        print(f"多餘凶煞: {list(extra_inauspicious)} ⚠️")
    
    # 整體評估
    print(f"\n📊 整體評估:")
    print(f"計算評分: {calculated_data['overall_score']}分")
    print(f"計算等級: {calculated_data['summary']}")
    print(f"計算理由: {'; '.join(calculated_data['reasons'])}")
    
    # 準確度計算
    total_checks = 4  # 干支、建除、吉星、凶煞
    correct_checks = 0
    
    if real_data['gan_zhi'] == calculated_data['ganzhi']:
        correct_checks += 1
    if real_data['twelve_builds'] == calculated_data['twelve_builds']:
        correct_checks += 1
    if common_auspicious:
        correct_checks += 1
    if common_inauspicious:
        correct_checks += 1
    
    accuracy = (correct_checks / total_checks) * 100
    print(f"\n🎯 準確度: {accuracy:.1f}% ({correct_checks}/{total_checks})")
    
    return {
        'accuracy': accuracy,
        'ganzhi_match': real_data['gan_zhi'] == calculated_data['ganzhi'],
        'builds_match': real_data['twelve_builds'] == calculated_data['twelve_builds'],
        'auspicious_match': len(common_auspicious) > 0,
        'inauspicious_match': len(common_inauspicious) > 0,
        'common_auspicious': list(common_auspicious),
        'common_inauspicious': list(common_inauspicious),
        'missing_auspicious': list(missing_auspicious),
        'missing_inauspicious': list(missing_inauspicious)
    }

def main():
    """主程式 - 驗證指定日期"""
    
    # 測試日期：2025年8月15日
    test_date = datetime(2025, 8, 15)
    year, month, day = test_date.year, test_date.month, test_date.day
    
    print(f"=== 董公擇日計算驗證 ===")
    print(f"測試日期: {year}年{month}月{day}日\n")
    
    # 1. 爬取真實資料
    real_data = scrape_specific_date(year, month, day)
    
    if not real_data:
        print("❌ 無法獲取真實資料，驗證失敗")
        return
    
    print("✅ 成功獲取真實資料")
    
    # 2. 使用我們的計算引擎計算
    try:
        calculator = DongGongCalculator('dong_gong_patterns.json')
        calculated_data = calculator.calculate_dong_gong_analysis(test_date)
        print("✅ 成功計算董公擇日分析")
    except Exception as e:
        print(f"❌ 計算失敗: {e}")
        return
    
    # 3. 比較結果
    comparison = compare_results(real_data, calculated_data)
    
    # 4. 顯示原始資料
    print(f"\n📋 真實資料詳情:")
    print(f"農曆: {real_data['lunar_date']}")
    print(f"卦象: {real_data['yijing_hexagram']}")
    print(f"季節: {real_data['season']}")
    print(f"節氣: {real_data['solar_term']}")
    print(f"生肖: {real_data['zodiac']}")
    print(f"沖煞: {real_data['clash_direction']} {real_data['clash_animal']}")
    print(f"描述: {real_data['description'][:200]}...")
    
    # 5. 儲存驗證結果
    verification_result = {
        'test_date': test_date.strftime('%Y-%m-%d'),
        'real_data': real_data,
        'calculated_data': calculated_data,
        'comparison': comparison,
        'verification_time': datetime.now().isoformat()
    }
    
    with open(f'verification_result_{year}{month:02d}{day:02d}.json', 'w', encoding='utf-8') as f:
        json.dump(verification_result, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 驗證結果已儲存至 verification_result_{year}{month:02d}{day:02d}.json")
    
    # 6. 總結
    if comparison['accuracy'] >= 75:
        print(f"\n🎉 驗證成功！準確度達到 {comparison['accuracy']:.1f}%")
    elif comparison['accuracy'] >= 50:
        print(f"\n⚠️  驗證部分成功，準確度 {comparison['accuracy']:.1f}%，需要改進")
    else:
        print(f"\n❌ 驗證失敗，準確度僅 {comparison['accuracy']:.1f}%，需要重新檢討計算邏輯")

if __name__ == "__main__":
    main()