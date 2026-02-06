import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, RotateCcw, Palette } from 'lucide-react';
import { settingsApi } from '../../api/djangoApi';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getSettings();
      setPreferences(data.preferences);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setMessage({ type: 'error', text: '설정을 불러오는데 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsApi.updateSettings(preferences);
      setMessage({ type: 'success', text: '설정이 저장되었습니다.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage({ type: 'error', text: '설정 저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const handleColorChange = (section, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleReset = () => {
    if (window.confirm('모든 설정을 기본값으로 되돌리시겠습니까?')) {
        const defaultSettings = {
            "image_inspector": {
                "diff_file1": "#3B82F6",
                "diff_file2": "#DC2626",
                "diff_common": "#000000",
                "overlay_file1": "#F97316",
                "overlay_file2": "#22C55E"
            }
        };
        setPreferences(defaultSettings);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">설정을 불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">환경 설정</h1>
          </div>
          <div className="flex gap-3">
             <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={18} />
              초기화
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>

        {/* Message Toast */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Image Inspector Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <Palette className="text-purple-500" size={20} />
            <h2 className="font-bold text-gray-800">Image Inspector 색상 설정</h2>
          </div>
          
          <div className="p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4">비교 (Difference Mode)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <ColorPicker 
                label="File 1 (기준 파일)" 
                description="기준 파일에만 존재하는 요소"
                value={preferences?.image_inspector?.diff_file1}
                onChange={(v) => handleColorChange('image_inspector', 'diff_file1', v)}
              />
              <ColorPicker 
                label="File 2 (비교 파일)" 
                description="비교 파일에만 존재하는 요소"
                value={preferences?.image_inspector?.diff_file2}
                onChange={(v) => handleColorChange('image_inspector', 'diff_file2', v)}
              />
              <ColorPicker 
                label="공통 요소" 
                description="두 파일 모두에 존재하는 요소 (Edge)"
                value={preferences?.image_inspector?.diff_common}
                onChange={(v) => handleColorChange('image_inspector', 'diff_common', v)}
              />
            </div>

            <div className="border-t border-gray-100 my-6"></div>

            <h3 className="text-sm font-bold text-gray-900 mb-4">오버레이 (Overlay Mode)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorPicker 
                label="File 1 레이어" 
                description="첫 번째 이미지의 오버레이 색상"
                value={preferences?.image_inspector?.overlay_file1}
                onChange={(v) => handleColorChange('image_inspector', 'overlay_file1', v)}
              />
              <ColorPicker 
                label="File 2 레이어" 
                description="두 번째 이미지의 오버레이 색상"
                value={preferences?.image_inspector?.overlay_file2}
                onChange={(v) => handleColorChange('image_inspector', 'overlay_file2', v)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ColorPicker = ({ label, description, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-gray-900">{label}</label>
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 p-0.5 rounded border border-gray-200 cursor-pointer"
      />
      <span className="text-sm font-mono text-gray-500 uppercase">{value}</span>
    </div>
    <p className="text-xs text-gray-400">{description}</p>
  </div>
);

export default SettingsPage;
