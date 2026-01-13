"use strict";
/**
 * 董公擇日 - 十二建星專業規則資料庫
 * 基於傳統「建滿平收黑，除危定執黃，成開皆可用，閉破不吉祥」的完整規則
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRADITIONAL_VERSES = exports.BUILD_FORMULA = exports.TWELVE_BUILDS_RULES = void 0;
exports.getBuildsByCategory = getBuildsByCategory;
exports.getYellowPathBuilds = getYellowPathBuilds;
exports.getBlackPathBuilds = getBlackPathBuilds;
exports.getUsableBuilds = getUsableBuilds;
exports.getInauspiciousBuilds = getInauspiciousBuilds;
exports.getBuildRule = getBuildRule;
exports.getSuitableBuildsForActivity = getSuitableBuildsForActivity;
exports.getUnsuitableBuildsForActivity = getUnsuitableBuildsForActivity;
exports.validateBuildFormula = validateBuildFormula;
exports.getBuildAnalysis = getBuildAnalysis;
// 十二建星完整規則資料庫
exports.TWELVE_BUILDS_RULES = {
    // 黑道日 - 建滿平收黑
    '建': {
        name: '建',
        category: 'auspicious',
        type: 'black_path',
        meaning: '建築創始',
        description: '建日為健旺至上之象，宜創始、立事，但忌動土安葬',
        score: 70,
        suitable: [
            '出行', '會友', '上官赴任', '嫁娶', '訂盟', '納采',
            '入學', '拜師', '開市', '立券', '修造', '動土'
        ],
        avoid: [
            '安葬', '破土', '開渠', '穿井'
        ],
        specialRules: [
            '建日雖屬黑道，但為月之首日，創始之象，多數事項皆吉',
            '建日動土需謹慎，容易有變動',
            '建日嫁娶主新人感情穩固'
        ],
        relationships: {
            opposite: '破',
            harmonious: ['除', '定', '成'],
            conflicting: ['破', '危']
        },
        hourInfluence: {
            best: ['寅', '卯', '辰'], // 早晨時辰，符合建築創始之意
            avoid: ['戌', '亥']
        },
        seasonalEffect: {
            spring: 'enhanced', // 春季萬物生長，建日更吉
            summer: 'normal',
            autumn: 'normal',
            winter: 'weakened'
        }
    },
    '滿': {
        name: '滿',
        category: 'auspicious',
        type: 'black_path',
        meaning: '圓滿豐收',
        description: '滿日為豐溢圓滿之象，宜祭祀、嫁娶，但忌動土栽種',
        score: 80,
        suitable: [
            '祭祀', '祈福', '嫁娶', '納采', '會親友',
            '修造', '豎柱', '上樑', '開市', '立券'
        ],
        avoid: [
            '動土', '栽種', '安葬', '破土'
        ],
        specialRules: [
            '滿日主圓滿，最宜婚姻嫁娶',
            '滿日忌動土，恐有土瘟之患',
            '滿日祭祀特別靈驗'
        ],
        relationships: {
            opposite: '危',
            harmonious: ['建', '定', '成'],
            conflicting: ['危', '破']
        },
        hourInfluence: {
            best: ['午', '未'], // 正午時分，陽氣最盛
            avoid: ['子', '丑']
        },
        seasonalEffect: {
            spring: 'normal',
            summer: 'enhanced', // 夏季豐收之象
            autumn: 'enhanced', // 秋季收穫之時
            winter: 'normal'
        }
    },
    '平': {
        name: '平',
        category: 'neutral',
        type: 'black_path',
        meaning: '平常無事',
        description: '平日為平常之象，無特別吉凶，一般事務皆可',
        score: 50,
        suitable: [
            '修造', '動土', '安床', '掃舍', '治病',
            '栽種', '牧養', '捕捉'
        ],
        avoid: [
        // 平日一般無特別禁忌
        ],
        specialRules: [
            '平日無特別吉凶，適合日常事務',
            '平日治病效果較好',
            '平日宜修身養性'
        ],
        relationships: {
            harmonious: ['除', '定', '執'],
            conflicting: []
        },
        hourInfluence: {
            best: ['辰', '申'], // 平穩時辰
            avoid: []
        },
        seasonalEffect: {
            spring: 'normal',
            summer: 'normal',
            autumn: 'normal',
            winter: 'normal'
        }
    },
    '收': {
        name: '收',
        category: 'auspicious',
        type: 'black_path',
        meaning: '收成納財',
        description: '收日為收藏納財之象，宜嫁娶、納財，先難後易',
        score: 75,
        suitable: [
            '嫁娶', '納采', '求財', '開市', '立券',
            '納畜', '捕捉', '漁獵', '安葬'
        ],
        avoid: [
            '開倉', '出貨', '放債'
        ],
        specialRules: [
            '收日最宜嫁娶，主夫妻和睦',
            '收日納財吉利，但不宜放出',
            '收日安葬主後代興旺'
        ],
        relationships: {
            opposite: '開',
            harmonious: ['滿', '成'],
            conflicting: ['開']
        },
        hourInfluence: {
            best: ['酉', '戌'], // 傍晚收成時分
            avoid: ['卯', '辰']
        },
        seasonalEffect: {
            spring: 'normal',
            summer: 'normal',
            autumn: 'enhanced', // 秋季收穫最佳
            winter: 'enhanced' // 冬季收藏最宜
        }
    },
    // 黃道日 - 除危定執黃
    '除': {
        name: '除',
        category: 'neutral',
        type: 'yellow_path',
        meaning: '清除舊物',
        description: '除日為除舊布新之象，宜清潔、治病，但忌修造',
        score: 60,
        suitable: [
            '除服', '療病', '出行', '嫁娶', '移徙',
            '入宅', '捕捉', '漁獵', '掃舍', '沐浴'
        ],
        avoid: [
            '修造', '動土', '栽種'
        ],
        specialRules: [
            '除日最宜治病，能除去病根',
            '除日宜清潔打掃，除舊迎新',
            '除日嫁娶能除去不好的過往'
        ],
        relationships: {
            opposite: '建',
            harmonious: ['危', '定', '執'],
            conflicting: []
        },
        hourInfluence: {
            best: ['巳', '午'], // 上午除舊
            avoid: ['亥', '子']
        },
        seasonalEffect: {
            spring: 'enhanced', // 春季除舊迎新
            summer: 'normal',
            autumn: 'normal',
            winter: 'enhanced' // 年末除舊
        }
    },
    '危': {
        name: '危',
        category: 'auspicious', // 修正：危日是黃道吉日
        type: 'yellow_path',
        meaning: '危險不安，高大之象',
        description: '危日為黃道吉日，高大之象，宜安床、交關、求官、謀事百為',
        score: 70, // 修正：黃道吉日應該有較高評分
        suitable: [
            '安床', '交關', '求官', '謀事', '起造', '安葬',
            '會友', '修倉', '補垣', '塞穴', '納財', '立券'
        ],
        avoid: [
            '遠行', '登高' // 危日忌登高遠行
        ],
        specialRules: [
            '危日為黃道吉日，雖名為危，實為高大之象',
            '危日宜謀大事，交關求官特別吉利',
            '危日起造安葬皆吉，但忌登高遠行'
        ],
        relationships: {
            opposite: '滿',
            harmonious: ['除', '定', '執'],
            conflicting: ['滿']
        },
        hourInfluence: {
            best: ['巳', '午', '未'], // 白天陽氣盛時較佳
            avoid: ['子', '丑'] // 深夜較不宜
        },
        seasonalEffect: {
            spring: 'enhanced', // 春季生機勃勃，危日更吉
            summer: 'normal',
            autumn: 'enhanced', // 秋季收穫，危日宜謀事
            winter: 'normal'
        }
    },
    '定': {
        name: '定',
        category: 'auspicious',
        type: 'yellow_path',
        meaning: '安定穩固',
        description: '定日為安定穩固之象，大吉，宜冠帶、修倉、嫁娶',
        score: 75,
        suitable: [
            '冠帶', '嫁娶', '納采', '修倉', '造倉',
            '立券', '交易', '納財', '栽種', '捕捉'
        ],
        avoid: [
            '訟事', '醫療' // 定日忌變動
        ],
        specialRules: [
            '定日大吉，百事皆宜',
            '定日嫁娶主婚姻穩定',
            '定日立券交易最為吉利'
        ],
        relationships: {
            harmonious: ['除', '危', '執', '建', '滿'],
            conflicting: []
        },
        hourInfluence: {
            best: ['辰', '巳', '午', '未'], // 白天穩定時段
            avoid: []
        },
        seasonalEffect: {
            spring: 'enhanced',
            summer: 'enhanced',
            autumn: 'enhanced',
            winter: 'enhanced' // 四季皆宜
        }
    },
    '執': {
        name: '執',
        category: 'neutral',
        type: 'yellow_path',
        meaning: '執行建造',
        description: '執日為執持操守之象，宜建造、種植，但忌開市',
        score: 65,
        suitable: [
            '捕捉', '造葬', '嫁娶', '建屋', '修造',
            '動土', '栽種', '牧養'
        ],
        avoid: [
            '開市', '立券', '出行'
        ],
        specialRules: [
            '執日宜執行既定計劃',
            '執日建造特別穩固',
            '執日不宜開始新的商業活動'
        ],
        relationships: {
            harmonious: ['除', '危', '定'],
            conflicting: ['開']
        },
        hourInfluence: {
            best: ['辰', '戌'], // 執行力強的時辰
            avoid: ['午'] // 正午過於急躁
        },
        seasonalEffect: {
            spring: 'enhanced', // 春季種植最佳
            summer: 'normal',
            autumn: 'normal',
            winter: 'weakened'
        }
    },
    // 可用日 - 成開皆可用
    '成': {
        name: '成',
        category: 'auspicious',
        type: 'usable',
        meaning: '成就完成',
        description: '成日為成就完成之象，大吉，各種成事皆宜',
        score: 85,
        suitable: [
            '嫁娶', '納采', '出行', '立券', '交易',
            '納財', '開市', '修造', '動土', '移徙',
            '入宅', '安床', '作灶', '補垣'
        ],
        avoid: [
        // 成日幾乎無禁忌
        ],
        specialRules: [
            '成日大吉，百事皆宜',
            '成日最宜完成重要事項',
            '成日開始的事業容易成功'
        ],
        relationships: {
            harmonious: ['建', '滿', '定', '開'],
            conflicting: []
        },
        hourInfluence: {
            best: ['巳', '午', '未'], // 成事的黃金時段
            avoid: []
        },
        seasonalEffect: {
            spring: 'enhanced',
            summer: 'enhanced',
            autumn: 'enhanced',
            winter: 'normal'
        }
    },
    '開': {
        name: '開',
        category: 'auspicious',
        type: 'usable',
        meaning: '開創啟動',
        description: '開日為開創啟動之象，萬事皆吉，唯忌破土安葬',
        score: 90,
        suitable: [
            '開市', '立券', '納財', '出行', '嫁娶',
            '納采', '移徙', '入宅', '修造', '豎柱',
            '上樑', '會友', '求官', '上任'
        ],
        avoid: [
            '破土', '安葬'
        ],
        specialRules: [
            '開日大吉，開創事業最佳',
            '開日忌安葬，與開創之意相反',
            '開日出行特別順利'
        ],
        relationships: {
            opposite: '收',
            harmonious: ['成', '建'],
            conflicting: ['收', '閉']
        },
        hourInfluence: {
            best: ['卯', '辰', '巳'], // 早晨開始時分
            avoid: ['戌', '亥']
        },
        seasonalEffect: {
            spring: 'enhanced', // 春季開創最佳
            summer: 'enhanced',
            autumn: 'normal',
            winter: 'normal'
        }
    },
    // 不吉祥日 - 閉破不吉祥
    '閉': {
        name: '閉',
        category: 'neutral',
        type: 'inauspicious',
        meaning: '閉藏休息',
        description: '閉日為閉藏堅固之象，宜埋葬、修築，忌開市經商',
        score: 40,
        suitable: [
            '埋葬', '修築', '補垣', '塞穴', '造倉',
            '修倉', '築堤', '建碑'
        ],
        avoid: [
            '開市', '立券', '納財', '出行', '嫁娶',
            '上任', '會友'
        ],
        specialRules: [
            '閉日宜閉藏，不宜開創',
            '閉日安葬特別吉利',
            '閉日適合內省修養'
        ],
        relationships: {
            opposite: '開',
            harmonious: [],
            conflicting: ['開', '成']
        },
        hourInfluence: {
            best: ['戌', '亥', '子'], // 夜晚閉藏時分
            avoid: ['卯', '辰', '巳']
        },
        seasonalEffect: {
            spring: 'weakened', // 春季不宜閉藏
            summer: 'weakened',
            autumn: 'normal',
            winter: 'enhanced' // 冬季閉藏最宜
        }
    },
    '破': {
        name: '破',
        category: 'inauspicious',
        type: 'inauspicious',
        meaning: '破敗損壞',
        description: '破日為破敗極凶之象，百事俱忌，唯宜破屋服藥',
        score: 20,
        suitable: [
            '破屋', '壞垣', '求醫', '服藥', '治病',
            '破土' // 僅限於破壞性活動
        ],
        avoid: [
            '嫁娶', '納采', '出行', '開市', '立券',
            '移徙', '入宅', '修造', '動土', '安床',
            '作灶', '會友', '上任' // 幾乎所有正面活動
        ],
        specialRules: [
            '破日大凶，百事不宜',
            '破日唯一好處是治病效果佳',
            '破日可以破除不好的事物'
        ],
        relationships: {
            opposite: '建',
            harmonious: [],
            conflicting: ['建', '滿', '成', '開']
        },
        hourInfluence: {
            best: [], // 破日無特別好的時辰
            avoid: ['子', '午', '卯', '酉'] // 四正時忌用
        },
        seasonalEffect: {
            spring: 'weakened',
            summer: 'weakened',
            autumn: 'weakened',
            winter: 'weakened' // 四季皆不宜
        }
    }
};
// 建星分類查詢函數
function getBuildsByCategory(category) {
    return Object.values(exports.TWELVE_BUILDS_RULES)
        .filter(rule => rule.type === category)
        .map(rule => rule.name);
}
// 獲取黃道吉日
function getYellowPathBuilds() {
    return getBuildsByCategory('yellow_path');
}
// 獲取黑道日
function getBlackPathBuilds() {
    return getBuildsByCategory('black_path');
}
// 獲取可用日
function getUsableBuilds() {
    return getBuildsByCategory('usable');
}
// 獲取不吉祥日
function getInauspiciousBuilds() {
    return getBuildsByCategory('inauspicious');
}
// 根據建星獲取詳細規則
function getBuildRule(build) {
    return exports.TWELVE_BUILDS_RULES[build];
}
// 根據事項獲取適合的建星
function getSuitableBuildsForActivity(activity) {
    return Object.values(exports.TWELVE_BUILDS_RULES)
        .filter(rule => rule.suitable.includes(activity))
        .map(rule => rule.name);
}
// 根據事項獲取不適合的建星
function getUnsuitableBuildsForActivity(activity) {
    return Object.values(exports.TWELVE_BUILDS_RULES)
        .filter(rule => rule.avoid.includes(activity))
        .map(rule => rule.name);
}
// 建星口訣驗證
exports.BUILD_FORMULA = {
    yellow_path: ['除', '危', '定', '執'], // 除危定執黃
    black_path: ['建', '滿', '平', '收'], // 建滿平收黑
    usable: ['成', '開'], // 成開皆可用
    inauspicious: ['閉', '破'] // 閉破不吉祥
};
// 驗證建星分類是否正確
function validateBuildFormula() {
    const yellowPath = getYellowPathBuilds();
    const blackPath = getBlackPathBuilds();
    const usable = getUsableBuilds();
    const inauspicious = getInauspiciousBuilds();
    return (JSON.stringify(yellowPath.sort()) === JSON.stringify(exports.BUILD_FORMULA.yellow_path.sort()) &&
        JSON.stringify(blackPath.sort()) === JSON.stringify(exports.BUILD_FORMULA.black_path.sort()) &&
        JSON.stringify(usable.sort()) === JSON.stringify(exports.BUILD_FORMULA.usable.sort()) &&
        JSON.stringify(inauspicious.sort()) === JSON.stringify(exports.BUILD_FORMULA.inauspicious.sort()));
} // 傳統口訣
exports.TRADITIONAL_VERSES = {
    main: '建滿平收黑，除危定執黃，成開皆可用，閉破不吉祥',
    explanation: {
        '黑道': '建滿平收為黑道，雖不大吉，但各有所宜',
        '黃道': '除危定執為黃道，大吉之日，百事皆宜',
        '可用': '成開皆可用，為最吉之日，萬事如意',
        '不吉': '閉破不吉祥，為凶日，諸事不宜'
    }
};
// 獲取建星的詳細分析
function getBuildAnalysis(build) {
    const rule = getBuildRule(build);
    let pathType = '';
    let recommendation = '';
    if (rule.type === 'yellow_path') {
        pathType = '黃道吉日';
        recommendation = '此日為黃道吉日，百事皆宜，是進行重要事務的好日子。';
    }
    else if (rule.type === 'usable') {
        pathType = '大吉可用';
        recommendation = '此日為大吉之日，萬事如意，特別適合開創新事業。';
    }
    else if (rule.type === 'black_path') {
        pathType = '黑道日';
        recommendation = '此日為黑道日，雖不大吉，但仍有其適宜之事，需謹慎選擇。';
    }
    else if (rule.type === 'inauspicious') {
        pathType = '不吉之日';
        recommendation = '此日不吉，除特定事項外，建議避免重要活動。';
    }
    return { rule, pathType, recommendation };
}
