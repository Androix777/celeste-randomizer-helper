import type { SocketType } from 'leader-line-new';
import { Dashes, Difficulty, WallPosition } from './stores/MapStore';

export const dashes = [
	{ value: Dashes.ZERO, name: 'Zero' },
	{ value: Dashes.ONE, name: 'One' },
	{ value: Dashes.TWO, name: 'Two' }
];

export const difficulties = [
	{ value: Difficulty.EASY, name: 'Easy' },
	{ value: Difficulty.NORMAL, name: 'Normal' },
	{ value: Difficulty.HARD, name: 'Hard' },
	{ value: Difficulty.EXPERT, name: 'Expert' },
	{ value: Difficulty.MASTER, name: 'Master' },
	{ value: Difficulty.PERFECT, name: 'Perfect' }
];

export const socketMap = {
	[WallPosition.DOWN]: 'top' as SocketType,
	[WallPosition.UP]: 'bottom' as SocketType,
	[WallPosition.LEFT]: 'right' as SocketType,
	[WallPosition.RIGHT]: 'left' as SocketType
};

export const invertedWall = {
	[WallPosition.DOWN]: WallPosition.UP,
	[WallPosition.UP]: WallPosition.DOWN,
	[WallPosition.LEFT]: WallPosition.RIGHT,
	[WallPosition.RIGHT]: WallPosition.LEFT
};

export const difficultyColorMap = {
	[Difficulty.EASY]: 'green',
	[Difficulty.NORMAL]: 'yellow',
	[Difficulty.HARD]: 'orange',
	[Difficulty.EXPERT]: 'red',
	[Difficulty.MASTER]: 'purple',
	[Difficulty.PERFECT]: 'black'
};

export const dashColorMap = {
	[Dashes.ZERO]: 'blue',
	[Dashes.ONE]: 'red',
	[Dashes.TWO]: 'pink'
};
