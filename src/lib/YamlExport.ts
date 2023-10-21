import type { CollectableData, HoleData, LinkData, MapData, RoomData } from './stores/MapStore';
import { stringify } from 'yaml';

function getHoles(room: RoomData) {
	const holes = room.holes;

	const holeDict: Record<string, HoleData> = holes.reduce((acc: Record<string, HoleData>, hole) => {
		acc[hole.id] = hole;
		return acc;
	}, {});

	return holeDict;
}

function getLinks(room: RoomData) {
	return room.links;
}

function getKind(links: LinkData[], holeId: string) {
	const linksForHole = links.filter((link) => link.idStart === holeId || link.idFinish === holeId);
	const isFinish = linksForHole.some((link) => link.idFinish === holeId);
	const isStart = linksForHole.some((link) => link.idStart === holeId);

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

export function GetRoomData(room: RoomData) {
	let holes = getHoles(room);
	let links = room.links;
	let collectables = room.collectables;

	if (!holes || Object.keys(holes).length === 0) {
		return null;
	}

	const subroomsData = Object.values(holes).map((hole) => {
		const internalEdges = getInternalEdges(links, hole, holes);
		return {
			Room: getRoomId(hole),
			Holes: [
				{
					Side: hole.position,
					Idx: hole.index,
					Kind: getKind(links, hole.id)
				}
			],
			InternalEdges: internalEdges ? internalEdges : undefined
		};
	});

	const collectableSubroomsData: any[] = []; // TODO

	const combinedSubrooms = [...subroomsData, ...collectableSubroomsData];

	const roomData = {
		Room: `"${room.name}"`,
		Subrooms: combinedSubrooms
	};
	return roomData;
}

export function convertRoomToYaml(room: RoomData) {
	const allRoomsData = {
		ASide: [GetRoomData(room)]
	};

	let yamlData = stringify(allRoomsData);
	yamlData = yamlData.replace(/'/g, '');

	return yamlData;
}

export function convertAllRoomsToYaml(mapData: MapData) {
	const allRoomsYaml = mapData.rooms
		.map((room) => GetRoomData(room))
		.filter((room) => room !== null);
	const allRoomsData = {
		ASide: allRoomsYaml
	};

	let yamlData = stringify(allRoomsData);
	yamlData = yamlData.replace(/'/g, '');

	return yamlData;
}
