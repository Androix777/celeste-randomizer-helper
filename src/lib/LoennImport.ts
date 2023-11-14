import { parse } from 'lua-json';
import { ImportLoennData, WallPosition, CollectableType } from './stores/MapStore';

export type MapLoennData = {
	rooms: RoomLoennData[];
};

export type RoomLoennData = {
	name: string;
	solids: string[][];
	bg: string[][];
	collectables: CollectableLoennData[];
	spawns: SpawnLoennData[];
	finishes: FinishLoennData[];
	errorObjects: ErrorObjectLoennData[];
	realHeight: number;
	realWidth: number;
	height: number;
	width: number;
	wallHoles: Record<WallPosition, number>;
};

export type CollectableLoennData = {
	loennID: number;
	index: number;
	collectableType: CollectableType;
	x: number;
	y: number;
};

export type SpawnLoennData = {
	loennID: number;
	index: number;
	isFirst: boolean;
	x: number;
	y: number;
};

export type FinishLoennData = {
	loennID: number;
	x: number;
	y: number;
};

export type ErrorObjectLoennData = {
	loennID: number;
	name: string;
	x: number;
	y: number;
};

export function importLoenn(data: string) {
	if (data == '') return;
	let parsedData: any = parse('return ' + data);
	let newData: MapLoennData = getMapLoennData(parsedData);
	calculateHoles(newData);
	ImportLoennData(newData);
}

function getMapLoennData(rawData: any): MapLoennData {
	const rooms = rawData.__children
		?.find((child: any) => child.__name === 'levels')
		.__children.map((level: any) => {
			const rawSolids = level.__children.find((child: any) => child.__name === 'solids').innerText;
			const rawBg = level.__children.find((child: any) => child.__name === 'bg').innerText;
			const rawEntities = level.__children.find(
				(child: any) => child.__name === 'entities'
			)?.__children;

			const width = Math.floor(level.width / 8);
			const height = Math.floor(level.height / 8);

			//solids
			let solids: string[][] = rawSolids.split('\n').map((row: string) => {
				return row.padEnd(width, '0').split('');
			});

			while (solids.length < height) {
				solids.push(Array(width).fill('0'));
			}

			//bg
			let bg: string[][] = rawBg.split('\n').map((row: string) => {
				return row.padEnd(width, '0').split('');
			});

			while (bg.length < height) {
				bg.push(Array(width).fill('0'));
			}

			//entities
			let collectables: CollectableLoennData[] = [];
			let spawns: SpawnLoennData[] = [];
			let finishes: FinishLoennData[] = [];
			let errorObjects: ErrorObjectLoennData[] = [];

			if (rawEntities != undefined) {
				let isFirst = true;
				rawEntities.forEach((entity: any) => {
					if (['key', 'strawberry'].includes(entity.__name)) {
						const newCollectable: CollectableLoennData = {
							loennID: entity.id,
							index: 0,
							collectableType:
								entity.__name == 'key' ? CollectableType.KEY : CollectableType.STRAWBERRY,
							x: entity.x,
							y: entity.y
						};
						collectables.push(newCollectable);
					}

					if (['player'].includes(entity.__name)) {
						const newSpawn: SpawnLoennData = {
							loennID: entity.id,
							index: 0,
							isFirst: isFirst,
							x: entity.x,
							y: entity.y
						};
						isFirst = false;
						spawns.push(newSpawn);
					}

					if (['blackGem'].includes(entity.__name)) {
						const newFinish: FinishLoennData = {
							loennID: entity.id,
							x: entity.x,
							y: entity.y
						};
						finishes.push(newFinish);
					}

					if (['MaxHelpingHand/FlagTouchSwitch'].includes(entity.__name)) {
						const newErrorObject: ErrorObjectLoennData = {
							loennID: entity.id,
							name: entity.name,
							x: entity.x,
							y: entity.y
						};
						errorObjects.push(newErrorObject);
					}
				});
			}

			if (collectables.length > 0) {
				collectables.sort((a, b) => {
					if (a.y === b.y) {
						return a.x - b.x;
					} else {
						return a.y - b.y;
					}
				});
				collectables.forEach((collectable, index) => {
					collectable.index = index;
				});
			}

			if (spawns.length > 0) {
				spawns.sort((a, b) => {
					if (a.y === b.y) {
						return a.x - b.x;
					} else {
						return a.y - b.y;
					}
				});
				spawns.forEach((spawn, index) => {
					spawn.index = index;
				});
			}

			const newRoomLoennData: RoomLoennData = {
				name: level.name,
				solids: solids,
				bg: bg,
				collectables: collectables,
				spawns: spawns,
				finishes: finishes,
				errorObjects: errorObjects,
				realHeight: level.height,
				realWidth: level.width,
				height: height,
				width: width,
				wallHoles: {
					[WallPosition.UP]: 0,
					[WallPosition.DOWN]: 0,
					[WallPosition.LEFT]: 0,
					[WallPosition.RIGHT]: 0
				}
			};

			return newRoomLoennData;
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
