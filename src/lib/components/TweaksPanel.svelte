<script lang="ts">
	import { mapStore } from '$lib/stores/MapStore';
	import { onDestroy } from 'svelte';
	import { calcErrors } from '$lib/SchemaTools';
	import YamlEditor from './YamlEditor.svelte';

	let room = mapStore.getRoom();

	function onTextChanged(newText: CustomEvent<string>) {
		room.customTweaks = newText.detail;
	}

	onDestroy(() => {
		calcErrors(room);
	});
</script>

<YamlEditor text={room.customTweaks} uri="tweaksSchema.yaml" on:textChanged={onTextChanged} />
