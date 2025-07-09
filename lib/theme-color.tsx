// Color Theme System - Easy to switch between different color schemes

export const colorThemes = {
  // Current Theme: Emerald & Teal (Green-based)
  current: {
    primary: {
      from: "from-emerald-500",
      to: "to-teal-500",
      hover: {
        from: "hover:from-emerald-600",
        to: "hover:to-teal-600",
      },
    },
    secondary: {
      from: "from-emerald-600",
      to: "to-teal-600",
    },
    background: {
      from: "from-emerald-50",
      to: "to-teal-50",
    },
    light: {
      from: "from-emerald-100",
      to: "to-teal-100",
      text: "text-emerald-700",
    },
    gradient: "from-emerald-600 via-teal-600 to-cyan-500",
    banner: "from-emerald-400 to-teal-400",
  },

  // Alternative Theme 1: Purple & Pink (Original)
  purple: {
    primary: {
      from: "from-purple-500",
      to: "to-pink-500",
      hover: {
        from: "hover:from-purple-600",
        to: "hover:to-pink-600",
      },
    },
    secondary: {
      from: "from-purple-600",
      to: "to-pink-600",
    },
    background: {
      from: "from-purple-50",
      to: "to-pink-50",
    },
    light: {
      from: "from-purple-100",
      to: "to-pink-100",
      text: "text-purple-700",
    },
    gradient: "from-purple-600 via-pink-600 to-orange-500",
    banner: "from-yellow-400 to-orange-400",
  },

  // Alternative Theme 2: Indigo & Violet
  indigo: {
    primary: {
      from: "from-indigo-500",
      to: "to-violet-500",
      hover: {
        from: "hover:from-indigo-600",
        to: "hover:to-violet-600",
      },
    },
    secondary: {
      from: "from-indigo-600",
      to: "to-violet-600",
    },
    background: {
      from: "from-indigo-50",
      to: "to-violet-50",
    },
    light: {
      from: "from-indigo-100",
      to: "to-violet-100",
      text: "text-indigo-700",
    },
    gradient: "from-indigo-600 via-violet-600 to-purple-500",
    banner: "from-indigo-400 to-violet-400",
  },

  // Alternative Theme 3: Rose & Amber
  rose: {
    primary: {
      from: "from-rose-500",
      to: "to-amber-500",
      hover: {
        from: "hover:from-rose-600",
        to: "hover:to-amber-600",
      },
    },
    secondary: {
      from: "from-rose-600",
      to: "to-amber-600",
    },
    background: {
      from: "from-rose-50",
      to: "to-amber-50",
    },
    light: {
      from: "from-rose-100",
      to: "to-amber-100",
      text: "text-rose-700",
    },
    gradient: "from-rose-600 via-amber-600 to-yellow-500",
    banner: "from-rose-400 to-amber-400",
  },
}

// Helper function to get current theme colors
export const getThemeColors = () => colorThemes.current

// Function to switch themes (you can call this to change themes)
export const switchTheme = (themeName: keyof typeof colorThemes) => {
  colorThemes.current = colorThemes[themeName]
}
