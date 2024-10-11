import "./App.css"
import { useKonamiCode, useStopwatch } from "./hooks"

function App() {
  const {
    hours,
    minutes,
    seconds,
    milliseconds,
    isRunning,
    toggleTime,
    resetTime,
  } = useStopwatch()
  const { active, swipeKey, reset } = useKonamiCode()

  return (
    <>
      <h1
        style={{
          borderBottom: "3px solid #ccc",
          paddingBottom: "1rem",
          marginBottom: "1rem",
        }}
      >
        Hooks Library
      </h1>
      {/* Test Hooks Here */}
      <div id="stopwatch">
        <h2 style={{ fontSize: "1.5rem" }}>Hello Stopwatch Hook</h2>
        <p className="stopwatch-time">
          {hours}:{minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}:
          {milliseconds.toString().padStart(2, "0")}
        </p>
        <div className="stopwatch-buttons">
          <button className="stopwatch-button" onClick={toggleTime}>
            {isRunning ? "Stop" : "Start"}
          </button>
          <button className="stopwatch-button" onClick={() => resetTime(false)}>
            Reset
          </button>
          <button className="stopwatch-button" onClick={() => resetTime(true)}>
            Full Reset
          </button>
        </div>
      </div>

      <hr style={{ margin: "1.5rem 0" }} />

      <div id="konami-code">
        <h2 style={{ fontSize: "1.5rem" }}>Konami Code Hook</h2>
        <p>{swipeKey.join(", ")}</p>
        {active && <p>Konami code activated!</p>}
        <button onClick={reset}>Reset</button>
      </div>
    </>
  )
}

export default App
