import React, { useEffect, useState } from "react";
import {
  Heart,
  Home,
  MessageCircle,
  Users,
  Image as ImageIcon,
  Settings as SettingsIcon,
  LogOut,
  Sparkles,
  Menu,
  X,
  Mic,
  Send,
} from "lucide-react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { api, auth } from "./services/api";

/* =========================================================
   DATA
========================================================= */

const PERSONALITY_PRESETS = [
  "Caring",
  "Cute",
  "Funny",
  "Intelligent",
  "Confident",
  "Calm",
  "Study Partner",
  "Gamer",
];

/* =========================================================
   APP SHELL
========================================================= */

function Shell({ children }) {
  const [open, setOpen] = useState(false);

  const navigation = [
    ["/", "Home", Home],
    ["/chats", "Chats", MessageCircle],
    ["/characters", "Characters", Users],
    ["/gallery", "Gallery", ImageIcon],
    ["/settings", "Settings", SettingsIcon],
  ];

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch {
      // Even if logout API fails, clear the local navigation state.
    }

    window.location.href = "/login";
  };

  return (
    <div className="app">
      <aside className={open ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <div className="brandmark">
            <Heart size={18} fill="currentColor" />
          </div>

          <b>GF AI</b>

          <button
            className="icon mobileOnly"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebarNav">
          {navigation.map(([to, label, Icon]) => (
            <Link
              key={to}
              to={to}
              className="navitem"
              onClick={() => setOpen(false)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <button className="navitem logout" onClick={handleLogout}>
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </aside>

      {open && (
        <div
          className="scrim"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <main className="main">
        <header className="topbar">
          <button
            className="icon mobileOnly"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>

          <span className="eyebrow">GF AI • PREMIUM COMPANION</span>

          <div className="topactions">
            <Link className="pill" to="/characters">
              Create GF
            </Link>
          </div>
        </header>

        {children}
      </main>

      <nav className="bottomnav">
        {navigation.map(([to, label, Icon]) => (
          <Link to={to} key={to}>
            <Icon size={19} />
            <small>{label}</small>
          </Link>
        ))}
      </nav>
    </div>
  );
}

/* =========================================================
   LANDING PAGE
========================================================= */

function Landing() {
  return (
    <div className="landing">
      <div className="hero">
        <div>
          <div className="badge">
            <Sparkles size={15} />
            Your AI. Your Companion.
          </div>

          <h1>
            Meet a companion that
            <br />
            <span>feels uniquely yours.</span>
          </h1>

          <p>
            Build a fictional adult AI companion with a personality, memory,
            voice and conversation style designed around you.
          </p>

          <div className="actions">
            <Link className="primary" to="/register">
              Create Your AI Companion
            </Link>

            <Link className="secondary" to="/login">
              Start Chatting
            </Link>
          </div>
        </div>

        <div className="orb" aria-hidden="true">
          <div className="orbcore">💗</div>
          <div className="orbglow" />
        </div>
      </div>

      <section className="featuregrid">
        {[
          [
            "💬",
            "Natural conversations",
            "Thoughtful, contextual AI chat.",
          ],
          [
            "🧠",
            "Persistent memory",
            "Control what your companion remembers.",
          ],
          [
            "🎙️",
            "Voice ready",
            "Browser and server voice adapters.",
          ],
          [
            "🖼️",
            "Creative gallery",
            "Moderated image generation architecture.",
          ],
          [
            "📚",
            "Study mode",
            "A focused educational experience.",
          ],
          [
            "🔒",
            "Privacy first",
            "Secure sessions and server-side secrets.",
          ],
        ].map(([emoji, title, description]) => (
          <div className="glass card" key={title}>
            <div className="emoji">{emoji}</div>

            <h3>{title}</h3>

            <p>{description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

/* =========================================================
   AUTH
========================================================= */

function Auth({ register = false }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (register) {
        await auth.register(form);

        navigate("/login");
      } else {
        await auth.login({
          email: form.email,
          password: form.password,
        });

        navigate("/");
      }
    } catch (error) {
      setError(error?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center">
      <form className="glass auth card" onSubmit={submit}>
        <div className="brand large">
          <div className="brandmark">
            <Heart size={22} fill="currentColor" />
          </div>

          <b>GF AI</b>
        </div>

        <h2>{register ? "Create your account" : "Welcome back"}</h2>

        <p className="muted">
          {register
            ? "Build your private AI companion space."
            : "Continue your conversations."}
        </p>

        {register && (
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(event) =>
              updateField("username", event.target.value)
            }
            autoComplete="username"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          autoComplete="email"
          required
        />

        <input
          type="password"
          placeholder="Password (8+ characters)"
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
          autoComplete={register ? "new-password" : "current-password"}
          minLength={8}
          required
        />

        {error && <div className="error">{error}</div>}

        <button className="primary wide" disabled={loading}>
          {loading
            ? "Please wait..."
            : register
            ? "Create account"
            : "Login"}
        </button>

        <p className="muted">
          {register ? "Already have an account? " : "Need an account? "}

          <Link to={register ? "/login" : "/register"}>
            {register ? "Login" : "Register"}
          </Link>
        </p>
      </form>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  return (
    <Shell>
      <section className="dashboard">
        <div className="welcome glass">
          <div>
            <span className="eyebrow">YOUR PRIVATE SPACE</span>

            <h1>Good to see you. 💗</h1>

            <p>
              Choose a companion or create someone new to start a
              conversation.
            </p>

            <Link className="primary" to="/characters">
              Create your GF
            </Link>
          </div>

          <div className="welcomeorb">✨</div>
        </div>

        <div className="sectionhead">
          <h2>Everything in one place</h2>
        </div>

        <div className="featuregrid">
          {[
            [
              "💬",
              "Chats",
              "Continue conversations with your companions.",
              "/chats",
            ],
            [
              "👩",
              "Characters",
              "Create multiple fictional adult companions.",
              "/characters",
            ],
            [
              "🧠",
              "Memory",
              "Review and control saved context.",
              "/settings",
            ],
            [
              "🖼️",
              "Gallery",
              "Your generated creative collection.",
              "/gallery",
            ],
          ].map(([emoji, title, description, link]) => (
            <Link className="glass card" to={link} key={title}>
              <div className="emoji">{emoji}</div>

              <h3>{title}</h3>

              <p>{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  );
}

/* =========================================================
   CHARACTERS
========================================================= */

function Characters() {
  const [characters, setCharacters] = useState([]);

  const [form, setForm] = useState({
    name: "",
    adult: true,
    personality: "Caring",
    greeting: "Hi! I'm happy to chat with you. 💗",
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const loadCharacters = async () => {
    try {
      setLoading(true);

      const data = await api("/characters");

      setCharacters(data.characters || []);
      setError("");
    } catch (error) {
      setError(error?.message || "Unable to load characters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  const createCharacter = async (event) => {
    event.preventDefault();

    if (!form.adult) {
      setError("Only fictional adult characters are allowed.");
      return;
    }

    setError("");
    setCreating(true);

    try {
      await api("/characters", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setForm({
        name: "",
        adult: true,
        personality: "Caring",
        greeting: "Hi! I'm happy to chat with you. 💗",
      });

      await loadCharacters();
    } catch (error) {
      setError(error?.message || "Unable to create character.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Shell>
      <section>
        <div className="sectionhead">
          <div>
            <span className="eyebrow">CHARACTER STUDIO</span>
            <h1>Your companions</h1>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="split">
          <form
            className="glass card builder"
            onSubmit={createCharacter}
          >
            <h2>Create a GF</h2>

            <input
              required
              type="text"
              placeholder="Character name"
              maxLength={60}
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />

            <label>Personality</label>

            <div className="chips">
              {PERSONALITY_PRESETS.map((preset) => (
                <button
                  type="button"
                  className={
                    form.personality === preset
                      ? "chip active"
                      : "chip"
                  }
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      personality: preset,
                    }))
                  }
                  key={preset}
                >
                  {preset}
                </button>
              ))}
            </div>

            <textarea
              placeholder="Greeting"
              maxLength={500}
              value={form.greeting}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  greeting: event.target.value,
                }))
              }
            />

            <label className="check">
              <input
                type="checkbox"
                checked={form.adult}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    adult: event.target.checked,
                  }))
                }
              />

              <span>Fictional adult character setting</span>
            </label>

            <button
              className="primary wide"
              disabled={!form.adult || creating}
            >
              {creating ? "Creating..." : "Save companion"}
            </button>
          </form>

          <div className="cards">
            {loading && (
              <div className="glass empty">
                Loading your companions...
              </div>
            )}

            {!loading &&
              characters.map((character) => (
                <div
                  className="glass character card"
                  key={character._id}
                >
                  <div className="avatar">
                    {character.avatar ? (
                      <img
                        src={character.avatar}
                        alt={character.name}
                      />
                    ) : (
                      character.name?.[0] || "💗"
                    )}
                  </div>

                  <div>
                    <h3>{character.name}</h3>

                    <p>{character.personality}</p>

                    <Link
                      className="secondary"
                      to={`/chat/${character._id}`}
                    >
                      Chat
                    </Link>
                  </div>
                </div>
              ))}

            {!loading && characters.length === 0 && (
              <div className="glass empty">
                No companions yet. Create your first one.
              </div>
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
}

/* =========================================================
   CHAT
========================================================= */

function ChatPage() {
  const { id } = useParams();

  const [character, setCharacter] = useState(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCharacter, setLoadingCharacter] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadCharacter = async () => {
      try {
        setLoadingCharacter(true);

        const data = await api("/characters");

        if (!active) return;

        const found = (data.characters || []).find(
          (item) => item._id === id
        );

        if (!found) {
          setError("Character not found.");
          return;
        }

        setCharacter(found);
      } catch (error) {
        if (active) {
          setError(
            error?.message || "Unable to load this companion."
          );
        }
      } finally {
        if (active) {
          setLoadingCharacter(false);
        }
      }
    };

    loadCharacter();

    return () => {
      active = false;
    };
  }, [id]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const content = text.trim();

    if (!content || loading || !character) {
      return;
    }

    setError("");
    setText("");

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content,
        local: true,
      },
    ]);

    setLoading(true);

    try {
      const data = await api("/chat", {
        method: "POST",
        body: JSON.stringify({
          characterId: id,
          conversationId,
          content,
        }),
      });

      setConversationId(data.conversationId);

      if (data.message) {
        setMessages((current) => [
          ...current,
          data.message,
        ]);
      }
    } catch (error) {
      setError(error?.message || "Unable to send message.");

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong. Please try again.",
          localError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      event.currentTarget.form?.requestSubmit();
    }
  };

  if (loadingCharacter) {
    return (
      <Shell>
        <div className="glass empty">
          Loading companion...
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <section className="chatpage">
        <div className="chathead glass">
          <div className="avatar">
            {character?.avatar ? (
              <img
                src={character.avatar}
                alt={character.name}
              />
            ) : (
              character?.name?.[0] || "💗"
            )}
          </div>

          <div>
            <b>{character?.name || "Your companion"}</b>

            <small>
              ● {character?.mood || "calm"} • fictional AI
            </small>
          </div>

          <button
            className="icon"
            type="button"
            aria-label="Voice"
            title="Voice integration"
          >
            <Mic size={20} />
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="messages">
          {messages.length === 0 && (
            <div className="chatwelcome">
              <div className="bigavatar">💗</div>

              <h2>
                {character?.greeting ||
                  "Start a conversation."}
              </h2>

              <p>
                Affectionate, supportive and non-explicit
                by design.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              className={
                message.role === "user"
                  ? "msg user"
                  : "msg"
              }
              key={message._id || index}
            >
              {message.content}
            </div>
          ))}

          {loading && (
            <div className="msg typing" aria-label="Typing">
              <i />
              <i />
              <i />
            </div>
          )}
        </div>

        <form
          className="composer glass"
          onSubmit={sendMessage}
        >
          <input
            value={text}
            onChange={(event) =>
              setText(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Message your companion…"
            maxLength={12000}
            disabled={loading}
            aria-label="Message"
          />

          <button
            className="send"
            type="submit"
            disabled={loading || !text.trim()}
            aria-label="Send message"
          >
            <Send size={19} />
          </button>
        </form>
      </section>
    </Shell>
  );
}

/* =========================================================
   SIMPLE PAGE
========================================================= */

function SimplePage({ title, icon, body }) {
  return (
    <Shell>
      <section>
        <span className="eyebrow">GF AI</span>

        <h1>
          {icon} {title}
        </h1>

        <div className="glass card empty">
          {body}
        </div>
      </section>
    </Shell>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: "dark",
    accentColor: "#ff4fa3",
    memoryEnabled: true,
    autoPlayVoice: false,
    enterToSend: true,
    language: "en",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      try {
        const data = await api("/user/settings");

        if (
          active &&
          data.settings
        ) {
          setSettings((current) => ({
            ...current,
            ...data.settings,
          }));
        }
      } catch (error) {
        if (active) {
          setError(
            error?.message || "Unable to load settings."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const toggleSetting = async (key) => {
    const nextValue = !settings[key];

    setSaving(key);
    setError("");

    setSettings((current) => ({
      ...current,
      [key]: nextValue,
    }));

    try {
      const data = await api("/user/settings", {
        method: "PATCH",
        body: JSON.stringify({
          [key]: nextValue,
        }),
      });

      if (data.settings) {
        setSettings((current) => ({
          ...current,
          ...data.settings,
        }));
      }
    } catch (error) {
      setSettings((current) => ({
        ...current,
        [key]: !nextValue,
      }));

      setError(
        error?.message || "Unable to save setting."
      );
    } finally {
      setSaving("");
    }
  };

  if (loading) {
    return (
      <Shell>
        <div className="glass empty">
          Loading settings...
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <section>
        <span className="eyebrow">PREFERENCES</span>

        <h1>Settings</h1>

        {error && <div className="error">{error}</div>}

        <div className="settings glass card">
          {[
            [
              "memoryEnabled",
              "Memory",
              "Control whether saved memories are used.",
            ],
            [
              "autoPlayVoice",
              "Auto-play voice",
              "Automatically play supported AI voice responses.",
            ],
            [
              "enterToSend",
              "Enter to send",
              "Press Enter to send a chat message.",
            ],
          ].map(([key, label, description]) => (
            <button
              className="setting"
              onClick={() => toggleSetting(key)}
              key={key}
              type="button"
              disabled={saving === key}
            >
              <span>
                {label}

                <small>{description}</small>
              </span>

              <span
                className={
                  settings[key]
                    ? "toggle on"
                    : "toggle"
                }
              >
                {saving === key
                  ? "..."
                  : settings[key]
                  ? "ON"
                  : "OFF"}
              </span>
            </button>
          ))}
        </div>
      </section>
    </Shell>
  );
}

/* =========================================================
   APP ROUTES
========================================================= */

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={<Auth />}
      />

      <Route
        path="/register"
        element={<Auth register />}
      />

      {/* Main */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/characters"
        element={<Characters />}
      />

      <Route
        path="/chat/:id"
        element={<ChatPage />}
      />

      <Route
        path="/chats"
        element={
          <SimplePage
            title="Chats"
            icon="💬"
            body="Your conversations will appear here after you start chatting."
          />
        }
      />

      <Route
        path="/gallery"
        element={
          <SimplePage
            title="Gallery"
            icon="🖼️"
            body="Generated images will appear here when an image provider is configured."
          />
        }
      />

      <Route
        path="/settings"
        element={<SettingsPage />}
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <SimplePage
            title="404"
            icon="🧭"
            body="Page not found."
          />
        }
      />
    </Routes>
  );
}
