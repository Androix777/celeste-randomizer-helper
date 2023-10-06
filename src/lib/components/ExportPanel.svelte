<script lang="ts">
	import { Button, Textarea, Label } from 'flowbite-svelte';
	import { convertRoomToYaml, convertAllRoomsToYaml } from '../YamlExport';
	import { mapStore } from '../stores/MapStore';

	let generatedYaml: string = '';

	function generateRoom(event: Event) {
		generatedYaml = convertRoomToYaml(mapStore.getRoom());
	}

	function generateAll(event: Event) {
		generatedYaml = convertAllRoomsToYaml($mapStore);
	}
</script>

<div class="mb-6">
	<Label for="yaml-textarea" class="block mb-2">Generated yaml</Label>
	<Textarea id="yaml-textarea" rows="20" placeholder="yaml" bind:value={generatedYaml} />
</div>

<Button class="mb-6" on:click={generateAll}>Generate for map</Button>
<Button class="mb-6" on:click={generateRoom}>Generate for room</Button>
