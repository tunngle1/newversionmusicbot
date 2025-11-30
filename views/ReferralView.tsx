import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { api } from '../services/api';

interface ReferralViewProps {
    onBack: () => void;
}

const ReferralView: React.FC<ReferralViewProps> = ({ onBack }) => {
    const { user } = usePlayer();
    const [stats, setStats] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (user) {
            loadStats();
        }
    }, [user]);

    const loadStats = async () => {
        if (!user) return;
        try {
            const data = await api.getReferralStats(user.id);
            setStats(data);
        } catch (e) {
            console.error('Failed to load referral stats:', e);
        }
    };

    const handleCopy = () => {
        if (!stats?.referral_link) return;
        navigator.clipboard.writeText(stats.referral_link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-32">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={onBack} className="text-gray-400 hover:text-white">
                    ← Назад
                </button>
                <h1 className="text-2xl font-bold">Реферальная программа</h1>
                <div className="w-16"></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="text-gray-400 text-sm mb-2">Приглашено</div>
                    <div className="text-3xl font-bold">{stats?.total_referrals || 0}</div>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="text-gray-400 text-sm mb-2">Premium рефералов</div>
                    <div className="text-3xl font-bold text-yellow-400">{stats?.premium_referrals || 0}</div>
                </div>
            </div>

            {/* Referral Link */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
                <h3 className="text-lg font-bold mb-4">Ваша реферальная ссылка</h3>
                <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 mb-4 text-white break-all">
                    {stats?.referral_link || 'Загрузка...'}
                </div>
                <button
                    onClick={handleCopy}
                    className="w-full bg-white text-black py-3 rounded-lg font-bold"
                >
                    {copied ? '✓ Скопировано' : 'Копировать ссылку'}
                </button>
            </div>

            {/* Info */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold mb-4">Как это работает?</h3>
                <ul className="space-y-3 text-gray-400">
                    <li>• Поделитесь ссылкой с друзьями</li>
                    <li>• Получайте бонусы за каждого приглашенного</li>
                    <li>• Дополнительные награды за Premium рефералов</li>
                </ul>
            </div>
        </div>
    );
};

export default ReferralView;
