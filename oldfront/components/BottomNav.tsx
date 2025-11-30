import React from 'react';
import { Home, Library, ListMusic, Heart, Radio } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const getItemClass = (view: ViewState) => `flex flex-col items-center justify-center space-y-1 w-full h-full ${currentView === view ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'} transition-colors`;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-black/90 backdrop-blur-md border-t border-gray-200 dark:border-white/10 flex justify-between items-center px-6 z-40 pb-safe">
      <button className={getItemClass(ViewState.HOME)} onClick={() => onNavigate(ViewState.HOME)}>
        <Home size={24} />
        <span className="text-[10px] font-medium">Главная</span>
      </button>
      <button className={getItemClass(ViewState.PLAYLISTS)} onClick={() => onNavigate(ViewState.PLAYLISTS)}>
        <ListMusic size={24} />
        <span className="text-[10px] font-medium">Плейлисты</span>
      </button>
      <button className={getItemClass(ViewState.FAVORITES)} onClick={() => onNavigate(ViewState.FAVORITES)}>
        <Heart size={24} />
        <span className="text-[10px] font-medium">Избранное</span>
      </button>
      <button className={getItemClass(ViewState.RADIO)} onClick={() => onNavigate(ViewState.RADIO)}>
        <Radio size={24} />
        <span className="text-[10px] font-medium">Радио</span>
      </button>
      <button className={getItemClass(ViewState.LIBRARY)} onClick={() => onNavigate(ViewState.LIBRARY)}>
        <Library size={24} />
        <span className="text-[10px] font-medium">Медиатека</span>
      </button>
    </div>
  );
};

export default BottomNav;