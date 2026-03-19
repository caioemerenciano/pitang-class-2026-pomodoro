import { useState } from "react";

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
    setTasks([
      ...tasks,
      { completed: false, id: crypto.randomUUID(), title: input },

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

  function deleteTask({ id }: Task) {
    setTasks(
      tasks.filter((task) => task.id !== id)
    );
  }

  return (
    <>
      <div>
        <input
          className="p-2 border-1"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />

        <button className="rounded p-2 bg-black" onClick={onSaveTask}>
          Save
        </button>
      </div>

      <ul>
        {tasks.map((task) => {
          return (
            <li
              className={task.completed ? "line-through" : ""}
              key={task.id}
              onClick={() => completeTask(task)}
            >
              {task.title} {String(task.completed)}
            </li>
          );
        })}
      </ul>

      {tasks.length === 0 && (
        <p className="text-white/30 text-center py-8">No tasks yet</p>
      )}
    </div >
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
  const [key, setKey] = useState(0);

  return (
    <div className="bg-slate-900 h-screen w-screen text-white">
      <h1>Tasks</h1>

      <Tasks />
    </div>
  );
}
