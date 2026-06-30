import { NativeTabs } from 'expo-router/unstable-native-tabs';

/** Accent color used for the selected tab (matches the app's gradient theme). */
const ACTIVE_COLOR = '#d946ef';
const INACTIVE_COLOR = 'rgba(255,255,255,0.55)';

export default function AppTabs() {
  return (
    <NativeTabs
      blurEffect="systemChromeMaterialDark"
      backgroundColor="rgba(15,23,42,0.6)"
      tintColor={ACTIVE_COLOR}
      iconColor={{ default: INACTIVE_COLOR, selected: ACTIVE_COLOR }}
      labelStyle={{
        default: { fontSize: 12, fontWeight: '600', color: INACTIVE_COLOR },
        selected: { fontSize: 13, fontWeight: '700', color: ACTIVE_COLOR },
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="film.stack.fill"
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
