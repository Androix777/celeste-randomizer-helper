<script lang="ts">
	import { mapStore } from '../stores/MapStore';
	import RoomInfoPanel from './RoomInfoPanel.svelte';

	$: rooms = $mapStore.rooms;
</script>

<div class="overflow-scroll" style="max-height: 800px">
	{#each Object.values(rooms) as room (room.id)}
		<div class="mb-4">
			<RoomInfoPanel {room} />
		</div>
	{/each}
</div>
