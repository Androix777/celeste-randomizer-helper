<script lang="ts">
	import { mapStore } from '../stores/MapStore';
	import { Label, Input } from 'flowbite-svelte';

	$: roomName = mapStore.getRoom(undefined, $mapStore).name;

	$: {
		let newRoom = { ...mapStore.getRoom(undefined, $mapStore), name: roomName };
		mapStore.updateRoom(newRoom);
	}
</script>

<div class="mb-6">
	<Label for="room-input" class="block mb-2">Room name</Label>
	<Input id="room-input" placeholder="" bind:value={roomName} />
</div>
