import schema from './schema/schema.json';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { parse } from 'yaml';
import { mapStore, type RoomData } from './stores/MapStore';

export function calcErrors(room: RoomData) {
	if (room.customYaml == '') return;
	try {
		const data = parse(room.customYaml);

		const ajv = new Ajv({ allErrors: true });
		addFormats(ajv);

		ajv.addKeyword({
			keyword: 'markdownDescription',
			code: () => true,
			metaSchema: undefined
		});

		const validate = ajv.compile(schema);

		if (data) {
			validate(data);
			room.customYamlErrors = validate.errors?.length ?? 0;
		}
	} catch (e) {
		console.error('Conversion YAML to JSON error', e);
		room.customYamlErrors = 0;
	}

	mapStore.updateRoom(room);
	console.log(room.customYamlErrors);
}
