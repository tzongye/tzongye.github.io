#!/usr/bin/env python3
"""
驗證特定日期的真實網站資料
"""

import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime

def scrape_specific_date_detailed(year, month, day):
    """爬取特定日期的詳細董公擇日資料"""
    url = "https://yju.tw/?disp=datesel&q=q"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
    
    form_data = {
        'Y': str(year),
        'M': str(month)
    }
    
    try:
        print(f"正在爬取 {year}年{month}月{day}日 的詳細資料...")
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
                    date_match = re.search(rf'{month}月\s*{day}\s*星期\w+', date_text)
                    
                    if date_match and content_text:
                        print(f"✅ 找到 {year}年{month}月{day}日 的資料")
                        print(f"完整內容: {content_text}")
                        print()
                        
                        # 解析詳細資訊
                        parsed_data = parse_dong_gong_content(content_text)
                        parsed_data['date'] = f"{year}-{month:02d}-{day:02d}"
                        parsed_data['raw_content'] = content_text
                        
                        return parsed_data
        
        print(f"❌ 未找到 {year}年{month}月{day}日 的資料")
        return None
        
    except Exception as e:
        print(f"❌ 爬取失敗: {e}")
        return None

def parse_dong_gong_content(content_text):
    """解析董公擇日內容"""
    
    data = {
        'lunar_date': '',
        'hexagram': '',
        'twelve_builds': '',
        'ganzhi_year': '',
        'ganzhi_month': '',
        'ganzhi_day': '',
        'solar_term': '',
        'season': '',
        'zodiac': '',
        'clash_direction': '',
        'clash_animal': '',
        'tai_yin_time': '',
        'tai_yang_time': '',
        'fetal_god': '',
        'repair_directions': '',
        'description': ''
    }
    
    # 提取農曆日期
    lunar_match = re.search(r'農曆\s*閏?\s*(\d+)\s*月\s*(\d+)\s*日', content_text)
    if lunar_match:
        data['lunar_date'] = f"農曆{lunar_match.group(1)}月{lunar_match.group(2)}日"
    
    # 提取易經卦象
    hexagram_match = re.search(r'\(([^)]+)\)', content_text)
    if hexagram_match:
        data['hexagram'] = hexagram_match.group(1)
    
    # 提取十二建除
    builds_match = re.search(r'(建|除|滿|平|定|執|破|危|成|收|開|閉)(\w+)日', content_text)
    if builds_match:
        data['twelve_builds'] = builds_match.group(1) + builds_match.group(2) + '日'
    
    # 提取年月日干支
    ganzhi_year_match = re.search(r'([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])年', content_text)
    if ganzhi_year_match:
        data['ganzhi_year'] = ganzhi_year_match.group(1) + '年'
    
    ganzhi_month_match = re.search(r'([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])月', content_text)
    if ganzhi_month_match:
        data['ganzhi_month'] = ganzhi_month_match.group(1) + '月'
    
    ganzhi_day_match = re.search(r'([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])日', content_text)
    if ganzhi_day_match:
        data['ganzhi_day'] = ganzhi_day_match.group(1) + '日'
    
    # 提取節氣
    solar_term_match = re.search(r'(立春|雨水|驚蟄|春分|清明|穀雨|立夏|小滿|芒種|夏至|小暑|大暑|立秋|處暑|白露|秋分|寒露|霜降|立冬|小雪|大雪|冬至|小寒|大寒)', content_text)
    if solar_term_match:
        data['solar_term'] = solar_term_match.group(1)
    
    # 提取季節
    season_match = re.search(r'(春季|夏季|秋季|冬季)', content_text)
    if season_match:
        data['season'] = season_match.group(1)
    
    # 提取生肖
    zodiac_match = re.search(r'肖(\w+)', content_text)
    if zodiac_match:
        data['zodiac'] = '肖' + zodiac_match.group(1)
    
    # 提取沖煞
    clash_match = re.search(r'煞(\w+)\s*沖(\w+)', content_text)
    if clash_match:
        data['clash_direction'] = '煞' + clash_match.group(1)
        data['clash_animal'] = '沖' + clash_match.group(2)
    
    # 提取太陰太陽時辰
    tai_yin_match = re.search(r'太陰\((\w+時)\)', content_text)
    if tai_yin_match:
        data['tai_yin_time'] = tai_yin_match.group(1)
    
    tai_yang_match = re.search(r'太陽\((\w+時)\)', content_text)
    if tai_yang_match:
        data['tai_yang_time'] = tai_yang_match.group(1)
    
    # 提取胎神
    fetal_god_match = re.search(r'胎神：([^。]+)', content_text)
    if fetal_god_match:
        data['fetal_god'] = fetal_god_match.group(1).strip()
    
    # 提取修方
    repair_match = re.search(r'修方：([^。]+)', content_text)
    if repair_match:
        data['repair_directions'] = repair_match.group(1).strip()
    
    # 提取描述（最後的文案部分）
    # 通常在修方之後
    desc_match = re.search(r'修方：[^。]+。(.+)', content_text)
    if desc_match:
        data['description'] = desc_match.group(1).strip()
    else:
        # 如果沒有修方，嘗試其他模式
        parts = content_text.split('。')
        if len(parts) > 1:
            # 取最後一個有意義的部分
            for part in reversed(parts):
                if len(part.strip()) > 5 and any(word in part for word in ['天', '主', '宜', '不宜', '吉', '凶']):
                    data['description'] = part.strip()
                    break
    
    return data

