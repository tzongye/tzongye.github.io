"use strict";
/**
 * 日曆圖例組件
 * 顯示色彩標示和符號說明
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarLegend = void 0;
const react_1 = __importDefault(require("react"));
const CalendarLegend = ({ config, colorTheme }) => {
    const legendItems = [
        {
            code: 'huang-dao-excellent',
            label: '黃道大吉',
            description: '黃道吉日，大吉大利'
        },
        {
            code: 'huang-dao-good',
            label: '黃道吉日',
            description: '黃道吉日，諸事皆宜'
        },
        {
            code: 'neutral',
            label: '平日',
            description: '平常日子，無特殊吉凶'
        },
        {
            code: 'hei-dao-poor',
            label: '黑道凶日',
            description: '黑道凶日，諸事不宜'
        },
        {
            code: 'hei-dao-terrible',
            label: '黑道大凶',
            description: '黑道凶日，大凶之日'
        },
        {
            code: 'special-auspicious',
            label: '特殊吉日',
            description: '特殊吉日，如定戍日等'
        },
        {
            code: 'special-inauspicious',
            label: '特殊凶日',
            description: '特殊凶日，如建巳日等'
        }
    ];
    const symbolItems = [
        { symbol: '★', label: '特殊吉日', description: '傳統特殊吉日標記' },
        { symbol: '⚠', label: '特殊凶日', description: '傳統特殊凶日標記' },
        { symbol: '絕', label: '四絕日', description: '四絕日標記' },
        { symbol: '離', label: '四離日', description: '四離日標記' },
        { symbol: '✓', label: '吉神', description: '吉神數量' },
        { symbol: '✗', label: '凶煞', description: '凶煞數量' }
    ];
    return (<div className="calendar-legend">
      <h3 className="legend-title">圖例說明</h3>
      
      {/* 色彩圖例 */}
      <div className="color-legend">
        <h4 className="legend-section-title">色彩標示</h4>
        <div className="legend-items">
          {legendItems.map(item => (<div key={item.code} className="legend-item">
              <div className="color-sample" style={{ backgroundColor: colorTheme[item.code] }} aria-label={item.label}/>
              <div className="legend-text">
                <span className="legend-label">{item.label}</span>
                <span className="legend-description">{item.description}</span>
              </div>
            </div>))}
        </div>
      </div>

      {/* 符號圖例 */}
      {config.showSpecialDays && (<div className="symbol-legend">
          <h4 className="legend-section-title">符號說明</h4>
          <div className="legend-items">
            {symbolItems.map(item => (<div key={item.symbol} className="legend-item">
                <div className="symbol-sample">
                  {item.symbol}
                </div>
                <div className="legend-text">
                  <span className="legend-label">{item.label}</span>
                  <span className="legend-description">{item.description}</span>
                </div>
              </div>))}
          </div>
        </div>)}

      {/* 十二建星說明 */}
      {config.showTwelveBuild && (<div className="builds-legend">
          <h4 className="legend-section-title">十二建星</h4>
          <div className="builds-explanation">
            <p className="traditional-verse">
              建滿平收黑，除危定執黃，<br />
              成開皆可用，閉破不吉祥。
            </p>
            <div className="builds-categories">
              <div className="huang-dao-builds">
                <strong>黃道吉日：</strong>建、除、定、執、危、成、開、閉
              </div>
              <div className="hei-dao-builds">
                <strong>黑道凶日：</strong>滿、平、破、收
              </div>
            </div>
          </div>
        </div>)}
    </div>);
};
exports.CalendarLegend = CalendarLegend;
//# sourceMappingURL=CalendarLegend.js.map