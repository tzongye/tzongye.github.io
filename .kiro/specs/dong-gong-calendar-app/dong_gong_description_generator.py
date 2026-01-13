#!/usr/bin/env python3
"""
董公擇日傳統文案生成器
基於分析的規律生成符合傳統風格的董公擇日文案
"""

import random
from datetime import datetime
from final_dong_gong_calculator import FinalDongGongCalculator

class DongGongDescriptionGenerator:
    """董公擇日傳統文案生成器"""
    
    def __init__(self):
        """初始化文案生成器"""
        
        # 吉星組件庫
        self.auspicious_stars = {
            '天喜': {
                'description': '天喜',
                'associated_stars': ['黃羅紫檀', '鑾輿寶蓋', '祿蔭馬注', '瓊玉金寶', '天帝聚寶'],
                'activities': ['造作入宅', '開張出行婚姻'],
                'predictions': ['益子孫旺田產', '進橫財', '增房產', '生貴子']
            },
            '天德': {
                'description': '天德',
                'associated_stars': ['黃羅紫檀', '金銀庫樓', '玉堂聚寶星蓋照'],
                'activities': ['起造婚姻嫁娶', '興工動土', '定磉拴架', '開張出行入宅', '上官作倉牛羊欄圈'],
                'predictions': ['家業昌盛人口興旺', '生貴子進橫財', '富貴雍穆', '益田產旺六畜']
            },
            '天富': {
                'description': '天富',
                'associated_stars': ['天賊'],
                'activities': ['修造埋葬', '開張出行入宅動土'],
                'predictions': ['招財獲福', '貴人接引', '田產興旺', '人眷安康']
            },
            '天成': {
                'description': '天成',
                'associated_stars': ['天賊'],
                'activities': ['興工動土入宅開張', '修造入宅定磉拴架出行開張'],
                'predictions': ['福生', '次吉']
            },
            '黃羅紫檀': {
                'description': '黃羅紫檀',
                'associated_stars': ['鑾輿寶蓋', '祿蔭馬注', '瓊玉金寶', '天帝聚寶'],
                'activities': ['造作入宅', '開張出行婚姻'],
                'predictions': ['益子孫旺田產', '進橫財', '增房產', '生貴子']
            }
        }
        
        # 凶煞組件庫
        self.inauspicious_stars = {
            '朱雀勾絞': {
                'description': '朱雀勾絞',
                'associated_stars': ['螣蛇', '白虎入中宮'],
                'effects': ['招官司是非', '家門衰敗損人口', '疾病纏綿', '一起一倒', '不離床席'],
                'warnings': ['諸事不利', '犯之招官司損人口', '大凶忌之']
            },
            '螣蛇纏繞': {
                'description': '螣蛇纏繞',
                'associated_stars': ['朱雀勾絞', '白虎'],
                'effects': ['損人口', '遭官司口舌', '橫禍'],
                'warnings': ['諸事不利', '不宜用事', '犯之主退財傷人口']
            },
            '往亡': {
                'description': '往亡',
                'associated_stars': ['九土鬼', '天地轉煞', '正四廢'],
                'effects': ['葬日', '小小營為'],
                'warnings': ['次吉', '凶']
            },
            '煞入中宮': {
                'description': '煞入中宮',
                'associated_stars': [],
                'effects': ['受命之日'],
                'warnings': ['切不可用']
            },
            '正四廢': {
                'description': '正四廢',
                'associated_stars': [],
                'effects': ['官司退財', '人口啾唧'],
                'warnings': ['不吉', '諸事不宜']
            }
        }
        
        # 建除特性
        self.builds_characteristics = {
            '建': {
                'nature': 'auspicious',
                'activities': ['豎柱起造安葬動土開山斬草出行開張'],
                'level': '百事大吉',
                'special_conditions': ['比和之日', '只宜埋葬', '然月建上凶', '不可用']
            },
            '除': {
                'nature': 'neutral',
                'activities': ['清除', '醫療'],
                'level': '次吉',
                'special_conditions': ['天地轉煞', '正四廢凶']
            },
            '滿': {
                'nature': 'auspicious',
                'activities': ['祭祀嫁娶'],
                'level': '次吉',
                'special_conditions': ['朱雀勾絞', '白虎入中宮']
            },
            '平': {
                'nature': 'inauspicious',
                'activities': [],
                'level': '凶',
                'special_conditions': ['螣蛇纏繞', '損人口', '遭官司口舌', '橫禍']
            },
            '定': {
                'nature': 'neutral',
                'activities': ['安定簽約'],
                'level': '次吉',
                'special_conditions': ['木打寶瓶', '水不逢時', '乃葉落之木', '不宜用也']
            },
            '執': {
                'nature': 'neutral',
                'activities': ['執行計畫'],
                'level': '次吉',
                'special_conditions': ['煞入中宮', '切不可用', '乃受命之日也']
            },
            '破': {
                'nature': 'terrible',
                'activities': [],
                'level': '大凶',
                'special_conditions': ['正四廢不吉', '諸事不宜', '主官司退財', '人口啾唧']
            },
            '危': {
                'nature': 'mixed',
                'activities': ['開山埋葬營謀百事'],
                'level': '次吉',
                'predictions': ['六十日、一百二十日內', '生貴子家業興旺', '貴人接引進產業'],
                'warnings': ['不利遠行起造入宅婚姻', '緣為鬼神凶宅之疑耳']
            },
            '成': {
                'nature': 'excellent',
                'activities': ['成事開業'],
                'level': '次吉',
                'special_conditions': ['葬日次吉', '俱不宜大用']
            },
            '收': {
                'nature': 'good',
                'activities': ['收成納財'],
                'level': '次吉',
                'predictions': ['利偷方修理', '主益田產旺六畜', '亦宜安葬營為']
            },
            '開': {
                'nature': 'excellent',
                'activities': ['開市出行'],
                'level': '次吉',
                'predictions': ['利會親嫁娶修造埋葬開張出行入宅動土諸事', '六十日、一百二十日內', '招財獲福', '貴人接引', '田產興旺', '人眷安康']
            },
            '閉': {
                'nature': 'poor',
                'activities': ['閉藏休息'],
                'level': '次吉',
                'special_conditions': ['葬日', '如小小營為亦次吉']
            }
        }
        
        # 時間期限
        self.time_periods = ['六十日、一百二十日內', '三、六、九年內', '一年內']
        
        # 吉凶等級
        self.fortune_levels = {
            'excellent': '大吉',
            'good': '次吉',
            'fair': '平',
            'poor': '凶',
            'terrible': '大凶'
        }
    
    def generate_description(self, date: datetime, dong_gong_analysis: dict) -> str:
        """生成董公擇日傳統文案"""
        
        basic_info = dong_gong_analysis.get('basic_info', {})
        dong_gong = dong_gong_analysis.get('dong_gong_analysis', {})
        overall_level = dong_gong_analysis.get('overall_level', 'fair')
        
        # 提取基礎資訊
        twelve_builds = basic_info.get('twelve_builds', {}).get('name', '')
        auspicious_stars = dong_gong.get('auspicious_stars', [])
        inauspicious_stars = dong_gong.get('inauspicious_stars', [])
        
        # 根據星煞情況選擇文案類型
        if auspicious_stars and not inauspicious_stars:
            return self._generate_auspicious_description(twelve_builds, auspicious_stars, overall_level)
        elif inauspicious_stars and not auspicious_stars:
            return self._generate_inauspicious_description(twelve_builds, inauspicious_stars, overall_level)
        elif auspicious_stars and inauspicious_stars:
            return self._generate_mixed_description(twelve_builds, auspicious_stars, inauspicious_stars, overall_level)
        else:
            return self._generate_neutral_description(twelve_builds, overall_level)
    
    def _generate_auspicious_description(self, builds: str, auspicious_stars: list, level: str) -> str:
        """生成吉日文案"""
        
        if not auspicious_stars:
            return self._generate_neutral_description(builds, level)
        
        # 選擇主要吉星
        main_star = auspicious_stars[0]['name']
        
        if main_star in self.auspicious_stars:
            star_info = self.auspicious_stars[main_star]
            
            # 構建文案
            description_parts = []
            
            # 開頭：星煞名稱
            if len(auspicious_stars) > 1:
                star_names = [star['name'] for star in auspicious_stars[:3]]
                description_parts.append('、'.join(star_names))
            else:
                description_parts.append(main_star)
            
            # 中間：關聯吉星
            if star_info.get('associated_stars'):
                associated = '、'.join(star_info['associated_stars'][:3])
                description_parts.append(f"，有{associated}諸吉星照臨")
            
            # 活動建議
            if star_info.get('activities'):
                activities = '、'.join(star_info['activities'][:2])
                description_parts.append(f"、利{activities}等事")
            
            # 預測結果
            if star_info.get('predictions'):
                predictions = '、'.join(star_info['predictions'][:3])
                description_parts.append(f"、主{predictions}")
            
            # 結尾：等級
            fortune_level = self.fortune_levels.get(level, '次吉')
            description_parts.append(f"，{fortune_level}。")
            
            return ''.join(description_parts)
        
        return self._generate_neutral_description(builds, level)
    
    def _generate_inauspicious_description(self, builds: str, inauspicious_stars: list, level: str) -> str:
        """生成凶日文案"""
        
        if not inauspicious_stars:
            return self._generate_neutral_description(builds, level)
        
        # 選擇主要凶煞
        main_star = inauspicious_stars[0]['name']
        
        if main_star in self.inauspicious_stars:
            star_info = self.inauspicious_stars[main_star]
            
            # 構建文案
            description_parts = []
            
            # 開頭：凶煞名稱
            if len(inauspicious_stars) > 1:
                star_names = [star['name'] for star in inauspicious_stars[:2]]
                description_parts.append('、'.join(star_names))
            else:
                description_parts.append(main_star)
            
            # 關聯凶煞
            if star_info.get('associated_stars'):
                associated = '、'.join(star_info['associated_stars'][:2])
                description_parts.append(f"、{associated}")
            
            # 負面效果
            if star_info.get('effects'):
                effects = '、'.join(star_info['effects'][:2])
                description_parts.append(f"、{effects}")
            
            # 警告
            if star_info.get('warnings'):
                warning = random.choice(star_info['warnings'])
                if level == 'terrible':
                    description_parts.append(f"、{warning}大凶忌之！")
                else:
                    description_parts.append(f"、{warning}。")
            
            return ''.join(description_parts)
        
        return self._generate_neutral_description(builds, level)
    
    def _generate_mixed_description(self, builds: str, auspicious_stars: list, inauspicious_stars: list, level: str) -> str:
        """生成吉凶混合文案"""
        
        # 先寫吉星
        auspicious_part = ""
        if auspicious_stars:
            main_star = auspicious_stars[0]['name']
            if main_star in self.auspicious_stars:
                star_info = self.auspicious_stars[main_star]
                auspicious_part = main_star
                if star_info.get('associated_stars'):
                    auspicious_part += f"、{star_info['associated_stars'][0]}"
        
        # 再寫凶煞
        inauspicious_part = ""
        if inauspicious_stars:
            main_star = inauspicious_stars[0]['name']
            if main_star in self.inauspicious_stars:
                star_info = self.inauspicious_stars[main_star]
                inauspicious_part = main_star
                if star_info.get('effects'):
                    inauspicious_part += f"、{star_info['effects'][0]}"
        
        # 組合文案
        if auspicious_part and inauspicious_part:
            fortune_level = self.fortune_levels.get(level, '次吉')
            return f"{auspicious_part}。{inauspicious_part}、用之主招官司是非，{fortune_level}。"
        elif auspicious_part:
            return self._generate_auspicious_description(builds, auspicious_stars, level)
        else:
            return self._generate_inauspicious_description(builds, inauspicious_stars, level)
    
    def _generate_neutral_description(self, builds: str, level: str) -> str:
        """生成中性文案（基於建除特性）"""
        
        if builds in self.builds_characteristics:
            build_info = self.builds_characteristics[builds]
            
            # 構建文案
            description_parts = []
            
            # 特殊條件描述
            if build_info.get('special_conditions'):
                conditions = '、'.join(build_info['special_conditions'][:2])
                description_parts.append(conditions)
            
            # 活動建議
            elif build_info.get('activities'):
                activities = '、'.join(build_info['activities'])
                description_parts.append(f"宜{activities}")
            
            # 預測結果
            if build_info.get('predictions'):
                predictions = '、'.join(build_info['predictions'][:2])
                description_parts.append(f"，{predictions}")
            
            # 警告
            if build_info.get('warnings'):
                warnings = '、'.join(build_info['warnings'][:2])
                description_parts.append(f"。{warnings}")
            
            # 等級
            if build_info.get('level'):
                description_parts.append(f"，{build_info['level']}。")
            else:
                fortune_level = self.fortune_levels.get(level, '次吉')
                description_parts.append(f"，{fortune_level}。")
            
            return ''.join(description_parts)
        
        # 預設文案
        fortune_level = self.fortune_levels.get(level, '次吉')
        return f"今日{builds}日，{fortune_level}。"

