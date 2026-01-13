#!/usr/bin/env python3
"""
測試四個隨機日期，先計算再去網站核對
"""

from datetime import datetime
from improved_star_calculator import ImprovedStarCalculator
import requests
from bs4 import BeautifulSoup
import re
import time

def test_four_random_dates():
    """測試四個不同類型的日期"""
    
    print("=== 測試四個隨機日期的準確度 ===")
    
    calculator = ImprovedStarCalculator()
    
    # 選擇四個不同的日期（不同月份、不同建除）
    test_dates = [
        datetime(2025, 9, 10),   # 秋季，不同月份
        datetime(2025, 7, 20),   # 夏季，不同月份  
        datetime(2025, 10, 5),   # 秋季，更晚的月份
        datetime(2025, 6, 15),   # 夏季，更早的月份
    ]
    
    results = []
    
    for i, date in enumerate(test_dates, 1):
        print(f"\n{'='*60}")
        print(f"🧪 測試 {i}: {date.strftime('%Y年%m月%d日')}")
        
        # 1. 先用我們的邏輯計算
        our_result = calculator.calculate_stars_for_date(date)
        
        if 'error' not in our_result:
            conditions = our_result['conditions']
            matched_stars = [star['name'] for star in our_result['matched_stars']]
            
            print(f"\n🤖 我們的計算結果:")
            print(f"  建除: {conditions['builds']}")
            print(f"  日干支: {conditions['ganzhi_day']}")
            print(f"  農曆月: {conditions['lunar_month']}")
            print(f"  季節: {conditions['season']}")
            print(f"  預測星煞: {matched_stars}")
            
            # 生成預測文案
            if matched_stars:
                if any('廢' in star or '煞' in star or '往亡' in star or '螣蛇' in star for star in matched_stars):
                    predicted_description = f"{matched_stars[0]}，諸事不宜，凶。"
                else:
                    predicted_description = f"{matched_stars[0]}，次吉。"
            else:
                if conditions['builds'] in ['破', '危']:
                    predicted_description = f"{conditions['builds']}日，諸事不宜，凶。"
                elif conditions['builds'] in ['成', '開', '滿']:
                    predicted_description = f"{conditions['builds']}日，次吉。"
                else:
                    predicted_description = f"{conditions['builds']}日，平。"
            
            print(f"  預測文案: {predicted_description}")
            
            # 2. 去網站核對
            print(f"\n🌐 正在查詢網站真實資料...")
            website_result = scrape_website_data(date)
            
            if website_result:
                print(f"  網站文案: {website_result}")
                
                # 3. 比較結果
                accuracy = compare_results(matched_stars, predicted_description, website_result)
                
                results.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'our_stars': matched_stars,
                    'our_description': predicted_description,
                    'website_description': website_result,
                    'accuracy': accuracy
                })
            else:
                print(f"  ❌ 無法獲取網站資料")
                results.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'our_stars': matched_stars,
                    'our_description': predicted_description,
                    'website_description': '無法獲取',
                    'accuracy': 'unknown'
                })
        else:
            print(f"❌ 計算失敗: {our_result['error']}")
        
        # 避免請求過於頻繁
        time.sleep(2)
    
    # 4. 總結結果
    print_summary(results)
    
    return results

def scrape_website_data(date):
    """爬取網站資料"""
    
    url = "https://yju.tw/?disp=datesel&q=q"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
    
    form_data = {
        'Y': str(date.year),
        'M': str(date.month)
    }
    
    try:
        response = requests.post(url, data=form_data, headers=headers, timeout=10)
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
                    date_match = re.search(rf'{date.month}月\s*{date.day}\s*星期\w+', date_text)
                    
                    if date_match and content_text and len(content_text) > 20:
                        # 提取描述（最後的文案部分）
                        desc_match = re.search(r'修方：[^。]+。(.+)', content_text)
                        if desc_match:
                            return desc_match.group(1).strip()
                        else:
                            # 如果沒有修方，嘗試其他模式
                            parts = content_text.split('。')
                            if len(parts) > 1:
                                for part in reversed(parts):
                                    if len(part.strip()) > 5 and any(word in part for word in ['天', '主', '宜', '不宜', '吉', '凶', '廢']):
                                        return part.strip()
        
        return None
        
    except Exception as e:
        print(f"    爬取失敗: {e}")
        return None

