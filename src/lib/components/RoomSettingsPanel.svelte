<script lang="ts">
	import {
		mapStore,
		setWallHolesFromLoennData,
		setCollectablesFromLoennData
	} from '../stores/MapStore';
	import { Label, Input, Button, Checkbox } from 'flowbite-svelte';

	let roomName = mapStore.getRoom().name;
	let spinnersShatter = mapStore.getRoom().spinnersShatter;

	function updateRoomName() {
		let newRoom = { ...mapStore.getRoom(), name: roomName };
		mapStore.updateRoom(newRoom);
	}

	function updateSpinnersShatter() {
		let newRoom = { ...mapStore.getRoom(), spinnersShatter: spinnersShatter };
		mapStore.updateRoom(newRoom);
	}

	function clearAll(event?: Event) {
		mapStore.clearRoom();
	}

	function autoSetHoles(event?: Event) {
		clearAll();
		let room = mapStore.getRoom();
		setWallHolesFromLoennData(room);
		setCollectablesFromLoennData(room);
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
	<Checkbox class="mb-2" bind:checked={spinnersShatter} on:change={updateSpinnersShatter}
		>Spinners Shatter</Checkbox
	>
	<Button on:click={autoSetHoles}>Auto set loenn data</Button>
	<Button color="red" on:click={clearAll}>Reset all</Button>
</div>
