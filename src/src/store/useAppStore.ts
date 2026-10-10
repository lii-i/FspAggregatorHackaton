import { create } from 'zustand';
import type { 
  Candidate, 
  JobOffer, 
  CatalogFilterState, 
  ActiveRoleMode, 
  FspDiscipline, 
  FspSportRank, 
  DeveloperGrade,
  RequestAddCandidate 
} from '../types';
import { MOCK_CANDIDATES } from '../data/mockCandidates';
import { INITIAL_OFFERS } from '../data/mockOffers';

import { api, USE_REAL_BACKEND } from '../services/api';

export interface EmployerNeed {
  teamName: string;
  description: string;
  targetCategory: string;
  requiredStack: string[];
  salaryMin: number;
  salaryMax: number;
}

interface AppState {
  roleMode: ActiveRoleMode;
  setRoleMode: (mode: ActiveRoleMode) => void;

  candidates: Candidate[];
  offers: JobOffer[];

  // API Статусы
  isLoadingCandidates: boolean;
  candidatesError: string | null;
  fetchCandidates: () => Promise<void>;
  addCandidate: (candidateData: RequestAddCandidate) => Promise<Candidate | null>;

  // Модальные окна
  selectedCandidate: Candidate | null;
  setSelectedCandidate: (candidate: Candidate | null) => void;
  isOfferModalOpen: boolean;
  offerTargetCandidate: Candidate | null;
  openOfferModal: (candidate: Candidate) => void;
  closeOfferModal: () => void;

  isTestModalOpen: boolean;
  openTestModal: () => void;
  closeTestModal: () => void;
  completeTest: (newScore: number, newGrade: DeveloperGrade, specialization: string) => void;

  // Создание профиля / Отправка резюме (POST /api/candidates)
  isCreateCandidateOpen: boolean;
  openCreateCandidateModal: () => void;
  closeCreateCandidateModal: () => void;

  // Смарт-подборка по потребности (Шаг 3)
  isSmartMatchOpen: boolean;
  activeSmartNeed: EmployerNeed | null;
  openSmartMatchModal: () => void;
  closeSmartMatchModal: () => void;
  applySmartMatch: (need: EmployerNeed) => Promise<void>;
  clearSmartMatch: () => void;

  filters: CatalogFilterState;
  setSearchQuery: (query: string) => void;
  toggleCategoryFilter: (category: string) => void;
  toggleStackFilter: (tech: string) => void;
  toggleDisciplineFilter: (discipline: FspDiscipline) => void;
  toggleSportRankFilter: (rank: FspSportRank) => void;
  toggleGradeFilter: (grade: DeveloperGrade) => void;
  setSalaryRange: (min: number, max: number) => void;
  toggleOnlyVerifiedFsp: () => void;
  setSortBy: (sort: CatalogFilterState['sortBy']) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetFilters: () => void;

  // Умный ИИ-поиск (/api/smartSearch)
  smartSearchText: string;
  triggerSmartSearch: (text: string) => Promise<void>;
  clearSmartSearchText: () => void;

  sendDirectOffer: (offer: Omit<JobOffer, 'id' | 'status' | 'sentAt'>) => Promise<void>;
  acceptOffer: (offerId: string) => Promise<void>;
  declineOffer: (offerId: string) => Promise<void>;

  resetDemoState: () => void;
}

const DEFAULT_FILTERS: CatalogFilterState = {
  page: 1,
  pageSize: 20,
  searchQuery: '',
  categories: [],
  stack: [],
  disciplines: [],
  sportRanks: [],
  grades: [],
  minSalary: 150000,
  maxSalary: 600000,
  onlyVerifiedFsp: false,
  sortBy: 'rating'
};

