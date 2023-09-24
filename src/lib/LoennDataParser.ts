import { parse } from 'lua-json';
import { WallPosition } from './stores/MapStore';

export type MapLoennData = {
	rooms: RoomLoennData[];
};

export type RoomLoennData = {
	name: string;
	solids: string[][];
	bg: string[][];
	height: number;
	width: number;

	wallHoles: Record<WallPosition, number>;
};

export function parseData(data: string) {
	let parsedData: any = parse('return ' + data);
	let newData: MapLoennData = getMapLoennData(parsedData);
	calculateHoles(newData);
	console.log(newData);
}

function getMapLoennData(rawData: any): MapLoennData {
	const rooms = rawData.__children
		?.find((child: any) => child.__name === 'levels')
		.__children.map((level: any) => {
			const rawSolids = level.__children.find((child: any) => child.__name === 'solids').innerText;
			const rawBg = level.__children.find((child: any) => child.__name === 'bg').innerText;

			const width = Math.floor(level.width / 8);
			const height = Math.floor(level.height / 8);

			let solids: string[][] = rawSolids.split('\n').map((row: string) => {
				return row.padEnd(width, '0').split('');
			});

			while (solids.length < height) {
				solids.push(Array(width).fill('0'));
			}

			let bg: string[][] = rawBg.split('\n').map((row: string) => {
				return row.padEnd(width, '0').split('');
			});

			while (bg.length < height) {
				bg.push(Array(width).fill('0'));
			}

			return {
				name: level.name,
				solids: solids,
				bg: bg,
				height: height,
				width: width,
				wallHoles: {}
			};
		});

	return {
		rooms: rooms
	};
}

function calculateHoles(loennData: MapLoennData) {
	loennData.rooms.forEach((room) => {
		const wallHoles: Record<WallPosition, number> = {
			[WallPosition.UP]: 0,
			[WallPosition.DOWN]: 0,
			[WallPosition.LEFT]: 0,
			[WallPosition.RIGHT]: 0
		};

		// Check top and bottom walls
		[room.solids[0], room.solids[room.height - 1]].forEach((wall, index) => {
			let isHole = false;
			wall.forEach((cell) => {
				if (cell === '0') {
					if (!isHole) {
						wallHoles[index === 0 ? WallPosition.UP : WallPosition.DOWN]++;
						isHole = true;
					}
				} else {
					isHole = false;
				}
			});
		});

		// Check left and right walls
		let isHoleLeft = false;
		let isHoleRight = false;
		room.solids.forEach((row) => {
			if (row[0] === '0') {
				if (!isHoleLeft) {
					wallHoles[WallPosition.LEFT]++;
					isHoleLeft = true;
				}
			} else {
				isHoleLeft = false;
			}

			if (row[row.length - 1] === '0') {
				if (!isHoleRight) {
					wallHoles[WallPosition.RIGHT]++;
					isHoleRight = true;
				}
			} else {
				isHoleRight = false;
			}
		});

		room.wallHoles = wallHoles;
	});
}
