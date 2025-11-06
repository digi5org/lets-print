"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-violet-800 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-violet-100">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            PO
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Production Owner</h2>
            <p className="text-gray-600 mb-2">production@letsprint.com</p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-violet-100 text-violet-700 text-sm font-medium rounded-full">
                Production Owner
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Active
              </span>
            </div>
          </div>
          <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all font-medium">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "profile"
                  ? "border-violet-600 text-violet-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "security"
                  ? "border-violet-600 text-violet-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "notifications"
                  ? "border-violet-600 text-violet-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "preferences"
                  ? "border-violet-600 text-violet-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Preferences
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Production"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Owner"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="production@letsprint.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Let's Print Production"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="123 Production Street, Manufacturing District, CA 90001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  ></textarea>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all font-medium">
                  Save Changes
                </button>
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all font-medium">
                  Update Password
                </button>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add an extra layer of security to your account
                </p>
                <button className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all font-medium">
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Order Updates</p>
                    <p className="text-sm text-gray-600">Receive notifications about order status changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Get email updates about important events</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Receive text messages for urgent updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option>Pacific Time (PT)</option>
                  <option>Mountain Time (MT)</option>
                  <option>Central Time (CT)</option>
                  <option>Eastern Time (ET)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all font-medium">
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
