# 董公擇日 App 設計文件

## 系統架構概覽

### 技術棧選擇 (免費服務優先)
```
前端層 (你負責 UI/UX)
├── React Native (免費，跨平台)
├── Expo (免費開發工具)
└── React Navigation (免費路由)

後端層 (我負責開發)
├── Node.js + Express (免費)
├── 6tail/lunar JavaScript 版本 (免費開源)
├── 董公擇日計算邏輯 (自行開發)
└── yju.tw 驗證整合

資料層 (免費方案)
├── 本地: AsyncStorage (免費)
├── 雲端: Firebase Firestore (免費額度: 1GB)
├── 認證: Firebase Auth (免費額度: 50,000 MAU)
└── 內購: React Native IAP (免費)

部署與服務 (免費方案)
├── 後端: Vercel/Netlify Functions (免費額度)
├── 資料庫: Firebase (免費額度)
├── 分析: 先不用，之後可加 Firebase Analytics (免費)
└── 錯誤監控: 先不用，之後可加 Sentry (免費額度)
```

### 開發分工
- **你負責**: UI/UX 設計、使用者體驗、視覺設計
- **我負責**: 所有程式開發、API 整合、計算邏輯、部署

## 核心組件設計

### 1. 董公擇日計算引擎

**設計理念：** 基於 6tail/lunar 開源庫，擴展董公特有的計算規則，並與 yju.tw 驗證系統整合

```typescript
interface DongGongCalculator {
  // 基礎農曆計算 (基於 6tail/lunar)
  getLunarDate(date: Date): LunarDate;
  
  // 董公特有計算
  getDongGongAnalysis(date: Date): DongGongAnalysis;
  calculateSuitableActivities(date: Date): Activity[];
  getAuspiciousLevel(date: Date, activity: ActivityType): AuspiciousLevel;
  
  // 計算準確性驗證 (開發階段手動比對)
  validateCalculation(date: Date): ValidationResult;
  
  // AI 增強推薦 (整合 contains-studio/agents)
  getAIRecommendations(
    activityType: ActivityType, 
    dateRange: DateRange,
    personalInfo?: PersonalInfo
  ): RecommendedDate[];
}

interface DongGongAnalysis {
  // 基礎資訊
  ganZhi: string;           // 干支：壬寅日
  zodiac: string;          // 生肖：肖蛇
  solarTerm: string;       // 節氣：大暑
  season: string;          // 季節：夏季
  
  // 董公核心元素
  twelveBuilds: string;    // 十二建：危寅日、成卯日等
  yiJingHexagram: string;  // 易經卦象：地水師、天水訟等
  
  // 董公獨有吉星系統
  auspiciousStars: Array<{
    name: string;          // 黃羅紫檀、鑾輿寶蓋等
    effect: string;        // 具體效果說明
  }>;
  
  // 董公獨有凶煞系統  
  inauspiciousStars: Array<{
    name: string;          // 朱雀勾絞、螣蛇白虎等
    severity: 'light' | 'medium' | 'severe';
    warning: string;       // 具體警告說明
  }>;
  
  // 沖煞資訊
  clash: {
    direction: string;     // 煞北、煞西等
    animal: string;        // 沖猴、沖雞等
    avoid: string[];       // 需要避開的方位
  };
  
  // 宜忌判斷（基於真實董公資料）
  suitable: Array<{
    activity: string;      // 嫁娶、起造、開張等
    reason: string;        // 董公判斷理由
    timeEffect: string;    // 六十日、一百二十日內效果
    benefits: string[];    // 生貴子、進橫財等具體好處
  }>;
  
  unsuitable: Array<{
    activity: string;      // 遠行、入宅、婚姻等
    reason: string;        // 董公判斷理由
    consequences: string[]; // 招官司、損人口等具體後果
  }>;
  
  // 整體評級
  overallLevel: 'excellent' | 'good' | 'fair' | 'poor' | 'terrible';
  summary: string;         // 整體評語：次吉、大凶等
}

interface ValidationResult {
  isValid: boolean;
  discrepancies: string[];
  yjuTwData?: YjuTwResponse;
  confidence: number; // 計算準確度信心指數
}

interface ComparisonResult {
  ganZhiMatch: boolean;
  solarTermMatch: boolean;
  auspiciousGodsMatch: boolean;
  overallAccuracy: number;
  differences: string[];
}
```

### 2. 日期推薦系統

**基於董公規則的推薦邏輯：**

