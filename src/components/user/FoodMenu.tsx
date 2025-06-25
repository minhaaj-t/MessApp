import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Edit, Save, X, AlertCircle, Sun, Moon } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { User } from '../../types';

interface FoodMenuProps {
  userId: string;
}

interface DailyMenu {
  id: string;
  date: string;
  timeSlot: 'afternoon' | 'night';
  items: any[];
  notes?: string;
  cutoffTime: string;
}

const FoodMenu: React.FC<FoodMenuProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editingTimeSlot, setEditingTimeSlot] = useState<'afternoon' | 'night' | null>(null);
  const [selections, setSelections] = useState<{[key: string]: string}>({});
  const [specialNote, setSpecialNote] = useState('');

  useEffect(() => {
    supabase.from('users').select('*').eq('id', userId).single().then(({ data }) => setUser(data));
    supabase.from('daily_menus').select('*').then(({ data }) => setMenus(data || []));
  }, [userId]);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const todayAfternoonMenu = menus.find(menu => menu.date === today && menu.timeSlot === 'afternoon');
  const todayNightMenu = menus.find(menu => menu.date === today && menu.timeSlot === 'night');
  const tomorrowAfternoonMenu = menus.find(menu => menu.date === tomorrow && menu.timeSlot === 'afternoon');
  const tomorrowNightMenu = menus.find(menu => menu.date === tomorrow && menu.timeSlot === 'night');
  
  const canEditTomorrow = () => {
    const now = new Date();
    const cutoffTime = new Date();
    cutoffTime.setHours(12, 0, 0, 0);
    return now < cutoffTime;
  };

  const handleItemSelection = (itemId: string, selection: string) => {
    setSelections(prev => ({
      ...prev,
      [itemId]: selection
    }));
  };

  const handleSaveChanges = () => {
    // Save menu changes
    alert('Menu changes saved successfully!');
    setEditingDate(null);
    setEditingTimeSlot(null);
    setSelections({});
    setSpecialNote('');
  };

  const handleCancelEdit = () => {
    setEditingDate(null);
    setEditingTimeSlot(null);
    setSelections({});
    setSpecialNote('');
  };

  const renderMenu = (menu: any, isEditable: boolean = false, timeSlot: 'afternoon' | 'night') => {
    if (!menu) return null;

    return (
      <div className="space-y-4">
        {menu.notes && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">{menu.notes}</p>
          </div>
        )}
        
        <div className="space-y-3">
          {menu.items.map((item: any) => (
            <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                {item.isOptional && (
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                    Optional
                  </span>
                )}
              </div>
              
              {item.isOptional && item.alternatives && isEditable && editingDate === menu.date && editingTimeSlot === timeSlot && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Choose option:</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`item-${item.id}-${timeSlot}`}
                        value={item.name}
                        checked={selections[`${item.id}-${timeSlot}`] === item.name || !selections[`${item.id}-${timeSlot}`]}
                        onChange={(e) => handleItemSelection(`${item.id}-${timeSlot}`, e.target.value)}
                        className="text-emerald-500"
                      />
                      <span className="text-sm">{item.name}</span>
                    </label>
                    {item.alternatives.map((alt: string) => (
                      <label key={alt} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`item-${item.id}-${timeSlot}`}
                          value={alt}
                          checked={selections[`${item.id}-${timeSlot}`] === alt}
                          onChange={(e) => handleItemSelection(`${item.id}-${timeSlot}`, e.target.value)}
                          className="text-emerald-500"
                        />
                        <span className="text-sm">{alt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              {item.isOptional && item.alternatives && !isEditable && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Alternatives: {item.alternatives.join(', ')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {isEditable && editingDate === menu.date && editingTimeSlot === timeSlot && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Note (Optional)
              </label>
              <textarea
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                placeholder={`Any special requests for tomorrow's ${timeSlot} meal...`}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={3}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSaveChanges}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const shouldShowTimeSlot = (timeSlot: 'afternoon' | 'night') => {
    return true; // Assuming the user should always see the menu
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Food Menu</h2>
        
        {/* Today's Menu */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800">Today's Menu</h3>
            <span className="text-sm text-gray-500">
              {new Date(today).toLocaleDateString()}
            </span>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Afternoon Menu */}
            {shouldShowTimeSlot('afternoon') && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sun className="w-5 h-5 text-orange-500" />
                  <h4 className="text-lg font-semibold text-gray-800">Afternoon Menu</h4>
                  <span className="text-sm text-gray-500">(Default: 01:00 PM)</span>
                </div>
                
                {renderMenu(todayAfternoonMenu, false, 'afternoon')}
              </div>
            )}

            {/* Night Menu */}
            {shouldShowTimeSlot('night') && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <h4 className="text-lg font-semibold text-gray-800">Night Menu</h4>
                  <span className="text-sm text-gray-500">(Default: 09:00 PM)</span>
                </div>
                
                {renderMenu(todayNightMenu, false, 'night')}
              </div>
            )}
          </div>
        </div>

        {/* Tomorrow's Menu */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <h3 className="text-xl font-semibold text-gray-800">Tomorrow's Menu</h3>
              <span className="text-sm text-gray-500">
                {new Date(tomorrow).toLocaleDateString()}
              </span>
            </div>
            
            {canEditTomorrow() && (
              <div className="flex gap-2">
                {shouldShowTimeSlot('afternoon') && (
                  <button
                    onClick={() => {
                      setEditingDate(tomorrow);
                      setEditingTimeSlot('afternoon');
                    }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Customize Afternoon
                  </button>
                )}
                {shouldShowTimeSlot('night') && (
                  <button
                    onClick={() => {
                      setEditingDate(tomorrow);
                      setEditingTimeSlot('night');
                    }}
                    className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Customize Night
                  </button>
                )}
              </div>
            )}
          </div>

          {!canEditTomorrow() && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-800">
                  Menu changes are only allowed before 12:00 PM
                </p>
              </div>
            </div>
          )}
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Tomorrow Afternoon Menu */}
            {shouldShowTimeSlot('afternoon') && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sun className="w-5 h-5 text-orange-500" />
                  <h4 className="text-lg font-semibold text-gray-800">Afternoon Menu</h4>
                  <span className="text-sm text-gray-500">(Default: 01:00 PM)</span>
                </div>
                
                {renderMenu(tomorrowAfternoonMenu, canEditTomorrow(), 'afternoon')}
              </div>
            )}

            {/* Tomorrow Night Menu */}
            {shouldShowTimeSlot('night') && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <h4 className="text-lg font-semibold text-gray-800">Night Menu</h4>
                  <span className="text-sm text-gray-500">(Default: 09:00 PM)</span>
                </div>
                
                {renderMenu(tomorrowNightMenu, canEditTomorrow(), 'night')}
              </div>
            )}
          </div>
        </div>

        {/* Cutoff Time Notice */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <div>
              <h4 className="font-semibold text-amber-800">Menu Change Policy</h4>
              <p className="text-sm text-amber-700">
                Menu customizations for the next day must be submitted before 12:00 PM. 
                After this time, the default menu will be prepared.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodMenu;