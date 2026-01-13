"use strict";
/**
 * 董公擇日 - 傳統事項資料庫
 * 基於正統董公規則的完整事項清單
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODERN_ACTIVITY_MAPPING = exports.DONG_GONG_CATEGORIES = exports.DONG_GONG_ACTIVITIES = void 0;
exports.getActivityById = getActivityById;
exports.getActivitiesByCategory = getActivitiesByCategory;
exports.getAllCategories = getAllCategories;
exports.getActivitiesByBuild = getActivitiesByBuild;
exports.getAvoidActivitiesByBuild = getAvoidActivitiesByBuild;
// 董公擇日完整事項清單（基於傳統分類）
exports.DONG_GONG_ACTIVITIES = [
    // 人事類
    {
        id: 'marry',
        name: '嫁娶',
        traditional: '嫁娶',
        description: '婚姻大典，人生大事',
        category: '人事',
        buildPreference: ['成', '收', '開'],
        avoidBuilds: ['破', '危'],
        requiredGods: ['天喜', '紅鸞'],
        avoidEvils: ['白虎', '喪門'],
        specialRules: '需配合新人八字，避開三煞方'
    },
    {
        id: 'nacai',
        name: '納采',
        traditional: '納采',
        description: '訂婚下聘，婚姻前禮',
        category: '人事',
        buildPreference: ['定', '成'],
        avoidBuilds: ['破', '危'],
        specialRules: '宜天德、月德照臨'
    },
    // 營建類
    {
        id: 'dongtou',
        name: '動土',
        traditional: '動土',
        description: '興工建造，破土動工',
        category: '營建',
        buildPreference: ['建', '開'],
        avoidBuilds: ['破', '危'],
        avoidEvils: ['三煞', '太歲'],
        specialRules: '忌煞入中宮，需查三煞方位'
    },
    {
        id: 'qizao',
        name: '起造',
        traditional: '起造',
        description: '建築房屋，營造工程',
        category: '營建',
        buildPreference: ['建', '滿', '成'],
        avoidBuilds: ['破', '危'],
        specialRules: '宜天德合、月德合照臨'
    },
    // 遷移類
    {
        id: 'ruzhai',
        name: '入宅',
        traditional: '入宅',
        description: '遷入新居，安居樂業',
        category: '遷移',
        buildPreference: ['成', '開', '定'],
        avoidBuilds: ['破', '危'],
        requiredGods: ['天德', '月德'],
        specialRules: '需配合宅主八字，避開歲破方'
    },
    {
        id: 'chuxing',
        name: '出行',
        traditional: '出行',
        description: '外出遠行，旅途平安',
        category: '遷移',
        buildPreference: ['建', '開', '成'],
        avoidBuilds: ['破', '危'],
        avoidEvils: ['五鬼', '劫煞'],
        specialRules: '忌往太歲、三煞方向'
    },
    // 商業類
    {
        id: 'kaishi',
        name: '開市',
        traditional: '開市',
        description: '商店開業，生意興隆',
        category: '商業',
        buildPreference: ['開', '成', '收'],
        avoidBuilds: ['破', '閉'],
        requiredGods: ['天喜', '天富'],
        specialRules: '宜財星照臨，忌劫財煞'
    },
    {
        id: 'liquan',
        name: '立券',
        traditional: '立券',
        description: '簽約買賣，契約成立',
        category: '商業',
        buildPreference: ['定', '成'],
        avoidBuilds: ['破', '危'],
        specialRules: '宜天德、月德，忌小人煞'
    },
    // 祭祀類
    {
        id: 'jisi',
        name: '祭祀',
        traditional: '祭祀',
        description: '祭拜神明，祈福求安',
        category: '祭祀',
        buildPreference: ['滿', '定', '成'],
        avoidBuilds: ['破', '危'],
        requiredGods: ['天德', '月德'],
        specialRules: '需齋戒沐浴，心誠則靈'
    },
    {
        id: 'qifu',
        name: '祈福',
        traditional: '祈福',
        description: '祈求神佛，保佑平安',
        category: '祭祀',
        buildPreference: ['成', '滿'],
        avoidBuilds: ['破', '危'],
        specialRules: '宜天德、月德照臨'
    },
    // 喪葬類
    {
        id: 'anzang',
        name: '安葬',
        traditional: '安葬',
        description: '安葬先人，入土為安',
        category: '喪葬',
        buildPreference: ['危', '成'],
        avoidBuilds: ['建', '破'],
        avoidEvils: ['重喪', '復日'],
        specialRules: '需配合死者生辰，避開沖煞'
    },
    {
        id: 'potou',
        name: '破土',
        traditional: '破土',
        description: '挖掘墳墓，喪葬用土',
        category: '喪葬',
        buildPreference: ['危', '開'],
        avoidBuilds: ['建', '滿'],
        specialRules: '專用於喪葬，與動土不同'
    },
    // 醫療類
    {
        id: 'liaobing',
        name: '療病',
        traditional: '療病',
        description: '治療疾病，恢復健康',
        category: '醫療',
        buildPreference: ['除', '破'],
        avoidBuilds: ['建', '滿'],
        specialRules: '破日宜療病，除舊疾'
    },
    // 農事類
    {
        id: 'zaizhong',
        name: '栽種',
        traditional: '栽種',
        description: '種植農作，播種希望',
        category: '農事',
        buildPreference: ['建', '滿', '成'],
        avoidBuilds: ['破', '危'],
        specialRules: '配合節氣，順應天時'
    }
];
// 董公擇日傳統分類
exports.DONG_GONG_CATEGORIES = {
    人事: {
        name: '人事類',
        description: '人生重要事項',
        activities: ['嫁娶', '納采', '冠笄', '上官'],
        color: '#ff6b6b'
    },
    營建: {
        name: '營建類',
        description: '建築工程事項',
        activities: ['動土', '起造', '修造', '上樑', '豎柱'],
        color: '#4ecdc4'
    },
    遷移: {
        name: '遷移類',
        description: '搬遷出行事項',
        activities: ['入宅', '移徙', '出行'],
        color: '#45b7d1'
    },
    商業: {
        name: '商業類',
        description: '商業經營事項',
        activities: ['開市', '立券', '納財', '開倉'],
        color: '#96ceb4'
    },
    祭祀: {
        name: '祭祀類',
        description: '宗教祭祀事項',
        activities: ['祭祀', '祈福', '開光', '齋醮'],
        color: '#feca57'
    },
    喪葬: {
        name: '喪葬類',
        description: '喪葬相關事項',
        activities: ['安葬', '破土', '成服', '除服'],
        color: '#6c5ce7'
    },
    醫療: {
        name: '醫療類',
        description: '醫療保健事項',
        activities: ['療病', '針灸', '服藥'],
        color: '#fd79a8'
    },
    農事: {
        name: '農事類',
        description: '農業生產事項',
        activities: ['栽種', '收成', '牧養', '畋獵'],
        color: '#00b894'
    }
};
// 現代生活對應（幫助用戶理解）
exports.MODERN_ACTIVITY_MAPPING = {
    '嫁娶': ['結婚', '婚禮', '喜宴'],
    '納采': ['訂婚', '下聘', '提親'],
    '動土': ['建築', '裝修', '挖掘', '施工'],
    '入宅': ['搬家', '喬遷', '入厝'],
    '出行': ['旅遊', '出差', '遠行', '搬遷'],
    '開市': ['開業', '開店', '開工', '營業'],
    '立券': ['簽約', '買賣', '交易', '合作'],
    '祭祀': ['拜拜', '祭祖', '法會', '祈禱'],
    '安葬': ['下葬', '土葬', '火葬', '入塔'],
    '療病': ['看醫生', '手術', '治療', '復健']
};
// 根據活動ID獲取活動資訊
function getActivityById(id) {
    return exports.DONG_GONG_ACTIVITIES.find(activity => activity.id === id);
}
// 根據分類獲取活動列表
function getActivitiesByCategory(category) {
    return exports.DONG_GONG_ACTIVITIES.filter(activity => activity.category === category);
}
// 獲取所有分類
function getAllCategories() {
    return Object.keys(exports.DONG_GONG_CATEGORIES);
}
// 根據建星獲取適合的活動
function getActivitiesByBuild(build) {
    return exports.DONG_GONG_ACTIVITIES.filter(activity => activity.buildPreference.includes(build));
}
// 根據建星獲取不適合的活動
function getAvoidActivitiesByBuild(build) {
    return exports.DONG_GONG_ACTIVITIES.filter(activity => activity.avoidBuilds.includes(build));
}
//# sourceMappingURL=dong-gong-activities.js.map