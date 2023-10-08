<script lang="ts">
	import { mapStore } from '../stores/MapStore';
	import RoomInfoPanel from './RoomInfoPanel.svelte';
	import { Button } from 'flowbite-svelte';

	$: rooms = $mapStore.rooms;

	function addRoom() {
		mapStore.addRoom({
			name: 'NewRoom',
			isEnabled: true,
			holes: [],
			links: []
		});
	}
</script>

<Button class="mb-6" on:click={addRoom}>Add new</Button>
<div class="overflow-scroll" style="max-height: 800px">
	{#each Object.values(rooms) as room (room.id)}
		<div class="mb-4">
			<RoomInfoPanel {room} />
		</div>
	{/each}
</div>