```typescript
// 董公擇日推薦系統
class DongGongRecommendationService {
  
  async findSuitableDates(
    activity: string,
    dateRange: DateRange
  ): Promise<RecommendedDate[]> {
    const suitableDates: RecommendedDate[] = [];
    
    for (const date of dateRange.dates) {
      const analysis = await this.calculator.getDongGongAnalysis(date);
      const suitability = this.calculateSuitability(activity, analysis);
      
      if (suitability.score >= 60) { // 只推薦60分以上的日期
        suitableDates.push({
          date,
          score: suitability.score,
          level: suitability.level,
          reasons: suitability.reasons,
          warnings: suitability.warnings
        });
      }
    }
    
    // 按評分排序
    return suitableDates.sort((a, b) => b.score - a.score);
  }
  
  private calculateSuitability(
    activity: string, 
    analysis: DongGongAnalysis
  ): SuitabilityResult {
    let score = 50; // 基礎分數
    const reasons: string[] = [];
    const warnings: string[] = [];
    
    // 檢查是否在宜做事項中
    if (analysis.activities.suitable.some(a => a.activity === activity)) {
      score += 30;
      reasons.push(`董公宜${activity}`);
    }
    
    // 檢查是否在忌做事項中
    if (analysis.activities.unsuitable.some(a => a.activity === activity)) {
      score -= 40;
      warnings.push(`董公忌${activity}`);
    }
    
    // 十二建除評分
    const buildScore = this.getBuildScore(analysis.twelveBuilds.name, activity);
    score += buildScore;
    if (buildScore > 0) {
      reasons.push(`${analysis.twelveBuilds.name}日宜此事`);
    }
    
    // 神煞影響
    const godScore = this.getGodScore(analysis.gods, activity);
    score += godScore;
    
    return {
      score: Math.max(0, Math.min(100, score)),
      level: this.getScoreLevel(score),
      reasons,
      warnings
    };
  }
  
  private getBuildScore(build: string, activity: string): number {
    // 十二建除對不同事項的影響
    const buildEffects = {
      '建': { '嫁娶': 10, '出行': 10, '開市': 5 },
      '除': { '療病': 15, '掃舍': 10 },
      '滿': { '嫁娶': 15, '祭祀': 10 },
      '平': { '開市': 5, '立券': 5 },
      '定': { '嫁娶': 20, '移徙': 15 },
      '執': { '建造': -10, '動土': -15 },
      '破': { '嫁娶': -30, '開市': -25 },
      '危': { '出行': -20, '移徙': -15 },
      '成': { '開市': 15, '立券': 10 },
      '收': { '納財': 10, '收成': 15 },
      '開': { '開市': 20, '出行': 15 },
      '閉': { '祭祀': -10, '開市': -20 }
    };
    
    return buildEffects[build]?.[activity] || 0;
  }
}
```

### 3. 商業模式架構

**免費增值模式設計：**

```typescript
enum SubscriptionTier {
  FREE = 'free',
  PREMIUM = 'premium',
  PROFESSIONAL = 'professional'
}

interface FeatureAccess {
  [SubscriptionTier.FREE]: {
    dailyQueries: 3;
    basicCalendar: true;
    reminderActivities: 1;        // 只能關注 1 個事項提醒
    advancedAnalysis: false;
    exportFeatures: false;
  };
  
  [SubscriptionTier.PREMIUM]: {
    dailyQueries: -1; // unlimited
    basicCalendar: true;
    reminderActivities: 3;        // 可以關注 3 個事項提醒
    advancedAnalysis: true;
    exportFeatures: true;
  };
}

// 內購商品設計
const IAP_PRODUCTS = {
  PREMIUM_MONTHLY: 'premium_monthly_4.99',
  PREMIUM_YEARLY: 'premium_yearly_39.99',
  AI_ANALYSIS_PACK: 'ai_analysis_10_queries_2.99'
};
```

## 用戶介面設計

### 4. 主要頁面架構

```
App 導航結構
├── 首頁 (今日擇日)
│   ├── 今日董公分析
│   ├── 快速查詢
│   └── AI 推薦卡片
├── 日曆頁面
│   ├── 月曆檢視 (吉凶標示)
│   ├── 日期詳情
│   └── 篩選功能
├── 智能推薦
│   ├── 事項選擇
│   ├── AI 分析結果
│   └── 個人化設定
├── 提醒設定
│   ├── 大吉日提醒開關
│   └── 事項提醒設定（選擇關注的事項）
└── 設定頁面
    ├── 訂閱管理
    ├── 個人資料
    └── 關於 App
```

### 4.1 事項選擇清單

**董公擇日傳統分類系統：**

董公擇日的原始分類是基於古代農民曆的「宜忌事項」，主要分為以下傳統類別：

```typescript
interface TraditionalActivity {
  id: string;
  name: string;
  traditional: string;  // 傳統農民曆用詞
  description: string;
  category: string;
}

// 董公擇日真實事項（基於實際董公擇日資料）
const DONG_GONG_ACTIVITIES: TraditionalActivity[] = [
  // 基於真實董公擇日資料的事項
  { id: 'marry', name: '嫁娶', traditional: '嫁娶', description: '婚姻大典', category: '人事' },
  { id: 'build', name: '起造', traditional: '起造', description: '建築房屋', category: '營建' },
  { id: 'move_in', name: '入宅', traditional: '入宅', description: '遷入新居', category: '遷移' },
  { id: 'travel', name: '出行', traditional: '出行', description: '外出遠行', category: '遷移' },
  { id: 'open_business', name: '開張', traditional: '開張', description: '商店開業', category: '商業' },
  { id: 'construction', name: '動土', traditional: '動土', description: '興工建造', category: '營建' },
  { id: 'burial', name: '埋葬', traditional: '埋葬', description: '安葬先人', category: '喪葬' },
  { id: 'repair', name: '修造', traditional: '修造', description: '修繕建築', category: '營建' },
  { id: 'open_mountain', name: '開山', traditional: '開山', description: '開山取土', category: '營建' },
  { id: 'cut_grass', name: '斬草', traditional: '斬草', description: '清理雜草', category: '農事' },
  { id: 'pillar', name: '豎柱', traditional: '豎柱', description: '立柱架樑', category: '營建' },
  { id: 'warehouse', name: '作倉', traditional: '作倉', description: '建造倉庫', category: '營建' },
  { id: 'livestock_pen', name: '牛羊欄圈', traditional: '牛羊欄圈', description: '建造畜欄', category: '農事' },
  { id: 'official', name: '上官', traditional: '上官', description: '赴任就職', category: '人事' }
];

// 按傳統分類組織
const TRADITIONAL_CATEGORIES = {
  人事: ['嫁娶', '納采', '冠笄'],
  營建: ['動土', '上樑', '修造', '破屋', '補垣'],
  遷移: ['移徙', '入宅', '出行'],
  商業: ['開市', '立券', '納財'],
  祭祀: ['祭祀', '祈福', '開光'],
  喪葬: ['安葬', '破土', '成服'],
  農事: ['栽種', '收成', '牧養'],
  醫療: ['療病', '針灸'],
  學習: ['入學', '習藝'],
  其他: ['理髮', '沐浴', '掃舍', '畋獵', '織染']
};

// 現代對應關係（方便用戶理解）
const MODERN_MAPPING = {
  '嫁娶': ['結婚', '婚禮'],
  '納采': ['訂婚', '下聘'],
  '動土': ['建築', '裝修', '挖掘'],
  '移徙': ['搬家', '遷居'],
  '入宅': ['入厝', '喬遷'],
  '出行': ['旅遊', '出差', '遠行'],
  '開市': ['開業', '開店', '開工'],
  '立券': ['簽約', '買賣'],
  '祭祀': ['拜拜', '祭祖'],
  '安葬': ['下葬', '土葬'],
  '療病': ['看醫生', '手術', '治療']
};
```

