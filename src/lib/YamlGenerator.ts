import { WallPosition } from './stores/MapStore';
import type { HoleData, LinkData, MapData, RoomData } from './stores/MapStore';
import { stringify } from 'yaml';

function getHoles(room: RoomData) {
	const holes = room.holes;

	const wallIndices: Record<WallPosition, number> = {
		[WallPosition.UP]: 0,
		[WallPosition.DOWN]: 0,
		[WallPosition.LEFT]: 0,
		[WallPosition.RIGHT]: 0
	};

	const holeDict: Record<string, HoleData & { index: number }> = holes.reduce(
		(acc: Record<string, HoleData & { index: number }>, hole) => {
			acc[hole.id] = {
				...hole,
				index: wallIndices[hole.position]++
			};
			return acc;
		},
		{}
	);

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

function getRoomId(hole: HoleData & { index: number }) {
	return `"${hole.position}_${hole.index}"`;
}

function getInternalEdges(
	links: LinkData[],
	hole: HoleData & { index: number },
	holes: Record<string, HoleData & { index: number }>
) {
	const linksForHole = links.filter((link) => link.idStart === hole.id);

	if (linksForHole.length === 0) return null;

	const groupedLinks = linksForHole.reduce((acc: any, link) => {
		const otherHole = holes[link.idFinish];
		const otherRoomId = getRoomId(otherHole);

		if (!acc[otherRoomId]) {
			acc[otherRoomId] = { To: otherRoomId, ReqOut: { Or: [] }, ReqIn: { Or: [] } };
		}

		acc[otherRoomId].ReqIn.Or.push({
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
	let links = getLinks(room);

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

	const roomData = {
		Room: `"${room.name}"`,
		Subrooms: subroomsData
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
	const allRoomsYaml = mapData.rooms.map((room) => GetRoomData(room));
	const allRoomsData = {
		ASide: allRoomsYaml
	};

	let yamlData = stringify(allRoomsData);
	yamlData = yamlData.replace(/'/g, '');

	return yamlData;
}
