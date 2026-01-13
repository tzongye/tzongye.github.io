#!/usr/bin/env python3
"""
基於反推規則的改進星煞計算器
"""

from datetime import datetime
from lunar_python import Lunar, Solar

# 基於網站資料反推的董公星煞規則
DONG_GONG_STAR_RULES = {
    '天喜': {
        'builds': ['成'],
        'ganzhi_day': ['癸卯', '丙辰', '戊辰'],
        'lunar_month': [6, 7],  # 修正：閏6月 = 6月
        'season': ['夏季', '秋季'],  # 放寬季節限制
        'confidence': 0.67
    },
    '正四廢': {
        'builds': ['破', '危', '除'],
        'ganzhi_day': ['甲寅', '乙卯', '辛酉'],
        'lunar_month': [6, 7],  # 修正：閏6月 = 6月
        'season': ['夏季', '秋季'],  # 放寬季節限制
        'confidence': 0.67
    },
    '天德': {
        'builds': ['收', '危'],
        'ganzhi_day': ['甲辰', '丁卯'],
        'lunar_month': [6, 7],
        'season': ['夏季', '秋季'],
        'confidence': 0.50
    },
    '天富': {
        'builds': ['滿'],
        'ganzhi_day': ['庚戌', '壬戌'],
        'lunar_month': [6, 7],
        'season': ['夏季', '秋季'],
        'confidence': 0.88
    },
    '天成': {
        'builds': ['閉', '開'],
        'ganzhi_day': ['乙巳', '己未', '辛未'],
        'lunar_month': [6, 7],
        'season': ['夏季', '秋季'],
        'confidence': 0.58
    },
    '往亡': {
        'builds': ['除', '閉'],
        'ganzhi_day': ['丙午', '己酉', '辛酉'],
        'lunar_month': [6, 7],
        'season': ['夏季', '秋季'],
        'confidence': 0.67
    },
    '朱雀勾絞': {
        'builds': ['收'],
        'ganzhi_day': ['丁巳', '壬戌', '乙丑', '己巳'],
        'lunar_month': [6, 7],
        'season': ['夏季', '秋季'],
        'confidence': 0.56
    },
    '螣蛇纏繞': {
        'builds': ['平'],
        'ganzhi_day': ['辛亥', '癸亥'],
        'lunar_month': [6, 7],
        'season': ['夏季', '秋季'],
        'confidence': 0.88
    },
    '煞入中宮': {
        'builds': ['執', '建'],
        'ganzhi_day': ['癸丑', '庚申'],
        'lunar_month': [6, 7],
        'season': ['夏季', '秋季'],
        'confidence': 0.75
    }
}