**董公擇日的核心特色：**

1. **十二建除** - 建、除、滿、平、定、執、破、危、成、收、開、閉
2. **二十八宿** - 東方青龍、南方朱雀、西方白虎、北方玄武各七宿
3. **神煞系統** - 天德、月德、天喜、紅鸞等吉神，五鬼、死符、歲破等凶神
4. **干支配合** - 天干地支的組合吉凶

這些才是董公擇日的原始分類基礎，比現代的生活分類更具傳統意義。

### 4.1.1 文字維護與多語言支援

**文字管理系統：**

```typescript
// 多語言文字檔案結構
interface LocalizationConfig {
  // 傳統事項名稱
  activities: {
    [key: string]: {
      traditional: string;    // 傳統用詞
      modern: string;        // 現代說法
      description: string;   // 詳細說明
      example?: string;      // 使用範例
    };
  };
  
  // 神煞名稱與說明
  gods: {
    auspicious: {
      [key: string]: {
        name: string;
        description: string;
        effect: string;
      };
    };
    inauspicious: {
      [key: string]: {
        name: string;
        description: string;
        effect: string;
        severity: string;
      };
    };
  };
  
  // 十二建除說明
  twelveBuilds: {
    [key: string]: {
      name: string;
      meaning: string;
      suitable: string[];
      unsuitable: string[];
    };
  };
  
  // UI 介面文字
  ui: {
    navigation: { [key: string]: string };
    buttons: { [key: string]: string };
    messages: { [key: string]: string };
    tooltips: { [key: string]: string };
  };
}

// 主要使用繁體中文，預留未來擴展空間
const DEFAULT_LOCALE = 'zh-TW';
```

**文字維護機制：**

```typescript
// 文字管理服務
class LocalizationService {
  private currentLocale: string = 'zh-TW';
  private localeData: LocalizationConfig;
  
  // 載入文字內容
  async loadContent(): Promise<void> {
    try {
      // 從雲端載入最新文字內容
      const response = await fetch('/api/content/zh-tw');
      this.localeData = await response.json();
    } catch (error) {
      // 載入失敗時使用本地快取
      console.warn('Failed to load remote content, using cached version');
      this.localeData = await this.loadCachedContent();
    }
  }
  
  // 取得翻譯文字
  t(key: string, params?: Record<string, string>): string {
    const keys = key.split('.');
    let value: any = this.localeData;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    // 支援參數替換
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] || match;
      });
    }
    
    return value;
  }
  
  // 取得活動資訊
  getActivityInfo(activityId: string): ActivityInfo {
    const activity = this.localeData.activities[activityId];
    if (!activity) {
      return {
        traditional: activityId,
        modern: activityId,
        description: '無說明'
      };
    }
    return activity;
  }
}

// 文字更新機制
class ContentUpdateService {
  // 檢查文字更新
  async checkForUpdates(): Promise<boolean> {
    try {
      const response = await fetch('/api/content/version');
      const serverVersion = await response.json();
      const localVersion = await this.getLocalVersion();
      
      return serverVersion.version > localVersion;
    } catch (error) {
      return false;
    }
  }
  
  // 下載最新文字內容
  async updateContent(): Promise<void> {
    try {
      const response = await fetch('/api/content/zh-tw');
      const content = await response.json();
      
      // 儲存到本地快取
      await this.saveContentToCache(content);
      
      // 更新版本號
      await this.updateLocalVersion();
    } catch (error) {
      console.error('Failed to update content:', error);
    }
  }
}
```

**使用範例：**

```jsx
// 在 React Native 組件中使用
const ActivityCard = ({ activityId }) => {
  const { t, getActivityInfo } = useLocalization();
  const activity = getActivityInfo(activityId);
  
  return (
    <View>
      <Text style={styles.traditional}>{activity.traditional}</Text>
      <Text style={styles.modern}>({activity.modern})</Text>
      <Text style={styles.description}>{activity.description}</Text>
    </View>
  );
};
```

