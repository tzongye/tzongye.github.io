"use strict";
/**
 * 董公擇日 - 特殊日期識別系統
 * 包含四絕四離、特殊大吉日、特殊大凶日、煞入中宮等專業識別
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSiJueSiLi = checkSiJueSiLi;
exports.checkSpecialInauspiciousDay = checkSpecialInauspiciousDay;
exports.checkSpecialAuspiciousDay = checkSpecialAuspiciousDay;
exports.checkShaRuZhongGong = checkShaRuZhongGong;
exports.checkSanSha = checkSanSha;
exports.checkAllSpecialDates = checkAllSpecialDates;
// 二十四節氣名稱
const SOLAR_TERMS = [
    '立春', '雨水', '驚蟄', '春分', '清明', '穀雨',
    '立夏', '小滿', '芒種', '夏至', '小暑', '大暑',
    '立秋', '處暑', '白露', '秋分', '寒露', '霜降',
    '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
];
// 四立節氣（立春、立夏、立秋、立冬）
const FOUR_SEASONS_START = ['立春', '立夏', '立秋', '立冬'];
// 特殊大凶日配置
const SPECIAL_INAUSPICIOUS_DAYS = [
    // 建星配地支的特殊大凶組合
    { build: '建', branch: '巳', name: '建巳日', severity: 'extreme', description: '建巳日大凶，諸事不宜' },
    { build: '平', branch: '巳', name: '平巳日', severity: 'extreme', description: '平巳日大凶，百事皆忌' },
    { build: '破', branch: '申', name: '破申日', severity: 'extreme', description: '破申日大凶，破敗之象' },
    { build: '危', branch: '酉', name: '危酉日', severity: 'extreme', description: '危酉日大凶，危險重重' },
    { build: '收', branch: '戌', name: '收戌日', severity: 'severe', description: '收戌日凶，收煞入墓' },
    { build: '開', branch: '辰', name: '開辰日', severity: 'medium', description: '開辰日需謹慎，雖開而有阻' },
    // 其他特殊凶日
    { build: '滿', branch: '亥', name: '滿亥日', severity: 'severe', description: '滿亥日凶，滿而必溢' },
    { build: '定', branch: '巳', name: '定巳日', severity: 'medium', description: '定巳日需謹慎，定中有變' },
    { build: '執', branch: '亥', name: '執亥日', severity: 'medium', description: '執亥日需謹慎，執而不通' },
    { build: '閉', branch: '丑', name: '閉丑日', severity: 'severe', description: '閉丑日大凶，閉塞不通' }
];
// 特殊大吉日配置
const SPECIAL_AUSPICIOUS_DAYS = [
    // 建星配地支的特殊大吉組合
    { build: '定', branch: '戌', name: '定戌日', level: 'excellent', description: '定戌日大吉，定而有成，百事皆宜' },
    { build: '定', branch: '午', name: '定午日', level: 'excellent', description: '定午日大吉，定中得火，光明正大' },
    { build: '成', branch: '子', name: '成子日', level: 'excellent', description: '成子日大吉，成功之始' },
    { build: '成', branch: '午', name: '成午日', level: 'excellent', description: '成午日大吉，成功光明' },
    { build: '開', branch: '子', name: '開子日', level: 'excellent', description: '開子日大吉，開創新局' },
    { build: '開', branch: '午', name: '開午日', level: 'excellent', description: '開午日大吉，開明盛大' },
    // 其他特殊吉日
    { build: '除', branch: '寅', name: '除寅日', level: 'good', description: '除寅日吉，除舊迎新' },
    { build: '除', branch: '申', name: '除申日', level: 'good', description: '除申日吉，除煞得金' },
    { build: '滿', branch: '辰', name: '滿辰日', level: 'good', description: '滿辰日吉，滿而有庫' },
    { build: '執', branch: '寅', name: '執寅日', level: 'good', description: '執寅日吉，執而有生' }
];
// 煞入中宮的特殊配置
const SHA_RU_ZHONG_GONG_RULES = {
    // 年份對應的煞入中宮日期
    yearlyRules: {
        // 甲年煞入中宮日
        '甲': ['己巳', '己亥', '戊辰', '戊戌'],
        // 乙年煞入中宮日  
        '乙': ['庚午', '庚子', '己巳', '己亥'],
        // 丙年煞入中宮日
        '丙': ['辛未', '辛丑', '庚午', '庚子'],
        // 丁年煞入中宮日
        '丁': ['壬申', '壬寅', '辛未', '辛丑'],
        // 戊年煞入中宮日
        '戊': ['癸酉', '癸卯', '壬申', '壬寅'],
        // 己年煞入中宮日
        '己': ['甲戌', '甲辰', '癸酉', '癸卯'],
        // 庚年煞入中宮日
        '庚': ['乙亥', '乙巳', '甲戌', '甲辰'],
        // 辛年煞入中宮日
        '辛': ['丙子', '丙午', '乙亥', '乙巳'],
        // 壬年煞入中宮日
        '壬': ['丁丑', '丁未', '丙子', '丙午'],
        // 癸年煞入中宮日
        '癸': ['戊寅', '戊申', '丁丑', '丁未']
    }
};
// 三煞方位的季節性配置
const SAN_SHA_DIRECTIONS = {
    // 春季三煞（寅卯辰月）
    spring: {
        direction: '西方',
        branches: ['申', '酉', '戌'],
        description: '春季三煞在西方，申酉戌三方不宜動土修造'
    },
    // 夏季三煞（巳午未月）
    summer: {
        direction: '北方',
        branches: ['亥', '子', '丑'],
        description: '夏季三煞在北方，亥子丑三方不宜動土修造'
    },
    // 秋季三煞（申酉戌月）
    autumn: {
        direction: '東方',
        branches: ['寅', '卯', '辰'],
        description: '秋季三煞在東方，寅卯辰三方不宜動土修造'
    },
    // 冬季三煞（亥子丑月）
    winter: {
        direction: '南方',
        branches: ['巳', '午', '未'],
        description: '冬季三煞在南方，巳午未三方不宜動土修造'
    }
};
/**
 * 檢查四絕四離日
 */