def compare_results(our_stars, our_description, website_description):
    """比較我們的結果與網站結果"""
    
    print(f"\n📊 結果比較:")
    print(f"  我們預測: {our_description}")
    print(f"  網站實際: {website_description}")
    
    # 提取網站的星煞
    website_stars = extract_stars_from_text(website_description)
    
    print(f"  我們星煞: {our_stars}")
    print(f"  網站星煞: {website_stars}")
    
    # 計算匹配度
    if our_stars and website_stars:
        matches = set(our_stars) & set(website_stars)
        missing = set(website_stars) - set(our_stars)
        extra = set(our_stars) - set(website_stars)
        
        print(f"  匹配星煞: {list(matches)} {'✅' if matches else '❌'}")
        print(f"  遺漏星煞: {list(missing)} {'❌' if missing else '✅'}")
        print(f"  多餘星煞: {list(extra)} {'⚠️' if extra else '✅'}")
        
        if website_stars:
            accuracy = len(matches) / len(website_stars) * 100
            print(f"  星煞準確度: {accuracy:.1f}%")
            return accuracy
    
    # 如果沒有星煞，比較文案風格
    our_level = extract_fortune_level(our_description)
    website_level = extract_fortune_level(website_description)
    
    print(f"  我們等級: {our_level}")
    print(f"  網站等級: {website_level}")
    
    if our_level == website_level:
        print(f"  等級匹配: ✅")
        return 100
    else:
        print(f"  等級匹配: ❌")
        return 0

def extract_stars_from_text(text):
    """從文字中提取星煞名稱"""
    
    star_patterns = [
        r'天喜', r'天德', r'天富', r'天成', r'天賊', 
        r'黃羅紫檀', r'正四廢', r'朱雀勾絞', r'螣蛇纏繞', r'往亡', 
        r'煞入中宮', r'九土鬼', r'小紅沙', r'黃沙', r'天地轉煞',
        r'白虎入中宮', r'白虎', r'螣蛇'
    ]
    
    found_stars = []
    for pattern in star_patterns:
        if re.search(pattern, text):
            found_stars.append(pattern)
    
    return found_stars

def extract_fortune_level(text):
    """從文字中提取吉凶等級"""
    
    if '大吉' in text:
        return '大吉'
    elif '次吉' in text or '吉' in text:
        return '吉'
    elif '大凶' in text:
        return '大凶'
    elif '凶' in text:
        return '凶'
    else:
        return '平'

def print_summary(results):
    """打印總結"""
    
    print(f"\n{'='*60}")
    print(f"📈 測試總結")
    print(f"{'='*60}")
    
    total_tests = len(results)
    successful_tests = len([r for r in results if r['accuracy'] != 'unknown'])
    
    if successful_tests > 0:
        accuracies = [r['accuracy'] for r in results if isinstance(r['accuracy'], (int, float))]
        avg_accuracy = sum(accuracies) / len(accuracies) if accuracies else 0
        
        print(f"總測試數: {total_tests}")
        print(f"成功測試: {successful_tests}")
        print(f"平均準確度: {avg_accuracy:.1f}%")
        
        print(f"\n詳細結果:")
        for result in results:
            accuracy_str = f"{result['accuracy']:.1f}%" if isinstance(result['accuracy'], (int, float)) else result['accuracy']
            print(f"  {result['date']}: {accuracy_str}")
            print(f"    我們: {result['our_description']}")
            print(f"    網站: {result['website_description']}")
        
        if avg_accuracy >= 80:
            print(f"\n🎉 準確度優秀！系統可以投入使用")
        elif avg_accuracy >= 60:
            print(f"\n✅ 準確度良好，可以繼續優化")
        else:
            print(f"\n⚠️  準確度需要改進")
    else:
        print(f"❌ 無法獲取足夠的網站資料進行比較")

if __name__ == "__main__":
    test_four_random_dates()