import { v4 as uuidv4 } from 'uuid';
import { writable, get, type Writable, type Updater } from 'svelte/store';
import type { MapLoennData, RoomLoennData } from '$lib/LoennImport';

export enum WallPosition {
	UP = 'up',
	DOWN = 'down',
	LEFT = 'left',
	RIGHT = 'right'
}

export enum CollectableType {
	STRAWBERRY = 'strawberry',
	KEY = 'key'
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
	index: number;
	name: string;
};

export type CollectableData = {
	id: string;
	loennID: number;
	collectableType: CollectableType;
	links: CollectableLinkData[];
};

export type CollectableLinkData = {
	holeID: string;
	dashesIn: Dashes;
	difficultyIn: Difficulty;
	isOnlyIn: boolean;
	dashesOut: Dashes;
	difficultyOut: Difficulty;
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
	holes: HoleData[];
	links: LinkData[];
	collectables: CollectableData[];
	loennData?: RoomLoennData;
};

export type MapData = {
	id: string;
	rooms: RoomData[];
};

function createMapStore(defaultRoomIdStore: Writable<string>) {
	const { subscribe, set, update } = writable<MapData>({
		id: uuidv4(),
		rooms: [
			{ id: uuidv4(), name: 'new-room', isEnabled: true, holes: [], links: [], collectables: [] }
		]
	});

	return {
		subscribe,
		set,
		update: (updater: Updater<MapData>) => {
			return update((state) => {
				const newState = typeof updater === 'function' ? updater(state) : updater;

				recalculateHolesIndexesForMap(newState);

				return newState;
			});
		},

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
						{
							id: uuidv4(),
							name: 'new-room',
							isEnabled: true,
							holes: [],
							links: [],
							collectables: []
						}
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
						{
							id: uuidv4(),
							name: 'name',
							isEnabled: true,
							isImported: false,
							holes: [],
							links: [],
							collectables: []
						}
					]
				};
			});
		},
		addHole: (hole: Omit<HoleData, 'id' | 'index'>, roomId: string = get(defaultRoomIdStore)) => {
			const id = uuidv4();
			update((map) => {
				let room = map.rooms.find((r) => r.id === roomId);
				if (room) {
					room.holes.push({ id, index: 0, ...hole });
					recalculateHolesIndexesForRoom(room);
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

					room.collectables.forEach((collectable) => {
						collectable.links = collectable.links.filter((link) => link.holeID !== holeId);
					});

					recalculateHolesIndexesForRoom(room);
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
		addCollectable: (
			collectable: Omit<CollectableData, 'id'>,
			roomId: string = get(defaultRoomIdStore)
		) => {
			const id = uuidv4();
			update((map) => {
				let room = map.rooms.find((r) => r.id === roomId);
				if (room) {
					room.collectables.push({ id, ...collectable });
				}
				return map;
			});
		},
		updateCollectable: (
			updatedCollectable: CollectableData,
			roomId: string = get(defaultRoomIdStore)
		) => {
			update((map) => {
				let room = map.rooms.find((r) => r.id === roomId);
				if (room) {
					room.collectables = room.collectables.map((collectable) =>
						collectable.id === updatedCollectable.id ? updatedCollectable : collectable
					);
				}
				return map;
			});
		},
		removeCollectable: (collectableId: string, roomId: string = get(defaultRoomIdStore)) => {
			update((map) => {
				let room = map.rooms.find((r) => r.id === roomId);
				if (room) {
					room.collectables = room.collectables.filter(
						(collectable) => collectable.id !== collectableId
					);
				}
				return map;
			});
		},
		clearCollectables: (roomId: string = get(defaultRoomIdStore)) => {
			update((map) => {
				let room = map.rooms.find((r) => r.id === roomId);
				if (room) {
					room.collectables = [];
				}
				return map;
			});
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

export function recalculateHolesIndexesForRoom(roomData: RoomData): void {
	const wallIndexCounters: Record<WallPosition, number> = {
		[WallPosition.UP]: -1,
		[WallPosition.DOWN]: -1,
		[WallPosition.LEFT]: -1,
		[WallPosition.RIGHT]: -1
	};

	roomData.holes.forEach((hole) => {
		hole.index = ++wallIndexCounters[hole.position];
	});
}

export function recalculateHolesIndexesForMap(mapData: MapData): void {
	mapData.rooms.forEach((room) => {
		recalculateHolesIndexesForRoom(room);
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

//Import

export function ImportLoennData(loennData: MapLoennData) {
	const tempRooms: RoomData[] = [];

	loennData.rooms.forEach((roomLoennData, index) => {
		const roomId = uuidv4();

		const roomData: RoomData = {
			id: roomId,
			name: roomLoennData.name,
			isEnabled: true,
			holes: [],
			links: [],
			collectables: [],
			loennData: roomLoennData
		};

		setWallHolesFromLoennData(roomData);
		setCollectablesFromLoennData(roomData);

		recalculateHolesIndexesForRoom(roomData);

		tempRooms.push(roomData);
	});

	mapStore.update((mapData) => {
		mapData.rooms = tempRooms;
		return mapData;
	});
}

export function setWallHolesFromLoennData(roomData: RoomData) {
	if (!roomData.loennData) return;

	Object.entries(roomData.loennData.wallHoles).forEach(([holePosition, holeCount], holeIndex) => {
		for (let i = 0; i < holeCount; i++) {
			roomData.holes.push({
				id: uuidv4(),
				index: 0,
				position: holePosition as WallPosition,
				name: `hole${holeIndex + 1}`
			});
		}
	});
}

export function setCollectablesFromLoennData(roomData: RoomData) {
	if (!roomData.loennData) return;

	roomData.loennData.collectables.forEach((collectable) => {
		roomData.collectables.push({
			id: uuidv4(),
			loennID: collectable.loennID,
			collectableType: collectable.collectableType,
			links: []
		});
	});
}
