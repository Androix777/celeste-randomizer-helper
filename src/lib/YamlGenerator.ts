import { holesStore, linksStore, WallPosition, roomName } from './stores/HolesStore';
import type { HoleData, LinkData } from './stores/HolesStore';
import { get } from 'svelte/store';
import { stringify } from 'yaml';

let holes = getHoles();
let links = getLinks();

function getHoles() {
	const holes = get(holesStore);

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

function getLinks() {
	return get(linksStore);
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

function getInternalEdges(links: LinkData[], hole: HoleData & { index: number }) {
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

export function getYaml() {
	holes = getHoles();
	links = getLinks();

	const subroomsData = Object.values(holes).map((hole) => {
		const internalEdges = getInternalEdges(links, hole);
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
		ASide: [
			{
				Room: `"${get(roomName)}"`,
				Subrooms: subroomsData
			}
		]
	};

	let yamlData = stringify(roomData);
	yamlData = yamlData.replace(/'/g, '');
	yamlData = yamlData.substring(yamlData.indexOf('\n') + 1);

	return yamlData;
}
