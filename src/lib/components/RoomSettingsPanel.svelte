<script lang="ts">
	import { mapStore, setWallHoles } from '../stores/MapStore';
	import { Label, Input, Button } from 'flowbite-svelte';

	let roomName = mapStore.getRoom(undefined, $mapStore).name;

	function updateRoomName() {
		let newRoom = { ...mapStore.getRoom(undefined, $mapStore), name: roomName };
		mapStore.updateRoom(newRoom);
	}

	function clearAll(event?: Event) {
		mapStore.clearRoom();
	}

	function autoSetHoles(event?: Event) {
		clearAll();
		let room = mapStore.getRoom();
		setWallHoles(room);
		mapStore.updateRoom(room);
	}
</script>

<div class="mb-6">
	<Label for="room-input" class="block mb-2">Room name</Label>
	<Input
		id="room-input"
		class="mb-2"
		placeholder=""
		bind:value={roomName}
		on:input={updateRoomName}
	/>
	<Button on:click={autoSetHoles}>Auto set holes</Button>
	<Button color="red" on:click={clearAll}>Reset all</Button>
</div>
