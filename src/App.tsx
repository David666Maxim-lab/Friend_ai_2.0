

import { useEffect, useState } from 'react';
import {
  Bot, Crown, Flame, Heart, Home, LifeBuoy,
  MessageCircle, Mic, Plus, Send, Settings,
  Sparkles, UserRound, ChevronRight, ShieldCheck,
  Globe, Moon, Star, AudioLines
} from 'lucide-react';

import LumaOrb from './components/LumaOrb';
import { supabase } from './lib/supabase';

type Tab = 'home' | 'chats' | 'streaks' | 'support' | 'profile';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const navigation = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'chats', label: 'Чаты', icon: MessageCircle },
  { id: 'streaks', label: 'Серии', icon: Flame },
  { id: 'support', label: 'Помощь', icon: LifeBuoy },
  { id: 'profile', label: 'Профиль', icon: UserRound },
] as const;

function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Привет! Рад тебя видеть. О чём поговорим сегодня?'
    }
  ]);

  const [orbActive, setOrbActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [chatError, setChatError] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (sessionData.session) {
          if (mounted) setAuthLoading(false);
          return;
        }

        const { data, error } =
          await supabase.auth.signInAnonymously();

        if (error) throw error;

        if (!data.session) {
          throw new Error('Не удалось создать пользовательскую сессию.');
        }

        if (mounted) {
          setAuthLoading(false);
          setAuthError('');
        }
      } catch (error) {
        console.error('Supabase auth error:', error);

        if (mounted) {
          setAuthError(
            error instanceof Error
              ? error.message
              : 'Ошибка авторизации'
          );
          setAuthLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const sendMessage = async () => {
    const text = message.trim();

    if (!text || loading) return;

    if (authLoading) {
      setChatError('Подключаем аккаунт. Попробуй ещё раз через секунду.');
      return;
    }

    if (authError) {
      setChatError('Не удалось подключить аккаунт: ' + authError);
      return;
    }

    setMessage('');
    setChatError('');
    setMessages((old) => [
      ...old,
      { role: 'user', content: text }
    ]);
    setTab('chats');
    setLoading(true);
    setOrbActive(true);

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error('Сессия не найдена. Перезагрузи приложение.');
      }

      const { data, error } = await supabase.functions.invoke(
        'Luma-chat',
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: {
            message: text,
            chatId
          }
        }
      );

      if (error) {
        let details = error.message;

        try {
          const response = error.context as Response | undefined;

          if (response) {
            const body = await response.clone().json();
            if (body?.error) details = body.error;
          }
        } catch {
          // Оставляем исходное сообщение ошибки.
        }

        throw new Error(details || 'Не удалось получить ответ Luma.');
      }

      if (!data?.reply || !data?.chatId) {
        throw new Error('Сервер вернул неполный ответ.');
      }

      setChatId(data.chatId);

      setMessages((old) => [
        ...old,
        { role: 'assistant', content: data.reply }
      ]);
    } catch (error) {
      console.error('Luma chat error:', error);

      setChatError(
        error instanceof Error
          ? error.message
          : 'Не удалось отправить сообщение.'
      );
    } finally {
      setLoading(false);
      setOrbActive(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <button className="brand" onClick={() => setTab('home')}>
          <div className="brand-icon">
            <Heart size={20} fill="currentColor" />
          </div>
          <div>
            <div className="brand-name">
              Friend AI<span>2.0</span>
            </div>
            <div className="brand-subtitle">ТВОЁ ПРОСТРАНСТВО</div>
          </div>
        </button>

        <button
          className="icon-button"
          onClick={() => setTab('profile')}
          aria-label="Настройки профиля"
        >
          <Settings size={20} />
        </button>
      </header>

      <main className="main-content">
        {tab === 'home' && (
          <div className="page home-page">
            <div className="home-welcome">
              <div className="eyebrow">
                <Sparkles size={14} /> ТВОЙ ИИ-ДРУГ
              </div>
              <h1>
                Рад тебя<br />
                <span>видеть.</span>
              </h1>
              <p className="muted">
                Я рядом. Можешь рассказать мне всё.
              </p>
            </div>

            <div className="home-luma">
              <div className="luma-status">
                <span className="status-dot" />
                LUMA · ТВОЙ ПОМОЩНИК
              </div>

              <LumaOrb
                active={orbActive}
                responding={loading}
                onClick={() => setOrbActive((value) => !value)}
              />

              <div className="luma-caption">
                <h2>Привет, я <span>Luma.</span></h2>
                <p>О чём поговорим сегодня?</p>
              </div>
            </div>

            <form
              className="home-message-box"
              onSubmit={(e) => {
                e.preventDefault();
                void sendMessage();
              }}
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Напиши что-нибудь..."
                aria-label="Сообщение для Luma"
                disabled={loading || authLoading}
              />
              <button
                type="submit"
                disabled={!message.trim() || loading || authLoading}
                aria-label="Отправить сообщение"
              >
                <Send size={19} />
              </button>
            </form>

            <p className="home-hint">
              {loading
                ? 'Luma думает над ответом...'
                : 'Напиши Luma — она тебя выслушает'}
            </p>

            <div className="voice-card">
              <div className="voice-card-icon">
                <AudioLines size={23} />
              </div>

              <div className="voice-card-content">
                <strong>Голосовое общение</strong>
                <span>Поговори с Luma голосом</span>
              </div>

              <button
                className="voice-action"
                type="button"
                disabled
                aria-label="Голосовое общение скоро появится"
              >
                <Mic size={20} />
              </button>

              <div className="voice-card-note">
                <span className="status-dot" />
                Скоро появится
              </div>
            </div>
          </div>
        )}

        {tab === 'chats' && (
          <div className="page">
            <div className="eyebrow">
              <MessageCircle size={14} /> ОБЩЕНИЕ
            </div>
            <h1>Мои <span>чаты</span></h1>
            <p className="muted">
              Твоё личное пространство для разговоров.
            </p>

            <div className="chat-card">
              <div className="chat-heading">
                <div className="chat-avatar"><Bot /></div>
                <div>
                  <strong>Luma</strong>
                  <span><i className="status-dot" /> Твой ИИ-помощник</span>
                </div>
                <span className="mini-badge">AI</span>
              </div>

              <div className="chat-messages">
                {messages.map((item, i) => (
                  <div
                    className={
                      item.role === 'user' ? 'user-message' : 'ai-message'
                    }
                    key={i}
                  >
                    {item.content}
                  </div>
                ))}

                {loading && (
                  <div className="ai-message">
                    Luma печатает...
                  </div>
                )}
              </div>

              {chatError && (
                <p className="hint" role="alert">
                  {chatError}
                </p>
              )}

              <form
                className="chat-input"
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendMessage();
                }}
              >
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Напиши сообщение..."
                  disabled={loading || authLoading}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || loading || authLoading}
                >
                  <Send size={18} />
                </button>
              </form>

              {authLoading && (
                <p className="hint">Подключаем твой аккаунт...</p>
              )}

              {authError && (
                <p className="hint" role="alert">
                  Ошибка авторизации: {authError}
                </p>
              )}
            </div>
          </div>
        )}

        {tab === 'streaks' && (
          <div className="page">
            <div className="eyebrow">
              <Flame size={14} /> ДРУЖБА КАЖДЫЙ ДЕНЬ
            </div>
            <h1>Серии <span>дружбы</span></h1>
            <p className="muted">
              Маленькие моменты создают большую дружбу.
            </p>

            <div className="streak-card">
              <div className="streak-glow" />
              <div className="streak-fire">
                <Flame
                  className="streak-flame animated-flame"
                  size={76}
                  fill="currentColor"
                />
              </div>
              <div className="streak-number">0</div>
              <div className="streak-label">ДНЕЙ ДРУЖБЫ</div>
              <div className="streak-divider" />
              <p>Твоя первая серия начинается с одного сообщения.</p>
              <button
                className="primary-button"
                onClick={() => setTab('chats')}
              >
                <Plus size={17} /> Начать общение
              </button>
            </div>

            <div className="info-card">
              <Star className="orange-text" />
              <div>
                <strong>Как работают серии?</strong>
                <p>
                  Общайтесь каждый день, чтобы сохранять огонёк вашей дружбы.
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === 'support' && (
          <div className="page">
            <div className="eyebrow">
              <LifeBuoy size={14} /> МЫ РЯДОМ
            </div>
            <h1>Чем <span>помочь?</span></h1>
            <p className="muted">
              Выбери, с чем мы можем помочь.
            </p>

            <div className="support-list">
              <button className="support-item">
                <div className="feature-icon violet"><MessageCircle /></div>
                <div>
                  <strong>Частые вопросы</strong>
                  <span>Ответы о Friend AI</span>
                </div>
                <ChevronRight />
              </button>

              <button className="support-item">
                <div className="feature-icon blue"><Settings /></div>
                <div>
                  <strong>Техническая поддержка</strong>
                  <span>Ошибки и проблемы приложения</span>
                </div>
                <ChevronRight />
              </button>

              <button className="support-item">
                <div className="feature-icon orange"><Heart /></div>
                <div>
                  <strong>Связаться с создателем</strong>
                  <span>Личное обращение, совет или разговор</span>
                </div>
                <ChevronRight />
              </button>

              <button className="support-item">
                <div className="feature-icon green"><ShieldCheck /></div>
                <div>
                  <strong>Безопасность</strong>
                  <span>Конфиденциальность и данные</span>
                </div>
                <ChevronRight />
              </button>
            </div>

            <div className="notice-card">
              <Heart size={20} />
              <p>
                Личное обращение направляется создателю приложения. Это не
                экстренная психологическая помощь. Ответ может занять время.
              </p>
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div className="page">
            <div className="eyebrow">
              <UserRound size={14} /> ТВОЙ АККАУНТ
            </div>
            <h1>Мой <span>профиль</span></h1>

            <div className="profile-card">
              <div className="profile-avatar">
                <UserRound size={38} />
              </div>
              <h2>Друг Friend AI</h2>
              <span className="subtle">
                {authLoading
                  ? 'Подключение...'
                  : authError
                    ? 'Ошибка подключения'
                    : 'Гость · Анонимный аккаунт'}
              </span>
              <div className="profile-stats">
                <div><strong>0</strong><span>Чатов</span></div>
                <div><strong>0</strong><span>Серий</span></div>
                <div><strong>Free</strong><span>План</span></div>
              </div>
            </div>

            <div className="section-heading">
              <h2>Настройки</h2>
            </div>

            <div className="support-list">
              <button className="support-item">
                <div className="feature-icon violet"><Globe /></div>
                <div>
                  <strong>Язык</strong>
                  <span>Русский</span>
                </div>
                <ChevronRight />
              </button>

              <button className="support-item">
                <div className="feature-icon blue"><Moon /></div>
                <div>
                  <strong>Оформление</strong>
                  <span>Тёмная тема</span>
                </div>
                <ChevronRight />
              </button>

              <button className="support-item">
                <div className="feature-icon orange"><Crown /></div>
                <div>
                  <strong>Friend AI Premium</strong>
                  <span>Расширенные возможности</span>
                </div>
                <ChevronRight />
              </button>

              <button className="support-item">
                <div className="feature-icon green"><ShieldCheck /></div>
                <div>
                  <strong>Конфиденциальность</strong>
                  <span>Управление данными</span>
                </div>
                <ChevronRight />
              </button>
            </div>
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${tab === id ? 'active' : ''}`}
            onClick={() => setTab(id)}
          >
            <span className="nav-icon"><Icon size={20} /></span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
