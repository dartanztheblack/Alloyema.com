import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Message } from '../types';

export function useMessages(orderId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

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
    });

    return () => unsubscribe();
  }, [orderId]);

  return { messages, loading };
}
