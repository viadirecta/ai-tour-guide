import React from 'react';
import { Message, MessageSender } from '../types';
import Icon from './Icon';
import CodeBlock from './CodeBlock';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubbleContent: React.FC<{ message: Message }> = ({ message }) => {
  const parts = message.text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="flex flex-col">
      {message.image && (
        <img src={message.image} alt="Content" className="rounded-lg mb-2 max-w-xs" />
      )}
      {message.videoUrl && (
        <div className="rounded-lg mb-2 overflow-hidden aspect-video max-w-xs bg-black">
            <video src={message.videoUrl} controls className="w-full h-full object-contain" />
        </div>
      )}
      <div className="text-current">
        {parts.map((part, index) => {
          const codeBlockMatch = part.match(/```(\w*)\n([\s\S]*?)```/);
          if (codeBlockMatch) {
            const language = codeBlockMatch[1] || 'plaintext';
            const code = codeBlockMatch[2].trim();
            return <CodeBlock key={index} code={code} language={language} />;
          } else {
            return (
              <p key={index} className="whitespace-pre-wrap break-words">
                {part}
              </p>
            );
          }
        })}
      </div>
    </div>
  );
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const sender = message.sender;

  const bubbleClasses = {
    [MessageSender.USER]: 'bg-indigo-600 text-white rounded-br-none',
    [MessageSender.GEMINI]: 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-none',
    [MessageSender.SYSTEM]: 'bg-teal-100 dark:bg-teal-900 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 rounded-bl-none',
  }[sender];

  const layoutClasses = sender === MessageSender.USER ? 'justify-end' : 'justify-start';

  const Avatar = {
    [MessageSender.USER]: <Icon name="user" className="w-6 h-6 text-white" />,
    [MessageSender.GEMINI]: <Icon name="gemini" className="w-6 h-6 text-sky-400" />,
    [MessageSender.SYSTEM]: <Icon name="system" className="w-6 h-6 text-teal-400" />,
  }[sender];

  const avatarContainerClasses = `flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
    sender === MessageSender.USER ? 'bg-indigo-500 ml-3' : 
    sender === MessageSender.GEMINI ? 'bg-slate-700 dark:bg-slate-800 mr-3' : 
    'bg-teal-800 dark:bg-teal-950 mr-3'
  }`;

  return (
    <div className={`flex items-start my-4 ${layoutClasses}`}>
      {sender !== MessageSender.USER && <div className={avatarContainerClasses}>{Avatar}</div>}
      <div className={`max-w-xl lg:max-w-2xl px-4 py-3 rounded-2xl ${bubbleClasses}`}>
        <ChatBubbleContent message={message} />
      </div>
      {sender === MessageSender.USER && <div className={avatarContainerClasses}>{Avatar}</div>}
    </div>
  );
};

export default ChatBubble;