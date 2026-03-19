import { useState, useEffect } from "react";

type Task = {
  completed: boolean;
  id: string;
  title: string;
};

function Tasks() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  function onSaveTask() {
    if (input === "") {
      return;
    }

    setTasks([
      ...tasks,
      { completed: false, id: crypto.randomUUID(), title: input },

    ]);

    setInput("");
  }

  function completeTask({ id }: Task) {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
          };
        }

        return task;
      }),
    );
  }

  function deleteTask({ id }: Task) {
    setTasks(
      tasks.filter((task) => task.id !== id)
    );
  }

  return (
    <>
      <div className="flex gap-2 mb-6">
        <input
          className="p-2 border-1 rounded text-black bg-white focus:outline-none"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSaveTask();
            }
          }}
          placeholder="Enter a task..."
        />

        <button
          className="rounded p-2 px-3 py-2 bg-white text-black font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
          onClick={onSaveTask}
        >
          Save
        </button>
      </div>

      <ul className="flex flex-col gap-2 w-full max-w-sm">
        {tasks.map((task) => {
          return (
            <li
              className={`flex justify-between items-center p-3 bg-slate-800 rounded cursor-pointer transition-colors hover:bg-slate-700  ${task.completed ? "line-through text-slate-400" : ""}`}
              key={task.id}
              onClick={() => completeTask(task)}
            >
              {task.title}
              <button
                className="text-slate-400 hover:text-red-500 transition-colors"
                onClick={(event) => {
                  event.stopPropagation();
                  deleteTask(task);
                }
                }
              >
                X
              </button>
            </li>
          );
        })}
      </ul>
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
    <div className="bg-slate-900 min-h-screen w-screen text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold mb-8 text-white">Pomodoro Focus</h1>
      
      <PomodoroTimer />
      
      <div className="w-full max-w-sm mb-4">
        <h2 className="text-2xl font-bold text-slate-300">Tasks</h2>
      </div>
      <Tasks />
    </div>
  );
}
