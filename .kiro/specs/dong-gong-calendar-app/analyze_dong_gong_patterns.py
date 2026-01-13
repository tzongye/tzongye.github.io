#!/usr/bin/env python3
"""
分析董公擇日資料規律
從爬取的資料中找出計算邏輯和規則
"""

import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timedelta
import pandas as pd

class DongGongPatternAnalyzer:
    def __init__(self, data_file):
        """載入董公擇日資料"""
        with open(data_file, 'r', encoding='utf-8') as f:
            self.data = json.load(f)
        
        self.daily_data = self.data['daily_data']
        print(f"載入了 {len(self.daily_data)} 天的資料")
        
        # 分析結果
        self.patterns = {
            'twelve_builds_cycle': {},
            'ganzhi_patterns': {},
            'hexagram_patterns': {},
            'auspicious_rules': {},
            'inauspicious_rules': {},
            'activity_rules': {},
            'seasonal_patterns': {}
        }
    
    def analyze_twelve_builds_cycle(self):
        """分析十二建除的循環規律"""
        print("\n=== 分析十二建除循環規律 ===")
        
        builds_sequence = []
        builds_counter = Counter()
        
        for day in self.daily_data:
            builds = day.get('twelve_builds', '')
            if builds:
                # 提取建除名稱
                build_match = re.search(r'(建|除|滿|平|定|執|破|危|成|收|開|閉)', builds)
                if build_match:
                    build_name = build_match.group(1)
                    builds_sequence.append(build_name)
                    builds_counter[build_name] += 1
        
        print(f"十二建除出現頻率:")
        for build, count in builds_counter.most_common():
            print(f"  {build}: {count} 次")
        
        # 分析循環模式
        if len(builds_sequence) > 20:
            print(f"\n前20天的建除序列:")
            print(" -> ".join(builds_sequence[:20]))
            
            # 檢查是否有固定循環
            cycle_length = self.find_cycle_pattern(builds_sequence[:100])
            if cycle_length:
                print(f"發現循環週期: {cycle_length} 天")
        
        self.patterns['twelve_builds_cycle'] = {
            'frequency': dict(builds_counter),
            'sequence_sample': builds_sequence[:50],
            'total_count': len(builds_sequence)
        }
    
    def find_cycle_pattern(self, sequence):
        """尋找序列中的循環模式"""
        for cycle_len in range(2, min(20, len(sequence) // 3)):
            is_cycle = True
            for i in range(cycle_len, min(len(sequence), cycle_len * 3)):
                if sequence[i] != sequence[i % cycle_len]:
                    is_cycle = False
                    break
            if is_cycle:
                return cycle_len
        return None
    
    def analyze_ganzhi_patterns(self):
        """分析干支規律"""
        print("\n=== 分析干支規律 ===")
        
        ganzhi_counter = Counter()
        ganzhi_builds = defaultdict(list)
        
        for day in self.daily_data:
            ganzhi = day.get('gan_zhi', '')
            builds = day.get('twelve_builds', '')
            
            if ganzhi:
                # 提取干支
                ganzhi_match = re.search(r'([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])', ganzhi)
                if ganzhi_match:
                    gz = ganzhi_match.group(1)
                    ganzhi_counter[gz] += 1
                    
                    # 記錄干支與建除的對應
                    build_match = re.search(r'(建|除|滿|平|定|執|破|危|成|收|開|閉)', builds)
                    if build_match:
                        ganzhi_builds[gz].append(build_match.group(1))
        
        print(f"最常見的10個干支:")
        for gz, count in ganzhi_counter.most_common(10):
            print(f"  {gz}: {count} 次")
        
        # 分析干支與建除的關係
        print(f"\n干支與建除的對應關係 (前5個):")
        for gz, builds_list in list(ganzhi_builds.items())[:5]:
            builds_freq = Counter(builds_list)
            print(f"  {gz}: {dict(builds_freq)}")
        
        self.patterns['ganzhi_patterns'] = {
            'frequency': dict(ganzhi_counter.most_common(20)),
            'ganzhi_builds_mapping': {k: dict(Counter(v)) for k, v in list(ganzhi_builds.items())[:10]}
        }
    
    def analyze_hexagram_patterns(self):
        """分析易經卦象規律"""
        print("\n=== 分析易經卦象規律 ===")
        
        hexagram_counter = Counter()
        hexagram_builds = defaultdict(list)
        
        for day in self.daily_data:
            hexagram = day.get('yijing_hexagram', '')
            builds = day.get('twelve_builds', '')
            
            if hexagram and '水' in hexagram or '山' in hexagram or '地' in hexagram or '天' in hexagram:
                hexagram_counter[hexagram] += 1
                
                # 記錄卦象與建除的對應
                build_match = re.search(r'(建|除|滿|平|定|執|破|危|成|收|開|閉)', builds)
                if build_match:
                    hexagram_builds[hexagram].append(build_match.group(1))
        
        print(f"最常見的10個卦象:")
        for hex_name, count in hexagram_counter.most_common(10):
            print(f"  {hex_name}: {count} 次")
        
        # 分析卦象與建除的關係
        print(f"\n卦象與建除的對應關係 (前3個):")
        for hex_name, builds_list in list(hexagram_builds.items())[:3]:
            builds_freq = Counter(builds_list)
            print(f"  {hex_name}: {dict(builds_freq)}")
        
        self.patterns['hexagram_patterns'] = {
            'frequency': dict(hexagram_counter.most_common(15)),
            'hexagram_builds_mapping': {k: dict(Counter(v)) for k, v in list(hexagram_builds.items())[:10]}
        }
    
    def analyze_auspicious_rules(self):
        """分析吉星出現規律"""
        print("\n=== 分析吉星出現規律 ===")
        
        # 從 extracted_terms 中取得吉星，如果沒有則使用預設列表
        if 'extracted_terms' in self.data and 'auspicious_stars' in self.data['extracted_terms']:
            auspicious_stars = self.data['extracted_terms']['auspicious_stars']
        else:
            auspicious_stars = self.data.get('auspicious_stars', [])
        star_occurrences = defaultdict(list)
        star_builds_mapping = defaultdict(lambda: defaultdict(int))
        
        for day in self.daily_data:
            description = day.get('description', '')
            builds = day.get('twelve_builds', '')
            date = day.get('date', '')
            
            # 檢查每個吉星是否出現
            for star in auspicious_stars:
                if star in description:
                    star_occurrences[star].append(date)
                    
                    # 記錄吉星與建除的關係
                    build_match = re.search(r'(建|除|滿|平|定|執|破|危|成|收|開|閉)', builds)
                    if build_match:
                        star_builds_mapping[star][build_match.group(1)] += 1
        
        print(f"吉星出現頻率:")
        star_frequency = {star: len(dates) for star, dates in star_occurrences.items()}
        for star, freq in sorted(star_frequency.items(), key=lambda x: x[1], reverse=True):
            print(f"  {star}: {freq} 次")
        
        # 分析吉星與建除的關係
        print(f"\n吉星與建除的關係 (前3個最常見的吉星):")
        top_stars = sorted(star_frequency.items(), key=lambda x: x[1], reverse=True)[:3]
        for star, _ in top_stars:
            builds_dist = dict(star_builds_mapping[star])
            print(f"  {star}: {builds_dist}")
        
        self.patterns['auspicious_rules'] = {
            'frequency': star_frequency,
            'star_builds_mapping': {k: dict(v) for k, v in star_builds_mapping.items()},
            'total_stars': len(auspicious_stars)
        }
    
    def analyze_inauspicious_rules(self):
        """分析凶煞出現規律"""
        print("\n=== 分析凶煞出現規律 ===")
        
        # 從 extracted_terms 中取得凶煞，如果沒有則使用預設列表
        if 'extracted_terms' in self.data and 'inauspicious_stars' in self.data['extracted_terms']:
            inauspicious_stars = self.data['extracted_terms']['inauspicious_stars']
        else:
            inauspicious_stars = self.data.get('inauspicious_stars', [])
        star_occurrences = defaultdict(list)
        star_builds_mapping = defaultdict(lambda: defaultdict(int))
        
        for day in self.daily_data:
            description = day.get('description', '')
            builds = day.get('twelve_builds', '')
            date = day.get('date', '')
            
            # 檢查每個凶煞是否出現
            for star in inauspicious_stars:
                if star in description:
                    star_occurrences[star].append(date)
                    
                    # 記錄凶煞與建除的關係
                    build_match = re.search(r'(建|除|滿|平|定|執|破|危|成|收|開|閉)', builds)
                    if build_match:
                        star_builds_mapping[star][build_match.group(1)] += 1
        
        print(f"凶煞出現頻率:")
        star_frequency = {star: len(dates) for star, dates in star_occurrences.items()}
        for star, freq in sorted(star_frequency.items(), key=lambda x: x[1], reverse=True):
            print(f"  {star}: {freq} 次")
        
        # 分析凶煞與建除的關係
        print(f"\n凶煞與建除的關係 (前3個最常見的凶煞):")
        top_stars = sorted(star_frequency.items(), key=lambda x: x[1], reverse=True)[:3]
        for star, _ in top_stars:
            builds_dist = dict(star_builds_mapping[star])
            print(f"  {star}: {builds_dist}")
        
        self.patterns['inauspicious_rules'] = {
            'frequency': star_frequency,
            'star_builds_mapping': {k: dict(v) for k, v in star_builds_mapping.items()},
            'total_stars': len(inauspicious_stars)
        }
    
    def analyze_activity_rules(self):
        """分析活動宜忌規律"""
        print("\n=== 分析活動宜忌規律 ===")
        
        # 從 extracted_terms 中取得活動，如果沒有則使用預設列表
        if 'extracted_terms' in self.data and 'activities' in self.data['extracted_terms']:
            activities = self.data['extracted_terms']['activities']
        else:
            activities = self.data.get('activities', [])
        activity_builds_mapping = defaultdict(lambda: defaultdict(int))
        activity_occurrences = defaultdict(int)
        
        for day in self.daily_data:
            description = day.get('description', '')
            builds = day.get('twelve_builds', '')
            
            # 檢查每個活動是否被提及
            for activity in activities:
                if activity in description:
                    activity_occurrences[activity] += 1
                    
                    # 記錄活動與建除的關係
                    build_match = re.search(r'(建|除|滿|平|定|執|破|危|成|收|開|閉)', builds)
                    if build_match:
                        activity_builds_mapping[activity][build_match.group(1)] += 1
        
        print(f"活動出現頻率:")
        for activity, freq in sorted(activity_occurrences.items(), key=lambda x: x[1], reverse=True):
            print(f"  {activity}: {freq} 次")
        
        # 分析活動與建除的關係
        print(f"\n活動與建除的關係 (前5個最常見的活動):")
        top_activities = sorted(activity_occurrences.items(), key=lambda x: x[1], reverse=True)[:5]
        for activity, _ in top_activities:
            builds_dist = dict(activity_builds_mapping[activity])
            print(f"  {activity}: {builds_dist}")
        
        self.patterns['activity_rules'] = {
            'frequency': dict(activity_occurrences),
            'activity_builds_mapping': {k: dict(v) for k, v in activity_builds_mapping.items()}
        }
    
    def analyze_seasonal_patterns(self):
        """分析季節性規律"""
        print("\n=== 分析季節性規律 ===")
        
        seasonal_data = defaultdict(lambda: defaultdict(int))
        
        for day in self.daily_data:
            season = day.get('season', '')
            builds = day.get('twelve_builds', '')
            
            if season and builds:
                build_match = re.search(r'(建|除|滿|平|定|執|破|危|成|收|開|閉)', builds)
                if build_match:
                    seasonal_data[season][build_match.group(1)] += 1
        
        print(f"季節與建除的分佈:")
        for season, builds_dist in seasonal_data.items():
            print(f"  {season}: {dict(builds_dist)}")
        
        self.patterns['seasonal_patterns'] = {k: dict(v) for k, v in seasonal_data.items()}
    
    def save_analysis_results(self, output_file='dong_gong_patterns.json'):
        """儲存分析結果"""
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.patterns, f, ensure_ascii=False, indent=2)
        
        print(f"\n分析結果已儲存至 {output_file}")
    
    def run_full_analysis(self):
        """執行完整分析"""
        print("開始分析董公擇日資料規律...")
        
        self.analyze_twelve_builds_cycle()
        self.analyze_ganzhi_patterns()
        self.analyze_hexagram_patterns()
        self.analyze_auspicious_rules()
        self.analyze_inauspicious_rules()
        self.analyze_activity_rules()
        self.analyze_seasonal_patterns()
        
        self.save_analysis_results()
        
        print("\n=== 分析完成 ===")
        print("基於這些規律，我們可以建立董公擇日的計算邏輯")

def main():
    import os
    # 取得當前檔案的目錄
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_file = os.path.join(current_dir, 'dong_gong_sample_data.json')
    
    analyzer = DongGongPatternAnalyzer(data_file)
    analyzer.run_full_analysis()

if __name__ == "__main__":
    main()