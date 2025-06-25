import { mockUsers } from '../data/mockData';
import { User } from '../types';

export async function fetchUsers(): Promise<User[]> {
  return mockUsers;
}

export async function fetchUserById(id: string): Promise<User | undefined> {
  return mockUsers.find(u => u.id === id);
}

export async function addUser(user: User): Promise<void> {
  mockUsers.push(user);
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const { data, error } = await supabase.from('users').update(updates).eq('id', id).single();
  if (error) throw error;
  return data as User;
}

export async function deleteUser(id: string): Promise<void> {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
} 