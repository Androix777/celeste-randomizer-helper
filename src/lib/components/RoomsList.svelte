<script lang="ts">
	import { onMount } from 'svelte';
	import { mapStore, getDefaultRoom, selectedRoom } from '../stores/MapStore';
	import RoomInfoPanel from './RoomInfoPanel.svelte';
	import { Button } from 'flowbite-svelte';

	let selectedRoomElement: HTMLElement;
	let selectedRoomID = $selectedRoom;
	$: rooms = $mapStore.rooms;

	function addRoom() {
		mapStore.addRoom(getDefaultRoom());
	}

	

	onMount(() => {
		if (selectedRoomElement) {
			selectedRoomElement.scrollIntoView({ behavior: 'instant' });
		}
	});
</script>

<Button class="mb-6" on:click={addRoom}>Add new</Button>
<div class="overflow-scroll" style="max-height: 800px">
	{#each Object.values(rooms) as room (room.id)}
		{#if room.id == selectedRoomID}
			<div class="mb-4" bind:this={selectedRoomElement}>
				<RoomInfoPanel {room} />
			</div>
		{:else}
			<div class="mb-4">
				<RoomInfoPanel {room} />
			</div>
		{/if}
	{/each}
</div>
