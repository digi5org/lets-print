"use client";

import { useState } from "react";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const conversations = [
    {
      id: 1,
      customer: "ABC Corp",
      lastMessage: "When will my order be ready?",
      time: "10 min ago",
      unread: 2,
      avatar: "🏢",
    },
    {
      id: 2,
      customer: "XYZ Inc",
      lastMessage: "Thank you for the update!",
      time: "1 hour ago",
      unread: 0,
      avatar: "🏭",
    },
    {
      id: 3,
      customer: "Tech Start",
      lastMessage: "Can we change the delivery address?",
      time: "2 hours ago",
      unread: 1,
      avatar: "💻",
    },
    {
      id: 4,
      customer: "Marketing Pro",
      lastMessage: "Perfect, looking forward to it!",
      time: "Yesterday",
      unread: 0,
      avatar: "📱",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "customer",
      text: "Hello, I wanted to check on my business card order",
      time: "2:30 PM",
    },
    {
      id: 2,
      sender: "me",
      text: "Hi! Your order is currently in production. It should be ready by tomorrow.",
      time: "2:35 PM",
    },
    {
      id: 3,
      sender: "customer",
      text: "Great! When will my order be ready?",
      time: "2:40 PM",
    },
    {
      id: 4,
      sender: "me",
      text: "We expect it to be ready by 5 PM tomorrow. Would you like us to schedule delivery?",
      time: "2:42 PM",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-800 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Messages</h1>
            <p className="text-pink-100">
              Communicate with customers and team members
            </p>
          </div>
          <button className="bg-white text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Message
          </button>
        </div>
      </div>

      {/* Messages Interface */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: "600px" }}>
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation.id ? "bg-pink-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{conversation.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {conversation.customer}
                        </p>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        {conversation.unread > 0 && (
                          <span className="ml-2 bg-pink-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Thread */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{selectedConversation.avatar}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {selectedConversation.customer}
                        </h3>
                        <p className="text-sm text-gray-500">Active now</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === "me"
                            ? "bg-pink-600 text-white"
                            : "bg-white border border-gray-200 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "me" ? "text-pink-100" : "text-gray-500"
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <button className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all font-medium">
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
