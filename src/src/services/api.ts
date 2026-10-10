import type { Candidate, JobOffer, RequestAddCandidate } from '../types';
import { MOCK_CANDIDATES } from '../data/mockCandidates';
import { INITIAL_OFFERS } from '../data/mockOffers';

// ФЛАГ ПЕРЕКЛЮЧЕНИЯ: когда бэкендер поднимет сервер, меняем на true
export const USE_REAL_BACKEND = true;
export const API_BASE_URL = 'http://localhost:5198/api';

export const api = {
  // 1. Получение каталога кандидатов с фильтрами (C# бэкенд ожидает массивы через запятую)
  async getCandidates(params?: Record<string, any>): Promise<Candidate[]> {
    if (!USE_REAL_BACKEND) {
      return Promise.resolve(MOCK_CANDIDATES);
    }
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            // Бэкенд сплитит строку по запятой!
            searchParams.append(key, value.join(','));
          }
        } else if (value !== undefined && value !== null && value !== '' && value !== false) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    const res = await fetch(`${API_BASE_URL}/candidates${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Не удалось получить список кандидатов');
    const rawData = await res.json();
    return rawData.map((c: any) => ({
      ...c,
      id: String(c.id) // У C# id это int, переводим в строку для фронтенда
    }));
  },

  // 2. Создание кандидата / регистрация соискателя (POST /api/candidates)
  async addCandidate(candidateData: RequestAddCandidate): Promise<Candidate> {
    if (!USE_REAL_BACKEND) {
      const mockCreated: Candidate = {
        ...MOCK_CANDIDATES[0],
        id: `cand-${Date.now()}`,
        fullName: candidateData.fullName,
        handle: candidateData.handle,
        city: candidateData.city,
        grade: candidateData.grade as any,
        salaryMin: candidateData.salaryMin,
        salaryMax: candidateData.salaryMax,
        bio: candidateData.bio,
        primaryStack: candidateData.primaryStack
      };
      return Promise.resolve(mockCreated);
    }
    const res = await fetch(`${API_BASE_URL}/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidateData)
    });
    if (!res.ok) throw new Error('Ошибка создания кандидата');
    return res.json();
  },

  // 3. Отправка прямого оффера (Обратный найм)
  async sendOffer(offerData: Omit<JobOffer, 'id' | 'status' | 'sentAt'>): Promise<JobOffer> {
    if (!USE_REAL_BACKEND) {
      const mockOffer: JobOffer = {
        ...offerData,
        id: `off-${Date.now()}`,
        status: 'pending',
        sentAt: 'Только что'
      };
      return Promise.resolve(mockOffer);
    }
    const res = await fetch(`${API_BASE_URL}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offerData)
    });
    if (!res.ok) throw new Error('Ошибка отправки оффера');
    return res.json();
  },

  // 4. Изменение статуса оффера (Принять / Отклонить)
  async updateOfferStatus(offerId: string, status: 'accepted' | 'declined'): Promise<{ status: string }> {
    if (!USE_REAL_BACKEND) {
      return Promise.resolve({ status });
    }
    const res = await fetch(`${API_BASE_URL}/offers/${offerId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Ошибка обновления статуса');
    return res.json();
  },

  // 5. Смарт-подбор по потребности команды (35% ТЗ)
  async smartMatch(need: {
    teamName: string;
    description: string;
    targetCategory: string;
    requiredStack: string[];
    salaryMin: number;
    salaryMax: number;
  }): Promise<{ candidates: (Candidate & { smartScore: number })[] }> {
    if (!USE_REAL_BACKEND) {
      return Promise.resolve({
        candidates: MOCK_CANDIDATES.map(c => ({
          ...c,
          smartScore: 95
        }))
      });
    }
    const res = await fetch(`${API_BASE_URL}/recruiter/smart-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(need)
    });
    if (!res.ok) throw new Error('Ошибка смарт-подбора');
    return res.json();
  },

  // 6. Симуляция запроса к реестру ФСП
  async syncFsp(candidateId: string): Promise<{ success: boolean; message: string }> {
    if (!USE_REAL_BACKEND) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Разряд Мастера Спорта и протоколы турниров подтверждены в реестре ФСП'
          });
        }, 1000);
      });
    }
    const res = await fetch(`${API_BASE_URL}/fsp/sync/${candidateId}`, { method: 'POST' });
    if (!res.ok) throw new Error('Ошибка синхронизации с ФСП');
    return res.json();
  },

  // 7. Умный ИИ-поиск по естественному языку (GET/POST /api/smartSearch)
  async smartSearch(queryText: string): Promise<Candidate[]> {
    if (!USE_REAL_BACKEND) {
      const q = queryText.toLowerCase();
      const mockResult = MOCK_CANDIDATES.filter(c => 
        c.fullName.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.bio.toLowerCase().includes(q) ||
        c.primaryStack.some(s => s.toLowerCase().includes(q))
      );
      return Promise.resolve(mockResult.length > 0 ? mockResult : MOCK_CANDIDATES);
    }
    const res = await fetch(`${API_BASE_URL}/smartSearch?query=${encodeURIComponent(queryText)}`);
    if (!res.ok) {
      const postRes = await fetch(`${API_BASE_URL}/smartSearch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, text: queryText })
      });
      if (!postRes.ok) throw new Error('Ошибка умного поиска');
      return postRes.json();
    }
    return res.json();
  }
};