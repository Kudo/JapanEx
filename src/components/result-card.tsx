import { forwardRef } from 'react';
import Svg, { G, Rect, Text as SvgText } from 'react-native-svg';

import { ResultMapFlags } from '@/components/map-flags';
import { MapRegions } from '@/components/map-regions';
import { LEVEL_COLORS, RESULT_THEME } from '@/constants/app-theme';
import type { AppLocale, ExperienceLevel, PrefectureCode } from '@/data/types';
import { LEVEL_LABELS, t } from '@/i18n/translations';
import { MAP_SIZE, MAP_X, MAP_Y } from '@/utils/map-layout';

type ResultCardProps = {
  locale: AppLocale;
  displayName: string;
  score: number;
  levels: Record<PrefectureCode, ExperienceLevel>;
  onFlagsReady: () => void;
  onLayout: () => void;
  showFlags: boolean;
  renderSize: number;
};

export const ResultCard = forwardRef<Svg, ResultCardProps>(function ResultCard(
  { locale, displayName, score, levels, onFlagsReady, onLayout, showFlags, renderSize },
  ref,
) {
  return (
    <Svg
      ref={ref}
      width={renderSize}
      height={renderSize}
      onLayout={onLayout}
      viewBox={`${MAP_X} ${MAP_Y} ${MAP_SIZE} ${MAP_SIZE}`}
    >
      <Rect x={MAP_X} y={MAP_Y} width={MAP_SIZE} height={MAP_SIZE} fill={RESULT_THEME.ocean} />
      <MapRegions
        levels={levels}
        locale={locale}
        stroke={RESULT_THEME.mapStroke}
        strokeWidth={4}
        showFlags={showFlags}
      />
      {showFlags ? <ResultMapFlags locale={locale} onReady={onFlagsReady} /> : null}

      <Rect x={342} y={-294} width={735} height={164} rx={26} fill="#FFFFFF" fillOpacity={0.94} />
      <SvgText x={380} y={-242} fontSize={42} fontWeight="700" fill={RESULT_THEME.text}>
        {t(locale, 'appName')}
      </SvgText>
      <SvgText x={380} y={-184} fontSize={28} fontWeight="600" fill={RESULT_THEME.secondaryText}>
        {t(locale, 'score')}
      </SvgText>
      <SvgText x={620} y={-178} fontSize={64} fontWeight="800" fill={RESULT_THEME.accent}>
        {score}
      </SvgText>
      {displayName ? (
        <SvgText x={1038} y={-184} textAnchor="end" fontSize={28} fontWeight="600" fill={RESULT_THEME.text}>
          {displayName}
        </SvgText>
      ) : null}

      <Rect x={342} y={-108} width={650} height={268} rx={22} fill="#FFFFFF" fillOpacity={0.92} />
      {([5, 4, 3, 2, 1, 0] as ExperienceLevel[]).map((level, index) => {
        const y = -76 + index * 36;
        return (
          <G key={level}>
            <Rect x={374} y={y} width={46} height={24} rx={6} fill={LEVEL_COLORS[level]} stroke="#4A5560" strokeWidth={2} />
            <SvgText x={440} y={y + 20} fontSize={20} fontWeight="600" fill={RESULT_THEME.text}>
              {level} · {LEVEL_LABELS[locale][level]}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
});
