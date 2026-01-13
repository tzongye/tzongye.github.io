#!/usr/bin/env python3
"""
修正版董公擇日爬蟲 - 基於實際 HTML 結構
"""

import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
import time

def scrape_single_month(year, month):
    """爬取單月資料"""
    url = "https://yju.tw/?disp=datesel&q=q"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
    
    form_data = {
        'Y': str(year),
        'M': str(month)
    }
    
    try:
        print(f"正在請求 {year}年{month}月 的資料...")
        response = requests.post(url, data=form_data, headers=headers)
        response.raise_for_status()
        
        # 解析 HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        daily_data = []
        
        # 尋找所有包含日期的表格行
        tables = soup.find_all('table')
        
        for table in tables:
            rows = table.find_all('tr')
            
            for row in rows:
                cells = row.find_all('td')
                
                if len(cells) >= 2:
                    # 第一個 cell 通常包含日期
                    date_cell = cells[0]
                    content_cell = cells[1]
                    
                    # 檢查是否包含日期格式
                    date_text = date_cell.get_text(strip=True)
                    content_text = content_cell.get_text(strip=True)
                    
                    # 尋找日期模式：8月1星期五
                    date_match = re.search(rf'{month}月(\d+)星期\w+', date_text)
                    
                    if date_match and content_text:
                        day = int(date_match.group(1))
                        
                        # 解析這一天的董公資料
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
                            'description': ''
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
                        
                        # 提取描述（通常在修方之後）
                        desc_match = re.search(r'修方：.*?。(.+)', content_text)
                        if desc_match:
                            data['description'] = desc_match.group(1).strip()
                        elif '。' in content_text:
                            # 如果沒有修方，取最後一個句號後的內容
                            parts = content_text.split('。')
                            if len(parts) > 1:
                                data['description'] = parts[-1].strip()
                        
                        daily_data.append(data)
        
        print(f"成功解析出 {len(daily_data)} 天的資料")
        return daily_data
        
    except Exception as e:
        print(f"爬取失敗: {e}")
        return []

def extract_terms_from_data(daily_data):
    """從資料中提取董公術語"""
    
    # 董公吉星
    auspicious_stars = set()
    auspicious_patterns = [
        r'黃羅紫檀', r'鑾輿寶蓋', r'祿蔭馬注', r'瓊玉金寶', r'天帝聚寶',
        r'金銀庫樓', r'玉堂聚寶星蓋照', r'天皇地皇', r'華彩操持',
        r'金銀寶藏', r'田塘庫珠', r'聚祿帶馬', r'鑾輿官曜',
        r'文昌貴顯之星', r'紫檀帶祿驛馬', r'集聚曲堂', r'天德', r'天喜',
        r'天富', r'天成', r'天月二德', r'天賊'
    ]
    
    # 董公凶煞
    inauspicious_stars = set()
    inauspicious_patterns = [
        r'朱雀勾絞', r'螣蛇白虎', r'白虎入中宮', r'往亡', r'九土鬼',
        r'小紅沙', r'黃沙', r'伏劍之金', r'北方黑煞將軍', r'煞入中宮',
        r'天地轉煞', r'月厭之凶', r'五行自敗', r'棄敗死絕', r'螣蛇纏繞',
        r'正四廢', r'十惡之凶', r'猖鬼敗亡', r'天地相疑', r'受命之日'
    ]
    
    # 活動事項
    activities = set()
    activity_patterns = [
        r'嫁娶', r'婚姻', r'起造', r'興工', r'動土', r'入宅', r'開張', r'出行',
        r'安葬', r'埋葬', r'修造', r'開山', r'斬草', r'豎柱', r'作倉', r'牛羊欄圈',
        r'上官', r'定磉', r'拴架', r'造作', r'營謀', r'遠行', r'移居'
    ]
    
    # 後果描述
    consequences = set()
    consequence_patterns = [
        r'生貴子', r'進橫財', r'旺田產', r'興六畜', r'家業興旺',
        r'人口興旺', r'富貴雍穆', r'改換門庭', r'家道隆昌',
        r'招官司', r'損人口', r'退財', r'疾病纏綿', r'家門衰敗',
        r'益子孫', r'增房產', r'添人口', r'興子孫', r'獲財成家'
    ]
    
    # 分析所有資料
    for day in daily_data:
        text = day.get('description', '') + ' ' + day.get('raw_text', '')
        
        # 提取吉星
        for pattern in auspicious_patterns:
            if re.search(pattern, text):
                auspicious_stars.add(pattern)
        
        # 提取凶煞
        for pattern in inauspicious_patterns:
            if re.search(pattern, text):
                inauspicious_stars.add(pattern)
        
        # 提取活動
        for pattern in activity_patterns:
            if re.search(pattern, text):
                activities.add(pattern)
        
        # 提取後果
        for pattern in consequence_patterns:
            if re.search(pattern, text):
                consequences.add(pattern)
    
    return {
        'auspicious_stars': sorted(list(auspicious_stars)),
        'inauspicious_stars': sorted(list(inauspicious_stars)),
        'activities': sorted(list(activities)),
        'consequences': sorted(list(consequences))
    }

def main():
    print("開始爬取2025年8月的董公擇日資料...")
    
    monthly_data = scrape_single_month(2025, 8)
    
    if monthly_data:
        print(f"成功爬取 {len(monthly_data)} 天的資料")
        
        # 顯示前3天的資料
        for i, day_data in enumerate(monthly_data[:3]):
            print(f"\n=== {day_data['date']} ===")
            print(f"農曆: {day_data['lunar_date']}")
            print(f"十二建: {day_data['twelve_builds']}")
            print(f"干支: {day_data['gan_zhi']}")
            print(f"卦象: {day_data['yijing_hexagram']}")
            print(f"季節: {day_data['season']}")
            print(f"節氣: {day_data['solar_term']}")
            print(f"生肖: {day_data['zodiac']}")
            print(f"沖煞: {day_data['clash_direction']} {day_data['clash_animal']}")
            print(f"描述: {day_data['description'][:100]}...")
        
        # 提取董公術語
        terms = extract_terms_from_data(monthly_data)
        
        print(f"\n=== 提取的董公術語 ===")
        print(f"吉星 ({len(terms['auspicious_stars'])}): {terms['auspicious_stars']}")
        print(f"凶煞 ({len(terms['inauspicious_stars'])}): {terms['inauspicious_stars']}")
        print(f"活動 ({len(terms['activities'])}): {terms['activities']}")
        print(f"後果 ({len(terms['consequences'])}): {terms['consequences']}")
        
        # 儲存資料
        result_data = {
            'daily_data': monthly_data,
            'extracted_terms': terms,
            'total_days': len(monthly_data),
            'scrape_date': datetime.now().isoformat()
        }
        
        with open('dong_gong_sample_data.json', 'w', encoding='utf-8') as f:
            json.dump(result_data, f, ensure_ascii=False, indent=2)
        
        print(f"\n資料已儲存至 dong_gong_sample_data.json")
    else:
        print("爬取失敗")

if __name__ == "__main__":
    main()