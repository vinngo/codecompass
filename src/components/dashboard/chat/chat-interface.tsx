'use client';

import React, { useState } from 'react';
import MessageList from './message-list';
import ChatInput from './chat-input';
import AnswerPanel from './answer-panel';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

interface Answer {
  id: number;
  title: string;
  content: string;
  source?: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  // replace with backend data later
  const [answers] = useState<Answer[]>([]);

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        text: inputValue,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
      setInputValue('');
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-grey-950 text-grey-300">
      {/* Chat Column */}
      <div className="flex flex-col w-1/2 border-r border-grey-800">
        <MessageList messages={messages} />
        <ChatInput 
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
        />
      </div>

      {/* Answers Column */}
      <AnswerPanel answers={answers} />
    </div>
  );
}