import type { ColorValue } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

type TabBarIconName = 'map' | 'flag' | 'settings';

type TabBarIconProps = {
  color: ColorValue;
  name: TabBarIconName;
};

export function TabBarIcon({ color, name }: TabBarIconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      {name === 'map' ? <MapIcon color={color} /> : null}
      {name === 'flag' ? <FlagIcon color={color} /> : null}
      {name === 'settings' ? <SettingsIcon color={color} /> : null}
    </Svg>
  );
}

function MapIcon({ color }: { color: ColorValue }) {
  return (
    <>
      <Path
        d="M3.5 5.5 8.5 3l7 3 5-2.5v15l-5 2.5-7-3-5 2.5v-15Z"
        fill="none"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={1.8}
      />
      <Path d="M8.5 3v15M15.5 6v15" stroke={color} strokeWidth={1.8} />
    </>
  );
}

function FlagIcon({ color }: { color: ColorValue }) {
  return (
    <>
      <Path d="M5 21V3" stroke={color} strokeLinecap="round" strokeWidth={2} />
      <Path
        d="M6 4h10.5l-1.8 3 1.8 3H6V4Z"
        fill={color}
        stroke={color}
        strokeLinejoin="round"
      />
    </>
  );
}

function SettingsIcon({ color }: { color: ColorValue }) {
  return (
    <>
      <Path
        d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.8}
      />
      <Circle cx={12} cy={12} fill="none" r={6.5} stroke={color} strokeWidth={1.8} />
      <Circle cx={12} cy={12} fill="none" r={2.5} stroke={color} strokeWidth={1.8} />
    </>
  );
}
