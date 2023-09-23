import { v4 as uuidv4 } from 'uuid';
import { writable } from 'svelte/store';

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

type HolesStoreType = HoleData[];
type LinksStoreType = LinkData[];

const createHolesStore = () => {
	const { subscribe, update } = writable<HolesStoreType>([]);

	return {
		subscribe,
		addHole: (hole: Omit<HoleData, 'id'>) => {
			const id = uuidv4();
			update((holes) => [...holes, { id, ...hole }]);
		},
		removeHole: (id: string) => {
			update((holes) => holes.filter((hole) => hole.id !== id));

			selectedHoleStart.update((startId) => (startId === id ? '' : startId));
			selectedHoleFinish.update((finishId) => (finishId === id ? '' : finishId));
			linksStore.removeLinksByHoleId(id);
		},
		updateHole: (updatedHole: HoleData) => {
			update((holes) => holes.map((hole) => (hole.id === updatedHole.id ? updatedHole : hole)));
		},
		getHole: (id: string, holesStore: HolesStoreType | null = null): HoleData => {
			let hole: HoleData | undefined;
			subscribe((holes) => {
				hole = holes.find((h) => h.id === id);
			})();

			if (hole === undefined) {
				throw new Error(`Hole is undefined`);
			}

			return hole;
		}
	};
};

const createLinksStore = () => {
	const { subscribe, update } = writable<LinksStoreType>([]);

	return {
		subscribe,
		addLink: (link: Omit<LinkData, 'id'>) => {
			const id = uuidv4();
			update((links) => [...links, { id, ...link }]);
		},
		removeLink: (id: string) => {
			update((links) => links.filter((link) => link.id !== id));
		},
		removeLinksByHoleId: (holeId: string) => {
			update((links) =>
				links.filter((link) => link.idStart !== holeId && link.idFinish !== holeId)
			);
		},
		getLink: (id: string, linksStore: LinksStoreType | null = null): LinkData => {
			let link: LinkData | undefined;
			subscribe((links) => {
				link = links.find((l) => l.id === id);
			})();

			if (link === undefined) {
				throw new Error(`Link is undefined`);
			}

			return link;
		}
	};
};

export const selectedHoleStart = writable<string>('');
export const selectedHoleFinish = writable<string>('');
export const roomName = writable<string>('');

export const linksStore = createLinksStore();
export const holesStore = createHolesStore();
