import React from 'react';
import { 
  Trophy, 
  ShieldCheck, 
  SendHorizontal, 
  Eye, 
  MapPin, 
  Medal,
  Activity,
  Sparkles,
  CheckCircle2,
  BrainCircuit,
  ArrowUpRight
} from 'lucide-react';
import type { Candidate } from '../types';
import { useAppStore } from '../store/useAppStore';

interface CandidateCardProps {
  candidate: Candidate & { smartScore?: number };
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const { openOfferModal, setSelectedCandidate, activeSmartNeed } = useAppStore();

  const hasFsp = candidate.fspProfile.hasHistory;
  const isMasterOfSport = candidate.fspProfile.sportRank === 'МС' || candidate.fspProfile.sportRank === 'МСМК';
  const isCandidateMaster = candidate.fspProfile.sportRank === 'КМС';

  return (
    <div className={`panel-dossier rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 text-left ${
      candidate.smartScore ? 'border-crimson/70 shadow-glow-crimson' : ''
    }`}>
      
      {/* Акцентная световая полоса слева */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-crimson via-red-500 to-amber-500 opacity-80 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Шапка досье */}
        <div className="flex items-start justify-between gap-3 pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img 
                src={candidate.avatarUrl} 
                alt={candidate.fullName} 
                className="w-13 h-13 rounded-xl object-cover border border-white/15 group-hover:border-crimson transition-all duration-300 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-crimson border-2 border-obsidian-sub flex items-center justify-center">
                <CheckCircle2 className="w-2.5 h-2.5 text-white stroke-[3]" />
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-chalk-dim block uppercase tracking-widest font-semibold">
                ID: {String(candidate.id).toUpperCase()}
              </span>
              <h3 className="text-base font-extrabold text-chalk group-hover:text-crimson transition-colors leading-tight font-sans">
                {candidate.fullName}
              </h3>
              <span className="text-xs font-mono text-chalk-muted">{candidate.handle} • {candidate.city}</span>
            </div>
          </div>

          {/* Разряд ФСП / Статус теста */}
          <div className="text-right shrink-0">
            {candidate.smartScore && (
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-black bg-gradient-to-r from-crimson to-red-600 text-white mb-1.5 inline-flex items-center gap-1 shadow-glow-crimson-sm">
                <BrainCircuit className="w-3.5 h-3.5 animate-pulse" /> {candidate.smartScore}% МАТЧ
              </span>
            )}

            {hasFsp ? (
              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-extrabold block mt-1 ${
                isMasterOfSport 
                  ? 'bg-crimson/20 text-crimson border border-crimson/50 shadow-glow-crimson-sm' 
                  : isCandidateMaster
                  ? 'bg-fsp-gold/20 text-fsp-gold border border-fsp-gold/50 shadow-glow-gold'
                  : 'bg-white/5 text-chalk border border-white/10'
              }`}>
                {candidate.fspProfile.sportRank} ФСП
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-white/5 text-chalk-muted border border-white/10 block mt-1">
                Без разряда ФСП
              </span>
            )}
          </div>
        </div>

        {/* Официальная Категория платформы */}
        <div className="mb-3">
          <span className="text-[10px] font-mono uppercase text-chalk-dim block mb-1">Категория специализации:</span>
          <span className="text-xs font-bold font-mono text-chalk bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl block leading-tight">
            {candidate.category.specialization} • <strong className="text-crimson font-mono font-extrabold">{candidate.grade}</strong>
          </span>
        </div>

        {/* Обоснование подборки (Explainability) */}
        <div className="p-3 rounded-xl bg-crimson/10 border border-crimson/25 mb-4 text-xs leading-relaxed text-chalk flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-crimson shrink-0 mt-0.5" />
          <span className="font-sans text-[11px] text-chalk-muted">{candidate.matchExplanation}</span>
        </div>

        {/* Телеметрические метрики */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-obsidian-sub/90 border border-white/10 mb-4 font-mono text-center">
          <div className="border-r border-white/10 pr-1">
            <span className="text-[9px] text-chalk-dim block uppercase font-semibold">Рейтинг ELO</span>
            <span className="text-xs font-black text-chalk">
              {hasFsp ? candidate.fspProfile.ratingScore : '—'}
            </span>
          </div>
          <div className="border-r border-white/10 px-1">
            <span className="text-[9px] text-chalk-dim block uppercase font-semibold">Награды</span>
            <span className="text-xs font-black text-crimson">
              {hasFsp ? `${candidate.fspProfile.podiumsCount}` : '0'}
            </span>
          </div>
          <div className="pl-1">
            <span className="text-[9px] text-chalk-dim block uppercase font-semibold">Тест грейда</span>
            <span className="text-xs font-black text-fsp-emerald">
              {candidate.testSummary.score}/100
            </span>
          </div>
        </div>

        {/* Стек технологий */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {candidate.primaryStack.map((tech) => {
            const isMatched = activeSmartNeed?.requiredStack.some(t => t.toLowerCase() === tech.toLowerCase());
            return (
              <span 
                key={tech} 
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold border transition-all ${
                  isMatched 
                    ? 'bg-crimson/20 text-white border-crimson font-bold shadow-glow-crimson-sm' 
                    : 'bg-white/5 text-chalk-muted border-white/10 hover:border-white/20'
                }`}
              >
                {tech}
              </span>
            );
          })}
        </div>
      </div>

      {/* Нижняя часть */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-chalk-dim uppercase font-mono block">Вилка ожиданий</span>
          <span className="text-xs font-mono font-black text-chalk">
            {candidate.salaryMin.toLocaleString('ru-RU')} – {candidate.salaryMax.toLocaleString('ru-RU')} ₽
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSelectedCandidate(candidate)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-chalk-muted hover:text-white border border-white/10 transition-all"
            title="Открыть полное досье атлета"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button 
            onClick={() => openOfferModal(candidate)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-crimson to-red-600 hover:from-red-500 hover:to-crimson text-white font-mono font-extrabold text-xs flex items-center gap-2 shadow-glow-crimson transition-all hover:scale-105 active:scale-95 border border-crimson/40"
          >
            <span>ОФФЕР</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};