class ImprovedStarCalculator:
    """改進的星煞計算器"""
    
    def __init__(self):
        self.star_rules = DONG_GONG_STAR_RULES
    
    def calculate_stars_for_date(self, date: datetime) -> dict:
        """計算指定日期的星煞"""
        
        try:
            # 使用 lunar-python 獲取準確資訊
            solar = Solar.fromDate(date)
            lunar = solar.getLunar()
            
            # 提取條件
            conditions = {
                'builds': lunar.getZhiXing(),
                'ganzhi_day': lunar.getDayInGanZhi(),
                'lunar_month': abs(lunar.getMonth()),  # 處理閏月
                'season': self._get_season(date)
            }
            
            print(f"📅 {date.strftime('%Y-%m-%d')} 的條件:")
            print(f"  建除: {conditions['builds']}")
            print(f"  日干支: {conditions['ganzhi_day']}")
            print(f"  農曆月: {conditions['lunar_month']}")
            print(f"  季節: {conditions['season']}")
            
            # 匹配星煞
            matched_stars = []
            
            for star_name, rule in self.star_rules.items():
                if self._check_star_match(star_name, rule, conditions):
                    matched_stars.append({
                        'name': star_name,
                        'confidence': rule['confidence'],
                        'match_reasons': self._get_match_reasons(rule, conditions)
                    })
            
            return {
                'date': date.strftime('%Y-%m-%d'),
                'conditions': conditions,
                'matched_stars': matched_stars
            }
            
        except Exception as e:
            return {
                'error': f'計算失敗: {str(e)}',
                'date': date.strftime('%Y-%m-%d')
            }
    
    def _check_star_match(self, star_name: str, rule: dict, conditions: dict) -> bool:
        """檢查星煞是否匹配"""
        
        # 建除必須匹配
        if 'builds' in rule:
            if conditions['builds'] not in rule['builds']:
                return False
        
        # 日干支必須匹配（如果有指定）
        if 'ganzhi_day' in rule:
            if conditions['ganzhi_day'] not in rule['ganzhi_day']:
                return False
        
        # 農曆月份匹配（放寬條件）
        if 'lunar_month' in rule:
            if conditions['lunar_month'] not in rule['lunar_month']:
                # 如果不完全匹配，檢查是否相近
                if not any(abs(conditions['lunar_month'] - m) <= 1 for m in rule['lunar_month']):
                    return False
        
        # 季節匹配（放寬條件）
        if 'season' in rule:
            if conditions['season'] not in rule['season']:
                return False
        
        return True
    
    def _get_match_reasons(self, rule: dict, conditions: dict) -> list:
        """獲取匹配理由"""
        reasons = []
        
        if 'builds' in rule and conditions['builds'] in rule['builds']:
            reasons.append(f"建除匹配: {conditions['builds']}")
        
        if 'ganzhi_day' in rule and conditions['ganzhi_day'] in rule['ganzhi_day']:
            reasons.append(f"日干支匹配: {conditions['ganzhi_day']}")
        
        if 'lunar_month' in rule and conditions['lunar_month'] in rule['lunar_month']:
            reasons.append(f"農曆月匹配: {conditions['lunar_month']}")
        
        if 'season' in rule and conditions['season'] in rule['season']:
            reasons.append(f"季節匹配: {conditions['season']}")
        
        return reasons
    
    def _get_season(self, date: datetime) -> str:
        """根據日期判斷季節"""
        month = date.month
        
        if month in [3, 4, 5]:
            return '春季'
        elif month in [6, 7, 8]:
            return '夏季'
        elif month in [9, 10, 11]:
            return '秋季'
        else:
            return '冬季'

def test_improved_calculator():
    """測試改進的計算器"""
    
    print("=== 測試改進的星煞計算器 ===")
    
    calculator = ImprovedStarCalculator()
    
    # 測試關鍵日期
    test_dates = [
        (datetime(2025, 8, 15), ['天喜'], "天喜，葬日次吉。俱不宜大用。"),
        (datetime(2025, 8, 13), ['正四廢'], "正四廢不吉、諸事不宜，主官司退財、人口啾唧。"),
        (datetime(1989, 12, 7), [], "測試歷史日期"),
    ]
    
    for date, expected_stars, description in test_dates:
        print(f"\n{'='*60}")
        print(f"🧪 測試: {date.strftime('%Y年%m月%d日')}")
        print(f"預期星煞: {expected_stars}")
        print(f"網站文案: {description}")
        
        result = calculator.calculate_stars_for_date(date)
        
        if 'error' not in result:
            matched_stars = [star['name'] for star in result['matched_stars']]
            
            print(f"\n🎯 計算結果:")
            print(f"  匹配星煞: {matched_stars}")
            
            # 詳細匹配資訊
            for star in result['matched_stars']:
                print(f"    • {star['name']} (信心度: {star['confidence']:.2f})")
                for reason in star['match_reasons']:
                    print(f"      - {reason}")
            
            # 準確度評估
            matches = set(expected_stars) & set(matched_stars)
            missing = set(expected_stars) - set(matched_stars)
            extra = set(matched_stars) - set(expected_stars)
            
            print(f"\n📊 準確度評估:")
            print(f"  匹配: {list(matches)} {'✅' if matches else '❌'}")
            print(f"  遺漏: {list(missing)} {'❌' if missing else '✅'}")
            print(f"  多餘: {list(extra)} {'⚠️' if extra else '✅'}")
            
            if expected_stars:
                accuracy = len(matches) / len(expected_stars) * 100
                print(f"  準確度: {accuracy:.1f}%")
        else:
            print(f"❌ {result['error']}")

if __name__ == "__main__":
    test_improved_calculator()