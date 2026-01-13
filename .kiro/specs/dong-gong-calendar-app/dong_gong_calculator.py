#!/usr/bin/env python3
"""
董公擇日計算引擎
基於分析的規律建立計算邏輯
"""

import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional

class DongGongCalculator:
    def __init__(self, patterns_file: str = 'dong_gong_patterns.json'):
        """初始化董公擇日計算器"""
        
        # 載入分析的規律
        try:
            with open(patterns_file, 'r', encoding='utf-8') as f:
                self.patterns = json.load(f)
        except FileNotFoundError:
            print(f"警告: 找不到規律檔案 {patterns_file}，使用預設規律")
            self.patterns = self._get_default_patterns()
        
        # 十二建除循環順序
        self.twelve_builds_cycle = [
            '建', '除', '滿', '平', '定', '執', 
            '破', '危', '成', '收', '開', '閉'
        ]
        
        # 六十甲子循環
        self.gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
        self.zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
        
        # 董公吉星凶煞規則（基於分析結果）
        self.auspicious_rules = self._build_auspicious_rules()
        self.inauspicious_rules = self._build_inauspicious_rules()
        self.activity_rules = self._build_activity_rules()
    
    def _get_default_patterns(self) -> Dict:
        """預設規律（如果沒有分析檔案）"""
        return {
            "twelve_builds_cycle": {
                "frequency": {
                    "建": 24, "除": 8, "滿": 8, "平": 8, "定": 8, "執": 8,
                    "破": 8, "危": 12, "成": 12, "收": 12, "開": 12, "閉": 12
                }
            },
            "auspicious_rules": {
                "frequency": {
                    "天喜": 12, "天德": 8, "天富": 8, "黃羅紫檀": 8
                }
            },
            "inauspicious_rules": {
                "frequency": {
                    "朱雀勾絞": 16, "往亡": 12, "螣蛇纏繞": 8
                }
            }
        }
    
    def _build_auspicious_rules(self) -> Dict:
        """建立吉星判斷規則"""
        rules = {}
        
        # 基於分析結果的吉星規則
        auspicious_data = self.patterns.get('auspicious_rules', {})
        star_builds_mapping = auspicious_data.get('star_builds_mapping', {})
        
        for star, builds_dist in star_builds_mapping.items():
            # 找出這個吉星最常出現的建除
            if builds_dist:
                most_common_build = max(builds_dist.items(), key=lambda x: x[1])[0]
                rules[star] = {
                    'preferred_builds': [most_common_build],
                    'probability': builds_dist.get(most_common_build, 0) / sum(builds_dist.values())
                }
        
        return rules
    
    def _build_inauspicious_rules(self) -> Dict:
        """建立凶煞判斷規則"""
        rules = {}
        
        # 基於分析結果的凶煞規則
        inauspicious_data = self.patterns.get('inauspicious_rules', {})
        star_builds_mapping = inauspicious_data.get('star_builds_mapping', {})
        
        for star, builds_dist in star_builds_mapping.items():
            # 找出這個凶煞最常出現的建除
            if builds_dist:
                most_common_build = max(builds_dist.items(), key=lambda x: x[1])[0]
                rules[star] = {
                    'preferred_builds': [most_common_build],
                    'probability': builds_dist.get(most_common_build, 0) / sum(builds_dist.values())
                }
        
        return rules
    
    def _build_activity_rules(self) -> Dict:
        """建立活動宜忌規則"""
        rules = {}
        
        # 基於分析結果的活動規則
        activity_data = self.patterns.get('activity_rules', {})
        activity_builds_mapping = activity_data.get('activity_builds_mapping', {})
        
        for activity, builds_dist in activity_builds_mapping.items():
            if builds_dist:
                # 計算每個建除對這個活動的適合度
                total_occurrences = sum(builds_dist.values())
                suitability = {}
                
                for build, count in builds_dist.items():
                    suitability[build] = count / total_occurrences
                
                rules[activity] = {
                    'build_suitability': suitability,
                    'most_suitable': max(builds_dist.items(), key=lambda x: x[1])[0]
                }
        
        return rules
    
    def calculate_ganzhi(self, date: datetime) -> str:
        """計算指定日期的干支"""
        # 以1900年1月1日為基準日（庚子日）
        base_date = datetime(1900, 1, 1)
        base_ganzhi_index = 36  # 庚子在六十甲子中的位置
        
        # 計算天數差
        days_diff = (date - base_date).days
        
        # 計算干支索引
        ganzhi_index = (base_ganzhi_index + days_diff) % 60
        
        # 計算天干地支
        gan_index = ganzhi_index % 10
        zhi_index = ganzhi_index % 12
        
        return self.gan[gan_index] + self.zhi[zhi_index]
    
    def calculate_twelve_builds(self, date: datetime) -> str:
        """計算指定日期的十二建除"""
        # 基於農曆月份和日期計算建除
        # 這裡使用簡化的計算方式，實際應該基於農曆
        
        # 使用日期的天數來模擬建除循環
        day_of_year = date.timetuple().tm_yday
        build_index = day_of_year % 12
        
        return self.twelve_builds_cycle[build_index]
    
    def calculate_auspicious_stars(self, date: datetime, builds: str) -> List[Dict]:
        """計算指定日期的吉星"""
        auspicious_stars = []
        
        # 提取建除名稱
        build_name = builds[0] if builds else ''
        
        for star, rule in self.auspicious_rules.items():
            if build_name in rule.get('preferred_builds', []):
                probability = rule.get('probability', 0.5)
                
                # 基於日期和概率決定是否出現
                date_hash = hash(date.strftime('%Y-%m-%d') + star) % 100
                if date_hash < probability * 100:
                    auspicious_stars.append({
                        'name': star,
                        'effect': self._get_star_effect(star, 'auspicious'),
                        'probability': probability
                    })
        
        return auspicious_stars
    
    def calculate_inauspicious_stars(self, date: datetime, builds: str) -> List[Dict]:
        """計算指定日期的凶煞"""
        inauspicious_stars = []
        
        # 提取建除名稱
        build_name = builds[0] if builds else ''
        
        for star, rule in self.inauspicious_rules.items():
            if build_name in rule.get('preferred_builds', []):
                probability = rule.get('probability', 0.3)
                
                # 基於日期和概率決定是否出現
                date_hash = hash(date.strftime('%Y-%m-%d') + star) % 100
                if date_hash < probability * 100:
                    inauspicious_stars.append({
                        'name': star,
                        'effect': self._get_star_effect(star, 'inauspicious'),
                        'severity': self._get_star_severity(star),
                        'probability': probability
                    })
        
        return inauspicious_stars
    
    def _get_star_effect(self, star: str, type: str) -> str:
        """取得星煞的效果說明"""
        effects = {
            'auspicious': {
                '天喜': '主喜慶吉祥，利婚嫁慶典',
                '天德': '逢凶化吉，諸事順利',
                '天富': '主財運亨通，利經商投資',
                '黃羅紫檀': '貴人相助，事業興旺',
                '天成': '利成事，宜開業創始',
                '天賊': '雖名為賊，實為財星，利求財'
            },
            'inauspicious': {
                '朱雀勾絞': '主口舌是非，易有官司',
                '往亡': '主失敗破敗，諸事不利',
                '螣蛇纏繞': '主纏綿不清，易有災禍',
                '煞入中宮': '主大凶，諸事不宜',
                '正四廢': '主廢敗，不宜用事'
            }
        }
        
        return effects.get(type, {}).get(star, '無特殊效果')
    
    def _get_star_severity(self, star: str) -> str:
        """取得凶煞的嚴重程度"""
        severity_map = {
            '煞入中宮': 'severe',
            '正四廢': 'severe',
            '朱雀勾絞': 'medium',
            '螣蛇纏繞': 'medium',
            '往亡': 'light'
        }
        
        return severity_map.get(star, 'light')
    
    def calculate_activity_suitability(self, date: datetime, activity: str, builds: str) -> Dict:
        """計算指定活動在指定日期的適合度"""
        
        # 提取建除名稱
        build_name = builds[0] if builds else ''
        
        # 基礎適合度
        base_score = 50
        
        # 根據活動規則調整分數
        if activity in self.activity_rules:
            rule = self.activity_rules[activity]
            build_suitability = rule.get('build_suitability', {})
            
            if build_name in build_suitability:
                # 根據建除適合度調整分數
                suitability = build_suitability[build_name]
                base_score += int(suitability * 50)  # 最多加50分
        
        # 根據吉星凶煞調整分數
        auspicious_stars = self.calculate_auspicious_stars(date, builds)
        inauspicious_stars = self.calculate_inauspicious_stars(date, builds)
        
        # 吉星加分
        for star in auspicious_stars:
            base_score += 10
        
        # 凶煞扣分
        for star in inauspicious_stars:
            severity = star.get('severity', 'light')
            if severity == 'severe':
                base_score -= 30
            elif severity == 'medium':
                base_score -= 20
            else:
                base_score -= 10
        
        # 確保分數在0-100範圍內
        final_score = max(0, min(100, base_score))
        
        # 判斷等級
        if final_score >= 80:
            level = 'excellent'
        elif final_score >= 60:
            level = 'good'
        elif final_score >= 40:
            level = 'fair'
        elif final_score >= 20:
            level = 'poor'
        else:
            level = 'terrible'
        
        return {
            'score': final_score,
            'level': level,
            'suitable': final_score >= 60,
            'reasons': self._generate_reasons(auspicious_stars, inauspicious_stars, builds),
            'auspicious_stars': auspicious_stars,
            'inauspicious_stars': inauspicious_stars
        }
    
    def _generate_reasons(self, auspicious_stars: List, inauspicious_stars: List, builds: str) -> List[str]:
        """生成吉凶判斷的理由"""
        reasons = []
        
        # 建除理由
        build_name = builds[0] if builds else ''
        if build_name:
            reasons.append(f"今日為{builds}，{self._get_build_meaning(build_name)}")
        
        # 吉星理由
        for star in auspicious_stars:
            reasons.append(f"有{star['name']}吉星，{star['effect']}")
        
        # 凶煞理由
        for star in inauspicious_stars:
            reasons.append(f"犯{star['name']}凶煞，{star['effect']}")
        
        return reasons
    
    def _get_build_meaning(self, build: str) -> str:
        """取得建除的含義"""
        meanings = {
            '建': '宜開創立事，不宜動土',
            '除': '宜清除舊物，利醫療',
            '滿': '宜祭祀嫁娶，諸事吉利',
            '平': '平常之日，可辦一般事務',
            '定': '宜安定簽約，利商業活動',
            '執': '宜執行計畫，利建造',
            '破': '破日大凶，諸事不宜',
            '危': '危險之日，宜謹慎行事',
            '成': '宜成事開業，利重要決定',
            '收': '宜收成納財，利收穫',
            '開': '宜開市出行，百事皆宜',
            '閉': '宜閉藏休息，不宜大事'
        }
        
        return meanings.get(build, '無特殊含義')
    
    def calculate_dong_gong_analysis(self, date: datetime) -> Dict:
        """計算完整的董公擇日分析"""
        
        # 基礎計算
        ganzhi = self.calculate_ganzhi(date)
        builds = self.calculate_twelve_builds(date)
        
        # 星煞計算
        auspicious_stars = self.calculate_auspicious_stars(date, builds)
        inauspicious_stars = self.calculate_inauspicious_stars(date, builds)
        
        # 整體評分
        base_score = 50
        
        # 根據建除調整基礎分數
        build_scores = {
            '建': 70, '除': 60, '滿': 80, '平': 50, '定': 75, '執': 65,
            '破': 20, '危': 30, '成': 85, '收': 75, '開': 90, '閉': 40
        }
        
        build_name = builds[0] if builds else '平'
        base_score = build_scores.get(build_name, 50)
        
        # 吉星加分
        for star in auspicious_stars:
            base_score += 15
        
        # 凶煞扣分
        for star in inauspicious_stars:
            severity = star.get('severity', 'light')
            if severity == 'severe':
                base_score -= 40
            elif severity == 'medium':
                base_score -= 25
            else:
                base_score -= 15
        
        # 確保分數範圍
        final_score = max(0, min(100, base_score))
        
        # 判斷等級
        if final_score >= 85:
            level = 'excellent'
            summary = '大吉'
        elif final_score >= 70:
            level = 'good'
            summary = '吉'
        elif final_score >= 50:
            level = 'fair'
            summary = '平'
        elif final_score >= 30:
            level = 'poor'
            summary = '凶'
        else:
            level = 'terrible'
            summary = '大凶'
        
        return {
            'date': date.strftime('%Y-%m-%d'),
            'ganzhi': ganzhi + '日',
            'twelve_builds': builds,
            'auspicious_stars': auspicious_stars,
            'inauspicious_stars': inauspicious_stars,
            'overall_score': final_score,
            'overall_level': level,
            'summary': summary,
            'reasons': self._generate_reasons(auspicious_stars, inauspicious_stars, builds)
        }