function checkSiJueSiLi(date) {
    try {
        const solar = require('lunar-javascript').Solar.fromDate(date);
        const lunar = solar.getLunar();
        // 獲取當前節氣
        const currentTerm = lunar.getJieQi();
        const nextTerm = lunar.getNextJie();
        let isSiJue = false;
        let isSiLi = false;
        let solarTerm = '';
        let description = '';
        const warnings = [];
        // 檢查是否為四立前一日（四絕日）
        if (nextTerm && FOUR_SEASONS_START.includes(nextTerm.getName())) {
            const nextTermDate = nextTerm.getSolar();
            const dayDiff = Math.floor((nextTermDate.toDate().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff === 1) {
                isSiJue = true;
                solarTerm = nextTerm.getName();
                description = `四絕日：${solarTerm}前一日，陰陽交接，氣機不穩`;
                warnings.push('四絕日諸事不宜，特別忌嫁娶、動土、開業');
                warnings.push('四絕日氣機不穩，宜靜不宜動');
            }
        }
        // 檢查是否為四立當日（四離日）
        if (currentTerm && FOUR_SEASONS_START.includes(currentTerm)) {
            const currentTermDate = lunar.getJieQiTable()[currentTerm];
            if (currentTermDate) {
                const termSolar = currentTermDate.getSolar();
                if (termSolar.toYmd() === solar.toYmd()) {
                    isSiLi = true;
                    solarTerm = currentTerm;
                    description = `四離日：${solarTerm}當日，季節交替，氣場變動`;
                    warnings.push('四離日氣場變動，不宜重要決策');
                    warnings.push('四離日宜順應自然，避免強求');
                }
            }
        }
        if (!isSiJue && !isSiLi) {
            description = '非四絕四離日，日期正常';
        }
        return {
            isSiJue,
            isSiLi,
            solarTerm: solarTerm || undefined,
            description,
            warnings
        };
    }
    catch (error) {
        return {
            isSiJue: false,
            isSiLi: false,
            description: '四絕四離日檢查失敗',
            warnings: ['無法檢查四絕四離日，請確認日期正確']
        };
    }
}
/**
 * 檢查特殊大凶日
 */
function checkSpecialInauspiciousDay(build, dayBranch) {
    const specialDay = SPECIAL_INAUSPICIOUS_DAYS.find(day => day.build === build && day.branch === dayBranch);
    if (specialDay) {
        const warnings = [];
        const recommendations = [];
        switch (specialDay.severity) {
            case 'extreme':
                warnings.push(`${specialDay.name}為極大凶日，百事皆忌`);
                warnings.push('強烈建議另擇吉日');
                recommendations.push('如必須行事，需進行專業化解');
                recommendations.push('宜多行善事，積累功德');
                break;
            case 'severe':
                warnings.push(`${specialDay.name}為大凶日，重要事務不宜`);
                warnings.push('避免嫁娶、開業、動土等重大事項');
                recommendations.push('可進行一般日常事務');
                recommendations.push('宜低調行事，避免招惹是非');
                break;
            case 'medium':
                warnings.push(`${specialDay.name}需謹慎，重要決策宜延後`);
                recommendations.push('可進行準備性工作');
                recommendations.push('宜謹慎行事，多加思考');
                break;
        }
        return {
            isSpecial: true,
            type: 'inauspicious',
            name: specialDay.name,
            description: specialDay.description,
            severity: specialDay.severity,
            recommendations,
            warnings
        };
    }
    return {
        isSpecial: false,
        type: 'neutral',
        name: '普通日期',
        description: '非特殊凶日',
        recommendations: [],
        warnings: []
    };
}
/**
 * 檢查特殊大吉日
 */
function checkSpecialAuspiciousDay(build, dayBranch) {
    const specialDay = SPECIAL_AUSPICIOUS_DAYS.find(day => day.build === build && day.branch === dayBranch);
    if (specialDay) {
        const recommendations = [];
        switch (specialDay.level) {
            case 'excellent':
                recommendations.push(`${specialDay.name}為大吉日，百事皆宜`);
                recommendations.push('特別適合嫁娶、開業、動土、出行');
                recommendations.push('宜把握良機，進行重要事務');
                recommendations.push('此日天時地利，事半功倍');
                break;
            case 'good':
                recommendations.push(`${specialDay.name}為吉日，諸事順遂`);
                recommendations.push('適合一般重要事務');
                recommendations.push('宜積極行動，把握機會');
                break;
        }
        return {
            isSpecial: true,
            type: 'auspicious',
            name: specialDay.name,
            description: specialDay.description,
            level: specialDay.level,
            recommendations,
            warnings: []
        };
    }
    return {
        isSpecial: false,
        type: 'neutral',
        name: '普通日期',
        description: '非特殊吉日',
        recommendations: [],
        warnings: []
    };
}
/**
 * 檢查煞入中宮
 */
function checkShaRuZhongGong(date) {
    try {
        const solar = require('lunar-javascript').Solar.fromDate(date);
        const lunar = solar.getLunar();
        const yearGan = lunar.getYearInGanZhi().charAt(0);
        const dayGanZhi = lunar.getDayInGanZhi();
        const yearRules = SHA_RU_ZHONG_GONG_RULES.yearlyRules[yearGan];
        const isShaRuZhongGong = yearRules ? yearRules.includes(dayGanZhi) : false;
        if (isShaRuZhongGong) {
            return {
                isShaRuZhongGong: true,
                description: `煞入中宮：${yearGan}年${dayGanZhi}日，煞氣聚集中宮，極為不利`,
                severity: 'extreme',
                warnings: [
                    '煞入中宮為極大凶日，百事皆凶',
                    '特別忌動土、修造、嫁娶、開業',
                    '此日煞氣極重，宜避之不用'
                ],
                resolutions: [
                    '延後所有重要事務',
                    '可進行化解儀式',
                    '多行善事，積累功德',
                    '佩戴護身符，避免外出'
                ]
            };
        }
        return {
            isShaRuZhongGong: false,
            description: '非煞入中宮日',
            severity: 'extreme',
            warnings: [],
            resolutions: []
        };
    }
    catch (error) {
        return {
            isShaRuZhongGong: false,
            description: '煞入中宮檢查失敗',
            severity: 'extreme',
            warnings: ['無法檢查煞入中宮，請確認日期正確'],
            resolutions: []
        };
    }
}
/**
 * 檢查三煞方位
 */
function checkSanSha(date, direction) {
    try {
        const month = date.getMonth() + 1;
        let season;
        let sanShaInfo;
        // 判斷季節
        if (month >= 2 && month <= 4) {
            season = '春季';
            sanShaInfo = SAN_SHA_DIRECTIONS.spring;
        }
        else if (month >= 5 && month <= 7) {
            season = '夏季';
            sanShaInfo = SAN_SHA_DIRECTIONS.summer;
        }
        else if (month >= 8 && month <= 10) {
            season = '秋季';
            sanShaInfo = SAN_SHA_DIRECTIONS.autumn;
        }
        else {
            season = '冬季';
            sanShaInfo = SAN_SHA_DIRECTIONS.winter;
        }
        const warnings = [];
        let isAffected = false;
        // 如果提供了方位，檢查是否受三煞影響
        if (direction) {
            if (direction.includes(sanShaInfo.direction.charAt(0))) {
                isAffected = true;
                warnings.push(`${direction}為${season}三煞方位，不宜動土修造`);
                warnings.push('如需在此方位動工，需擇吉日化解');
            }
        }
        // 檢查日支是否在三煞範圍內
        const solar = require('lunar-javascript').Solar.fromDate(date);
        const lunar = solar.getLunar();
        const dayBranch = lunar.getDayInGanZhi().charAt(1);
        if (sanShaInfo.branches.includes(dayBranch)) {
            isAffected = true;
            warnings.push(`日支${dayBranch}在${season}三煞範圍內，需謹慎行事`);
        }
        return {
            season,
            direction: sanShaInfo.direction,
            branches: sanShaInfo.branches,
            description: sanShaInfo.description,
            isAffected,
            warnings
        };
    }
    catch (error) {
        return {
            season: '未知',
            direction: '未知',
            branches: [],
            description: '三煞方位檢查失敗',
            isAffected: false,
            warnings: ['無法檢查三煞方位，請確認日期正確']
        };
    }
}
/**
 * 綜合特殊日期檢查
 */
function checkAllSpecialDates(date, build) {
    try {
        const solar = require('lunar-javascript').Solar.fromDate(date);
        const lunar = solar.getLunar();
        const dayBranch = lunar.getDayInGanZhi().charAt(1);
        // 各項檢查
        const siJueSiLi = checkSiJueSiLi(date);
        const specialInauspicious = checkSpecialInauspiciousDay(build, dayBranch);
        const specialAuspicious = checkSpecialAuspiciousDay(build, dayBranch);
        const shaRuZhongGong = checkShaRuZhongGong(date);
        const sanSha = checkSanSha(date);
        // 綜合評估
        let isSpecialDay = false;
        let type = 'neutral';
        let summary = '';
        const recommendations = [];
        const warnings = [];
        // 極大凶日判斷
        if (shaRuZhongGong.isShaRuZhongGong ||
            (specialInauspicious.isSpecial && specialInauspicious.severity === 'extreme') ||
            siJueSiLi.isSiJue) {
            isSpecialDay = true;
            type = 'extremely_inauspicious';
            summary = '極大凶日，百事皆忌';
            warnings.push(...shaRuZhongGong.warnings);
            warnings.push(...specialInauspicious.warnings);
            warnings.push(...siJueSiLi.warnings);
        }
        // 大凶日判斷
        else if ((specialInauspicious.isSpecial && specialInauspicious.severity === 'severe') ||
            siJueSiLi.isSiLi) {
            isSpecialDay = true;
            type = 'inauspicious';
            summary = '大凶日，重要事務不宜';
            warnings.push(...specialInauspicious.warnings);
            warnings.push(...siJueSiLi.warnings);
        }
        // 大吉日判斷
        else if (specialAuspicious.isSpecial && specialAuspicious.level === 'excellent') {
            isSpecialDay = true;
            type = 'extremely_auspicious';
            summary = '大吉日，百事皆宜';
            recommendations.push(...specialAuspicious.recommendations);
        }
        // 吉日判斷
        else if (specialAuspicious.isSpecial && specialAuspicious.level === 'good') {
            isSpecialDay = true;
            type = 'auspicious';
            summary = '吉日，諸事順遂';
            recommendations.push(...specialAuspicious.recommendations);
        }
        // 一般凶日判斷
        else if (specialInauspicious.isSpecial && specialInauspicious.severity === 'medium') {
            isSpecialDay = true;
            type = 'inauspicious';
            summary = '需謹慎，重要決策宜延後';
            warnings.push(...specialInauspicious.warnings);
            recommendations.push(...specialInauspicious.recommendations);
        }
        // 普通日期
        else {
            summary = '普通日期，無特殊吉凶';
        }
        // 加入三煞警告
        if (sanSha.isAffected) {
            warnings.push(...sanSha.warnings);
        }
        return {
            siJueSiLi,
            specialInauspicious,
            specialAuspicious,
            shaRuZhongGong,
            sanSha,
            overallAssessment: {
                isSpecialDay,
                type,
                summary,
                recommendations,
                warnings
            }
        };
    }
    catch (error) {
        return {
            siJueSiLi: { isSiJue: false, isSiLi: false, description: '檢查失敗', warnings: [] },
            specialInauspicious: { isSpecial: false, type: 'neutral', name: '檢查失敗', description: '檢查失敗', recommendations: [], warnings: [] },
            specialAuspicious: { isSpecial: false, type: 'neutral', name: '檢查失敗', description: '檢查失敗', recommendations: [], warnings: [] },
            shaRuZhongGong: { isShaRuZhongGong: false, description: '檢查失敗', severity: 'extreme', warnings: [], resolutions: [] },
            sanSha: { season: '未知', direction: '未知', branches: [], description: '檢查失敗', isAffected: false, warnings: [] },
            overallAssessment: {
                isSpecialDay: false,
                type: 'neutral',
                summary: '特殊日期檢查失敗',
                recommendations: [],
                warnings: ['特殊日期檢查失敗，請確認日期正確']
            }
        };
    }
}
//# sourceMappingURL=special-dates-rules.js.map