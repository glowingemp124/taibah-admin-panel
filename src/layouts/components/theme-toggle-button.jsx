import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings/context';

// ----------------------------------------------------------------------

export function ThemeToggleButton({ sx, ...other }) {
  const settings = useSettingsContext();
  const { mode, setMode } = useColorScheme();

  const isDark = (mode || settings.colorScheme) === 'dark';
  const nextMode = isDark ? 'light' : 'dark';

  const handleToggle = () => {
    settings.onUpdateField('colorScheme', nextMode);
    setMode(nextMode);
  };

  return (
    <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
      <IconButton aria-label="toggle theme" onClick={handleToggle} sx={{ p: 0, width: 40, height: 40, mr: 1, ...sx }} {...other}>
        <Iconify width={24} icon={isDark ? 'solar:sun-bold' : 'famicons:moon-sharp'} />
      </IconButton>
    </Tooltip>
  );
}
