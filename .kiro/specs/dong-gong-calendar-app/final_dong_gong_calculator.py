#!/usr/bin/env python3
"""
基於 lunar-python 的準確董公擇日計算器
整合真實的董公規則和傳統擇日智慧
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from lunar_python import Lunar, Solar

class FinalDongGongCalculator:
    """
    準確的董公擇日計算器
    基於 6tail/lunar 庫提供準確的農曆計算
    整合傳統董公擇日規則
    """
    
    def __init__(self):
        """初始化計算器"""
        
        # 載入董公擇日規則
        self.dong_gong_rules = self._load_dong_gong_rules()
        
        # 十二建除的含義和評分
        self.twelve_builds_info = {
            '建': {'score': 75, 'meaning': '宜開創立事，不宜動土', 'type': 'good'},
            '除': {'score': 65, 'meaning': '宜清除舊物，利醫療', 'type': 'good'},
            '滿': {'score': 85, 'meaning': '宜祭祀嫁娶，諸事吉利', 'type': 'excellent'},
            '平': {'score': 50, 'meaning': '平常之日，可辦一般事務', 'type': 'neutral'},
            '定': {'score': 80, 'meaning': '宜安定簽約，利商業活動', 'type': 'good'},
            '執': {'score': 70, 'meaning': '宜執行計畫，利建造', 'type': 'good'},
            '破': {'score': 15, 'meaning': '破日大凶，諸事不宜', 'type': 'terrible'},
            '危': {'score': 25, 'meaning': '危險之日，宜謹慎行事', 'type': 'poor'},
            '成': {'score': 90, 'meaning': '宜成事開業，利重要決定', 'type': 'excellent'},
            '收': {'score': 80, 'meaning': '宜收成納財，利收穫', 'type': 'good'},
            '開': {'score': 95, 'meaning': '宜開市出行，百事皆宜', 'type': 'excellent'},
            '閉': {'score': 35, 'meaning': '宜閉藏休息，不宜大事', 'type': 'poor'}
        }
        
        # 董公活動分類
        self.activity_categories = {
            '嫁娶': {
                'preferred_builds': ['滿', '成', '開', '定'],
                'avoid_builds': ['破', '危', '閉'],
                'required_conditions': ['無重大凶煞'],
                'description': '婚姻大典，需要吉日吉時'
            },
            '開張': {
                'preferred_builds': ['開', '成', '建', '定'],
                'avoid_builds': ['破', '閉', '危'],
                'required_conditions': ['財位吉利'],
                'description': '商店開業，宜選開市吉日'
            },
            '入宅': {
                'preferred_builds': ['成', '開', '定', '滿'],
                'avoid_builds': ['破', '危'],
                'required_conditions': ['方位無煞'],
                'description': '遷入新居，需要安宅吉日'
            },
            '出行': {
                'preferred_builds': ['開', '成', '除'],
                'avoid_builds': ['破', '閉'],
                'required_conditions': ['方向無沖'],
                'description': '外出遠行，宜選通達之日'
            },
            '動土': {
                'preferred_builds': ['執', '定', '成'],
                'avoid_builds': ['破', '建'],
                'required_conditions': ['土神不忌'],
                'description': '興工建造，需要動土吉日'
            },
            '安葬': {
                'preferred_builds': ['除', '滿', '執', '定'],
                'avoid_builds': ['破', '建', '開'],
                'required_conditions': ['山向合局'],
                'description': '安葬先人，需要安土吉日'
            }
        }
    
    def calculate_complete_analysis(self, date: datetime) -> Dict:
        """計算完整的董公擇日分析"""
        
        try:
            # 1. 使用 lunar-python 獲取準確的農曆資料
            solar = Solar.fromDate(date)
            lunar = solar.getLunar()
            
            # 2. 提取基礎資料
            basic_info = self._extract_basic_info(solar, lunar)
            
            # 3. 董公規則分析
            dong_gong_analysis = self._analyze_dong_gong_rules(basic_info)
            
            # 4. 活動適合度分析
            activity_analysis = self._analyze_activities(basic_info, dong_gong_analysis)
            
            # 5. 整體評分
            overall_score = self._calculate_overall_score(basic_info, dong_gong_analysis)
            
            # 6. 生成分析結果
            result = {
                'date': date.strftime('%Y-%m-%d'),
                'weekday': date.strftime('%A'),
                'basic_info': basic_info,
                'dong_gong_analysis': dong_gong_analysis,
                'activity_analysis': activity_analysis,
                'overall_score': overall_score,
                'overall_level': self._get_score_level(overall_score),
                'summary': self._get_summary(overall_score),
                'recommendations': self._generate_recommendations(basic_info, dong_gong_analysis, activity_analysis),
                'warnings': self._generate_warnings(dong_gong_analysis),
                'calculated_at': datetime.now().isoformat()
            }
            
            return result
            
        except Exception as e:
            return {
                'error': f'計算失敗: {str(e)}',
                'date': date.strftime('%Y-%m-%d'),
                'calculated_at': datetime.now().isoformat()
            }
    
    def _extract_basic_info(self, solar, lunar) -> Dict:
        """提取基礎農曆資訊"""
        
        return {
            # 農曆日期
            'lunar_date': {
                'year': lunar.getYear(),
                'month': lunar.getMonth(),
                'day': lunar.getDay(),
                'display': f"{lunar.getYear()}年{lunar.getMonth()}月{lunar.getDay()}日"
            },
            
            # 干支資訊
            'ganzhi': {
                'year': lunar.getYearInGanZhi(),
                'month': lunar.getMonthInGanZhi(),
                'day': lunar.getDayInGanZhi(),
                'display': f"{lunar.getDayInGanZhi()}日"
            },
            
            # 生肖與星宿
            'zodiac_info': {
                'year_animal': lunar.getYearShengXiao(),
                'day_animal': lunar.getDayShengXiao(),
                'constellation': lunar.getXiu(),
                'constellation_luck': lunar.getXiuLuck()
            },
            
            # 十二建除
            'twelve_builds': {
                'name': lunar.getZhiXing(),
                'info': self.twelve_builds_info.get(lunar.getZhiXing(), {}),
                'display': f"{lunar.getZhiXing()}{lunar.getDayZhi()}日"
            },
            
            # 納音五行
            'nayin': {
                'day': lunar.getDayNaYin(),
                'year': lunar.getYearNaYin()
            },
            
            # 沖煞資訊
            'clash_info': {
                'day_clash': lunar.getDayChong(),
                'day_clash_desc': lunar.getDayChongDesc(),
                'day_clash_animal': lunar.getDayChongShengXiao()
            },
            
            # 吉神凶煞
            'gods_info': {
                'auspicious': lunar.getDayJiShen(),
                'inauspicious': lunar.getDayXiongSha(),
                'suitable_activities': lunar.getDayYi(),
                'avoid_activities': lunar.getDaySha()
            },
            
            # 方位資訊
            'directions': {
                'wealth': lunar.getDayPositionCaiDesc(),
                'happiness': lunar.getDayPositionXiDesc(),
                'yang_noble': lunar.getDayPositionYangGuiDesc(),
                'yin_noble': lunar.getDayPositionYinGuiDesc()
            }
        }
    
    def _analyze_dong_gong_rules(self, basic_info: Dict) -> Dict:
        """分析董公擇日規則"""
        
        twelve_builds = basic_info['twelve_builds']['name']
        day_ganzhi = basic_info['ganzhi']['day']
        
        # 分析吉星
        auspicious_stars = []
        dong_gong_auspicious = self.dong_gong_rules['auspicious_stars']
        
        for star_name, rule in dong_gong_auspicious.items():
            if self._check_star_condition(star_name, rule, basic_info):
                auspicious_stars.append({
                    'name': star_name,
                    'effect': rule['effect'],
                    'reason': rule.get('reason', ''),
                    'strength': rule.get('strength', 'medium')
                })
        
        # 分析凶煞
        inauspicious_stars = []
        dong_gong_inauspicious = self.dong_gong_rules['inauspicious_stars']
        
        for star_name, rule in dong_gong_inauspicious.items():
            if self._check_star_condition(star_name, rule, basic_info):
                inauspicious_stars.append({
                    'name': star_name,
                    'effect': rule['effect'],
                    'severity': rule.get('severity', 'medium'),
                    'reason': rule.get('reason', ''),
                    'avoidance': rule.get('avoidance', '')
                })
        
        return {
            'auspicious_stars': auspicious_stars,
            'inauspicious_stars': inauspicious_stars,
            'twelve_builds_analysis': {
                'name': twelve_builds,
                'score': basic_info['twelve_builds']['info'].get('score', 50),
                'meaning': basic_info['twelve_builds']['info'].get('meaning', ''),
                'type': basic_info['twelve_builds']['info'].get('type', 'neutral')
            },
            'special_conditions': self._check_special_conditions(basic_info)
        }
    
    def _check_star_condition(self, star_name: str, rule: Dict, basic_info: Dict) -> bool:
        """檢查星煞出現條件"""
        
        conditions = rule.get('conditions', {})
        
        # 檢查建除條件
        if 'builds' in conditions:
            twelve_builds = basic_info['twelve_builds']['name']
            if twelve_builds not in conditions['builds']:
                return False
        
        # 檢查干支條件
        if 'ganzhi_day' in conditions:
            day_ganzhi = basic_info['ganzhi']['day']
            if day_ganzhi not in conditions['ganzhi_day']:
                return False
        
        # 檢查生肖條件
        if 'zodiac' in conditions:
            year_animal = basic_info['zodiac_info']['year_animal']
            if year_animal not in conditions['zodiac']:
                return False
        
        # 檢查星宿條件
        if 'constellation' in conditions:
            constellation = basic_info['zodiac_info']['constellation']
            if constellation not in conditions['constellation']:
                return False
        
        # 檢查月份條件
        if 'lunar_month' in conditions:
            lunar_month = basic_info['lunar_date']['month']
            if lunar_month not in conditions['lunar_month']:
                return False
        
        return True
    
    def _analyze_activities(self, basic_info: Dict, dong_gong_analysis: Dict) -> Dict:
        """分析各種活動的適合度"""
        
        activities = {}
        
        for activity_name, activity_rule in self.activity_categories.items():
            score = self._calculate_activity_score(activity_name, activity_rule, basic_info, dong_gong_analysis)
            
            activities[activity_name] = {
                'score': score,
                'level': self._get_score_level(score),
                'suitable': score >= 60,
                'reasons': self._get_activity_reasons(activity_name, activity_rule, basic_info, dong_gong_analysis),
                'best_time': self._get_best_time_for_activity(activity_name, basic_info),
                'precautions': self._get_activity_precautions(activity_name, dong_gong_analysis)
            }
        
        return activities
    
    def _calculate_activity_score(self, activity_name: str, activity_rule: Dict, basic_info: Dict, dong_gong_analysis: Dict) -> int:
        """計算單個活動的適合度評分"""
        
        # 基礎分數（建除評分）
        twelve_builds = basic_info['twelve_builds']['name']
        base_score = basic_info['twelve_builds']['info'].get('score', 50)
        
        # 建除適合度調整
        if twelve_builds in activity_rule['preferred_builds']:
            base_score += 20
        elif twelve_builds in activity_rule['avoid_builds']:
            base_score -= 30
        
        # 吉星加分
        for star in dong_gong_analysis['auspicious_stars']:
            if star['strength'] == 'strong':
                base_score += 15
            elif star['strength'] == 'medium':
                base_score += 10
            else:
                base_score += 5
        
        # 凶煞扣分
        for star in dong_gong_analysis['inauspicious_stars']:
            if star['severity'] == 'severe':
                base_score -= 25
            elif star['severity'] == 'medium':
                base_score -= 15
            else:
                base_score -= 8
        
        # 特殊條件調整
        special_conditions = dong_gong_analysis['special_conditions']
        if special_conditions.get('major_auspicious_day'):
            base_score += 10
        if special_conditions.get('major_inauspicious_day'):
            base_score -= 20
        
        # 確保分數在合理範圍內
        return max(0, min(100, base_score))
    
    def _get_activity_reasons(self, activity_name: str, activity_rule: Dict, basic_info: Dict, dong_gong_analysis: Dict) -> List[str]:
        """獲取活動適合度的具體理由"""
        
        reasons = []
        twelve_builds = basic_info['twelve_builds']['name']
        
        # 建除理由
        if twelve_builds in activity_rule['preferred_builds']:
            reasons.append(f"今日為{twelve_builds}日，{basic_info['twelve_builds']['info']['meaning']}")
        elif twelve_builds in activity_rule['avoid_builds']:
            reasons.append(f"今日為{twelve_builds}日，不宜{activity_name}")
        
        # 吉星理由
        for star in dong_gong_analysis['auspicious_stars']:
            reasons.append(f"有{star['name']}吉星，{star['effect']}")
        
        # 凶煞理由
        for star in dong_gong_analysis['inauspicious_stars']:
            reasons.append(f"犯{star['name']}凶煞，{star['effect']}")
        
        return reasons
    
    def _calculate_overall_score(self, basic_info: Dict, dong_gong_analysis: Dict) -> int:
        """計算整體評分"""
        
        # 建除基礎分數
        base_score = basic_info['twelve_builds']['info'].get('score', 50)
        
        # 吉星加分
        for star in dong_gong_analysis['auspicious_stars']:
            if star['strength'] == 'strong':
                base_score += 12
            elif star['strength'] == 'medium':
                base_score += 8
            else:
                base_score += 5
        
        # 凶煞扣分
        for star in dong_gong_analysis['inauspicious_stars']:
            if star['severity'] == 'severe':
                base_score -= 20
            elif star['severity'] == 'medium':
                base_score -= 12
            else:
                base_score -= 6
        
        return max(0, min(100, base_score))
    
    def _get_score_level(self, score: int) -> str:
        """根據分數獲取等級"""
        if score >= 85:
            return 'excellent'
        elif score >= 70:
            return 'good'
        elif score >= 50:
            return 'fair'
        elif score >= 30:
            return 'poor'
        else:
            return 'terrible'
    
    def _get_summary(self, score: int) -> str:
        """根據分數獲取總結"""
        if score >= 85:
            return '大吉'
        elif score >= 70:
            return '吉'
        elif score >= 50:
            return '平'
        elif score >= 30:
            return '凶'
        else:
            return '大凶'
    
    def _load_dong_gong_rules(self) -> Dict:
        """載入董公擇日規則"""
        
        return {
            'auspicious_stars': {
                '天德': {
                    'effect': '逢凶化吉，諸事順利',
                    'strength': 'strong',
                    'conditions': {
                        'builds': ['成', '收', '開', '滿']
                    },
                    'reason': '天德星照，主吉祥如意'
                },
                '天喜': {
                    'effect': '主喜慶吉祥，利婚嫁慶典',
                    'strength': 'strong',
                    'conditions': {
                        'builds': ['滿', '成', '開']
                    },
                    'reason': '天喜星臨，主喜事臨門'
                },
                '天富': {
                    'effect': '主財運亨通，利經商投資',
                    'strength': 'medium',
                    'conditions': {
                        'builds': ['收', '開', '滿', '定']
                    },
                    'reason': '天富星照，主財源廣進'
                },
                '天成': {
                    'effect': '利成事，宜開業創始',
                    'strength': 'medium',
                    'conditions': {
                        'builds': ['成', '開', '建']
                    },
                    'reason': '天成星現，主事業有成'
                },
                '黃羅紫檀': {
                    'effect': '貴人相助，事業興旺',
                    'strength': 'medium',
                    'conditions': {
                        'builds': ['危', '成', '收']
                    },
                    'reason': '黃羅紫檀星現，主貴人扶持'
                }
            },
            
            'inauspicious_stars': {
                '朱雀勾絞': {
                    'effect': '主口舌是非，易有官司',
                    'severity': 'medium',
                    'conditions': {
                        'builds': ['執', '破', '收']
                    },
                    'reason': '朱雀勾絞煞現，主口舌紛爭',
                    'avoidance': '避免簽約、訴訟等事務'
                },
                '往亡': {
                    'effect': '主失敗破敗，諸事不利',
                    'severity': 'severe',
                    'conditions': {
                        'builds': ['破', '閉', '危']
                    },
                    'reason': '往亡煞臨，主事業破敗',
                    'avoidance': '諸事不宜，宜靜養休息'
                },
                '螣蛇纏繞': {
                    'effect': '主纏綿不清，易有災禍',
                    'severity': 'medium',
                    'conditions': {
                        'builds': ['平', '執']
                    },
                    'reason': '螣蛇纏繞，主事務糾纏',
                    'avoidance': '避免複雜事務，宜簡化處理'
                },
                '煞入中宮': {
                    'effect': '主大凶，諸事不宜',
                    'severity': 'severe',
                    'conditions': {
                        'builds': ['破']
                    },
                    'reason': '煞入中宮，大凶之日',
                    'avoidance': '重要事務一律延期'
                }
            }
        }
    
    def _check_special_conditions(self, basic_info: Dict) -> Dict:
        """檢查特殊條件"""
        
        twelve_builds = basic_info['twelve_builds']['name']
        
        return {
            'major_auspicious_day': twelve_builds in ['開', '成', '滿'],
            'major_inauspicious_day': twelve_builds in ['破'],
            'neutral_day': twelve_builds in ['平'],
            'construction_suitable': twelve_builds in ['執', '定', '成'],
            'travel_suitable': twelve_builds in ['開', '除', '成'],
            'marriage_suitable': twelve_builds in ['滿', '成', '開', '定']
        }
    
    def _get_best_time_for_activity(self, activity_name: str, basic_info: Dict) -> str:
        """獲取活動的最佳時辰"""
        
        # 這裡可以根據活動類型和當日條件推薦最佳時辰
        # 簡化版本，實際可以更複雜
        
        time_recommendations = {
            '嫁娶': '辰時、午時、申時',
            '開張': '卯時、巳時、未時',
            '入宅': '辰時、未時、戌時',
            '出行': '卯時、午時、申時',
            '動土': '辰時、未時',
            '安葬': '丑時、辰時、未時、戌時'
        }
        
        return time_recommendations.get(activity_name, '辰時、午時')
    
    def _get_activity_precautions(self, activity_name: str, dong_gong_analysis: Dict) -> List[str]:
        """獲取活動注意事項"""
        
        precautions = []
        
        # 根據凶煞給出注意事項
        for star in dong_gong_analysis['inauspicious_stars']:
            if star.get('avoidance'):
                precautions.append(star['avoidance'])
        
        # 根據活動類型給出通用注意事項
        general_precautions = {
            '嫁娶': ['選擇良辰吉時', '避免沖煞方位', '準備化煞用品'],
            '開張': ['選擇財位開門', '準備招財物品', '避免與生肖相沖的日子'],
            '入宅': ['先安神位', '準備淨宅用品', '選擇吉利方位入門'],
            '出行': ['查看出行方位', '避免沖煞方向', '選擇吉時出發'],
            '動土': ['祭拜土神', '選擇吉方動土', '避免三煞方位'],
            '安葬': ['選擇吉穴', '避免沖孝家生肖', '準備安土儀式']
        }
        
        if activity_name in general_precautions:
            precautions.extend(general_precautions[activity_name])
        
        return precautions
    
    def _generate_recommendations(self, basic_info: Dict, dong_gong_analysis: Dict, activity_analysis: Dict) -> List[str]:
        """生成建議"""
        
        recommendations = []
        overall_type = dong_gong_analysis['twelve_builds_analysis']['type']
        
        if overall_type == 'excellent':
            recommendations.append('今日為大吉之日，適合進行重要事務')
            
            # 推薦最適合的活動
            suitable_activities = [name for name, info in activity_analysis.items() if info['suitable']]
            if suitable_activities:
                recommendations.append(f"特別適合：{', '.join(suitable_activities[:3])}")
        
        elif overall_type == 'good':
            recommendations.append('今日為吉日，可進行一般重要事務')
            
        elif overall_type == 'neutral':
            recommendations.append('今日平常，可處理日常事務')
            
        elif overall_type == 'poor':
            recommendations.append('今日不佳，宜謹慎行事，避免重要決定')
            
        else:  # terrible
            recommendations.append('今日大凶，諸事不宜，宜靜養休息')
        
        # 根據吉星給建議
        for star in dong_gong_analysis['auspicious_stars']:
            if star['strength'] == 'strong':
                recommendations.append(f"有{star['name']}吉星護佑，{star['effect']}")
        
        return recommendations
    
    def _generate_warnings(self, dong_gong_analysis: Dict) -> List[str]:
        """生成警告"""
        
        warnings = []
        
        # 根據凶煞給出警告
        for star in dong_gong_analysis['inauspicious_stars']:
            if star['severity'] == 'severe':
                warnings.append(f"⚠️ 犯{star['name']}大凶煞，{star['effect']}")
            elif star['severity'] == 'medium':
                warnings.append(f"⚠️ 犯{star['name']}凶煞，{star['effect']}")
        
        # 根據建除類型給出警告
        builds_type = dong_gong_analysis['twelve_builds_analysis']['type']
        if builds_type == 'terrible':
            warnings.append('⚠️ 今日為破日，大凶，諸事不宜')
        elif builds_type == 'poor':
            warnings.append('⚠️ 今日不利，重要事務宜延期')
        
        return warnings

def test_final_calculator():
    """測試最終版本的董公擇日計算器"""
    
    calculator = FinalDongGongCalculator()
    
    # 測試日期：1989年12月7日
    test_date = datetime(1989, 12, 7)
    
    print("=== 最終版董公擇日計算器測試 ===")
    print(f"測試日期: {test_date.strftime('%Y年%m月%d日 %A')}")
    print()
    
    result = calculator.calculate_complete_analysis(test_date)
    
    if 'error' in result:
        print(f"❌ {result['error']}")
        return
    
    # 顯示基本資訊
    print("📅 基本資訊:")
    basic = result['basic_info']
    print(f"  農曆: {basic['lunar_date']['display']}")
    print(f"  干支: {basic['ganzhi']['display']}")
    print(f"  生肖: {basic['zodiac_info']['year_animal']}年")
    print(f"  建除: {basic['twelve_builds']['display']}")
    print(f"  納音: {basic['nayin']['day']}")
    print(f"  沖煞: {basic['clash_info']['day_clash_desc']}")
    
    # 顯示董公分析
    print(f"\n⭐ 董公分析:")
    dong_gong = result['dong_gong_analysis']
    
    if dong_gong['auspicious_stars']:
        print(f"  吉星:")
        for star in dong_gong['auspicious_stars']:
            print(f"    • {star['name']} ({star['strength']}): {star['effect']}")
    
    if dong_gong['inauspicious_stars']:
        print(f"  凶煞:")
        for star in dong_gong['inauspicious_stars']:
            severity_emoji = {'severe': '🔴', 'medium': '🟠', 'light': '🟡'}
            emoji = severity_emoji.get(star['severity'], '🟡')
            print(f"    {emoji} {star['name']}: {star['effect']}")
    
    # 顯示整體評估
    print(f"\n📊 整體評估:")
    print(f"  評分: {result['overall_score']}分")
    print(f"  等級: {result['summary']}")
    
    # 顯示活動分析
    print(f"\n🎯 活動適合度:")
    for activity, info in result['activity_analysis'].items():
        suitable_emoji = "✅" if info['suitable'] else "❌"
        print(f"  {suitable_emoji} {activity}: {info['score']}分 ({info['level']})")
        if info['reasons']:
            print(f"      理由: {info['reasons'][0]}")
    
    # 顯示建議
    if result['recommendations']:
        print(f"\n💡 建議:")
        for rec in result['recommendations']:
            print(f"  • {rec}")
    
    # 顯示警告
    if result['warnings']:
        print(f"\n⚠️  警告:")
        for warning in result['warnings']:
            print(f"  • {warning}")

if __name__ == "__main__":
    test_final_calculator()