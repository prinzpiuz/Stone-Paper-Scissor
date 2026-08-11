import { computed } from "vue";
import { useTheme } from "vuetify";

export function useThemeToggle() {
  const theme = useTheme();
  const isDark = computed(() => theme.global.current.value.dark);

  function toggleTheme() {
    theme.global.name.value = isDark.value ? "light" : "dark";
  }

  return { isDark, toggleTheme };
}