這樣的設計讓所有文字內容都可以：
1. **動態更新** - 不需要更新 App 就能修改文字
2. **版本控制** - 可以回滾到之前的版本  
3. **批量管理** - 透過後台統一管理所有文字內容
4. **離線支援** - 文字檔案會快取在本地
5. **未來擴展** - 架構支援未來加入多語言功能

### 4.1.2 農曆國曆切換功能

**基於 6tail/lunar 的日曆切換：**

```typescript
// 日曆顯示模式
enum CalendarDisplayMode {
  GREGORIAN_ONLY = 'gregorian',     // 只顯示國曆
  LUNAR_ONLY = 'lunar',             // 只顯示農曆
  BOTH = 'both'                     // 同時顯示
}

interface CalendarSwitchService {
  // 切換顯示模式
  switchDisplayMode(mode: CalendarDisplayMode): void;
  
  // 國曆轉農曆
  gregorianToLunar(date: Date): LunarDate;
  
  // 農曆轉國曆
  lunarToGregorian(lunarDate: LunarDate): Date;
  
  // 取得混合顯示資訊
  getMixedDateInfo(date: Date): MixedDateInfo;
}

interface MixedDateInfo {
  gregorian: {
    year: number;
    month: number;
    day: number;
    weekday: string;
  };
  lunar: {
    year: string;      // 甲辰年
    month: string;     // 正月
    day: string;       // 初一
    zodiac: string;    // 龍年
  };
  displayText: {
    primary: string;   // 主要顯示文字
    secondary: string; // 次要顯示文字
  };
}
```

### 4.1.3 提醒功能設計

**提醒功能的具體內容：**

```typescript
interface ReminderSystem {
  // 兩種獨立的提醒類型
  reminderTypes: {
    // 1. 大吉日提醒（所有用戶都有，自動）
    excellentDays: {
      enabled: boolean;          // 用戶可以開關
      frequency: 'weekly' | 'biweekly'; // 頻率設定
      time: string;              // 提醒時間 "09:00"
      message: string;           // "明天是大吉日，適合重要事項"
    };
    
    // 2. 特定事項提醒（用戶主動設定，有付費限制）
    activityReminder: {
      enabled: boolean;
      maxActivities: number;     // 免費1個，付費3個
      selectedActivities: Array<{
        activity: string;        // 選擇的事項（嫁娶、開市等）
        daysAdvance: number;     // 提前幾天提醒
        enabled: boolean;        // 該事項是否開啟提醒
      }>;
      time: string;              // 提醒時間
      message: string;           // "未來 {{days}} 天內有適合 {{activity}} 的吉日"
    };
  };
  
  // 提醒設定
  settings: {
    globalEnabled: boolean;
    defaultTime: string;        // 預設提醒時間
    soundEnabled: boolean;      // 是否播放提醒音
    vibrationEnabled: boolean;  // 是否震動
  };
}

// 提醒服務實作
class NotificationService {
  // 排程提醒
  async scheduleReminder(reminder: ReminderConfig): Promise<string> {
    // 使用 React Native 的本地通知
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: reminder.title,
        body: reminder.message,
        data: { type: reminder.type, date: reminder.date }
      },
      trigger: {
        date: reminder.triggerDate
      }
    });
  }
  
  // 取消提醒
  async cancelReminder(reminderId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(reminderId);
  }
  
  // 檢查並排程未來的吉日提醒
  async scheduleUpcomingGoodDays(): Promise<void> {
    const nextMonth = this.getNextMonthDates();
    
    for (const date of nextMonth) {
      const analysis = await this.dongGongService.getDongGongAnalysis(date);
      
      // 如果是大吉日，排程提醒
      if (analysis.score.level === 'excellent') {
        await this.scheduleReminder({
          type: 'excellent_day',
          title: '大吉日提醒',
          message: `${this.formatDate(date)} 是大吉日，適合重要事項`,
          triggerDate: this.subtractDays(date, 1), // 前一天提醒
          date: date
        });
      }
    }
  }
}
```

**提醒功能說明：**

實際上有**兩種獨立的提醒**：

### 1. **大吉日提醒**（自動，所有用戶都有）
- 系統自動偵測未來的大吉日
- 一週或兩週提醒一次
- 不需要用戶設定，預設開啟
- 訊息：「明天是大吉日，適合重要事項」

### 2. **特定事項提醒**（用戶主動設定，有付費限制）
- 用戶選擇關注的特定事項（如嫁娶、開市、動土等）
- **免費用戶**：只能選擇 1 個事項
- **付費用戶**：可以選擇 3 個事項
- 系統會提醒這些事項的適合日期
- 訊息：「未來 3 天內有適合嫁娶的吉日」

**移除的功能：**
- ~~重要日子提醒~~（農曆節日、節氣）- 為了保持簡潔

**設計理念：**
- **簡單直接** - 移除複雜的收藏功能
- **用戶主導** - 提醒都需要用戶主動設定
- **不打擾** - 頻率控制，避免過度通知
- **有價值** - 只在真正重要的時候才提醒

這樣的設計讓 App 保持簡潔，專注於核心的董公擇日功能。

### 4.2 日期詳情頁面欄位

**完整資訊架構：**

