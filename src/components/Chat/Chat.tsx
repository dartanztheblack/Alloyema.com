import { useState, useRef, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Send } from 'lucide-react';
import { Message } from '../../types';
import './Chat.css';

interface ChatProps {
  orderId: string;
  currentUserId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserPhoto?: string;
}

export function Chat({ orderId, currentUserId, otherUserId, otherUserName, otherUserPhoto }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to messages
  useEffect(() => {
    if (!orderId) return;

    const q = query(
      collection(db, 'messages'),
      where('orderId', '==', orderId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as Message);
      });
      setMessages(msgs);
      setLoading(false);

      // Mark messages as read
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.receiverId === currentUserId && !data.read) {
          updateDoc(doc(db, 'messages', docSnap.id), { read: true });
        }
      });
    });

    return () => unsubscribe();
  }, [orderId, currentUserId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        orderId,
        senderId: currentUserId,
        receiverId: otherUserId,
        content: newMessage.trim(),
        createdAt: serverTimestamp(),
        read: false
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="chat-loading">Chargement des messages...</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img 
          src={otherUserPhoto || 'https://via.placeholder.com/40'} 
          alt={otherUserName}
          className="chat-avatar"
        />
        <div className="chat-user-info">
          <h4>{otherUserName}</h4>
          <span className="status">En ligne</span>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>Aucun message encore</p>
            <p>Commencez la conversation ! 👋</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.senderId === currentUserId ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                {msg.content}
              </div>
              <div className="message-time">
                {formatTime(msg.createdAt)}
                {msg.senderId === currentUserId && (
                  <span className="read-status">{msg.read ? '✓✓' : '✓'}</span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-container" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Écrivez votre message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" disabled={!newMessage.trim()}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
