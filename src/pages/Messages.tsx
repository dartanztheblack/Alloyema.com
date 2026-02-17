import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { Chat } from '../components/Chat/Chat';
import { useAuth } from '../hooks/useAuth';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, doc as docRef, getDoc } from 'firebase/firestore';
import { Auth } from '../components/Auth/Auth';
import { MessageCircle, ChevronRight } from 'lucide-react';
import './Messages.css';

interface Conversation {
  orderId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserPhoto: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

export function Messages() {
  const { user, loading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch conversations where user is either sender or receiver
    const q = query(
      collection(db, 'messages'),
      where('senderId', '==', user.uid)
    );

    const q2 = query(
      collection(db, 'messages'),
      where('receiverId', '==', user.uid)
    );

    const unsubscribe1 = onSnapshot(q, async (snapshot) => {
      await processMessages(snapshot, user.uid);
    });

    const unsubscribe2 = onSnapshot(q2, async (snapshot) => {
      await processMessages(snapshot, user.uid);
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [user]);

  const processMessages = async (snapshot: any, userId: string) => {
    const convs = new Map<string, Conversation>();

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const otherUserId = data.senderId === userId ? data.receiverId : data.senderId;
      const orderId = data.orderId;
      const key = `${orderId}_${otherUserId}`;

      if (!convs.has(key) || convs.get(key)!.lastMessageTime < data.createdAt?.toDate()) {
        // Fetch other user info
        const userDoc = await getDoc(docRef(db, 'users', otherUserId));
        const userData = userDoc.data();

        convs.set(key, {
          orderId,
          otherUserId,
          otherUserName: userData?.displayName || 'Utilisateur',
          otherUserPhoto: userData?.photoURL || '',
          lastMessage: data.content,
          lastMessageTime: data.createdAt?.toDate() || new Date(),
          unreadCount: data.receiverId === userId && !data.read ? 1 : 0
        });
      }
    }

    setConversations(Array.from(convs.values()).sort((a, b) => 
      b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
    ));
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="messages-page">
      <Navbar user={user} />
      
      <main className="messages-content">
        <div className="conversations-list">
          <h2>Messages</h2>
          
          {conversations.length === 0 ? (
            <div className="no-conversations">
              <MessageCircle size={48} />
              <p>Aucune conversation</p>
              <p>Commencez à chatter avec une Yemma !</p>
            </div>
          ) : (
            <div className="conversation-items">
              {conversations.map((conv) => (
                <button
                  key={`${conv.orderId}_${conv.otherUserId}`}
                  className={`conversation-item ${selectedConversation?.orderId === conv.orderId ? 'active' : ''}`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <img 
                    src={conv.otherUserPhoto || 'https://via.placeholder.com/50'} 
                    alt={conv.otherUserName}
                    className="conversation-avatar"
                  />
                  <div className="conversation-info">
                    <h4>{conv.otherUserName}</h4>
                    <p>{conv.lastMessage.substring(0, 40)}...</p>
                  </div>
                  <div className="conversation-meta">
                    <span className="time">
                      {conv.lastMessageTime.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="unread-badge">{conv.unreadCount}</span>
                    )}
                    <ChevronRight size={18} className="chevron" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="chat-area">
          {selectedConversation ? (
            <Chat
              orderId={selectedConversation.orderId}
              currentUserId={user.uid}
              otherUserId={selectedConversation.otherUserId}
              otherUserName={selectedConversation.otherUserName}
              otherUserPhoto={selectedConversation.otherUserPhoto}
            />
          ) : (
            <div className="no-chat-selected">
              <MessageCircle size={64} />
              <p>Sélectionnez une conversation</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
