
import { useState } from 'react';
import {
  AudioLines,
  Bot,
  Crown,
  Flame,
  Heart,
  Home,
  LifeBuoy,
  MessageCircle,
  Mic,
  Plus,
  Send,
  Settings,
  Sparkles,
  UserRound,
} from 'lucide-react';

type Tab = 'home' | 'voice' | 'chats' | 'streaks' | 'support' | 'profile';

const navigation = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'voice', label: 'Голос', icon: AudioLines },
  { id: 'chats', label: 'Чаты', icon: MessageCircle },
  { id: 'streaks', label: 'Серии', icon: Flame },
  { id: 'support', label: 'Поддержка', icon: LifeBuoy },
  { id: 'profile', label: 'Профиль', icon: UserRound },
] as const;

export default function App() {
  const [tab, setTab] = useState<Tab>('home');

  return (
    <div className="min-h-screen bg-[#080b16] text-white">
      <div className="mx-auto min-h-screen max-w-md pb-28">
        <header className="flex items-center justify-between px-6 pt-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600">
              <Heart size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Friend AI</h1>
              <p className="text-xs text-slate-500">Твой мир общения</p>
            </div>
          </div>
          <button onClick={() => setTab('profile')} className="rounded-full border border-white/10 bg-white/5 p-3">
            <Settings size={19} />
          </button>
        </header>

        <main className="px-6 pt-9">
          {tab === 'home' && (
            <div className="space-y-7">
              <section>
                <p className="text-sm text-cyan-300">Твоё пространство</p>
                <h2 className="mt-2 text-3xl font-bold">
                  Рад тебя видеть.
                  <br />
                  <span className="text-slate-400">Я рядом.</span>
                </h2>
              </section>

              <section className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-[#14243b] via-[#11172d] to-[#24153b] p-6">
                <div className="relative">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Sparkles size={17} />
                    <span className="text-xs font-semibold uppercase tracking-widest">Твой ИИ-помощник</span>
                  </div>
                  <h3 className="mt-5 text-2xl font-bold">Есть о чём поговорить?</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Задавай вопросы, делись мыслями или просто поговори.
                  </p>
                  <button onClick={() => setTab('chats')} className="mt-6 flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950">
                    Начать общение <Send size={16} />
                  </button>
                </div>
                <Bot className="absolute -bottom-8 -right-4 text-cyan-300/10" size={150} />
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Твои возможности</h3>
                  <span className="text-xs text-slate-500">Friend AI 2.0</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setTab('voice')} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
                    <AudioLines className="text-cyan-300" size={25} />
                    <p className="mt-4 font-semibold">Голосовой ИИ</p>
                    <p className="mt-1 text-xs text-slate-500">Общайся голосом</p>
                  </button>
                  <button onClick={() => setTab('chats')} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
                    <MessageCircle className="text-violet-300" size={25} />
                    <p className="mt-4 font-semibold">Мои чаты</p>
                    <p className="mt-1 text-xs text-slate-500">Твои разговоры</p>
                  </button>
                  <button onClick={() => setTab('streaks')} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
                    <Flame className="text-orange-400" size={25} />
                    <p className="mt-4 font-semibold">Серии дружбы</p>
                    <p className="mt-1 text-xs text-slate-500">Будь ближе к друзьям</p>
                  </button>
                  <button onClick={() => setTab('support')} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
                    <LifeBuoy className="text-emerald-300" size={25} />
                    <p className="mt-4 font-semibold">Поддержка</p>
                    <p className="mt-1 text-xs text-slate-500">Мы готовы помочь</p>
                  </button>
                </div>
              </section>

              <button className="flex w-full items-center justify-between rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-left">
                <div className="flex items-center gap-3">
                  <Crown className="text-amber-300" size={25} />
                  <div>
                    <p className="font-semibold">Friend AI Premium</p>
                    <p className="text-xs text-slate-400">Больше возможностей</p>
                  </div>
                </div>
                <span className="text-amber-300">→</span>
              </button>
            </div>
          )}

          {tab === 'voice' && (
            <section className="flex min-h-[65vh] flex-col items-center justify-center text-center">
              <AudioLines className="text-cyan-300" size={25} />
              <h2 className="mt-4 text-2xl font-bold">Голосовой ИИ</h2>
              <div className="my-12 flex h-52 w-52 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-violet-600/30">
                <div className="flex h-36 w-36 items-center justify-center rounded-full border border-cyan-300/30 bg-gradient-to-br from-cyan-400 to-violet-600">
                  <Mic size={48} />
                </div>
              </div>
              <p className="text-slate-300">Твой голосовой помощник</p>
              <p className="mt-2 text-xs text-slate-500">Голосовое подключение появится после интеграции ИИ.</p>
            </section>
          )}

          {tab === 'chats' && (
            <section>
              <h2 className="text-2xl font-bold">Мои чаты</h2>
              <p className="mt-2 text-sm text-slate-400">Все твои разговоры в одном месте.</p>
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-7 text-center">
                <MessageCircle className="mx-auto text-cyan-300" size={38} />
                <p className="mt-4 font-semibold">Пока здесь пусто</p>
                <p className="mt-2 text-sm text-slate-500">Создай свой первый разговор с ИИ.</p>
                <button className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950">
                  <Plus className="mr-2 inline" size={16} /> Новый чат
                </button>
              </div>
            </section>
          )}

          {tab === 'streaks' && (
            <section>
              <h2 className="text-2xl font-bold">Серии дружбы</h2>
              <p className="mt-2 text-sm text-slate-400">Поддерживайте связь каждый день.</p>
              <div className="mt-8 rounded-3xl border border-orange-400/20 bg-orange-400/[0.06] p-7 text-center">
                <Flame className="mx-auto text-orange-400" size={48} />
                <p className="mt-4 text-xl font-bold">Дружба начинается здесь</p>
                <p className="mt-2 text-sm text-slate-400">Добавь друга, чтобы начать общую серию.</p>
                <button className="mt-5 rounded-xl bg-orange-400 px-5 py-3 text-sm font-bold text-slate-950">
                  <Plus className="mr-2 inline" size={16} /> Добавить друга
                </button>
              </div>
            </section>
          )}

          {tab === 'support' && (
            <section>
              <h2 className="text-2xl font-bold">Поддержка</h2>
              <p className="mt-2 text-sm text-slate-400">Помощь, общение и обратная связь.</p>
              <div className="mt-7 space-y-3">
                {['Частые вопросы', 'Техническая поддержка', 'Связаться с создателем', 'Конфиденциальность и безопасность'].map((item) => (
                  <button key={item} className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left font-medium">
                    {item}
                  </button>
                ))}
              </div>
            </section>
          )}

          {tab === 'profile' && (
            <section>
              <h2 className="text-2xl font-bold">Профиль</h2>
              <p className="mt-2 text-sm text-slate-400">Твой аккаунт Friend AI.</p>
              <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <UserRound className="text-cyan-300" size={32} />
                <p className="mt-4 font-semibold">Мой профиль</p>
                <p className="mt-1 text-sm text-slate-500">
                  Настройки аккаунта появятся после подключения авторизации.
                </p>
              </div>
            </section>
          )}
        </main>

        <nav className="fixed bottom-0 left-1/2 z-50 grid w-full max-w-md -translate-x-1/2 grid-cols-6 border-t border-white/10 bg-[#0b1020]/95 px-1 pb-5 pt-3 backdrop-blur-xl">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-1 ${
                tab === id ? 'text-cyan-300' : 'text-slate-500'
              }`}
            >
              <Icon size={19} />
              <span className="text-[9px]">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
