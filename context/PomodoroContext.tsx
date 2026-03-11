import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SessionType = "focus" | "shortBreak" | "longBreak";

export interface PomodoroSettings {
	title: string;
	focusDuration: number; // seconds
	shortBreakDuration: number; // seconds
	longBreakDuration: number; // seconds
	sessionsBeforeLongBreak: number;
}

interface SessionEntry {
	type: SessionType;
	duration: number;
	label: string;
}

interface PomodoroState {
	settings: PomodoroSettings;
	running: boolean;
	elapsed: number;
	sessionIndex: number;
	queue: SessionEntry[];
	currentSession: SessionEntry;
	nextSession: SessionEntry | null;
	sessionCurrent: number;
	sessionTotal: number;
	// actions
	play: () => void;
	pause: () => void;
	restart: () => void;
	skip: () => void;
	onComplete: () => void;
	updateSettings: (patch: Partial<PomodoroSettings>) => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: PomodoroSettings = {
	title: "Physical Science",
	focusDuration: 25 * 60,
	shortBreakDuration: 5 * 60,
	longBreakDuration: 15 * 60,
	sessionsBeforeLongBreak: 4,
};

function buildQueue(settings: PomodoroSettings): SessionEntry[] {
	const queue: SessionEntry[] = [];
	for (let i = 0; i < settings.sessionsBeforeLongBreak; i++) {
		queue.push({
			type: "focus",
			duration: settings.focusDuration,
			label: settings.title,
		});
		if (i < settings.sessionsBeforeLongBreak - 1) {
			queue.push({
				type: "shortBreak",
				duration: settings.shortBreakDuration,
				label: "Short Break",
			});
		}
	}
	queue.push({
		type: "longBreak",
		duration: settings.longBreakDuration,
		label: "Long Break",
	});
	return queue;
}

function focusSessionNumber(queue: SessionEntry[], index: number): number {
	let count = 0;
	for (let i = 0; i <= index; i++) {
		if (queue[i].type === "focus") count++;
	}
	return count;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const PomodoroContext = createContext<PomodoroState | null>(null);

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
	const [running, setRunning] = useState(false);
	const [elapsed, setElapsed] = useState(0);
	const [sessionIndex, setSessionIndex] = useState(0);

	const queue = buildQueue(settings);
	const currentSession = queue[sessionIndex] ?? queue[0];
	const nextSession = queue[sessionIndex + 1] ?? null;
	const sessionTotal = settings.sessionsBeforeLongBreak;
	const sessionCurrent =
		currentSession.type === "focus"
			? focusSessionNumber(queue, sessionIndex)
			: focusSessionNumber(queue, sessionIndex - 1);

	// ─── Tick ────────────────────────────────────────────────────────────────
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		if (running) {
			intervalRef.current = setInterval(() => {
				setElapsed((e) => e + 1);
			}, 1000);
		} else {
			if (intervalRef.current) clearInterval(intervalRef.current);
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [running]);

	// ─── Actions ─────────────────────────────────────────────────────────────
	const play = useCallback(() => setRunning(true), []);
	const pause = useCallback(() => setRunning(false), []);

	const restart = useCallback(() => {
		setRunning(false);
		setElapsed(0);
	}, []);

	const advanceSession = useCallback(() => {
		setRunning(false);
		setElapsed(0);
		setSessionIndex((i) => (i + 1 < queue.length ? i + 1 : 0));
	}, [queue.length]);

	const skip = advanceSession;
	const onComplete = advanceSession;

	// Applying new settings resets the timer and queue from the top
	const updateSettings = useCallback((patch: Partial<PomodoroSettings>) => {
		setSettings((prev) => ({ ...prev, ...patch }));
		setRunning(false);
		setElapsed(0);
		setSessionIndex(0);
	}, []);

	return (
		<PomodoroContext.Provider
			value={{
				settings,
				running,
				elapsed,
				sessionIndex,
				queue,
				currentSession,
				nextSession,
				sessionCurrent,
				sessionTotal,
				play,
				pause,
				restart,
				skip,
				onComplete,
				updateSettings,
			}}
		>
			{children}
		</PomodoroContext.Provider>
	);
}

export function usePomodoro(): PomodoroState {
	const ctx = useContext(PomodoroContext);
	if (!ctx) throw new Error("usePomodoro must be used within PomodoroProvider");
	return ctx;
}
