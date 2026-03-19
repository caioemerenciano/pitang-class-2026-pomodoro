import { useState, useCallback, useEffect } from "react";

type Task = {
  completed: boolean;
  id: string;
  title: string;
};

type TimerMode = "work" | "break" | "longBreak";

const TIMER_CONFIG = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

const modeLabel = {
  work: "Focus",
  break: "Short Break",
  longBreak: "Long Break",
};

const modeColors = {
  work: "text-red-400",
  break: "text-green-400",
  longBreak: "text-blue-400",
};

function Timer({ onComplete }: { onComplete: () => void }) {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(TIMER_CONFIG.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_CONFIG[newMode]);
    setIsRunning(false);
  }, []);

  const handleComplete = useCallback(() => {
    onComplete();
    if (mode === "work") {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      if (newSessions % 4 === 0) {
        switchMode("longBreak");
      } else {
        switchMode("break");
      }
    } else {
      switchMode("work");
    }
  }, [mode, sessions, switchMode, onComplete]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, handleComplete]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_CONFIG[mode]);
  };

  return (
    <div className="flex flex-col items-center py-8">
      <div className="flex gap-2 mb-6">
        {(["work", "break", "longBreak"] as TimerMode[]).map((m) => (
          <button
            key={m}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${mode === m
              ? "bg-white/20 text-white"
              : "text-white/50 hover:text-white/70"
              }`}
            onClick={() => switchMode(m)}
          >
            {modeLabel[m]}
          </button>
        ))}
      </div>

      <div
        className={`text-8xl font-light tabular-nums mb-6 ${modeColors[mode]}`}
      >
        {formatTime(timeLeft)}
      </div>

      <div className="flex gap-3">
        <button
          className="px-8 py-3 bg-white text-slate-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
          onClick={toggleTimer}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          className="px-6 py-3 border border-white/30 rounded-full font-medium hover:bg-white/10 transition-colors"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>

      <p className="text-white/40 text-sm mt-4">Session {sessions + 1}</p>
    </div>
  );
}

function Tasks() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  function onSaveTask() {
    if (!input.trim()) return;
    setTasks([
      ...tasks,
      { completed: false, id: crypto.randomUUID(), title: input.trim() },
    ]);
    setInput("");
  }

  function completeTask({ id }: Task) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask({ id }: Task) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  return (
    <>
      <div className="flex gap-3 w-full mb-6">
        <input
          className="flex-1 p-4 rounded-xl bg-slate-800 text-slate-100 border border-slate-700 focus:outline-none focus:border-slate-500 shadow-inner transition-all text-lg placeholder:text-slate-500"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSaveTask();
            }
          }}
          placeholder="Digite suas tasks..."
        />

        <button
          className="rounded-xl px-8 py-4 bg-white text-slate-900 font-bold hover:bg-slate-200 transition-colors shadow-sm text-lg"
          onClick={onSaveTask}
        >
          Add
        </button>
      </div>

      <ul className="flex flex-col gap-3 w-full">
        {tasks.map((task) => {
          return (
            <li
              className={`group flex items-center justify-between p-4 bg-slate-800 rounded-xl cursor-pointer transition-all hover:bg-slate-700 border border-slate-700/50 shadow-sm ${task.completed ? "opacity-60 bg-slate-800/50" : ""
                }`}
              key={task.id}
              onClick={() => completeTask(task)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? "bg-green-500 border-green-500" : "border-slate-500 group-hover:border-white"
                  }`}>
                  {task.completed && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  )}
                </div>
                <span className={`text-lg transition-all ${task.completed ? "line-through text-slate-500" : "text-slate-200"
                  }`}>
                  {task.title}
                </span>
              </div>

              <button
                className="text-slate-500 hover:text-red-400 p-2 transition-all opacity-0 group-hover:opacity-100 rounded-lg hover:bg-slate-600/50"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task);
                }}
                aria-label="Delete task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </li>
          );
        })}
      </ul>

      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="m9 15 2 2 4-4" /></svg>
          <p className="text-lg">Sem tasks.</p>
        </div>
      )}
    </>
  );
}

function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => window.clearInterval(interval);
  }, [isActive, timeLeft]);

  function toggleTimer() {
    setIsActive(!isActive);
  }

  function resetTimer() {
    setIsActive(false);
    setTimeLeft(25 * 60);
  }

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center mb-8 bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
      <div className="text-7xl font-bold font-mono text-slate-100 tracking-wider mb-6">
        {minutes}:{seconds}
      </div>
      <div className="flex gap-4 w-full">
        <button
          className={`flex-1 rounded p-3 font-bold text-lg transition-colors cursor-pointer ${isActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white hover:bg-slate-200 text-black'}`}
          onClick={toggleTimer}
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          className="rounded p-3 bg-slate-700 text-white font-bold text-lg hover:bg-slate-600 transition-colors cursor-pointer px-6"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default function Pomodoro() {
  return (
    <div className="bg-slate-900 min-h-screen w-screen text-white flex flex-col items-center p-8 gap-12 overflow-y-auto">
      <div className="w-full flex justify-center mt-8">
        <PomodoroTimer />
      </div>

      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8">Tasks</h1>
        <div className="w-full max-w-sm">
          <Tasks />
        </div>
      </div>
    </div>
  );
}
