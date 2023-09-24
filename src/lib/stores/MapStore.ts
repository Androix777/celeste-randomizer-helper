import { v4 as uuidv4 } from 'uuid';
import { writable, get, type Writable } from 'svelte/store';

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
		rooms: [{ id: uuidv4(), holes: [], links: [] }]
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
			})();

			if (room === undefined) {
				throw new Error(`Room is undefined`);
			}

			return room;
		},
		updateRoom: (updatedRoom: RoomData) => {
			update((map) => {
				map.rooms = map.rooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room));
				return map;
			});
		},
		clearMap: () => {
			update(() => {
				return { id: uuidv4(), rooms: [] };
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

export const roomName = writable<string>('');

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
		selectedRoom.set('');
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
