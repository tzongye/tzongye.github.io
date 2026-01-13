#!/usr/bin/env python3
"""
簡化版董公擇日爬蟲 - 快速測試
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
        
        print(f"請求成功，狀態碼: {response.status_code}")
        
        # 解析 HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 提取文字內容
        text_content = soup.get_text()
        print(f"提取到 {len(text_content)} 字元的內容")
        
        # 儲存原始 HTML 以供檢查
        with open('debug_response.html', 'w', encoding='utf-8') as f:
            f.write(response.text)
        print("原始 HTML 已儲存至 debug_response.html")
        
        # 分析董公資料
        daily_data = []
        
        # 尋找日期模式 - 使用你之前提供的實際格式
        date_pattern = r'(\d+月\s*\d+\s*星期\w+農曆.*?)(?=\d+月|\Z)'
        matches = re.finditer(date_pattern, text_content, re.DOTALL)
        
        match_count = 0
        for match in matches:
            match_count += 1
            full_text = match.group(1)
            
            # 提取日期
            day_match = re.search(r'(\d+)月\s*(\d+)\s*星期', full_text)
            if not day_match:
                continue
            
            day = int(day_match.group(2))
            
            # 提取基本資訊
            data = {
                'date': f"{year}-{month:02d}-{day:02d}",
                'raw_text': full_text,
                'lunar_date': '',
                'twelve_builds': '',
                'gan_zhi': '',
                'yijing_hexagram': '',
                'season': '',
                'description': ''
            }
            
            # 提取農曆
            lunar_match = re.search(r'農曆\s*(.*?)\s*日', full_text)
            if lunar_match:
                data['lunar_date'] = lunar_match.group(1)
            
            # 提取十二建除
            builds_match = re.search(r'(建|除|滿|平|定|執|破|危|成|收|開|閉)(\w+)日', full_text)
            if builds_match:
                data['twelve_builds'] = builds_match.group(1) + builds_match.group(2) + '日'
            
            # 提取干支
            ganzhi_match = re.search(r'([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])日', full_text)
            if ganzhi_match:
                data['gan_zhi'] = ganzhi_match.group(1) + '日'
            
            # 提取易經卦象
            hexagram_match = re.search(r'\(([^)]+)\)', full_text)
            if hexagram_match:
                data['yijing_hexagram'] = hexagram_match.group(1)
            
            # 提取季節
            season_match = re.search(r'(春季|夏季|秋季|冬季)', full_text)
            if season_match:
                data['season'] = season_match.group(1)
            
            # 提取描述（修方之後的內容）
            desc_match = re.search(r'修方：.*?。(.+)', full_text)
            if desc_match:
                data['description'] = desc_match.group(1)
            
            daily_data.append(data)
        
        print(f"找到 {match_count} 個日期匹配，解析出 {len(daily_data)} 天的資料")
        return daily_data
        
    except Exception as e:
        print(f"爬取失敗: {e}")
        return []

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
            print(f"描述: {day_data['description'][:100]}...")
        
        # 儲存資料
        result_data = {
            'daily_data': monthly_data,
            'total_days': len(monthly_data)
        }
        
        with open('dong_gong_sample_data.json', 'w', encoding='utf-8') as f:
            json.dump(result_data, f, ensure_ascii=False, indent=2)
        
        print(f"\n資料已儲存至 dong_gong_sample_data.json")
    else:
        print("爬取失敗")

if __name__ == "__main__":
    main()