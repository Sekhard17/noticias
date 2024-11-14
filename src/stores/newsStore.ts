import { atom } from 'nanostores';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface NewsItem {
  title: string;
  summary: string;
  image: string;
  category: string;
  date: string;
}

export const newsStore = atom<NewsItem[]>([]);

export async function fetchNews() {
  try {
    const querySnapshot = await getDocs(collection(db, 'news'));
    const news = querySnapshot.docs.map(doc => doc.data() as NewsItem);
    newsStore.set(news);
    return news;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}