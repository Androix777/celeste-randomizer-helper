import { v4 as uuidv4 } from 'uuid';
import { writable, get, type Writable } from 'svelte/store';
import type { MapLoennData } from '$lib/LoennDataParser';

export enum WallPosition {
	UP = 'up',
	DOWN = 'down',
	LEFT = 'left',
	RIGHT = 'right'
}

export enum Dashes {
	ZERO = 'zero',
	ONE = 'one',
	TWO = 'two'
}

export enum Difficulty {
	EASY = 'easy',
	NORMAL = 'normal',
	HARD = 'hard',
	EXPERT = 'expert',
	MASTER = 'master',
	PERFECT = 'perfect'
}

export type HoleData = {
	id: string;
	position: WallPosition;
	name: string;
};

export type LinkData = {
	id: string;
	idStart: string;
	idFinish: string;
	dashes: Dashes;
	difficulty: Difficulty;
};

export type RoomData = {
	id: string;
	name: string;
	isEnabled: boolean;
	solids?: string[][];
	calculatedWallHoles?: Record<WallPosition, number>;
	isImported: boolean;
	holes: HoleData[];
	links: LinkData[];
};

export type MapData = {
	id: string;
	rooms: RoomData[];
};

function createMapStore(defaultRoomIdStore: Writable<string>) {
	const { subscribe, set, update } = writable<MapData>({
		id: uuidv4(),
		rooms: [
			{ id: uuidv4(), name: 'name', isEnabled: true, isImported: false, holes: [], links: [] }
		]
	});

	return {
		subscribe,
		set,
		update,

		addRoom: (room: Omit<RoomData, 'id'>) => {
			const id = uuidv4();
			update((map) => {
				map.rooms.push({ id, ...room });
				return map;
			});
		},
		removeRoom: (id: string = get(defaultRoomIdStore)) => {
			update((map) => {
				map.rooms = map.rooms.filter((room) => room.id !== id);
				if (map.rooms.length == 0) {
					map.rooms = [
						{ id: uuidv4(), name: 'name', isEnabled: true, isImported: false, holes: [], links: [] }
					];
				}
				return map;
			});
		},
		getRoom: (
			roomId: string = get(defaultRoomIdStore),
			mapData: MapData | null = null
		): RoomData => {
			let room: RoomData | undefined;
			subscribe((map) => {
				room = map.rooms.find((r) => r.id === roomId);
				if (room === undefined) {
					if (map.rooms.length == 0) {
						throw new Error(`Room is undefined`);
					} else {
						defaultRoomIdStore.set(map.rooms[0].id);
						room = map.rooms[0];
					}
				}
			})();

			return room!;
		},
		updateRoom: (updatedRoom: RoomData) => {
			update((map) => {
				map.rooms = map.rooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room));
				return map;
			});
		},
		clearMap: () => {
			update(() => {
				return {
					id: uuidv4(),
					rooms: [
						{ id: uuidv4(), name: 'name', isEnabled: true, isImported: false, holes: [], links: [] }
					]
				};
			});
		},
		addHole: (hole: Omit<HoleData, 'id'>, roomId: string = get(defaultRoomIdStore)) => {
			const id = uuidv4();
			update((map) => {
				let room = map.rooms.find((r) => r.id === roomId);
				if (room) {
					room.holes.push({ id, ...hole });
				}
				return map;
			});
		},
		getHole: (
			holeId: string,
			roomId: string = get(defaultRoomIdStore),
			mapData: MapData | null = null
		): HoleData => {
			let hole: HoleData | undefined;
			subscribe((map) => {
				const room = map.rooms.find((r) => r.id === roomId);
				if (room) {
					hole = room.holes.find((h) => h.id === holeId);
				}
			})();

			if (hole === undefined) {
				throw new Error(`Hole is undefined`);
			}

			return hole;
		},
		getHoleID: (
			holeId: string,
			roomId: string = get(defaultRoomIdStore),
			mapData: MapData | null = null
		): number => {
			let holeIndex: number | undefined;
			subscribe((map) => {
				const room = map.rooms.find((r) => r.id === roomId);
				if (room) {
					const holesOnTheWall = room.holes.filter(
						(h) => h.position === room.holes.find((h) => h.id === holeId)?.position
					);
					holeIndex = holesOnTheWall.findIndex((h) => h.id === holeId);
				}
			})();

			if (holeIndex === undefined || holeIndex === -1) {
				throw new Error(`Hole is undefined`);
			}

			return holeIndex;
		},
		getHoleName: (
			holeId: string,
			roomId: string = get(defaultRoomIdStore),
			mapData: MapData | null = null
		): string => {
			let holeName: string | undefined;
			subscribe((map) => {
				const room = map.rooms.find((r) => r.id === roomId);
				if (room) {
					const selectedHole = room.holes.find((h) => h.id === holeId);
					if (selectedHole) {
						const holesOnTheWall = room.holes.filter((h) => h.position === selectedHole.position);
						const holeIndex = holesOnTheWall.findIndex((h) => h.id === holeId);
						holeName = `${selectedHole.position} ${holeIndex}`;
					}
				}
			})();

			if (!holeName) {
				throw new Error(`Hole is undefined`);
			}

			return holeName;
		},
		updateHole: (updatedHole: HoleData, roomId: string = get(defaultRoomIdStore)) => {
			update((map) => {
				let room = map.rooms.find((r) => r.id === roomId);
				if (room) {
					room.holes = room.holes.map((hole) => (hole.id === updatedHole.id ? updatedHole : hole));
				}
				return map;
			});
		},
		removeHole: (holeId: string, roomId: string = get(defaultRoomIdStore)) => {
			update((map) => {
				let room = map.rooms.find((r) => r.id === roomId);
				if (room) {
					room.holes = room.holes.filter((h) => h.id !== holeId);
					room.links = room.links.filter((l) => l.idStart !== holeId && l.idFinish !== holeId);
				}
				return map;
			});
		},
		addLink: (link: Omit<LinkData, 'id'>, roomId: string = get(defaultRoomIdStore)) => {
			const id = uuidv4();
			update((map) => {
				let room = map.rooms.find((r) => r.id === roomId);
				if (room) {
					room.links.push({ id, ...link });
				}
				return map;
			});
		},
		updateLink: (updatedLink: LinkData, roomId: string = get(defaultRoomIdStore)) => {
			update((map) => {
				let room = map.rooms.find((r) => r.id === roomId);
				if (room) {
					room.links = room.links.map((link) => (link.id === updatedLink.id ? updatedLink : link));
				}
				return map;
			});
		},
		removeLink: (linkId: string, roomId: string = get(defaultRoomIdStore)) => {
			update((map) => {
				let room = map.rooms.find((r) => r.id === roomId);
				if (room) {
					room.links = room.links.filter((l) => l.id !== linkId);
				}
				return map;
			});
		},
		getLink: (linkId: string, roomId: string = get(defaultRoomIdStore)): LinkData => {
			let link: LinkData | undefined;
			subscribe((map) => {
				const room = map.rooms.find((r) => r.id === roomId);
				if (room) {
					link = room.links.find((l) => l.id === linkId);
				}
			})();

			if (link === undefined) {
				throw new Error(`Link is undefined`);
			}

			return link;
		},
		clearRoom: (roomId: string = get(defaultRoomIdStore)) => {
			update((map) => {
				let room = map.rooms.find((r) => r.id === roomId);
				if (room) {
					room.holes = [];
					room.links = [];
				}
				return map;
			});
		}
	};
}

