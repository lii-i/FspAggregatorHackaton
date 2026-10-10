import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  User, 
  DollarSign, 
  SendHorizontal, 
  Briefcase, 
  FileCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store/useAppStore';
import type { DeveloperGrade, RequestAddCandidate } from '../types';

export const CreateCandidateModal: React.FC = () => {
  const { isCreateCandidateOpen, closeCreateCandidateModal, addCandidate, setRoleMode } = useAppStore();

  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [city, setCity] = useState('Москва');
  const [grade, setGrade] = useState<DeveloperGrade>('Senior');
  const [specialization, setSpecialization] = useState('Бэкенд и распределенные системы');
  const [salaryMin, setSalaryMin] = useState<number>(300000);
  const [salaryMax, setSalaryMax] = useState<number>(400000);
  const [stackTags, setStackTags] = useState<string[]>(['C++', 'Go', 'PostgreSQL']);
  const [newTag, setNewTag] = useState('');
  const [bio, setBio] = useState('');
  const [telegram, setTelegram] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fspId, setFspId] = useState('');

  // Загрузка PDF файлом
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isParsingPdf, setIsParsingPdf] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isCreateCandidateOpen) return null;

  const isSalaryValid = salaryMin >= 0 && salaryMax >= 0 && salaryMin <= salaryMax;

  const addTag = () => {
    if (newTag.trim() && !stackTags.includes(newTag.trim())) {
      setStackTags([...stackTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setStackTags(stackTags.filter(t => t !== tag));
  };

  // Демо-симуляция авто-распознавания PDF-резюме по ТЗ стр. 4
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setIsParsingPdf(true);

      setTimeout(() => {
        setIsParsingPdf(false);
        if (!fullName) setFullName('Александр Овечкин');
        if (!handle) setHandle('@alex_fsp');
        if (!telegram) setTelegram('@alex_fsp');
        if (!email) setEmail('alexander@fsp.ru');
        if (!phone) setPhone('+7 (999) 400-20-10');
        if (!bio) setBio('Опыт разработки высоконагруженных бэкенд-систем более 4 лет. Призер соревнований ФСП по алгоритмическому программированию.');
        if (!stackTags.includes('C++20')) setStackTags([...stackTags, 'C++20', 'Distributed Systems', 'Kafka']);
      }, 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSalaryValid) return;

    setIsSubmitting(true);

    const nowISO = new Date().toISOString();
    const cooldownISO = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

    const payload: RequestAddCandidate = {
      fullName: fullName || 'Анонимный соискатель',
      handle: handle.startsWith('@') ? handle : `@${handle || 'candidate'}`,
      city: city || 'Москва',
      grade,
      categorySpecialization: [specialization],
      salaryMin: Number(salaryMin),
      salaryMax: Number(salaryMax),
      primaryStack: stackTags.length > 0 ? stackTags : ['C++', 'Go'],
      bio: bio || 'Верифицированный кибератлет ФСП.',
      isOpenToOffers: true,
      
      testIsPassed: true,
      testedGrade: grade,
      testPassedAt: nowISO,
      testCoolDownUntil: cooldownISO,
      
      telegram: telegram || '@telegram',
      email: email || 'candidate@fsp.ru',
      phone: phone || '+7 (999) 000-00-00',
      
      fspId: fspId.trim() || undefined
    };

    const res = await addCandidate(payload);
    setIsSubmitting(false);
    setIsSuccess(true);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F0FF', '#F43F5E', '#FFB800']
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-obsidian-950/85 backdrop-blur-2xl animate-in fade-in duration-200 text-left font-sans">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel border border-crimson-500/30 shadow-2xl p-6 sm:p-8 text-left bg-gradient-to-b from-obsidian-900/90 via-obsidian-950/95 to-black">
        
        {/* Кнопка закрытия */}
        <button
          onClick={closeCreateCandidateModal}
          disabled={isSubmitting}
          className="absolute top-5 right-5 p-2.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-400 hover:text-white border border-obsidian-700/60 transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-16 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-fsp-emerald/10 text-fsp-emerald border-2 border-fsp-emerald flex items-center justify-center mx-auto shadow-glow-emerald">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white tracking-wide uppercase">
              РЕЗЮМЕ УСПЕШНО РАЗМЕЩЕНО В РЕЕСТРЕ!
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed pb-4">
              Запрос <code className="text-neon-cyan font-bold">POST /api/candidates</code> успешно отправлен на бэкенд. Профиль опубликован в каталоге соискателей.
            </p>
            <button 
              onClick={() => {
                setIsSuccess(false);
                closeCreateCandidateModal();
                setRoleMode('recruiter'); // Перекидываем на главную
              }}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-fsp-emerald text-black font-extrabold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity shadow-glow-cyan"
            >
              ОК
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson-500/10 border border-crimson-500/40 text-crimson-400 text-xs font-mono mb-2 shadow-glow-crimson/20">
                <Sparkles className="w-3.5 h-3.5 text-crimson-400 animate-pulse" /> РАЗМЕЩЕНИЕ РЕЗЮМЕ • POST /api/candidates
              </div>
              <h2 className="text-2xl font-black text-white tracking-wide">
                Регистрация соискателя и отправка резюме
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Заполните форму вручную или прикрепите готовое PDF-резюме для автоматического распознавания данных.
              </p>
            </div>

            {/* Драг-н-дроп зона загрузки PDF по ТЗ (стр. 4) */}
            <div className="p-4 rounded-2xl bg-obsidian-850/90 border border-dashed border-crimson-500/40 hover:border-crimson-500 transition-all text-center relative group">
              <input 
                type="file" 
                accept=".pdf,.docx" 
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-crimson-500/10 border border-crimson-500/30 flex items-center justify-center text-crimson-400">
                  <UploadCloud className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {uploadedFileName ? `Загружен файл: ${uploadedFileName}` : 'Загрузить файл резюме (PDF / DOCX)'}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                    {isParsingPdf ? '⏳ Идёт авто-распознавание данных...' : 'Нажмите или перетащите файл для автоматического заполнения полей'}
                  </span>
                </div>
                {uploadedFileName && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-fsp-emerald/15 text-fsp-emerald border border-fsp-emerald/30 inline-flex items-center gap-1">
                    <FileCheck className="w-3 h-3" /> Авто-распознавание завершено
                  </span>
                )}
              </div>
            </div>

            {/* Личные данные */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1 tracking-wider">
                  ФИО Кандидата:
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Иван Иванов"
                  className="w-full bg-obsidian-850 border border-obsidian-700/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1 tracking-wider">
                  Никнейм / Handle:
                </label>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@ivan_code"
                  className="w-full bg-obsidian-850 border border-obsidian-700/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1 tracking-wider">
                  Город:
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Москва"
                  className="w-full bg-obsidian-850 border border-obsidian-700/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-cyan"
                />
              </div>
            </div>

            {/* Специализация и Заявляемый грейд */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1 tracking-wider">
                  Специализация:
                </label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700/70 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-neon-cyan"
                >
                  <option value="Бэкенд и распределенные системы">Бэкенд и распределенные системы</option>
                  <option value="Системы ИИ и большие данные">Системы ИИ и большие данные</option>
                  <option value="Программирование робототехники">Программирование робототехники</option>
                  <option value="Информационная безопасность">Информационная безопасность</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1 tracking-wider">
                  Заявляемый Грейд:
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as DeveloperGrade)}
                  className="w-full bg-obsidian-850 border border-obsidian-700/70 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-neon-cyan"
                >
                  <option value="Junior+">Junior+</option>
                  <option value="Middle">Middle</option>
                  <option value="Middle+">Middle+</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead / Architect">Lead / Architect</option>
                </select>
              </div>
            </div>

            {/* Стек технологий */}
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1 tracking-wider">
                Ключевой стек технологий:
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  placeholder="Добавить навык (напр. Kafka) + Enter"
                  className="w-full bg-obsidian-850 border border-obsidian-700/70 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-neon-cyan"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3.5 py-2 rounded-xl bg-obsidian-800 border border-obsidian-700 text-xs font-bold text-white hover:border-neon-cyan transition-all"
                >
                  +
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {stackTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-obsidian-850 border border-neon-cyan/40 text-neon-cyan flex items-center gap-1.5 shadow-glow-cyan/10"
                  >
                    <span>{tag}</span>
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-crimson-400 text-slate-400">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Зарплатная вилка от–до */}
            <div className="p-4 rounded-2xl bg-obsidian-850/90 border border-obsidian-700/70 space-y-3">
              <span className="text-xs font-mono uppercase text-slate-400 block tracking-wider">
                Зарплатные ожидания (от–до в рублях / мес):
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Минимум (от):</label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(Math.max(0, Number(e.target.value)))}
                    className={`w-full bg-obsidian-900 border rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none ${
                      !isSalaryValid ? 'border-red-500' : 'border-obsidian-700 focus:border-neon-cyan'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Максимум (до):</label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(Math.max(0, Number(e.target.value)))}
                    className={`w-full bg-obsidian-900 border rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none ${
                      !isSalaryValid ? 'border-red-500' : 'border-obsidian-700 focus:border-neon-cyan'
                    }`}
                  />
                </div>
              </div>
              {!isSalaryValid && (
                <div className="text-[11px] font-mono text-red-400">
                  ⚠️ Нижняя планка ЗП не может быть больше верхней!
                </div>
              )}
            </div>

            {/* Контакты */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1 tracking-wider">
                  Telegram:
                </label>
                <input
                  type="text"
                  required
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="@telegram_nick"
                  className="w-full bg-obsidian-850 border border-obsidian-700/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1 tracking-wider">
                  Email:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dev@fsp.ru"
                  className="w-full bg-obsidian-850 border border-obsidian-700/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1 tracking-wider">
                  FSP ID (необязательно):
                </label>
                <input
                  type="text"
                  value={fspId}
                  onChange={(e) => setFspId(e.target.value)}
                  placeholder="FSP-RU-2025-0012"
                  className="w-full bg-obsidian-850 border border-obsidian-700/70 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-neon-cyan"
                />
              </div>
            </div>

            {/* Био */}
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1 tracking-wider">
                Опыт и краткое описание резюме:
              </label>
              <textarea
                rows={3}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Расскажите о вашей квалификации и участии в соревновательном программировании..."
                className="w-full bg-obsidian-850 border border-obsidian-700/70 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-neon-cyan leading-relaxed resize-none"
              />
            </div>

            {/* Кнопка отправки */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isSalaryValid || isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-crimson-600 via-crimson-500 to-neon-purple disabled:opacity-40 text-white font-black text-sm flex items-center justify-center gap-2 shadow-glow-crimson hover:opacity-95 transition-all uppercase tracking-wider"
              >
                <SendHorizontal className="w-4 h-4" />
                <span>{isSubmitting ? 'ОТПРАВКА НА БЭКЕНД...' : 'ОТПРАВИТЬ РЕЗЮМЕ (POST /api/candidates)'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