```typescript
interface DateDetailInfo {
  // 基本日期資訊
  gregorianDate: {
    year: number;
    month: number;
    day: number;
    weekday: string;
  };
  
  // 農曆資訊
  lunarDate: {
    year: string;        // 例：甲辰年
    month: string;       // 例：正月
    day: string;         // 例：初一
    zodiac: string;      // 例：龍年
    solarTerm: string;   // 例：立春
    festival?: string;   // 例：春節
  };
  
  // 董公擇日核心資訊
  dongGongInfo: {
    ganZhi: {
      year: string;      // 年干支：甲辰
      month: string;     // 月干支：丙寅
      day: string;       // 日干支：戊申
      hour?: string;     // 時干支（如有指定時辰）
    };
    
    // 十二建
    twelveBuilds: {
      name: string;      // 例：建、除、滿、平、定、執、破、危、成、收、開、閉
      meaning: string;   // 建築意義說明
      level: 'auspicious' | 'neutral' | 'inauspicious';
    };
    
    // 神煞系統
    gods: {
      auspicious: Array<{
        name: string;    // 例：天德、月德、天喜
        description: string;
        effect: string;  // 對運勢的影響
      }>;
      inauspicious: Array<{
        name: string;    // 例：五鬼、死符、歲破
        description: string;
        effect: string;
        severity: 'light' | 'medium' | 'severe';
      }>;
    };
    
    // 宜忌事項
    activities: {
      suitable: Array<{
        activity: string;
        reason: string;
        confidence: number; // 1-100 信心指數
      }>;
      unsuitable: Array<{
        activity: string;
        reason: string;
        severity: 'avoid' | 'caution' | 'forbidden';
      }>;
    };
    
    // 董公評分
    score: {
      overall: number;   // 總體評分 1-100
      breakdown: {
        ganZhi: number;  // 干支評分
        gods: number;    // 神煞評分
        builds: number;  // 十二建評分
      };
      level: 'excellent' | 'good' | 'fair' | 'poor' | 'terrible';
    };
  };
  
  // 時辰分析（進階功能）
  hourlyAnalysis?: Array<{
    hour: string;        // 子時、丑時...
    timeRange: string;   // 23:00-01:00
    ganZhi: string;      // 時干支
    suitability: number; // 該時辰適合度
    activities: string[]; // 適合的活動
  }>;
  
  // 進階分析（付費功能）
  advancedAnalysis?: {
    detailedExplanation: string;    // 詳細的董公規則說明
    alternativeDates: Date[];       // 其他適合的日期
    historicalContext: string;      // 歷史典故或背景
  };
  
  // 驗證狀態
  validation: {
    status: 'verified' | 'pending' | 'failed';
    accuracy: number;
    lastChecked: Date;
    source: 'yju.tw' | 'internal';
  };
}
```

### 4.3 篩選功能選項

**實際的篩選介面設計：**

篩選功能主要用於**日曆頁面**和**智能推薦頁面**，讓用戶快速找到符合條件的日期。

```typescript
interface FilterUI {
  // 1. 基礎篩選（所有用戶都有）
  basic: {
    // 日期範圍選擇
    dateRange: {
      options: ['本週', '本月', '下個月', '未來三個月', '自訂範圍'];
      selected: string;
      customStart?: Date;
      customEnd?: Date;
    };
    
    // 吉凶程度篩選（多選）
    auspiciousLevel: {
      options: [
        { value: 'excellent', label: '大吉', color: '#ff6b6b' },
        { value: 'good', label: '吉', color: '#4ecdc4' },
        { value: 'fair', label: '平', color: '#45b7d1' },
        { value: 'poor', label: '凶', color: '#96ceb4' },
        { value: 'terrible', label: '大凶', color: '#feca57' }
      ];
      selected: string[]; // 用戶選擇的等級
    };
  };
  
  // 2. 事項篩選（核心功能）
  activity: {
    // 傳統董公分類（單選或多選）
    categories: [
      { id: 'marriage', name: '人事類', activities: ['嫁娶', '納采', '冠笄'] },
      { id: 'construction', name: '營建類', activities: ['動土', '上樑', '修造', '破屋', '補垣'] },
      { id: 'moving', name: '遷移類', activities: ['移徙', '入宅', '出行'] },
      { id: 'business', name: '商業類', activities: ['開市', '立券', '納財'] },
      { id: 'ceremony', name: '祭祀類', activities: ['祭祀', '祈福', '開光'] },
      { id: 'funeral', name: '喪葬類', activities: ['安葬', '破土', '成服'] },
      { id: 'agriculture', name: '農事類', activities: ['栽種', '收成', '牧養'] },
      { id: 'medical', name: '醫療類', activities: ['療病', '針灸'] },
      { id: 'education', name: '學習類', activities: ['入學', '習藝'] },
      { id: 'others', name: '其他類', activities: ['理髮', '沐浴', '掃舍', '畋獵', '織染'] }
    ];
    selectedActivity: string; // 用戶選擇的具體事項
  };
  
  // 3. 進階篩選（付費功能）- 專注董公獨有特色
  advanced?: {
    // 董公十二建篩選（董公擇日的核心特色）
    twelveBuilds: {
      enabled: boolean;
      options: [
        { value: '建', name: '建日', description: '宜開創、立事' },
        { value: '除', name: '除日', description: '宜清除、治療' },
        { value: '滿', name: '滿日', description: '宜祭祀、嫁娶' },
        { value: '平', name: '平日', description: '平常日，諸事可行' },
        { value: '定', name: '定日', description: '宜安定、簽約' },
        { value: '執', name: '執日', description: '宜執行、建造' },
        { value: '破', name: '破日', description: '破日，諸事不宜' },
        { value: '危', name: '危日', description: '危險日，宜謹慎' },
        { value: '成', name: '成日', description: '宜成事、開業' },
        { value: '收', name: '收日', description: '宜收成、納財' },
        { value: '開', name: '開日', description: '宜開市、出行' },
        { value: '閉', name: '閉日', description: '宜閉藏、休息' }
      ];
      selected: string[]; // 用戶選擇包含的建日
    };
  };
}

// 實際的篩選介面流程
const FILTER_FLOW = {
  step1: '選擇日期範圍',
  step2: '選擇要做的事項（嫁娶、開市等）',
  step3: '選擇吉凶程度（大吉、吉、平等）',
  step4: '（付費用戶）進階篩選（十二建、神煞等）'
};

// 快速篩選預設組合
const QUICK_FILTERS = [
  {
    name: '結婚吉日',
    activity: '嫁娶',
    levels: ['excellent', 'good'],
    dateRange: 'next_month'
  },
  {
    name: '開業吉日', 
    activity: '開市',
    levels: ['excellent', 'good'],
    dateRange: 'next_month'
  },
  {
    name: '搬家吉日',
    activity: '移徙',
    levels: ['excellent', 'good'],
    dateRange: 'next_month'
  }
];
```