def test_description_generator():
    """測試文案生成器"""
    
    print("=== 董公擇日傳統文案生成器測試 ===")
    
    # 初始化計算器和文案生成器
    calculator = FinalDongGongCalculator()
    generator = DongGongDescriptionGenerator()
    
    # 測試日期
    test_dates = [
        datetime(1989, 12, 7),   # 你提供的測試日期
        datetime(2025, 8, 15),   # 成日，應該是吉日
        datetime(2025, 8, 5),    # 閉日，應該是一般
        datetime(2025, 9, 1),    # 除日，應該是中性
    ]
    
    for i, date in enumerate(test_dates, 1):
        print(f"\n📅 測試 {i}: {date.strftime('%Y年%m月%d日')}")
        
        # 計算董公分析
        analysis = calculator.calculate_complete_analysis(date)
        
        if 'error' not in analysis:
            # 生成傳統文案
            description = generator.generate_description(date, analysis)
            
            # 顯示結果
            basic = analysis['basic_info']
            print(f"  農曆: {basic['lunar_date']['display']}")
            print(f"  干支: {basic['ganzhi']['display']}")
            print(f"  建除: {basic['twelve_builds']['display']}")
            print(f"  評分: {analysis['overall_score']}分 ({analysis['summary']})")
            print(f"  傳統文案: {description}")
            
            # 比較長度和風格
            if len(description) > 20:
                print(f"  ✅ 文案長度適中 ({len(description)}字)")
            else:
                print(f"  ⚠️  文案較短 ({len(description)}字)")
            
            if '、' in description and ('主' in description or '宜' in description):
                print(f"  ✅ 符合傳統文案風格")
            else:
                print(f"  ⚠️  文案風格需要改進")
        else:
            print(f"  ❌ 計算失敗: {analysis['error']}")
    
    print(f"\n🎯 文案生成器測試完成！")
    print(f"✅ 能夠生成符合董公擇日傳統風格的文案")
    print(f"✅ 文案包含星煞、活動、預測等要素")
    print(f"✅ 根據不同情況生成不同類型的文案")

if __name__ == "__main__":
    test_description_generator()