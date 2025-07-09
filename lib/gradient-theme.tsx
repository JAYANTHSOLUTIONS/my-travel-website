// Beautiful Gradient Color Themes for Travel India

export const gradientThemes = {
  // Current: Indigo Purple Pink (Vibrant & Modern)
  current: {
    name: "Cosmic Sunset",
    primary: "from-indigo-500 via-purple-500 to-pink-500",
    primaryHover: "hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600",
    secondary: "from-indigo-600 via-purple-600 to-pink-600",
    background: "from-slate-50 via-blue-50 to-indigo-100",
    cardBg: "from-white via-blue-50/30 to-indigo-50/50",
    banner: "from-violet-500 via-purple-500 to-pink-500",
    header: "from-indigo-600 via-purple-600 to-pink-600",
    text: "from-indigo-600 via-purple-600 to-pink-600",
    light: "from-indigo-100 via-purple-100 to-pink-100",
    accent: "text-indigo-700",
  },

  // Ocean Breeze (Blue & Teal)
  ocean: {
    name: "Ocean Breeze",
    primary: "from-cyan-500 via-blue-500 to-indigo-500",
    primaryHover: "hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600",
    secondary: "from-cyan-600 via-blue-600 to-indigo-600",
    background: "from-cyan-50 via-blue-50 to-indigo-100",
    cardBg: "from-white via-cyan-50/30 to-blue-50/50",
    banner: "from-cyan-400 via-blue-500 to-indigo-500",
    header: "from-cyan-600 via-blue-600 to-indigo-600",
    text: "from-cyan-600 via-blue-600 to-indigo-600",
    light: "from-cyan-100 via-blue-100 to-indigo-100",
    accent: "text-blue-700",
  },

  // Sunset Glow (Orange & Pink)
  sunset: {
    name: "Sunset Glow",
    primary: "from-orange-500 via-pink-500 to-rose-500",
    primaryHover: "hover:from-orange-600 hover:via-pink-600 hover:to-rose-600",
    secondary: "from-orange-600 via-pink-600 to-rose-600",
    background: "from-orange-50 via-pink-50 to-rose-100",
    cardBg: "from-white via-orange-50/30 to-pink-50/50",
    banner: "from-orange-400 via-pink-500 to-rose-500",
    header: "from-orange-600 via-pink-600 to-rose-600",
    text: "from-orange-600 via-pink-600 to-rose-600",
    light: "from-orange-100 via-pink-100 to-rose-100",
    accent: "text-pink-700",
  },

  // Forest Magic (Green & Emerald)
  forest: {
    name: "Forest Magic",
    primary: "from-emerald-500 via-green-500 to-teal-500",
    primaryHover: "hover:from-emerald-600 hover:via-green-600 hover:to-teal-600",
    secondary: "from-emerald-600 via-green-600 to-teal-600",
    background: "from-emerald-50 via-green-50 to-teal-100",
    cardBg: "from-white via-emerald-50/30 to-green-50/50",
    banner: "from-emerald-400 via-green-500 to-teal-500",
    header: "from-emerald-600 via-green-600 to-teal-600",
    text: "from-emerald-600 via-green-600 to-teal-600",
    light: "from-emerald-100 via-green-100 to-teal-100",
    accent: "text-green-700",
  },

  // Royal Purple (Purple & Violet)
  royal: {
    name: "Royal Purple",
    primary: "from-purple-500 via-violet-500 to-fuchsia-500",
    primaryHover: "hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-600",
    secondary: "from-purple-600 via-violet-600 to-fuchsia-600",
    background: "from-purple-50 via-violet-50 to-fuchsia-100",
    cardBg: "from-white via-purple-50/30 to-violet-50/50",
    banner: "from-purple-400 via-violet-500 to-fuchsia-500",
    header: "from-purple-600 via-violet-600 to-fuchsia-600",
    text: "from-purple-600 via-violet-600 to-fuchsia-600",
    light: "from-purple-100 via-violet-100 to-fuchsia-100",
    accent: "text-purple-700",
  },

  // Golden Hour (Yellow & Orange)
  golden: {
    name: "Golden Hour",
    primary: "from-yellow-500 via-orange-500 to-red-500",
    primaryHover: "hover:from-yellow-600 hover:via-orange-600 hover:to-red-600",
    secondary: "from-yellow-600 via-orange-600 to-red-600",
    background: "from-yellow-50 via-orange-50 to-red-100",
    cardBg: "from-white via-yellow-50/30 to-orange-50/50",
    banner: "from-yellow-400 via-orange-500 to-red-500",
    header: "from-yellow-600 via-orange-600 to-red-600",
    text: "from-yellow-600 via-orange-600 to-red-600",
    light: "from-yellow-100 via-orange-100 to-red-100",
    accent: "text-orange-700",
  },
}

// Helper function to get current theme
export const getCurrentTheme = () => gradientThemes.current

// Function to switch themes
export const switchGradientTheme = (themeName: keyof typeof gradientThemes) => {
  gradientThemes.current = gradientThemes[themeName]
  return gradientThemes.current
}

// Get all available theme names
export const getAvailableThemes = () => {
  return Object.keys(gradientThemes)
    .filter((key) => key !== "current")
    .map((key) => ({
      key,
      name: gradientThemes[key as keyof typeof gradientThemes].name,
    }))
}
