import { useAppSettings } from '@/store/settingsStore';
import { COLORS, FONT_SIZES } from '@/constants/theme';

export function useTheme() {
  const { theme, fontSize } = useAppSettings();
  
  return {
    colors: COLORS[theme === 'dark' ? 'dark' : 'light'],
    fonts: FONT_SIZES[fontSize || 'default'],
  };
}