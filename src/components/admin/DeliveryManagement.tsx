import React, { useState } from 'react';
import { Clock, Users, Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { mockDeliverySlots } from '../../data/mockData';
import { DeliverySlot } from '../../types';

const DeliveryManagement: React.FC = () => {
  const [slots, setSlots] = useState<DeliverySlot[]>(mockDeliverySlots);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<DeliverySlot | null>(null);

  const [formData, setFormData] = useState({
    time: '',
    type: 'lunch' as 'lunch' | 'dinner',
    capacity: 50,
    isActive: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'capacity') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlot) {
      setSlots(slots.map(slot => 
        slot.id === editingSlot.id 
          ? { ...slot, ...formData }
          : slot
      ));
      setEditingSlot(null);
    } else {
      const newSlot: DeliverySlot = {
        id: Date.now().toString(),
        ...formData,
        currentBookings: 0
      };
      setSlots([...slots, newSlot]);
    }
    setFormData({ time: '', type: 'lunch', capacity: 50, isActive: true });
    setShowAddForm(false);
  };

  const handleEdit = (slot: DeliverySlot) => {
    setEditingSlot(slot);
    setFormData({
      time: slot.time,
      type: slot.type,
      capacity: slot.capacity,
      isActive: slot.isActive
    });
    setShowAddForm(true);
  };

  const handleDelete = (slotId: string) => {
    if (confirm('Are you sure you want to delete this delivery slot?')) {
      setSlots(slots.filter(slot => slot.id !== slotId));
    }
  };

  const toggleStatus = (slotId: string) => {
    setSlots(slots.map(slot => 
      slot.id === slotId 
        ? { ...slot, isActive: !slot.isActive }
        : slot
    ));
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Delivery Slots</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Slot
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingSlot ? 'Edit Delivery Slot' : 'Add New Delivery Slot'}
            </h3>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  placeholder="12:00 - 13:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label className="text-sm text-gray-700">Active</label>
              </div>
              <div className="md:col-span-4 flex gap-2">
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {editingSlot ? 'Update' : 'Add'} Slot
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingSlot(null);
                    setFormData({ time: '', type: 'lunch', capacity: 50, isActive: true });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Slots Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {slots.map((slot) => {
            const utilization = (slot.currentBookings / slot.capacity) * 100;
            return (
              <div key={slot.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <h3 className="font-semibold text-gray-800">{slot.time}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        slot.type === 'lunch' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {slot.type.charAt(0).toUpperCase() + slot.type.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{slot.currentBookings}/{slot.capacity} bookings</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(slot.id)}
                      className={`p-1 rounded-full ${
                        slot.isActive ? 'text-green-500 hover:bg-green-50' : 'text-red-500 hover:bg-red-50'
                      }`}
                    >
                      {slot.isActive ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => handleEdit(slot)}
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded-full"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(slot.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Utilization</span>
                    <span className={`font-medium ${getUtilizationColor(utilization)}`}>
                      {utilization.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        utilization >= 90 ? 'bg-red-500' : utilization >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${utilization}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    slot.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {slot.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {utilization >= 90 && (
                    <span className="text-xs text-red-600 font-medium">Near Capacity</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeliveryManagement;