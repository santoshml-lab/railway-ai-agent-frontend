import { useState } from "react";
import {
  ArrowUp,
  Brain,
  CalendarDays,
  ChevronDown,
  Loader2,
  MapPin,
  MessageSquare,
  Search,
  Sparkles,
  TrainFront,
  Users,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https:https://railway-reservation-agent.onrender.com";

function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  const [goal, setGoal] = useState("");
  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState([]);

  const searchTrains = async () => {
    if (!from.trim() || !to.trim() || !date) {
      setAnswer("Please enter From, To and Journey Date.");
      return;
    }

    const request = `Find trains from ${from} to ${to} on ${date} for ${passengers} passenger${
      passengers > 1 ? "s" : ""
    }.`;

    await runAgent(request);
  };

  const runAgent = async (customGoal = null) => {
    const finalGoal = (customGoal || goal).trim();

    if (!finalGoal) return;

    setLoading(true);
    setAnswer("");

    setActivity([
      {
        icon: "brain",
        text: "Understanding your journey...",
      },
      {
        icon: "search",
        text: "Selecting the appropriate railway tool...",
      },
      {
        icon: "sparkle",
        text: "Agent is processing your request...",
      },
    ]);

    try {
      const response = await fetch(`${API_URL}/agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal: finalGoal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Request failed"
        );
      }

      setActivity([
        {
          icon: "brain",
          text: "Journey understood",
        },
        {
          icon: "search",
          text: "Tool execution completed",
        },
        {
          icon: "check",
          text: "Response generated",
        },
      ]);

      setAnswer(
        data.result || "No response received."
      );
    } catch (error) {
      setActivity([
        {
          icon: "brain",
          text: "Agent request failed",
        },
      ]);

      setAnswer(
        `Error: ${error.message}`
      );
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
      runAgent();
    }
  };

  const ActivityIcon = ({ type }) => {
    if (type === "brain") {
      return <Brain size={15} />;
    }

    if (type === "search") {
      return <Search size={15} />;
    }

    if (type === "check") {
      return <span>✓</span>;
    }

    return <Sparkles size={15} />;
  };

  return (
    <div className="app">
      <div className="orb orb-one" />
      <div className="orb orb-two" />

      {/* NAVBAR */}

      <header className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <TrainFront size={19} />
          </div>

          <span>Railway AI</span>
        </div>

        <div className="online">
          <span />
          AI Online
        </div>
      </header>

      {/* MAIN */}

      <main className="container">

        {/* HERO */}

        <section className="hero">

          <div className="eyebrow">
            <Sparkles size={15} />
            Intelligent Railway Assistant
          </div>

          <h1>
            Your journey.
            <br />
            <span>Handled by AI.</span>
          </h1>

          <p>
            Search trains, check availability,
            understand fares and plan your journey
            with an intelligent AI agent.
          </p>

        </section>

        {/* SEARCH CARD */}

        <section className="search-card">

          <div className="card-top">

            <div>
              <h2>Plan your journey</h2>

              <p>
                Enter your travel details
              </p>
            </div>

            <div className="train-badge">
              <TrainFront size={18} />
            </div>

          </div>

          <div className="journey-grid">

            {/* FROM */}

            <div className="field">

              <label>
                <MapPin size={14} />
                From
              </label>

              <input
                value={from}
                onChange={(e) =>
                  setFrom(e.target.value)
                }
                placeholder="Departure city"
              />

            </div>

            {/* TO */}

            <div className="field">

              <label>
                <MapPin size={14} />
                To
              </label>

              <input
                value={to}
                onChange={(e) =>
                  setTo(e.target.value)
                }
                placeholder="Destination city"
              />

            </div>

            {/* DATE */}

            <div className="field">

              <label>
                <CalendarDays size={14} />
                Journey date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
              />

            </div>

            {/* PASSENGERS */}

            <div className="field">

              <label>
                <Users size={14} />
                Passengers
              </label>

              <div className="select-wrapper">

                <select
                  value={passengers}
                  onChange={(e) =>
                    setPassengers(
                      Number(e.target.value)
                    )
                  }
                >
                  <option value={1}>1 passenger</option>
                  <option value={2}>2 passengers</option>
                  <option value={3}>3 passengers</option>
                  <option value={4}>4 passengers</option>
                  <option value={5}>5 passengers</option>
                  <option value={6}>6 passengers</option>
                </select>

                <ChevronDown size={15} />

              </div>

            </div>

          </div>

          <button
            className="primary-button"
            onClick={searchTrains}
            disabled={loading}
          >

            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="spin"
                />

                Searching...
              </>
            ) : (
              <>
                <Search size={18} />

                Search with AI
              </>
            )}

          </button>

        </section>

        {/* AI CHAT */}

        <section className="chat-card">

          <div className="chat-header">

            <div className="chat-title">

              <div className="ai-icon">
                <Sparkles size={17} />
              </div>

              <div>
                <strong>
                  Ask Railway AI
                </strong>

                <span>
                  Natural language search
                </span>
              </div>

            </div>

            <MessageSquare size={18} />

          </div>

          <div className="chat-input">

            <textarea
              value={goal}
              onChange={(e) =>
                setGoal(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder='Try: "Find the fastest train from Patna to Delhi tomorrow"'
              rows={3}
            />

            <button
              onClick={() => runAgent()}
              disabled={
                loading || !goal.trim()
              }
            >

              {loading ? (
                <Loader2
                  size={18}
                  className="spin"
                />
              ) : (
                <ArrowUp size={18} />
              )}

            </button>

          </div>

        </section>

        {/* ACTIVITY */}

        {activity.length > 0 && (
          <section className="activity-card">

            <div className="activity-header">

              <div className="activity-title">

                <div className="activity-icon">
                  <Brain size={16} />
                </div>

                <div>
                  <strong>
                    Agent Activity
                  </strong>

                  <span>
                    {loading
                      ? "Working..."
                      : "Completed"}
                  </span>
                </div>

              </div>

              {loading && (
                <Loader2
                  size={17}
                  className="spin"
                />
              )}

            </div>

            <div className="activity-list">

              {activity.map(
                (item, index) => (
                  <div
                    className="activity-item"
                    key={index}
                  >

                    <div className="activity-check">
                      <ActivityIcon
                        type={item.icon}
                      />
                    </div>

                    <span>
                      {item.text}
                    </span>

                  </div>
                )
              )}

            </div>

          </section>
        )}

        {/* ANSWER */}

        {answer && (
          <section className="answer-card">

            <div className="answer-header">

              <div className="answer-agent">

                <div className="ai-icon">
                  <Sparkles size={16} />
                </div>

                <div>
                  <strong>
                    Railway AI
                  </strong>

                  <span>
                    Agent response
                  </span>
                </div>

              </div>

            </div>

            <div className="answer-content">
              {answer}
            </div>

          </section>
        )}

        {/* INFO */}

        <div className="info-row">

          <div>
            <TrainFront size={17} />
            <span>Smart train search</span>
          </div>

          <div>
            <Brain size={17} />
            <span>AI-powered decisions</span>
          </div>

          <div>
            <Sparkles size={17} />
            <span>Natural language</span>
          </div>

        </div>

      </main>

      <footer>
        Railway AI · Powered by Groq
      </footer>

    </div>
  );
}

export default App;