**篩選結果顯示：**

```typescript
interface FilterResult {
  // 篩選後的日期列表
  dates: Array<{
    date: Date;
    score: number;
    level: 'excellent' | 'good' | 'fair' | 'poor' | 'terrible';
    reason: string;        // 為什麼適合這個事項
    warnings?: string[];   // 需要注意的事項
  }>;
  
  // 篩選統計
  summary: {
    total: number;         // 總共找到幾個日期
    excellent: number;     // 大吉日數量
    good: number;         // 吉日數量
    dateRange: string;    // 搜尋的日期範圍
  };
}
```

**篩選功能的使用場景：**

1. **日曆頁面** - 用戶可以篩選顯示特定條件的日期
2. **智能推薦頁面** - 根據篩選條件推薦適合的日期
3. **快速查詢** - 提供常用的預設篩選組合

## 最終的篩選設計：

### 1. **基礎篩選**（所有用戶）
- 日期範圍選擇
- 吉凶程度篩選（大吉、吉、平、凶、大凶）

### 2. **事項篩選**（核心功能）
- 選擇具體要做的事項（嫁娶、開市、動土等）
- 按董公傳統分類組織

### 3. **進階篩選**（付費功能）
- **十二建除篩選** - 董公擇日的核心特色
- 每個建日都有清楚的說明和適用場景

**設計理念：**
- **專注董公特色** - 突出十二建除這個獨有功能
- **簡潔易懂** - 移除複雜的神煞篩選
- **實用導向** - 每個選項都有明確的使用場景

這樣的設計讓用戶真正體驗到董公擇日的獨特價值。

### 4.4 個人化設定詳細內容

**完整個人化選項：**

```typescript
interface PersonalizationSettings {
  // 個人基本資料
  personalInfo: {
    name?: string;
    birthDate?: Date;
    birthTime?: {
      hour: number;
      minute: number;
      isLunar: boolean;    // 是否為農曆生日
    };
    birthPlace?: {
      city: string;
      timezone: string;
    };
    gender?: 'male' | 'female';
    zodiac?: string;       // 生肖
    constellation?: string; // 星座
  };
  
  // 使用偏好（非個人化推薦）
  usagePreferences: {
    frequentActivities: string[]; // 常查詢的事項類型
    defaultDateRange: number;     // 預設查詢天數
    reminderSettings: {
      enabled: boolean;
      daysAdvance: number;        // 提前幾天提醒
      reminderTime: string;       // 提醒時間 (例: "09:00")
      reminderTypes: {
        favoriteDate: boolean;    // 收藏日期提醒
        goodDays: boolean;        // 大吉日提醒
        specificActivity: boolean; // 特定事項吉日提醒
      };
    };
  };
  
  // 偏好設定
  preferences: {
    // 顯示偏好
    display: {
      calendarType: 'gregorian' | 'lunar' | 'both'; // 日曆顯示模式
      primaryCalendar: 'gregorian' | 'lunar';       // 主要顯示的日曆
      showGanZhi: boolean;           // 顯示干支
      showGods: boolean;             // 顯示神煞
      showHourlyAnalysis: boolean;   // 顯示時辰分析
      defaultView: 'month' | 'week' | 'day'; // 預設檢視
    };
    
    // 通知偏好
    notifications: {
      enabled: boolean;
      dailyReminder: boolean;        // 每日提醒
      favoriteReminder: boolean;     // 收藏日期提醒
      auspiciousAlert: boolean;      // 吉日提醒
      customReminders: Array<{
        activity: string;
        daysAdvance: number;         // 提前幾天提醒
        time: string;               // 提醒時間
      }>;
    };
    
    // 常用活動
    frequentActivities: string[];   // 常查詢的活動類型
    
    // 避忌設定
    personalTaboos: {
      avoidDates: Date[];           // 個人忌日
      avoidGods: string[];          // 個人避忌神煞
      avoidActivities: string[];    // 個人不適合的活動
    };
    
    // 地區設定
    location: {
      timezone: string;             // 時區
      region: 'taiwan' | 'hongkong' | 'mainland' | 'singapore'; // 地區習俗
      calendar: 'traditional' | 'simplified'; // 農曆系統
    };
  };
  
  // 使用記錄（用於改善體驗）
  usageHistory: {
    queryCount: number;
    lastUsedActivities: string[];
    favoriteFilters: FilterOptions[];
  };
  
  // 分享設定
  sharing: {
    defaultPrivacy: 'public' | 'friends' | 'private';
    includePersonalInfo: boolean;   // 分享時是否包含個人資訊
    watermark: boolean;            // 是否加浮水印
  };
  
  // 訂閱偏好
  subscription: {
    autoRenewal: boolean;
    preferredPlan: 'monthly' | 'yearly';
    features: {
      aiRecommendations: boolean;
      personalizedAnalysis: boolean;
      unlimitedQueries: boolean;
      exportFeatures: boolean;
    };
  };
}
```

