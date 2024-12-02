import React, { useState } from 'react';
import Chat from './Chat';
import NotificationDisplay from './NotificationDisplay';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <Chat />;
      case 'notifications':
        return <NotificationDisplay />;
      default:
        return <Chat />;
    }
  };

  return (
    <div>
      <div className="tabs">
        <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'active' : ''}>
          Chat
        </button>
        <button onClick={() => setActiveTab('notifications')} className={activeTab === 'notifications' ? 'active' : ''}>
          Notifications
        </button>
      </div>
      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Tabs;