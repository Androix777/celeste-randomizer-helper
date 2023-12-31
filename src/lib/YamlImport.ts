import { parse, parseDocument, Document, stringify } from 'yaml';
import type { Node } from 'yaml';
import { v4 as uuidv4 } from 'uuid';
import { get } from 'svelte/store';
import { mapStore, getDefaultRoom, type CollectableLinkData } from './stores/MapStore';
import {
	type MapData,
	type RoomData,
	type HoleData,
	type LinkData,
	type WallPosition,
	type Dashes,
	type Difficulty,
	type CollectableData,
	CollectableType
} from './stores/MapStore';
import { calcErrors } from './SchemaTools';

// This needs to be redone properly

export function importYaml(rawData: string) {
	let data: any = parse(rawData);
	let dataDocument: any = parseDocument(rawData);
	let map: MapData = get(mapStore);
	let newRooms: RoomData[] = [];
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			const rooms = data[key];
			let roomIndex = -1;
			for (const room of rooms) {
				roomIndex++;

				let roomData: RoomData | undefined = map.rooms.find((r) => r.name === room.Room);
				let newRoom: RoomData = getDefaultRoom();

				if (roomData) {
					newRoom.id = roomData.id;
					newRoom.name = roomData.name;
					newRoom.loennData = roomData.loennData;
				} else {
					newRoom.name = room.Room;
				}

				if (!room.CelesteRandomizerHelper) {
					let roomDocument = dataDocument.contents.items[0].value.items[roomIndex];
					const newDoc = new Document();
					newDoc.contents = roomDocument as Node;
					newRoom.customYaml = newDoc.toString();
					calcErrors(newRoom);
				} else {
					if (room.Subrooms) {
						// holes
						for (const subroom of room.Subrooms) {
							if (subroom.Holes) {
								for (const hole of subroom.Holes) {
									const holeData: HoleData = {
										id: uuidv4(),
										index: 0,
										position: hole.Side.toLowerCase() as WallPosition,
										name: subroom.Room,
										lowBound: hole.LowBound,
										launch: hole.Launch,
										highBound: hole.HighBound,
										highOpen: hole.HighOpen ?? false
									};
									newRoom.holes.push(holeData);
								}
							}
						}

						// holes Subrooms
						for (const subroom of room.Subrooms) {
							if (subroom.InternalEdges && !subroom.Collectables) {
								for (const edge of subroom.InternalEdges) {
									if (edge.ReqOut && edge.ReqOut.Or) {
										for (const req of edge.ReqOut.Or) {
											const startHole = newRoom.holes.find((hole) => hole.name === subroom.Room);
											const finishHole = newRoom.holes.find((hole) => hole.name === edge.To);

											if (startHole && finishHole) {
												const linkData: LinkData = {
													id: uuidv4(),
													idStart: startHole.id,
													idFinish: finishHole.id,
													dashes: req.Dashes as Dashes,
													difficulty: req.Difficulty as Difficulty
												};
												newRoom.links.push(linkData);
											}
										}
									}
								}
							}
						}

						//collectables
						for (const subroom of room.Subrooms) {
							if (subroom.Collectables) {
								for (const collectable of subroom.Collectables) {
									const collectableData: CollectableData = {
										id: uuidv4(),
										collectableType: CollectableType.STRAWBERRY,
										index: collectable.Idx
									};

									newRoom.collectables.push(collectableData);
								}

								if (subroom.InternalEdges) {
									for (const edge of subroom.InternalEdges) {
										const hole = newRoom.holes.find((hole) => hole.name === edge.To);
										const collectable = newRoom.collectables.slice(-1)[0];

										// TODO redo

										if (hole && collectable) {
											if (edge.ReqOut && edge.ReqOut.Or) {
												for (const req of edge.ReqOut.Or) {
													const linkData: CollectableLinkData = {
														id: uuidv4(),
														collectableID: collectable.id,
														holeID: hole.id,
														dashes: req.Dashes as Dashes,
														difficulty: req.Difficulty as Difficulty,
														isIn: false
													};
													newRoom.collectablesLinks.push(linkData);
												}
											}

											if (edge.ReqIn && edge.ReqIn.Or) {
												for (const req of edge.ReqIn.Or) {
													const linkData: CollectableLinkData = {
														id: uuidv4(),
														collectableID: collectable.id,
														holeID: hole.id,
														dashes: req.Dashes as Dashes,
														difficulty: req.Difficulty as Difficulty,
														isIn: true
													};
													newRoom.collectablesLinks.push(linkData);
												}
											}
										}
									}
								}
							}
						}
					}

					if (room.InternalEdges) {
						for (const edge of room.InternalEdges) {
							const hole = newRoom.holes.find((hole) => hole.name === edge.To);
							const collectable: CollectableData = {
								id: uuidv4(),
								collectableType: CollectableType.SPAWN,
								index: 0
							};

							if (hole) {
								newRoom.collectables.push(collectable);
								if (edge.ReqOut && edge.ReqOut.Or) {
									for (const req of edge.ReqOut.Or) {
										const linkData: CollectableLinkData = {
											id: uuidv4(),
											collectableID: collectable.id,
											holeID: hole.id,
											dashes: req.Dashes as Dashes,
											difficulty: req.Difficulty as Difficulty,
											isIn: false
										};
										newRoom.collectablesLinks.push(linkData);
									}
								}

								if (edge.ReqIn && edge.ReqIn.Or) {
									for (const req of edge.ReqIn.Or) {
										const linkData: CollectableLinkData = {
											id: uuidv4(),
											collectableID: collectable.id,
											holeID: hole.id,
											dashes: req.Dashes as Dashes,
											difficulty: req.Difficulty as Difficulty,
											isIn: true
										};
										newRoom.collectablesLinks.push(linkData);
									}
								}
							}
						}
					}

					if (room.SpinnersShatter) {
						newRoom.spinnersShatter = room.SpinnersShatter;
					}

					if (room.Tweaks) {
						newRoom.customTweaks = stringify({ Tweaks: room.Tweaks });
					}
				}

				newRooms.push(newRoom);
			}
		}
	}

	let finalRooms = map.rooms.map((oldRoom) => {
		let newRoom = newRooms.find((newRoom) => newRoom.name === oldRoom.name);
		return newRoom ? newRoom : oldRoom;
	});

	for (let newRoom of newRooms) {
		if (!finalRooms.find((room) => room.name === newRoom.name)) {
			finalRooms.push(newRoom);
		}
	}

	let finalMap: MapData = {
		id: uuidv4(),
		rooms: finalRooms
	};

	mapStore.update(() => {
		return finalMap;
	});
}
