              </div>
            </section>
          )}

          {tab === 'profile' && (
            <section>
              <h2 className="text-2xl font-bold">Профиль</h2>
              <p className="mt-2 text-sm text-slate-400">
                Твой аккаунт Friend AI.
              </p>
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