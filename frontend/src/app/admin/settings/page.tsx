'use client';

import { useState, useEffect } from 'react';
import request from '@/lib/request';

interface Settings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  postsPerPage: number;
  enableComments: boolean;
  analyticsId: string;
}

const DEFAULT_SETTINGS: Settings = {
  siteName: '我的技术博客',
  siteDescription: '分享技术知识与学习心得',
  siteUrl: 'https://example.com',
  postsPerPage: 10,
  enableComments: true,
  analyticsId: '',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 从后端加载设置
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await request.put('/settings', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error('保存设置失败:', e);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">系统设置</h1>
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          加载中...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">系统设置</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">基本信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">网站名称</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">网站描述</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">网站 URL</label>
              <input
                type="url"
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">显示设置</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">每页显示文章数</label>
              <input
                type="number"
                min={1}
                max={50}
                value={settings.postsPerPage}
                onChange={(e) => setSettings({ ...settings, postsPerPage: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enableComments"
                checked={settings.enableComments}
                onChange={(e) => setSettings({ ...settings, enableComments: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="enableComments" className="text-sm font-medium text-gray-700">启用评论功能</label>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">分析</h2>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Google Analytics ID</label>
            <input
              type="text"
              value={settings.analyticsId}
              onChange={(e) => setSettings({ ...settings, analyticsId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </section>

        <div className="flex justify-end gap-4">
          {saved && (
            <span className="px-4 py-2 text-green-600">设置已保存</span>
          )}
          <button
            type="button"
            onClick={() => setSettings(DEFAULT_SETTINGS)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            重置
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? '保存中...' : '保存设置'}
          </button>
        </div>
      </form>
    </div>
  );
}
