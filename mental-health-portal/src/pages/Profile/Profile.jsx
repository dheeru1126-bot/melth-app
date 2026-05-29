import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Bell, Key, LogOut, Settings, Edit3 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('general');
    const { logout } = useAuth();
    
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [isSaving, setIsSaving] = useState(false);
    
    // Password state
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    useEffect(() => {
        // Fetch fresh user data from API
        const fetchUser = async () => {
            try {
                const response = await api.get('/auth/me');
                setUser(response.data.user);
                setFormData({
                    name: response.data.user.name || '',
                    email: response.data.user.email || ''
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
                
                // Fallback to local storage if API fails
                const local = sessionStorage.getItem('user');
                if (local) {
                    const parsed = JSON.parse(local);
                    setUser(parsed);
                    setFormData({ name: parsed.name, email: parsed.email });
                }
            }
        };
        fetchUser();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await api.put('/auth/me', formData);
            // Update local storage so Navbar and other components pick it up securely
            sessionStorage.setItem('user', JSON.stringify(response.data.user));
            setUser(response.data.user);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        setIsSavingPassword(true);
        try {
            await api.put('/auth/me', { password: newPassword });
            alert("Your password has been securely updated!");
            setNewPassword('');
            setIsChangingPassword(false);
        } catch (error) {
            console.error("Error updating password:", error);
            alert("Failed to update password.");
        } finally {
            setIsSavingPassword(false);
        }
    };

    if (!user) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">

                    {/* Sidebar */}
                    <div className="md:w-64 bg-gray-50/50 border-r border-gray-100 p-6 flex-shrink-0">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-24 h-24 bg-[#4A90E2] text-white rounded-full flex flex-col items-center justify-center text-3xl font-bold shadow-md relative mb-4">
                                AJ
                                <button className="absolute bottom-0 right-0 p-1.5 bg-white text-gray-600 rounded-full shadow-sm hover:text-[#4A90E2] transition-colors border border-gray-100">
                                    <Edit3 className="w-4 h-4" />
                                </button>
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
                            <p className="text-sm text-gray-500 capitalize">{user.role} Account</p>
                        </div>

                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveTab('general')}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'general' ? 'bg-[#4A90E2] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <User className="w-5 h-5" /> General
                            </button>
                            <button
                                onClick={() => setActiveTab('privacy')}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'privacy' ? 'bg-[#4A90E2] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Shield className="w-5 h-5" /> Privacy & Security
                            </button>
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'notifications' ? 'bg-[#4A90E2] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Bell className="w-5 h-5" /> Notifications
                            </button>
                        </nav>

                        <div className="mt-auto pt-8 border-t border-gray-100 border-dashed mt-8">
                            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                <LogOut className="w-5 h-5" /> Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 md:p-10">
                        {activeTab === 'general' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input 
                                                type="text" 
                                                value={formData.name} 
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#4A90E2] focus:border-[#4A90E2] sm:text-sm py-2 px-3 border" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input 
                                                type="email" 
                                                value={formData.email} 
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#4A90E2] focus:border-[#4A90E2] sm:text-sm py-2 px-3 border" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
                                    <div className="flex gap-4">
                                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex-1">
                                            <p className="text-sm font-medium text-blue-800 mb-1">User Role</p>
                                            <p className="text-xl font-extrabold text-[#4A90E2] uppercase">{user.role}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex-1">
                                            <p className="text-sm font-medium text-green-800 mb-1">Account Created</p>
                                            <p className="text-lg font-extrabold text-[#6FCF97]">{new Date(user.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6">
                                    <button 
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="bg-[#4A90E2] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'privacy' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>

                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 transition-all duration-300">
                                    {!isChangingPassword ? (
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-gray-900 mb-1">Change Password</p>
                                                <p className="text-sm text-gray-500">Update your password to keep your account secure.</p>
                                            </div>
                                            <button 
                                                onClick={() => setIsChangingPassword(true)}
                                                className="text-[#4A90E2] bg-white border border-[#4A90E2] px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                            <p className="font-semibold text-gray-900">Set New Password</p>
                                            <input 
                                                type="password" 
                                                placeholder="Enter new strong password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-[#4A90E2] focus:border-[#4A90E2] sm:text-sm py-2.5 px-3 outline-none" 
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => {
                                                        setIsChangingPassword(false);
                                                        setNewPassword('');
                                                    }}
                                                    className="text-gray-600 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    onClick={handleUpdatePassword}
                                                    disabled={isSavingPassword}
                                                    className="text-white bg-[#4A90E2] border border-[#4A90E2] px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                                                >
                                                    {isSavingPassword ? 'Saving...' : 'Save Password'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Data & Privacy</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input id="data-sharing" type="checkbox" defaultChecked className="focus:ring-[#4A90E2] h-4 w-4 text-[#4A90E2] border-gray-300 rounded" />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="data-sharing" className="font-medium text-gray-700">Anonymous Data Usage</label>
                                                <p className="text-gray-500 mt-1">Allow Melth to use your data anonymously to improve AI capabilities.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input id="download-data" type="checkbox" className="focus:ring-[#4A90E2] h-4 w-4 text-[#4A90E2] border-gray-300 rounded" />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="download-data" className="font-medium text-gray-700">Two-Factor Authentication</label>
                                                <p className="text-gray-500 mt-1">Add an extra layer of security to your account.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <div>
                                            <p className="font-medium text-gray-900">Daily Reminder</p>
                                            <p className="text-sm text-gray-500">Get notified to log your daily mood check-in.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={user.daily_reminder_enabled}
                                                onChange={async (e) => {
                                                    const enabled = e.target.checked;
                                                    try {
                                                        const response = await api.put('/auth/me', { daily_reminder_enabled: enabled });
                                                        setUser(response.data.user);
                                                        sessionStorage.setItem('user', JSON.stringify(response.data.user));
                                                    } catch (err) {
                                                        console.error("Failed to update preference:", err);
                                                    }
                                                }}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A90E2]"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <div>
                                            <p className="font-medium text-gray-900">New Resources</p>
                                            <p className="text-sm text-gray-500">Get an email when we add new meditations or articles.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A90E2]"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between py-3">
                                        <div>
                                            <p className="font-medium text-gray-900">Appointment Reminders</p>
                                            <p className="text-sm text-gray-500">SMS notifications for upcoming counseling sessions.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A90E2]"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
