<script lang="ts">
	import { mapStore } from '$lib/stores/MapStore';
	import { Textarea } from 'flowbite-svelte';

	let room = mapStore.getRoom();
</script>

<Textarea
	id="yaml-textarea"
	rows="40"
	placeholder="Loenn data"
	class="mb-2"
	bind:value={room.customYaml}
/>
