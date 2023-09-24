<script lang="ts">
	import { mapStore } from '../stores/MapStore';
	import RoomInfoPanel from './RoomInfoPanel.svelte';

	$: rooms = $mapStore.rooms;
</script>

<div>
	{#each Object.values(rooms) as room (room.id)}
		<RoomInfoPanel {room} />
	{/each}
</div>
