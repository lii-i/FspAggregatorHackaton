// Дисциплины Федерации спортивного программирования
export type FspDiscipline = 
  | 'algorithms'         // Алгоритмическое программирование
  | 'product_dev'        // Продуктовое программирование
  | 'robotics'           // Программирование робототехники
  | 'cyber_security'     // Информационная безопасность
  | 'systems_ai';        // Системы ИИ и большие данные

// Спортивные разряды (включая статус для новичков без ФСП)
export type FspSportRank = 
  | 'МСМК'              
  | 'МС'                
  | 'КМС'               
  | '1-й разряд'
  | '2-й разряд'
  | 'Без разряда';

// Грейд в индустрии
export type DeveloperGrade = 'Junior+' | 'Middle' | 'Middle+' | 'Senior' | 'Lead / Architect';

// Официальная Категория платформы: [Специализация] + [Грейд] (по ТЗ стр. 2)
export interface CandidateCategory {
  specialization: string;        // "Бэкенд-разработка (C++ / Go)"
  grade: DeveloperGrade;
}

// Верифицированное соревнование из реестра ФСП
export interface FspTournamentAchievement {
  id: string;
  tournamentName: string;
  stage: 'Финал' | 'Полуфинал' | 'Региональный этап' | 'Кубок Федерации';
  year: number;
  discipline: FspDiscipline;
  placeResult: string;           // "1 место (Золото)", "Топ-5"
  teamName?: string;
  roleInTeam: string;
  verificationHash: string;      // Хэш в реестре ФСП
  verifiedDate: string;
}

// Профиль ФСП (может быть пустым у кандидата без истории в ФСП)
export interface FspProfile {
  hasHistory: boolean;           // Флаг: есть ли подтвержденный опыт в ФСП
  isVerified: boolean;
  fspId?: string;                // "FSP-RU-2025-0012"
  sportRank: FspSportRank;
  disciplines: FspDiscipline[];
  ratingScore: number;           // Рейтинг ELO (0, если нет ФСП)
  contestsParticipated: number;
  podiumsCount: number;
  achievements: FspTournamentAchievement[];
}

// Метрика для Паутинки Навыков (Radar Chart)
export interface SkillMetric {
  subject: string;
  score: number;                 // от 0 до 100
  fullMark: number;
}

// Результаты независимого тестирования на грейд (по ТЗ стр. 2-3)
export interface CandidateTestSummary {
  isPassed: boolean;
  score: number;                 // балл от 0 до 100
  testedGrade: DeveloperGrade;
  passedAt: string;
  cooldownUntil: string;         // дата окончания 3-месячного кулдауна
}

// Профиль разработчика (Кандидата)
export interface Candidate {
  id: string;
  fullName: string;
  avatarUrl: string;
  handle: string;
  headline: string;
  city: string;
  grade: DeveloperGrade;
  category: CandidateCategory;   // Формальная категория
  primaryStack: string[];
  
  // Зарплатная вилка "от–до" в рублях (по ТЗ стр. 5)
  salaryMin: number;
  salaryMax: number;
  
  bio: string;
  isOpenToOffers: boolean;
  
  // Краткая объяснимость выдачи / почему в топе (по ТЗ стр. 4-5)
  matchExplanation: string;

  // Блок ФСП (корректно обрабатывает отсутствие истории)
  fspProfile: FspProfile;

  // Результаты входного тестирования платформы
  testSummary: CandidateTestSummary;

  // Паутинка компетенций
  radarSkills: SkillMetric[];

  contacts: {
    telegram: string;
    github: string;
    email: string;
    phone?: string;
  };
}

// Прямой оффер с обязательным диапазоном ЗП «от–до» (по ТЗ стр. 5)
export interface JobOffer {
  id: string;
  candidateId: string;
  companyName: string;
  companyLogoUrl: string;
  positionTitle: string;
  salaryMin: number;             // Нижняя планка в рублях
  salaryMax: number;             // Верхняя планка в рублях
  employmentType: 'Полная удаленка' | 'Гибрид (Москва)' | 'Офис (СПб)' | 'Релокация';
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt: string;
  perks: string[];
}

// Фильтры каталога
export interface CatalogFilterState {
  page: number;
  pageSize: number;
  searchQuery: string;
  categories: string[];
  stack: string[];               // Отдельный query-параметр стека (C++, Go, Python, etc.)
  disciplines: FspDiscipline[];
  sportRanks: FspSportRank[];
  grades: DeveloperGrade[];
  minSalary: number;
  maxSalary: number;
  onlyVerifiedFsp: boolean;
  sortBy: 'rating' | 'salary_asc' | 'salary_desc' | 'podiums' | 'test_score';
}

export type ActiveRoleMode = 'recruiter' | 'candidate';

// DTO для создания кандидата / отправки резюме (POST /api/candidates)
export interface RequestAddCandidate {
  fullName: string;
  handle: string;
  city: string;
  grade: string;                 // Заявленный грейд
  categorySpecialization: string[];
  salaryMax: number;
  salaryMin: number;
  primaryStack: string[];
  bio: string;
  isOpenToOffers: boolean;
  
  testIsPassed: boolean;         // Обязательно (по ТЗ грейд дает тест)
  testedGrade: string; 
  testPassedAt: string;          // Даты в ISO "2026-10-08T12:00:00Z"
  testCoolDownUntil: string;
  
  telegram: string;
  email: string;
  phone: string;
  
  fspId?: string;                // Если кандидат указал свой FSP ID
}