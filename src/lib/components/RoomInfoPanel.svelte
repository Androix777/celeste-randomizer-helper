<script lang="ts">
	import { mapStore, type RoomData } from '../stores/MapStore';
	import { P, Button, Card } from 'flowbite-svelte';
	import { selectedRoom } from '../stores/MapStore';

	export let room: RoomData;

	function openRoom() {
		selectedRoom.set(room.id);
	}

	function deleteRoom() {
		mapStore.removeRoom(room.id);
	}
</script>

<Card class="max-w-none">
	<div class="mb-4 flex space-x-4">
		<P>{room.name}</P>
		<P>Holes: {room.holes.length}</P>
		<P>Links: {room.links.length}</P>
	</div>
	<div class="mb-4 flex space-x-4">
		<Button on:click={openRoom}>Open</Button>
		<Button color="red" on:click={deleteRoom}>Delete</Button>
	</div>
</Card>
