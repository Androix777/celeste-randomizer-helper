import { parse } from 'yaml';
import { v4 as uuidv4 } from 'uuid';
import { get } from 'svelte/store';
import { mapStore } from './stores/MapStore';
import type { MapData, RoomData, HoleData, LinkData, WallPosition, Dashes, Difficulty } from './stores/MapStore';


// This needs to be redone properly

export function importYaml(rawData: string) {
    let data: any = parse(rawData);
    let map : MapData = get(mapStore);
    let newRooms: RoomData[] = [];

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const rooms = data[key];

            for (const room of rooms) {
                let roomData: RoomData | undefined = map.rooms.find(r => r.name === room.Room);
                console.log(roomData ? "Exist" : "NEW");

                let newRoom : RoomData = {
                    id: roomData ?  roomData.id : uuidv4(),
                    solids: roomData ? roomData.solids : undefined,
                    calculatedWallHoles: roomData ? roomData.calculatedWallHoles : undefined,
                    name: room.Room,
                    isEnabled: true,
                    isImported: true,
                    holes: [],
                    links: [],
                };

                if (room.Subrooms) {
                    for (const subroom of room.Subrooms) {
                        for(const hole of subroom.Holes){
                            const holeData: HoleData = {
                                id: uuidv4(),
                                position: hole.Side as WallPosition,
                                name: subroom.Room,
                            };
                            newRoom.holes.push(holeData);
                        }
                    }

                    for (const subroom of room.Subrooms) {
                        if (subroom.InternalEdges) {
                            for (const edge of subroom.InternalEdges) {
                                if (edge.ReqOut) {
                                    if (edge.ReqOut.Or){
                                        for(const req of edge.ReqOut.Or){
                                            const startHole = newRoom.holes.find(hole => hole.name === subroom.Room);
                                            const finishHole = newRoom.holes.find(hole => hole.name === edge.To);

                                            if (startHole && finishHole) {
                                                const linkData: LinkData = {
                                                    id: uuidv4(),
                                                    idStart: startHole.id,
                                                    idFinish: finishHole.id,
                                                    dashes: req.Dashes as Dashes,
                                                    difficulty: req.Difficulty as Difficulty,
                                                };
                                                newRoom.links.push(linkData);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                newRooms.push(newRoom);
            }
        }
    }

    let finalRooms = map.rooms.map(oldRoom => {
        let newRoom = newRooms.find(newRoom => newRoom.name === oldRoom.name);
        return newRoom ? newRoom : oldRoom;
    });
    
    for (let newRoom of newRooms) {
        if (!finalRooms.find(room => room.name === newRoom.name)) {
            finalRooms.push(newRoom);
        }
    }

    let finalMap: MapData = {
        id: uuidv4(),
        rooms: finalRooms
    };

    console.log(finalMap);
    
    mapStore.update(() => {
		return finalMap;
	});
}