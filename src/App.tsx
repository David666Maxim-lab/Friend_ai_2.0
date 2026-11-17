
import { useState } from 'react';
import {
  AudioLines, Bot, Crown, Flame, Heart, Home, LifeBuoy,
  MessageCircle, Mic, Plus, Send, Settings, Sparkles,
  UserRound, ChevronRight, ShieldCheck, Globe,
  Moon, Star
} from 'lucide-react';

type Tab = 'home' | 'voice' | 'chats' | 'streaks' | 'support' | 'profile';

const navigation = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'voice', label: 'Голос', icon: AudioLines },
  { id: 'chats', label: 'Чаты', icon: MessageCircle },
  { id: 'streaks', label: 'Серии', icon: Flame },
  { id: 'support', label: 'Помощь', icon: LifeBuoy },
  { id: 'profile', label: 'Профиль', icon: UserRound },
] as const;

function Orb({
  small = false,
  active = false,
  onClick
}: {
  small?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={`orb-wrap ${small ? 'orb-small' : ''} ${active ? 'orb-active' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      } : undefined}
      aria-label={onClick ? 'Активировать Luma' : undefined}
    >
      <div className="orb-halo" />

      <div className="orb">
        <div className="orb-liquid orb-liquid-one" />
        <div className="orb-liquid orb-liquid-two" />
        <div className="orb-liquid orb-liquid-three" />
        <div className="orb-light" />
        <div className="orb-core" />
        <div className="orb-shine" />
        <div className="orb-glass-reflection" />
        <div className="orb-particles" />
      </div>

      <div className="orb-base-light" />
      <div className="orb-pedestal">
        <div className="pedestal-top" />
        <div className="pedestal-neck" />
        <div className="pedestal-body" />
        <div className="pedestal-bottom" />
        <div className="pedestal-glow" />
      </div>
    </div>
  );
}

function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [orbActive, setOrbActive] = useState(false);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages((old) => [...old, message.trim()]);
    setMessage('');
    setTab('chats');
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
            <div className="brand-name">Friend AI<span>2.0</span></div>
            <div className="brand-subtitle">ТВОЁ ПРОСТРАНСТВО</div>
          </div>
        </button>
        <button className="icon-button" onClick={() => setTab('profile')}>
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
              <h1>Рад тебя<br /><span>видеть.</span></h1>
              <p className="muted">Я рядом. Можешь рассказать мне всё.</p>
            </div>

            <div className="home-luma">
              <div className="luma-status">
                <span className="status-dot" />
                LUMA · ТВОЙ ПОМОЩНИК
              </div>

              <Orb
                active={orbActive}
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
                sendMessage();
              }}
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Напиши что-нибудь..."
                aria-label="Сообщение для Luma"
              />
              <button type="submit" disabled={!message.trim()}>
                <Send size={19} />
              </button>
            </form>

            <p className="home-hint">
              Нажми на сферу, чтобы почувствовать её энергию
            </p>
          </div>
        )}

        {tab === 'voice' && (
          <div className="page voice-page">
            <div className="eyebrow">
              <AudioLines size={14} /> ГОЛОСОВОЕ ОБЩЕНИЕ
            </div>
            <h1>Поговорим<br /><span>голосом?</span></h1>
            <p className="muted">Luma всегда готова тебя выслушать.</p>

            <div className="voice-orb-area">
              <Orb
                active={orbActive}
                onClick={() => setOrbActive((value) => !value)}
              />
            </div>

            <div className="voice-status">
              <span className="status-dot" />
              ОЖИДАНИЕ ПОДКЛЮЧЕНИЯ
            </div>

            <button className="primary-button wide" disabled>
              <Mic size={18} /> Голос скоро появится
            </button>
            <p className="hint">
              Голосовой режим станет доступен после подключения сервера ИИ.
            </p>
          </div>
        )}

        {tab === 'chats' && (
          <div className="page">
            <div className="eyebrow">
              <MessageCircle size={14} /> ОБЩЕНИЕ
            </div>
            <h1>Мои <span>чаты</span></h1>
            <p className="muted">Твоё личное пространство для разговоров.</p>

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
                <div className="ai-message">
                  Привет! Рад тебя видеть. О чём поговорим сегодня?
                </div>
                {messages.map((item, i) => (
                  <div className="user-message" key={i}>{item}</div>
                ))}
              </div>

              <div className="chat-input">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Напиши сообщение..."
                />
                <button onClick={sendMessage}>
                  <Send size={18} />
                </button>
              </div>
              <p className="hint">
                Пока сообщения отображаются локально. Для ответов ИИ нужна серверная интеграция.
              </p>
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
                <Flame className="streak-flame animated-flame" size={76} fill="currentColor" />
              </div>
              <div className="streak-number">0</div>
              <div className="streak-label">ДНЕЙ ДРУЖБЫ</div>
              <div className="streak-divider" />
              <p>Твоя первая серия начинается с одного сообщения.</p>
              <button className="primary-button" onClick={() => setTab('chats')}>
                <Plus size={17} /> Начать общение
              </button>
            </div>

            <div className="info-card">
              <Star className="orange-text" />
              <div>
                <strong>Как работают серии?</strong>
                <p>
                  Общайтесь с друзьями каждый день, чтобы сохранять огонёк вашей дружбы.
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
            <p className="muted">Выбери, с чем мы можем помочь.</p>

            <div className="support-list">
              <button className="support-item">
                <div className="feature-icon violet"><MessageCircle /></div>
                <div><strong>Частые вопросы</strong><span>Ответы о Friend AI</span></div>
                <ChevronRight />
              </button>
              <button className="support-item">
                <div className="feature-icon blue"><Settings /></div>
                <div><strong>Техническая поддержка</strong><span>Ошибки и проблемы приложения</span></div>
                <ChevronRight />
              </button>
              <button className="support-item">
                <div className="feature-icon orange"><Heart /></div>
                <div><strong>Связаться с создателем</strong><span>Личное обращение, совет или разговор</span></div>
                <ChevronRight />
              </button>
              <button className="support-item">
                <div className="feature-icon green"><ShieldCheck /></div>
                <div><strong>Безопасность</strong><span>Конфиденциальность и данные</span></div>
                <ChevronRight />
              </button>
            </div>

            <div className="notice-card">
              <Heart size={20} />
              <p>
                Личное обращение направляется создателю приложения. Это не ИИ-служба и не экстренная психологическая помощь. Ответ может занять время.
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
              <div className="profile-avatar"><UserRound size={38} /></div>
              <h2>Друг Friend AI</h2>
              <span className="subtle">Гость · Telegram подключение ожидается</span>
              <div className="profile-stats">
                <div><strong>0</strong><span>Чатов</span></div>
                <div><strong>0</strong><span>Серий</span></div>
                <div><strong>Free</strong><span>План</span></div>
              </div>
            </div>

            <div className="section-heading"><h2>Настройки</h2></div>
            <div className="support-list">
              <button className="support-item">
                <div className="feature-icon violet"><Globe /></div>
                <div><strong>Язык</strong><span>Русский</span></div>
                <ChevronRight />
              </button>
              <button className="support-item">
                <div className="feature-icon blue"><Moon /></div>
                <div><strong>Оформление</strong><span>Тёмная тема</span></div>
                <ChevronRight />
              </button>
              <button className="support-item">
                <div className="feature-icon orange"><Crown /></div>
                <div><strong>Friend AI Premium</strong><span>Расширенные возможности</span></div>
                <ChevronRight />
              </button>
              <button className="support-item">
                <div className="feature-icon green"><ShieldCheck /></div>
                <div><strong>Конфиденциальность</strong><span>Управление данными</span></div>
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
