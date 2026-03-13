'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import request from '@/lib/request';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  postsPerPage: number;
  enableComments: boolean;
  analyticsId: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: '我的技术博客',
  siteDescription: '分享技术知识与学习心得',
  siteUrl: 'https://example.com',
  postsPerPage: 10,
  enableComments: true,
  analyticsId: '',
};

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  loading: true,
});

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await request.get('/settings');
        if (res.data) {
          setSettings({
            siteName: res.data.siteName || DEFAULT_SETTINGS.siteName,
            siteDescription: res.data.siteDescription || DEFAULT_SETTINGS.siteDescription,
            siteUrl: res.data.siteUrl || DEFAULT_SETTINGS.siteUrl,
            postsPerPage: parseInt(res.data.postsPerPage) || DEFAULT_SETTINGS.postsPerPage,
            enableComments: res.data.enableComments === 'true',
            analyticsId: res.data.analyticsId || DEFAULT_SETTINGS.analyticsId,
          });
        }
      } catch (e) {
        console.error('加载设置失败:', e);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}
