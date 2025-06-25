import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Calendar, Clock, Sun, Moon } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  isOptional?: boolean;
  alternatives?: string[];
}

interface DailyMenu {
  id: string;
  date: string;
  timeSlot: 'afternoon' | 'night';
  items: MenuItem[];
  notes?: string;
  cutoffTime: string;
}

const MenuManagement: React.FC = () => {
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingMenu, setEditingMenu] = useState<DailyMenu | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'afternoon' | 'night'>('afternoon');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [cutoffTime, setCutoffTime] = useState('');

  useEffect(() => {
    supabase.from('daily_menus').select('*').then(({ data }) => setMenus(data || []));
    supabase.from('menu_items').select('*').then(({ data }) => setMenuItems(data || []));
  }, []);

  const handleAddMenu = () => {
    if (!selectedDate || selectedItems.length === 0) {
      alert('Please select a date and at least one menu item');
      return;
    }

    const newMenu: DailyMenu = {
      id: Date.now().toString(),
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      items: menuItems.filter(item => selectedItems.includes(item.id)),
      notes: notes,
      cutoffTime: cutoffTime || (selectedTimeSlot === 'afternoon' ? '12:00' : '18:00')
    };

    setMenus([...menus, newMenu]);
    setShowAddForm(false);
    resetForm();
  };

  const handleEditMenu = (menu: DailyMenu) => {
    setEditingMenu(menu);
    setSelectedDate(menu.date);
    setSelectedTimeSlot(menu.timeSlot);
    setSelectedItems(menu.items.map(item => item.id));
    setNotes(menu.notes || '');
    setCutoffTime(menu.cutoffTime);
  };

  const handleSaveEdit = () => {
    if (!editingMenu || !selectedDate || selectedItems.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedMenu: DailyMenu = {
      ...editingMenu,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      items: menuItems.filter(item => selectedItems.includes(item.id)),
      notes: notes,
      cutoffTime: cutoffTime
    };

    setMenus(menus.map(menu => menu.id === editingMenu.id ? updatedMenu : menu));
    setEditingMenu(null);
    resetForm();
  };

  const handleDeleteMenu = (menuId: string) => {
    if (confirm('Are you sure you want to delete this menu?')) {
      setMenus(menus.filter(menu => menu.id !== menuId));
    }
  };

  const resetForm = () => {
    setSelectedDate('');
    setSelectedTimeSlot('afternoon');
    setSelectedItems([]);
    setNotes('');
    setCutoffTime('');
  };

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getTimeSlotIcon = (timeSlot: 'afternoon' | 'night') => {
    return timeSlot === 'afternoon' ? <Sun className="w-4 h-4 text-orange-500" /> : <Moon className="w-4 h-4 text-indigo-500" />;
  };

  const getTimeSlotLabel = (timeSlot: 'afternoon' | 'night') => {
    return timeSlot === 'afternoon' ? 'Afternoon' : 'Night';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Menu Management</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Menu
          </button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingMenu) && (
          <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingMenu ? 'Edit Menu' : 'Add New Menu'}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value as 'afternoon' | 'night')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="afternoon">Afternoon (12:00 PM - 3:00 PM, Default: 01:00 PM)</option>
                  <option value="night">Night (7:00 PM - 10:00 PM, Default: 09:00 PM)</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cutoff Time</label>
                <input
                  type="time"
                  value={cutoffTime}
                  onChange={(e) => setCutoffTime(e.target.value)}
                  placeholder={selectedTimeSlot === 'afternoon' ? '12:00' : '18:00'}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special notes for this menu..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Menu Items</label>
              <div className="grid md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {menuItems.map((item) => (
                  <label key={item.id} className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleItemToggle(item.id)}
                      className="text-emerald-500"
                    />
                    <span className="text-sm">{item.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={editingMenu ? handleSaveEdit : handleAddMenu}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingMenu ? 'Save Changes' : 'Add Menu'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingMenu(null);
                  resetForm();
                }}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Menu List */}
        <div className="space-y-4">
          {menus.map((menu) => (
            <div key={menu.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-800">
                      {new Date(menu.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTimeSlotIcon(menu.timeSlot)}
                    <span className="text-sm font-medium text-gray-600">
                      {getTimeSlotLabel(menu.timeSlot)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Cutoff: {menu.cutoffTime}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditMenu(menu)}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMenu(menu.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
              
              {menu.notes && (
                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                  {menu.notes}
                </div>
              )}
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                {menu.items.map((item) => (
                  <div key={item.id} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;