export const useAppStore = create<AppState>((set, get) => ({
  roleMode: 'recruiter',
  setRoleMode: (mode) => set({ roleMode: mode }),

  candidates: MOCK_CANDIDATES,
  offers: INITIAL_OFFERS,

  isLoadingCandidates: false,
  candidatesError: null,

  smartSearchText: '',

  fetchCandidates: async () => {
    set({ isLoadingCandidates: true, candidatesError: null });
    try {
      const filters = get().filters;
      const data = await api.getCandidates({
        // Передаем параметры в camelCase
        page: filters.page || 1,
        pageSize: filters.pageSize || 20,
        searchQuery: filters.searchQuery || undefined,
        category: filters.categories.length > 0 ? filters.categories : undefined,
        stack: filters.stack.length > 0 ? filters.stack : undefined,
        discipline: filters.disciplines.length > 0 ? filters.disciplines : undefined,
        sportRank: filters.sportRanks.length > 0 ? filters.sportRanks : undefined,
        grade: filters.grades.length > 0 ? filters.grades : undefined,
        maxSalary: filters.maxSalary < 600000 ? filters.maxSalary : undefined,
        hasFsp: filters.onlyVerifiedFsp ? true : undefined,
        sortBy: filters.sortBy
      });
      set({ candidates: data, isLoadingCandidates: false });
    } catch (err: any) {
      console.warn('Бэкенд недоступен, подставляем локальные моки:', err?.message || err);
      set({ 
        candidates: MOCK_CANDIDATES, 
        isLoadingCandidates: false,
        candidatesError: USE_REAL_BACKEND 
          ? 'Сервер бэкенда (http://localhost:5198/api) недоступен. Работает демо-режим на фолбэк-данных.' 
          : null 
      });
    }
  },

  triggerSmartSearch: async (text: string) => {
    if (!text.trim()) {
      set({ smartSearchText: '' });
      get().fetchCandidates();
      return;
    }
    set({ isLoadingCandidates: true, candidatesError: null, smartSearchText: text });
    try {
      const data = await api.smartSearch(text);
      set({ candidates: data, isLoadingCandidates: false });
    } catch (err) {
      console.warn('API smartSearch недоступен, выполняем локально:', err);
      const q = text.toLowerCase();
      const filtered = MOCK_CANDIDATES.filter(c => 
        c.fullName.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.bio.toLowerCase().includes(q) ||
        c.primaryStack.some(s => s.toLowerCase().includes(q))
      );
      set({ candidates: filtered, isLoadingCandidates: false });
    }
  },

  clearSmartSearchText: () => {
    set({ smartSearchText: '' });
    get().fetchCandidates();
  },

  addCandidate: async (candidateData) => {
    try {
      await api.addCandidate(candidateData);
      await get().fetchCandidates(); // Заново стягиваем список с бэкенда
      return get().candidates[0] || null;
    } catch (err) {
      console.warn('API addCandidate недоступен:', err);
      return null;
    }
  },

  selectedCandidate: null,
  setSelectedCandidate: (candidate) => set({ selectedCandidate: candidate }),

  isOfferModalOpen: false,
  offerTargetCandidate: null,
  openOfferModal: (candidate) => set({ isOfferModalOpen: true, offerTargetCandidate: candidate }),
  closeOfferModal: () => set({ isOfferModalOpen: false, offerTargetCandidate: null }),

  isTestModalOpen: false,
  openTestModal: () => set({ isTestModalOpen: true }),
  closeTestModal: () => set({ isTestModalOpen: false }),

  isCreateCandidateOpen: false,
  openCreateCandidateModal: () => set({ isCreateCandidateOpen: true }),
  closeCreateCandidateModal: () => set({ isCreateCandidateOpen: false }),

  completeTest: (newScore, newGrade, specialization) =>
    set((state) => {
      const updatedCandidates = state.candidates.map((c, index) => {
        if (index === 0) {
          return {
            ...c,
            grade: newGrade,
            category: {
              ...c.category,
              grade: newGrade,
              specialization
            },
            testSummary: {
              isPassed: true,
              score: newScore,
              testedGrade: newGrade,
              passedAt: 'Сегодня',
              cooldownUntil: 'Через 3 месяца'
            },
            matchExplanation: `Квалификация подтверждена независимым тестированием (${newScore}/100, ${newGrade}) + статус ФСП`
          };
        }
        return c;
      });
      return { candidates: updatedCandidates };
    }),

  // Смарт-подбор через API
  isSmartMatchOpen: false,
  activeSmartNeed: null,
  openSmartMatchModal: () => set({ isSmartMatchOpen: true }),
  closeSmartMatchModal: () => set({ isSmartMatchOpen: false }),

  applySmartMatch: async (need) => {
    try {
      const res = await api.smartMatch(need);
      set({ candidates: res.candidates, activeSmartNeed: need });
    } catch (err) {
      console.warn('API smartMatch недоступен, выполняем расчет локально:', err);
      const state = get();
      const scoredCandidates = state.candidates.map((candidate) => {
        const matchedTechs = candidate.primaryStack.filter((tech) =>
          need.requiredStack.some((req) => req.toLowerCase() === tech.toLowerCase())
        );
        const stackScore = (matchedTechs.length / Math.max(1, need.requiredStack.length)) * 50;

        const fspBonus = candidate.fspProfile.hasHistory
          ? candidate.fspProfile.sportRank === 'МС' ? 35 : candidate.fspProfile.sportRank === 'КМС' ? 28 : 20
          : 15;
        const testBonus = (candidate.testSummary.score / 100) * 15;

        const totalMatchPercent = Math.min(99, Math.round(stackScore + fspBonus + testBonus));

        let explanation = candidate.fspProfile.hasHistory
          ? `Матчинг ${totalMatchPercent}%: Призер ФСП (${candidate.fspProfile.sportRank}) + совпадение стека [${matchedTechs.join(', ') || 'базовый'}] + тест ${candidate.testSummary.score}/100`
          : `Матчинг ${totalMatchPercent}%: Независимый тест платформы (${candidate.testSummary.score}/100) + релевантный опыт [${matchedTechs.join(', ') || 'профиль'}]`;

        return {
          ...candidate,
          matchExplanation: explanation,
          smartScore: totalMatchPercent
        };
      });

      scoredCandidates.sort((a: any, b: any) => (b.smartScore || 0) - (a.smartScore || 0));

      set({
        candidates: scoredCandidates,
        activeSmartNeed: need
      });
    }
  },

  clearSmartMatch: () =>
    set({
      candidates: MOCK_CANDIDATES,
      activeSmartNeed: null
    }),

  filters: DEFAULT_FILTERS,
  setSearchQuery: (query) => 
    set((state) => ({ filters: { ...state.filters, searchQuery: query } })),

  toggleCategoryFilter: (cat) =>
    set((state) => {
      const exists = state.filters.categories.includes(cat);
      const updated = exists
        ? state.filters.categories.filter((c) => c !== cat)
        : [...state.filters.categories, cat];
      return { filters: { ...state.filters, categories: updated } };
    }),

  toggleStackFilter: (tech) =>
    set((state) => {
      const exists = state.filters.stack.includes(tech);
      const updated = exists
        ? state.filters.stack.filter((t) => t !== tech)
        : [...state.filters.stack, tech];
      return { filters: { ...state.filters, stack: updated } };
    }),

  toggleDisciplineFilter: (discipline) =>
    set((state) => {
      const exists = state.filters.disciplines.includes(discipline);
      const updated = exists
        ? state.filters.disciplines.filter((d) => d !== discipline)
        : [...state.filters.disciplines, discipline];
      return { filters: { ...state.filters, disciplines: updated } };
    }),

  toggleSportRankFilter: (rank) =>
    set((state) => {
      const exists = state.filters.sportRanks.includes(rank);
      const updated = exists
        ? state.filters.sportRanks.filter((r) => r !== rank)
        : [...state.filters.sportRanks, rank];
      return { filters: { ...state.filters, sportRanks: updated } };
    }),

  toggleGradeFilter: (grade) =>
    set((state) => {
      const exists = state.filters.grades.includes(grade);
      const updated = exists
        ? state.filters.grades.filter((g) => g !== grade)
        : [...state.filters.grades, grade];
      return { filters: { ...state.filters, grades: updated } };
    }),

  setSalaryRange: (min, max) =>
    set((state) => ({ filters: { ...state.filters, minSalary: min, maxSalary: max } })),

  toggleOnlyVerifiedFsp: () =>
    set((state) => ({ filters: { ...state.filters, onlyVerifiedFsp: !state.filters.onlyVerifiedFsp } })),

  setSortBy: (sortBy) =>
    set((state) => ({ filters: { ...state.filters, sortBy } })),

  setPage: (page) =>
    set((state) => ({ filters: { ...state.filters, page } })),

  setPageSize: (pageSize) =>
    set((state) => ({ filters: { ...state.filters, pageSize } })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  sendDirectOffer: async (offerData) => {
    try {
      const newOffer = await api.sendOffer(offerData);
      set((state) => ({
        offers: [newOffer, ...state.offers],
        isOfferModalOpen: false,
        offerTargetCandidate: null
      }));
    } catch (err) {
      console.warn('API sendOffer недоступен, сохраняем оффер локально:', err);
      const fallbackOffer: JobOffer = {
        ...offerData,
        id: `off-${Date.now()}`,
        status: 'pending',
        sentAt: 'Только что'
      };
      set((state) => ({
        offers: [fallbackOffer, ...state.offers],
        isOfferModalOpen: false,
        offerTargetCandidate: null
      }));
    }
  },

  acceptOffer: async (offerId) => {
    try {
      await api.updateOfferStatus(offerId, 'accepted');
    } catch (err) {
      console.warn('API updateOfferStatus недоступен:', err);
    }
    set((state) => ({
      offers: state.offers.map((offer) =>
        offer.id === offerId ? { ...offer, status: 'accepted' as const } : offer
      )
    }));
  },

  declineOffer: async (offerId) => {
    try {
      await api.updateOfferStatus(offerId, 'declined');
    } catch (err) {
      console.warn('API updateOfferStatus недоступен:', err);
    }
    set((state) => ({
      offers: state.offers.map((offer) =>
        offer.id === offerId ? { ...offer, status: 'declined' as const } : offer
      )
    }));
  },

  resetDemoState: () =>
    set({
      roleMode: 'recruiter',
      candidates: MOCK_CANDIDATES,
      offers: INITIAL_OFFERS,
      selectedCandidate: null,
      isOfferModalOpen: false,
      offerTargetCandidate: null,
      isTestModalOpen: false,
      isSmartMatchOpen: false,
      activeSmartNeed: null,
      filters: DEFAULT_FILTERS,
      candidatesError: null,
      isLoadingCandidates: false
    })
}));