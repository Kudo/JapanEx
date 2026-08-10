import { useLocalSearchParams, useRouter } from 'expo-router';

import { MapScreen } from '@/screens/map-screen';

export default function MapRoute() {
  const router = useRouter();
  const { flags } = useLocalSearchParams<{ flags?: string }>();
  const showFlags = flags === '1';

  const toggleFlags = () => {
    router.setParams({ flags: showFlags ? undefined : '1' });
  };

  return <MapScreen showFlags={showFlags} onToggleFlags={toggleFlags} />;
}
