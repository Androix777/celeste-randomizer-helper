<script lang="ts">
	import { mapStore } from '$lib/stores/MapStore';
	import { onDestroy } from 'svelte';
	import { calcErrors } from '$lib/SchemaTools';
	import YamlEditor from './YamlEditor.svelte';

	let room = mapStore.getRoom();

	function onTextChanged(newText: CustomEvent<string>) {
		room.customYaml = newText.detail;
	}

	onDestroy(() => {
		calcErrors(room);
	});
</script>

<YamlEditor text={room.customYaml} uri="roomSchema.yaml" on:textChanged={onTextChanged} />