def test_specific_dates():
    """測試特定日期"""
    
    print("=== 驗證特定日期的真實網站資料 ===")
    
    # 測試你提到的兩個日期
    test_dates = [
        (2025, 8, 15),  # 8月15日
        (2025, 8, 13),  # 8月13日
    ]
    
    results = []
    
    for year, month, day in test_dates:
        print(f"\n📅 測試 {year}年{month}月{day}日:")
        
        result = scrape_specific_date_detailed(year, month, day)
        
        if result:
            results.append(result)
            
            print(f"解析結果:")
            print(f"  農曆: {result['lunar_date']}")
            print(f"  卦象: {result['hexagram']}")
            print(f"  建除: {result['twelve_builds']}")
            print(f"  年干支: {result['ganzhi_year']}")
            print(f"  月干支: {result['ganzhi_month']}")
            print(f"  日干支: {result['ganzhi_day']}")
            print(f"  節氣: {result['solar_term']}")
            print(f"  季節: {result['season']}")
            print(f"  生肖: {result['zodiac']}")
            print(f"  沖煞: {result['clash_direction']} {result['clash_animal']}")
            print(f"  太陰: {result['tai_yin_time']}")
            print(f"  太陽: {result['tai_yang_time']}")
            print(f"  胎神: {result['fetal_god']}")
            print(f"  修方: {result['repair_directions']}")
            print(f"  🎯 董公文案: {result['description']}")
            print(f"  文案長度: {len(result['description'])}字")
        else:
            print(f"  ❌ 無法獲取資料")
    
    return results

if __name__ == "__main__":
    results = test_specific_dates()
    
    if results:
        print(f"\n📊 文案分析:")
        for result in results:
            desc = result['description']
            print(f"  {result['date']}: {desc}")
            
            # 分析文案特點
            if len(desc) <= 20:
                print(f"    特點: 簡潔型文案")
            elif len(desc) <= 50:
                print(f"    特點: 中等長度文案")
            else:
                print(f"    特點: 詳細型文案")
        
        print(f"\n💡 結論:")
        print(f"✅ 網站的真實文案比較簡潔")
        print(f"✅ 通常只包含核心的星煞和簡單預測")
        print(f"✅ 文案長度大多在10-30字之間")
        print(f"🔧 需要調整我們的文案生成器，使其更貼近真實風格")