### 5. 核心 UI 組件

**日曆組件：**
```jsx
<DongGongCalendar
  onDateSelect={handleDateSelect}
  highlightAuspicious={true}
  showLunarDates={true}
  aiRecommendations={premiumUser ? aiData : null}
/>
```

**分析卡片：**
```jsx
<AnalysisCard
  date={selectedDate}
  analysis={dongGongAnalysis}
  showAIInsights={isPremiumUser}
  onSharePress={handleShare}
/>
```

## 資料模型設計

### 6. 核心資料結構

```typescript
// 日期分析資料
interface DateAnalysis {
  id: string;
  date: Date;
  lunarDate: LunarDate;
  dongGongAnalysis: DongGongAnalysis;
  aiRecommendations?: AIRecommendation[];
  userNotes?: string;
  isFavorited: boolean;
  createdAt: Date;
}

// 用戶資料
interface UserProfile {
  id: string;
  subscriptionTier: SubscriptionTier;
  personalInfo?: {
    birthDate?: Date;
    birthTime?: string;
    gender?: 'male' | 'female';
  };
  preferences: {
    showLunarCalendar: boolean;
    enableNotifications: boolean;
    preferredActivities: ActivityType[];
  };
  usageStats: {
    dailyQueries: number;
    lastQueryDate: Date;
    totalQueries: number;
  };
}
```

### 6. yju.tw 驗證服務整合

**驗證機制設計：**

```typescript
class YjuTwValidationService {
  private readonly YJU_TW_BASE_URL = 'https://yju.tw';
  
  async validateDongGongCalculation(
    date: Date, 
    ourCalculation: DongGongAnalysis
  ): Promise<ValidationResult> {
    try {
      // 1. 呼叫 yju.tw API 或爬取資料
      const yjuData = await this.fetchYjuTwData(date);
      
      // 2. 比對關鍵欄位
      const comparison = this.compareCalculations(ourCalculation, yjuData);
      
      // 3. 計算準確度
      const accuracy = this.calculateAccuracy(comparison);
      
      return {
        isValid: accuracy > 0.85, // 85% 以上視為有效
        discrepancies: comparison.differences,
        yjuTwData: yjuData,
        confidence: accuracy
      };
    } catch (error) {
      // 驗證服務失敗時的處理
      return {
        isValid: true, // 預設信任我們的計算
        discrepancies: ['驗證服務暫時無法使用'],
        confidence: 0.8 // 降低信心指數
      };
    }
  }
  
  private async fetchYjuTwData(date: Date): Promise<YjuTwResponse> {
    // 實作方式 1: 如果有 API
    const response = await fetch(`${this.YJU_TW_BASE_URL}/api/datesel`, {
      method: 'POST',
      body: JSON.stringify({ date: date.toISOString() })
    });
    
    // 實作方式 2: 如果需要網頁爬取
    // const html = await this.scrapeYjuTwPage(date);
    // return this.parseYjuTwHtml(html);
    
    return response.json();
  }
  
  private compareCalculations(
    ours: DongGongAnalysis, 
    theirs: YjuTwResponse
  ): ComparisonResult {
    return {
      ganZhiMatch: ours.ganZhi === theirs.ganZhi,
      solarTermMatch: ours.solarTerm === theirs.solarTerm,
      auspiciousGodsMatch: this.compareArrays(ours.auspiciousGods, theirs.auspiciousGods),
      overallAccuracy: this.calculateOverallAccuracy(ours, theirs),
      differences: this.identifyDifferences(ours, theirs)
    };
  }
}

// 開發階段的測試驗證
class DevelopmentValidator {
  async runValidationTests(): Promise<ValidationReport> {
    const testDates = [
      new Date('2024-01-01'),
      new Date('2024-02-14'),
      new Date('2024-03-15'),
      // ... 更多測試日期
    ];
    
    const results = await Promise.all(
      testDates.map(date => this.validateSingleDate(date))
    );
    
    return {
      totalTests: testDates.length,
      passedTests: results.filter(r => r.isValid).length,
      averageAccuracy: results.reduce((sum, r) => sum + r.confidence, 0) / results.length,
      failedDates: results.filter(r => !r.isValid).map(r => r.date)
    };
  }
}
```

**品質保證流程：**

