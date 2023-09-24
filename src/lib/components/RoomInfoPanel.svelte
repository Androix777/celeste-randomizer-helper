<script lang="ts">
	import type { RoomData } from '../stores/MapStore';
	import { P, Button } from 'flowbite-svelte';
	import { selectedRoom } from '../stores/MapStore';

	export let room: RoomData;

	function openRoom() {
		selectedRoom.set(room.id);
	}
</script>

<div>
	<P>{room.name}</P>
	<P>{room.id}</P>
	<Button on:click={openRoom}>Open</Button>
</div>
