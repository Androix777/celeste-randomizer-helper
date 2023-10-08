<script lang="ts">
	import { mapStore, type RoomData } from '../stores/MapStore';
	import { P, Button, Card } from 'flowbite-svelte';
	import { selectedRoom } from '../stores/MapStore';
	import RoomCanvas from './RoomCanvas.svelte';

	export let room: RoomData;

	function openRoom() {
		selectedRoom.set(room.id);
	}

	function deleteRoom() {
		mapStore.removeRoom(room.id);
	}
</script>

<Card class="max-w-none relative" color={room.id == $selectedRoom ? 'light' : 'default'}>
	<div class="mb-4 flex space-x-4">
		<P>{room.name}</P>
		<P>Holes: {room.holes.length}</P>
		<P>Links: {room.links.length}</P>
		<P>Collectables: {room.collectables.length}</P>
	</div>
	<div class="mb-4 flex space-x-4">
		<Button on:click={openRoom}>Open</Button>
		<Button color="red" on:click={deleteRoom}>Delete</Button>
	</div>
	<div
		class="absolute left-56 top-1/2 transform -translate-y-1/2"
		style="height: 128px; width: 750px;"
	>
		<RoomCanvas {room} startColor="#6B7280" solidColor="black" bgColor="#585e6a" />
	</div>
</Card>
