/**
 * 日曆單日組件
 * 顯示單個日期的董公擇日資訊
 */

import React from 'react';
import { CalendarDayInfo, CalendarViewConfig, CalendarColorCode } from '../../types/calendar';

interface CalendarDayProps {
  date: Date;
  dayInfo: CalendarDayInfo | null;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isHovered: boolean;
  config: CalendarViewConfig;
  colorTheme: Record<CalendarColorCode, string>;
  onClick?: () => void;
  onHover?: () => void;
  onHoverEnd?: () => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  dayInfo,
  isCurrentMonth,
  isSelected,
  isHovered,
  config,
  colorTheme,
  onClick,
  onHover,
  onHoverEnd
}) => {
  const dayNumber = date.getDate();
  
  // 如果不是當月日期，顯示簡化版本
  if (!isCurrentMonth || !dayInfo) {
    return (
      <div className="calendar-day other-month">
        <span className="day-number">{dayNumber}</span>
      </div>
    );
  }

  // 獲取背景色
  const backgroundColor = colorTheme[dayInfo.colorCode];
  
  // 生成CSS類名
  const classNames = [
    'calendar-day',
    'current-month',
    dayInfo.colorCode,
    isSelected ? 'selected' : '',
    isHovered ? 'hovered' : '',
    dayInfo.isHuangDao ? 'huang-dao' : '',
    dayInfo.isHeiDao ? 'hei-dao' : '',
    dayInfo.specialDay.isSpecialAuspicious ? 'special-auspicious' : '',
    dayInfo.specialDay.isSpecialInauspicious ? 'special-inauspicious' : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      style={{ backgroundColor }}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      role="button"
      tabIndex={0}
      aria-label={`${date.getFullYear()}年${date.getMonth() + 1}月${dayNumber}日 ${dayInfo.quickSummary}`}
    >
      {/* 日期數字 */}
      <div className="day-number">
        {dayNumber}
      </div>

      {/* 農曆日期 */}
      {config.showLunarDate && (
        <div className="lunar-date">
          {dayInfo.lunarDate.dayInChinese}
        </div>
      )}

      {/* 十二建星 */}
      {config.showTwelveBuild && (
        <div className="twelve-build">
          {dayInfo.twelveBuild.name}
        </div>
      )}

      {/* 神煞指示器 */}
      {config.showGodsEvils && (dayInfo.godsEvils.auspiciousGods.length > 0 || dayInfo.godsEvils.inauspiciousEvils.length > 0) && (
        <div className="gods-evils-indicator">
          {dayInfo.godsEvils.auspiciousGods.length > 0 && (
            <span className="gods-count" title={`吉神 ${dayInfo.godsEvils.auspiciousGods.length}個`}>
              ✓{dayInfo.godsEvils.auspiciousGods.length}
            </span>
          )}
          {dayInfo.godsEvils.inauspiciousEvils.length > 0 && (
            <span className="evils-count" title={`凶煞 ${dayInfo.godsEvils.inauspiciousEvils.length}個`}>
              ✗{dayInfo.godsEvils.inauspiciousEvils.length}
            </span>
          )}
        </div>
      )}

      {/* 特殊日期標記 */}
      {config.showSpecialDays && (
        <>
          {dayInfo.specialDay.isSpecialAuspicious && (
            <div className="special-marker auspicious" title="特殊吉日">
              ★
            </div>
          )}
          {dayInfo.specialDay.isSpecialInauspicious && (
            <div className="special-marker inauspicious" title="特殊凶日">
              ⚠
            </div>
          )}
          {dayInfo.specialDay.isFourJue && (
            <div className="special-marker four-jue" title="四絕日">
              絕
            </div>
          )}
          {dayInfo.specialDay.isFourLi && (
            <div className="special-marker four-li" title="四離日">
              離
            </div>
          )}
        </>
      )}

      {/* 快速摘要（懸停時顯示） */}
      {isHovered && (
        <div className="quick-summary-tooltip">
          {dayInfo.quickSummary}
        </div>
      )}
    </div>
  );
};