def main():
    """測試董公擇日計算器"""
    import os
    
    # 取得當前檔案的目錄
    current_dir = os.path.dirname(os.path.abspath(__file__))
    patterns_file = os.path.join(current_dir, 'dong_gong_patterns.json')
    
    calculator = DongGongCalculator(patterns_file)
    
    # 測試幾個日期
    test_dates = [
        datetime(2025, 8, 1),
        datetime(2025, 8, 15),
        datetime(2025, 9, 1),
        datetime(2025, 10, 1)
    ]
    
    print("=== 董公擇日計算器測試 ===\n")
    
    for date in test_dates:
        analysis = calculator.calculate_dong_gong_analysis(date)
        
        print(f"日期: {analysis['date']}")
        print(f"干支: {analysis['ganzhi']}")
        print(f"建除: {analysis['twelve_builds']}")
        print(f"整體評分: {analysis['overall_score']} ({analysis['summary']})")
        print(f"吉星: {[star['name'] for star in analysis['auspicious_stars']]}")
        print(f"凶煞: {[star['name'] for star in analysis['inauspicious_stars']]}")
        print(f"判斷理由: {'; '.join(analysis['reasons'])}")
        
        # 測試特定活動
        activities = ['嫁娶', '開張', '入宅', '出行']
        print("活動適合度:")
        for activity in activities:
            suitability = calculator.calculate_activity_suitability(date, activity, analysis['twelve_builds'])
            print(f"  {activity}: {suitability['score']}分 ({suitability['level']})")
        
        print("-" * 50)

if __name__ == "__main__":
    main()