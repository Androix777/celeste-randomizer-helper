import { v4 as uuidv4 } from 'uuid';
import { writable } from 'svelte/store';

export enum WallPosition {
	TOP = 'top',
	BOTTOM = 'bottom',
	LEFT = 'left',
	RIGHT = 'right'
}

export enum Dashes {
	ZERO,
	ONE,
	TWO
}

export enum Difficulty {
	EASY,
	NORMAL,
	HARD,
	EXPERT,
	MASTER,
	PERFECT
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

type HolesStoreType = { [id: string]: HoleData };
type LinksStoreType = { [id: string]: LinkData };

const createHolesStore = () => {
	const { subscribe, update } = writable<HolesStoreType>({});

	return {
		subscribe,
		addHole: (hole: Omit<HoleData, 'id'>) => {
			const id = uuidv4();
			update((holes) => ({ ...holes, [id]: { ...hole, id } }));
		},
		removeHole: (id: string) => {
			update((holes) => {
				const { [id]: _, ...rest } = holes;
				return rest;
			});

			selectedHoleStart.update((startId) => (startId === id ? '' : startId));
			selectedHoleFinish.update((finishId) => (finishId === id ? '' : finishId));
			linksStore.removeLinksByHoleId(id);
		},
		updateHole: (updatedHole: HoleData) => {
			update((holes) => ({ ...holes, [updatedHole.id]: updatedHole }));
		}
	};
};

const createLinksStore = () => {
	const { subscribe, update } = writable<LinksStoreType>({});

	return {
		subscribe,
		addLink: (link: Omit<LinkData, 'id'>) => {
			const id = uuidv4();
			update((links) => ({
				...links,
				[id]: { ...link, id }
			}));
		},
		removeLink: (id: string) => {
			update((links) => {
				const { [id]: _, ...rest } = links;
				return rest;
			});
		},

		removeLinksByHoleId: (holeId: string) => {
			update((links) => {
				return Object.values(links).reduce((result, link) => {
					if (link.idStart !== holeId && link.idFinish !== holeId) {
						result[link.id] = link;
					}
					return result;
				}, {} as LinksStoreType);
			});
		}
	};
};

export const selectedHoleStart = writable<string>();
export const selectedHoleFinish = writable<string>();

export const linksStore = createLinksStore();
export const holesStore = createHolesStore();
