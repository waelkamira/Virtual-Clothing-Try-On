'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  extractColorsFromImage,
  type ExtractedColors,
} from '@/lib/color-extractor';

type ThemeType = 'orange' | 'teal' | 'rose' | 'custom';
type ColorMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  colorMode: ColorMode;
  extractedColors: ExtractedColors | null;
  setTheme: (theme: ThemeType) => void;
  setColorMode: (mode: ColorMode) => void;
  extractColorsFromUploadedImage: (
    imageUrl: string,
  ) => Promise<ExtractedColors>;
  applyExtractedColors: () => void;
  resetTheme: () => void;
}

const defaultColors: ExtractedColors = {
  primary: '#f97316',
  secondary: '#fb923c',
  accent: '#ea580c',
  background: '#fff7ed',
  text: '#111111',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>('orange');
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const [extractedColors, setExtractedColors] =
    useState<ExtractedColors | null>(null);

  // Initialize theme based on user preference
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    const savedColorMode = localStorage.getItem('colorMode') as ColorMode;

    if (savedTheme) setTheme(savedTheme);
    if (savedColorMode) setColorMode(savedColorMode);

    // Apply color mode to document
    if (savedColorMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Update theme class on document
  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove(
      'theme-orange',
      'theme-teal',
      'theme-rose',
    );

    // Add current theme class
    if (theme !== 'custom') {
      document.documentElement.classList.add(`theme-${theme}`);
    }

    // Save preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Update color mode
  useEffect(() => {
    if (colorMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save preference
    localStorage.setItem('colorMode', colorMode);
  }, [colorMode]);

  const extractColorsFromUploadedImage = async (imageUrl: string) => {
    try {
      const colors = await extractColorsFromImage(imageUrl);
      setExtractedColors(colors);
      return colors;
    } catch (error) {
      console.error('Failed to extract colors:', error);
      return defaultColors;
    }
  };

  const applyExtractedColors = () => {
    if (!extractedColors) return;

    // Set theme to custom
    setTheme('custom');

    // Apply extracted colors to CSS variables
    document.documentElement.style.setProperty(
      '--primary',
      extractedColors.primary,
    );
    document.documentElement.style.setProperty(
      '--secondary',
      extractedColors.secondary,
    );
    document.documentElement.style.setProperty(
      '--accent',
      extractedColors.accent,
    );
    document.documentElement.style.setProperty(
      '--background',
      extractedColors.background,
    );
  };

  const resetTheme = () => {
    // Reset to default theme
    setTheme('orange');

    // Clear custom CSS variables
    document.documentElement.style.removeProperty('--primary');
    document.documentElement.style.removeProperty('--secondary');
    document.documentElement.style.removeProperty('--accent');
    document.documentElement.style.removeProperty('--background');

    setExtractedColors(null);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorMode,
        extractedColors,
        setTheme,
        setColorMode,
        extractColorsFromUploadedImage,
        applyExtractedColors,
        resetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
