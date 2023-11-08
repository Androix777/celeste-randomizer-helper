import {
	CollectableType,
	type CollectableData,
	type CollectableLinkData,
	type Dashes,
	type Difficulty,
	type HoleData,
	type LinkData,
	type MapData,
	type RoomData
} from './stores/MapStore';
import { parseDocument, stringify } from 'yaml';

function getHoles(room: RoomData) {
	const holes = room.holes;

	const holeDict: Record<string, HoleData> = holes.reduce((acc: Record<string, HoleData>, hole) => {
		acc[hole.id] = hole;
		return acc;
	}, {});

	return holeDict;
}

function getKind(links: LinkData[], collectableLinks: CollectableLinkData[], holeId: string) {
	const linksForHole = links.filter((link) => link.idStart === holeId || link.idFinish === holeId);
	const collectableLinksForHole = collectableLinks.filter((link) => link.holeID === holeId);
	const isFinish =
		linksForHole.some((link) => link.idFinish === holeId) ||
		collectableLinksForHole.some((link) => !link.isIn);
	const isStart =
		linksForHole.some((link) => link.idStart === holeId) ||
		collectableLinksForHole.some((link) => link.isIn);

	if (isFinish && isStart) return 'inout';
	if (isFinish) return 'out';
	if (isStart) return 'in';
	return 'none';
}

function getRoomId(hole: HoleData) {
	return `"${hole.position}_${hole.index}"`;
}

function getCollectableRoomId(collectable: CollectableData) {
	return `"${collectable.collectableType}_${collectable.index}"`;
}

function getInternalEdges(links: LinkData[], hole: HoleData, holes: Record<string, HoleData>) {
	const linksForHole = links.filter((link) => link.idStart === hole.id);

	if (linksForHole.length === 0) return null;

	const groupedLinks = linksForHole.reduce((acc: any, link) => {
		const otherHole = holes[link.idFinish];
		const otherRoomId = getRoomId(otherHole);

		if (!acc[otherRoomId]) {
			acc[otherRoomId] = {
				To: otherRoomId,
				ReqOut: { Difficulty: 'easy', Or: [] },
				ReqIn: { Difficulty: 'easy', Or: [] }
			};
		}

		acc[otherRoomId].ReqOut.Or.push({
			Dashes: link.dashes,
			Difficulty: link.difficulty
		});

		return acc;
	}, {});

	return Object.values(groupedLinks).map((edge: any) => {
		if (edge.ReqOut.Or.length === 0) delete edge.ReqOut;
		if (edge.ReqIn.Or.length === 0) delete edge.ReqIn;
		return edge;
	});
}

function getCollectableInternalEdges(
	links: CollectableLinkData[],
	collectable: CollectableData,
	holes: Record<string, HoleData>
) {
	const linksForCollectable = links.filter((link) => link.collectableID === collectable.id);

	const linksGroupedByRoom = linksForCollectable.reduce((groupedLinks, link) => {
		const hole = holes[link.holeID];
		const roomId = getRoomId(hole);
		if (!groupedLinks[roomId]) {
			groupedLinks[roomId] = [];
		}
		groupedLinks[roomId].push(link);
		return groupedLinks;
	}, {} as Record<string, CollectableLinkData[]>);

	const internalEdges = Object.entries(linksGroupedByRoom).map(([roomId, links]) => {
		const edge: {
			To: string;
			ReqIn?: {
				Difficulty: string;
				Or: { Dashes: Dashes; Difficulty: Difficulty }[];
			};
			ReqOut?: {
				Difficulty: string;
				Or: { Dashes: Dashes; Difficulty: Difficulty }[];
			};
		} = {
			To: roomId,
			ReqIn: { Difficulty: 'easy', Or: [] },
			ReqOut: { Difficulty: 'easy', Or: [] }
		};

		links.forEach((link) => {
			const request = {
				Dashes: link.dashes,
				Difficulty: link.difficulty
			};
			if (link.isIn) {
				edge.ReqIn!.Or.push(request);
			} else {
				edge.ReqOut!.Or.push(request);
			}
		});

		if (edge.ReqIn!.Or.length === 0) {
			delete edge.ReqIn;
		}
		if (edge.ReqOut!.Or.length === 0) {
			delete edge.ReqOut;
		}

		return edge;
	});

	return internalEdges.length > 0 ? internalEdges : undefined;
}

export function GetRoomData(room: RoomData) {
	let holes = getHoles(room);
	let links = room.links;
	let collectablesLinks = room.collectablesLinks;
	let collectables = room.collectables;

	if (
		!holes ||
		Object.keys(holes).length === 0 ||
		(links.length == 0 && collectablesLinks.length == 0)
	) {
		return null;
	}

	const subroomsData = Object.values(holes).map((hole) => {
		const internalEdges = getInternalEdges(links, hole, holes);
		return {
			Room: getRoomId(hole),
			Holes: [
				{
					Side: hole.position.charAt(0).toUpperCase() + hole.position.slice(1),
					Idx: hole.index,
					Kind: getKind(links, collectablesLinks, hole.id)
				}
			],
			InternalEdges: internalEdges ? internalEdges : undefined
		};
	});

	const collectableSubroomsData = collectables
		.filter((collectable) =>
			[CollectableType.STRAWBERRY, CollectableType.KEY].includes(collectable.collectableType)
		)
		.map((collectable) => {
			const internalEdges = getCollectableInternalEdges(collectablesLinks, collectable, holes);
			return {
				Room: getCollectableRoomId(collectable),
				Collectables: [{ Idx: collectable.index }],
				InternalEdges: internalEdges ? internalEdges : undefined
			};
		});

	const combinedSubrooms = [...subroomsData, ...collectableSubroomsData];

	const roomData: any = {
		Room: `"${room.name}"`,
		CelesteRandomizerHelper: true,
		Subrooms: combinedSubrooms
	};

	const spawn = collectables.find(
		(collectable) => collectable.collectableType == CollectableType.SPAWN
	);
	if (spawn != undefined) {
		const internalEdges = getCollectableInternalEdges(collectablesLinks, spawn, holes);
		roomData.InternalEdges = internalEdges ? internalEdges : undefined;
	}

	return roomData;
}

function customYamlToYaml(customYaml: string) {
	try {
		const document = parseDocument(customYaml);
		return document.toString();
	} catch (error) {
		throw new Error(`Error parsing YAML: ${error}`);
	}
}

export function convertRoomToYaml(room: RoomData): string {
	try {
		let yamlData;
		if (room.customYaml) {
			yamlData = customYamlToYaml(room.customYaml);
		} else {
			const allRoomsData = {
				ASide: [GetRoomData(room)]
			};
			yamlData = stringify(allRoomsData);
		}
		return yamlData.replace(/'/g, '');
	} catch (error) {
		if (error instanceof Error) {
			return error.message;
		}
	}
	return '';
}

export function convertAllRoomsToYaml(mapData: MapData): string {
	const hasDuplicates =
		new Set(mapData.rooms.map((room) => room.name)).size !== mapData.rooms.length;
	if (hasDuplicates) {
		return 'Error. Some rooms have the same names.';
	}

	try {
		const allRoomsData = mapData.rooms
			.map((room) => (room.customYaml ? parseDocument(room.customYaml) : GetRoomData(room)))
			.filter((room) => room !== null);

		let yamlData = stringify({ ASide: allRoomsData });
		yamlData = yamlData.replace(/'/g, '');

		return yamlData;
	} catch (error) {
		if (error instanceof Error) {
			return error.message;
		}
	}
	return '';
}