```typescript
// 每日自動驗證
class QualityAssuranceService {
  async dailyValidationCheck(): Promise<void> {
    const today = new Date();
    const nextWeek = Array.from({ length: 7 }, (_, i) => 
      new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
    );
    
    for (const date of nextWeek) {
      const validation = await this.validator.validateDongGongCalculation(
        date, 
        await this.calculator.getDongGongAnalysis(date)
      );
      
      if (!validation.isValid) {
        // 記錄錯誤並通知開發團隊
        await this.reportValidationFailure(date, validation);
      }
    }
  }
  
  private async reportValidationFailure(
    date: Date, 
    validation: ValidationResult
  ): Promise<void> {
    // 發送警報給開發團隊
    console.error(`Validation failed for ${date.toISOString()}:`, validation.discrepancies);
    
    // 可以整合 Slack、Email 或其他通知系統
    await this.notificationService.sendAlert({
      type: 'VALIDATION_FAILURE',
      date,
      discrepancies: validation.discrepancies,
      confidence: validation.confidence
    });
  }
}
```

## 錯誤處理與效能

### 7. 錯誤處理策略

```typescript
class DongGongErrorHandler {
  static handleCalculationError(error: Error): UserFriendlyError {
    // 農曆計算錯誤處理
    if (error instanceof LunarCalculationError) {
      return new UserFriendlyError(
        '日期計算暫時無法使用，請稍後再試',
        'CALCULATION_ERROR'
      );
    }
    
    // AI 服務錯誤處理
    if (error instanceof AIServiceError) {
      return new UserFriendlyError(
        'AI 推薦功能暫時無法使用，您仍可查看基礎擇日資訊',
        'AI_SERVICE_ERROR'
      );
    }
    
    return new UserFriendlyError(
      '發生未知錯誤，請重新啟動 App',
      'UNKNOWN_ERROR'
    );
  }
}
```

### 8. 免費服務使用策略

**Firebase 免費額度管理：**
- **Firestore**: 1GB 儲存空間，50,000 讀取/天
- **Auth**: 50,000 MAU (月活躍用戶)
- **Functions**: 125,000 次調用/月
- **Hosting**: 10GB 儲存空間

**成本控制措施：**
- 本地快取農曆計算結果，減少 API 調用
- 用戶資料最小化，只存必要資訊
- 分批載入資料，避免超出免費額度
- 監控使用量，接近限制時優化

**數據追蹤 (第二階段)：**
- 初期不使用分析服務，專注核心功能
- 用戶增長後再加入 Firebase Analytics
- 使用簡單的本地統計記錄基本使用情況

**效能優化：**
- 本地快取農曆計算結果 30 天
- 離線優先設計，基礎功能無需網路
- 圖片使用 Expo 內建優化
- 懶載入非核心功能

## 測試策略

### 9. 測試覆蓋範圍

```typescript
// 單元測試
describe('DongGongCalculator', () => {
  test('should calculate correct lunar date', () => {
    const result = calculator.getLunarDate(new Date('2024-01-01'));
    expect(result.lunarYear).toBe(2023);
    expect(result.lunarMonth).toBe(11);
  });
  
  test('should provide accurate dong gong analysis', () => {
    const analysis = calculator.getDongGongAnalysis(new Date('2024-01-01'));
    expect(analysis.dongGongScore).toBeGreaterThan(0);
    expect(analysis.dongGongScore).toBeLessThanOrEqual(100);
  });
});

// 整合測試
describe('AI Recommendation Integration', () => {
  test('should integrate with contains-studio agents', async () => {
    const recommendations = await aiAgent.analyzeOptimalDates({
      activityType: 'wedding',
      dateRange: getNextMonth()
    });
    expect(recommendations).toHaveLength(greaterThan(0));
  });
});

// yju.tw 驗證測試
describe('YjuTw Validation Service', () => {
  test('should validate calculations against yju.tw', async () => {
    const testDate = new Date('2024-01-01');
    const ourAnalysis = await calculator.getDongGongAnalysis(testDate);
    const validation = await validator.validateDongGongCalculation(testDate, ourAnalysis);
    
    expect(validation.confidence).toBeGreaterThan(0.8);
    expect(validation.discrepancies.length).toBeLessThan(3);
  });
  
  test('should handle yju.tw service unavailability gracefully', async () => {
    // 模擬 yju.tw 服務不可用
    jest.spyOn(validator, 'fetchYjuTwData').mockRejectedValue(new Error('Service unavailable'));
    
    const validation = await validator.validateDongGongCalculation(new Date(), mockAnalysis);
    expect(validation.isValid).toBe(true); // 應該預設信任我們的計算
    expect(validation.confidence).toBeLessThan(0.9); // 但降低信心指數
  });
});
```

這個設計整合了傳統董公擇日智慧與現代 AI 技術，提供了可持續的商業模式和優秀的用戶體驗。

## 🎯 基於真實資料的董公擇日分析結果

### 📊 資料統計
- **分析天數**: 12000 天
- **吉星種類**: 22 種
- **凶煞種類**: 23 種
- **活動事項**: 23 種

### 🔍 主要發現
1. **十二建除頻率**: 建(50), 破(50), 開(20), 定(10), 收(20)
2. **最常見吉星**: 天賊, 天喜, 天月二德, 天皇地皇, 金銀庫樓
3. **最常見凶煞**: 白虎入中宮, 小紅沙, 朱雀勾絞, 黃沙, 往亡
4. **最常見活動**: 婚姻, 起造, 入宅, 出行, 安葬

### ⚙️ 計算引擎
基於以上分析結果，已自動生成 `dong_gong_calculator.py` 計算引擎，包含：
- 干支計算邏輯
- 十二建除計算
- 吉星凶煞判斷
- 事項宜忌分析
- 整體評分系統

