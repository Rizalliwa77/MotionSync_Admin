import React, { useState } from 'react';
import HubAdminSidebar from '../HubAdminSidebar';
import '../../styles/Management/HubAdmin_Messages.css';

const MessageItem = ({ message, onSelect, isSelected, onStar }) => (
    <div className={`message-item ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(message.id)}>
        <input 
            type="checkbox" 
            checked={isSelected}
            onChange={(e) => e.stopPropagation()}
        />
        <button 
            className={`star-btn ${message.starred ? 'starred' : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                onStar(message.id);
            }}
        >
            ★
        </button>
        <div className="message-content">
            <span className="sender">{message.sender}</span>
            <span className="preview">{message.preview}</span>
        </div>
        <span className="date">{message.date}</span>
    </div>
);

const HubAdmin_Messages = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'User #XX20',
            preview: 'Good day! I would like to inquire about...',
            date: 'June 10',
            starred: false,
            content: 'Good day! I would like to inquire about the upcoming examination schedule.',
            userType: 'student'
        },
        // Add more sample messages here
    ]);

    const [selectedMessages, setSelectedMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMessage, setActiveMessage] = useState(null);
    const [replyText, setReplyText] = useState('');

    const handleMessageSelect = (messageId) => {
        const message = messages.find(m => m.id === messageId);
        setActiveMessage(message);
    };

    const handleStar = (messageId) => {
        setMessages(messages.map(message => 
            message.id === messageId 
                ? { ...message, starred: !message.starred }
                : message
        ));
    };

    const handleReply = () => {
        if (replyText.trim() && activeMessage) {
            // Add reply logic here
            console.log(`Replying to message ${activeMessage.id}: ${replyText}`);
            setReplyText('');
        }
    };

    const handleBulkAction = (action) => {
        // Implement bulk action logic here
        console.log(`Performing ${action} on selected messages:`, selectedMessages);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <HubAdminSidebar />
            <div className="messages-container">
                <h1>Messages</h1>
                
                <div className="messages-header">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="filter-btn">
                            <i className="fas fa-filter"></i>
                        </button>
                    </div>
                    <div className="messages-status">
                        <div className="status-item">
                            <span className="status-count">{messages.length}</span>
                            <span>Total</span>
                        </div>
                        <div className="status-item">
                            <span className="status-count">
                                {messages.filter(m => m.starred).length}
                            </span>
                            <span>Starred</span>
                        </div>
                        <div className="status-item">
                            <span className="status-count">
                                {selectedMessages.length}
                            </span>
                            <span>Selected</span>
                        </div>
                    </div>
                    <div className="bulk-actions">
                        <button className="bulk-btn" onClick={() => handleBulkAction('delete')}>Delete</button>
                        <button className="bulk-btn" onClick={() => handleBulkAction('mark as read')}>Mark as Read</button>
                    </div>
                </div>

                <div className="messages-content">
                    <div className="messages-list">
                        {messages
                            .filter(message => 
                                message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                message.preview.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map(message => (
                                <MessageItem
                                    key={message.id}
                                    message={message}
                                    onSelect={handleMessageSelect}
                                    isSelected={selectedMessages.includes(message.id)}
                                    onStar={handleStar}
                                />
                            ))
                        }
                    </div>

                    <div className="message-detail">
                        {activeMessage ? (
                            <>
                                <div className="message-header">
                                    <h3>{activeMessage.sender}</h3>
                                    <span className="date">{activeMessage.date}</span>
                                </div>
                                <div className="message-body">
                                    {activeMessage.content}
                                </div>
                                <div className="reply-section">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Type your reply..."
                                    />
                                    <button 
                                        className="reply-btn"
                                        onClick={handleReply}
                                        disabled={!replyText.trim()}
                                    >
                                        Send Reply
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="no-message-selected">
                                Select a message to view details
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HubAdmin_Messages;
