import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { api } from '../services/api';

interface AdminViewProps {
    onBack: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onBack }) => {
    const { user } = usePlayer();
    const [stats, setStats] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'broadcast'>('stats');
    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [targetUserId, setTargetUserId] = useState('');
    const [grantType, setGrantType] = useState<'premium' | 'admin'>('premium');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (user?.is_admin) {
            loadStats();
        }
    }, [user]);

    const loadStats = async () => {
        if (!user) return;
        try {
            const data = await api.getAdminStats(user.id);
            setStats(data);
        } catch (e) {
            console.error('Failed to load stats:', e);
        }
    };

    const handleBroadcast = async () => {
        if (!broadcastMessage.trim() || !user) return;
        try {
            await api.broadcastMessage(user.id, broadcastMessage);
            setMessage({ type: 'success', text: 'Рассылка отправлена' });
            setBroadcastMessage('');
        } catch (e) {
            setMessage({ type: 'error', text: 'Ошибка рассылки' });
        }
        setTimeout(() => setMessage(null), 3000);
    };

    const handleGrant = async () => {
        if (!targetUserId || !user) return;
        try {
            await api.grantRights(user.id, {
                user_id: parseInt(targetUserId),
                [grantType === 'premium' ? 'is_premium' : 'is_admin']: true
            });
            setMessage({ type: 'success', text: `${grantType} выдан` });
            setTargetUserId('');
            loadStats();
        } catch (e) {
            setMessage({ type: 'error', text: 'Ошибка' });
        }
        setTimeout(() => setMessage(null), 3000);
    };

    if (!user?.is_admin) return null;

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-32">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={onBack} className="text-gray-400 hover:text-white">
                    ← Назад
                </button>
                <h1 className="text-2xl font-bold">Админ-панель</h1>
                <div className="w-16"></div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('stats')}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'stats' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}
                >
                    Статистика
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'users' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}
                >
                    Управление
                </button>
                <button
                    onClick={() => setActiveTab('broadcast')}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'broadcast' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}
                >
                    Рассылка
                </button>
            </div>

            {/* Stats Tab */}
            {activeTab === 'stats' && stats && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <div className="text-gray-400 text-sm mb-2">Всего пользователей</div>
                        <div className="text-3xl font-bold">{stats.total_users}</div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <div className="text-gray-400 text-sm mb-2">Premium</div>
                        <div className="text-3xl font-bold text-yellow-400">{stats.premium_users}</div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <div className="text-gray-400 text-sm mb-2">Админы</div>
                        <div className="text-3xl font-bold text-blue-400">{stats.admin_users}</div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <div className="text-gray-400 text-sm mb-2">Новые сегодня</div>
                        <div className="text-3xl font-bold text-green-400">{stats.new_users_today}</div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 col-span-2">
                        <div className="text-gray-400 text-sm mb-2">Доход (TON)</div>
                        <div className="text-3xl font-bold">{stats.total_revenue_ton?.toFixed(2) || 0}</div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="space-y-4">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-bold mb-4">Выдать права</h3>
                        <input
                            type="text"
                            value={targetUserId}
                            onChange={(e) => setTargetUserId(e.target.value.replace(/\D/g, ''))}
                            placeholder="Telegram ID"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 mb-4 text-white placeholder-gray-500"
                        />
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setGrantType('premium')}
                                className={`flex-1 py-3 rounded-lg ${grantType === 'premium' ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white'}`}
                            >
                                Premium
                            </button>
                            <button
                                onClick={() => setGrantType('admin')}
                                className={`flex-1 py-3 rounded-lg ${grantType === 'admin' ? 'bg-blue-500 text-black' : 'bg-white/10 text-white'}`}
                            >
                                Admin
                            </button>
                        </div>
                        <button
                            onClick={handleGrant}
                            disabled={!targetUserId}
                            className="w-full bg-white text-black py-3 rounded-lg font-bold disabled:opacity-50"
                        >
                            Применить
                        </button>
                    </div>
                </div>
            )}

            {/* Broadcast Tab */}
            {activeTab === 'broadcast' && (
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-bold mb-4">Рассылка всем пользователям</h3>
                    <textarea
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        placeholder="Текст сообщения..."
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 mb-4 text-white placeholder-gray-500 h-32 resize-none"
                    />
                    <button
                        onClick={handleBroadcast}
                        disabled={!broadcastMessage.trim()}
                        className="w-full bg-white text-black py-3 rounded-lg font-bold disabled:opacity-50"
                    >
                        Отправить
                    </button>
                </div>
            )}

            {/* Message */}
            {message && (
                <div className={`fixed bottom-24 left-4 right-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white font-bold text-center`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default AdminView;