export function ImportLoennData(loennData: MapLoennData) {
	const tempRooms: RoomData[] = [];

	loennData.rooms.forEach((roomLoennData, index) => {
		const roomId = uuidv4();

		const roomData: RoomData = {
			id: roomId,
			name: roomLoennData.name,
			isEnabled: true,
			isImported: true,
			calculatedWallHoles: roomLoennData.wallHoles,
			solids: roomLoennData.solids,
			holes: [],
			links: []
		};

		setWallHoles(roomData);

		tempRooms.push(roomData);
	});

	mapStore.update((mapData) => {
		mapData.rooms = tempRooms;
		return mapData;
	});
}

export function setWallHoles(roomData: RoomData) {
	if (!roomData.calculatedWallHoles) return;

	Object.entries(roomData.calculatedWallHoles).forEach(([holePosition, holeCount], holeIndex) => {
		for (let i = 0; i < holeCount; i++) {
			roomData.holes.push({
				id: uuidv4(),
				position: holePosition as WallPosition,
				name: `hole${holeIndex + 1}`
			});
		}
	});
}

export const selectedRoom = writable<string>('');
export const mapStore = createMapStore(selectedRoom);
selectedRoom.set(get(mapStore).rooms[0].id);

export const selectedHoleStart = writable<string>('');
export const selectedHoleFinish = writable<string>('');

const updateHandler = () => updateStores();

mapStore.subscribe(updateStores);
selectedHoleStart.subscribe(updateStores);
selectedHoleFinish.subscribe(updateStores);
selectedRoom.subscribe(updateHandler);

function updateStores() {
	const map = get(mapStore);
	const currentRoomId = get(selectedRoom);
	const currentHoleStartId = get(selectedHoleStart);
	const currentHoleFinishId = get(selectedHoleFinish);

	const currentRoom = map.rooms.find((room) => room.id === currentRoomId);

	if (!currentRoom) {
		selectedRoom.set(map.rooms[0].id);
		selectedHoleStart.set('');
		selectedHoleFinish.set('');
	} else {
		if (!currentRoom.holes.some((hole) => hole.id === currentHoleStartId)) {
			selectedHoleStart.set('');
		}
		if (!currentRoom.holes.some((hole) => hole.id === currentHoleFinishId)) {
			selectedHoleFinish.set('');
		}
	}
}
