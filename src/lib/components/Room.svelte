<script lang="ts">
	import { HOLE_ELEMENTS, FOCUSED_HOLE, COLLECTABLE_ELEMENT } from '../ContextConstants';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import Wall from './Wall.svelte';
	import LinksDrawer from './LinksDrawer.svelte';
	import { WallPosition } from '$lib/stores/MapStore';
	import RoomCanvas from './RoomCanvas.svelte';

	import { mapStore, selectedRoom } from '$lib/stores/MapStore';
	import Collectable from './Collectable.svelte';
	import LinksCollectablesDrawer from './LinksCollectablesDrawer.svelte';

	let holeElements = writable<{ [key: string]: HTMLElement }>({});
	setContext(HOLE_ELEMENTS, holeElements);

	let collectableElement = writable<HTMLElement>();
	setContext(COLLECTABLE_ELEMENT, collectableElement);

	let focusedHole = writable<string>('');
	setContext(FOCUSED_HOLE, focusedHole);

	let wallsPositions = [WallPosition.UP, WallPosition.DOWN, WallPosition.LEFT, WallPosition.RIGHT];

	$: currentRoom = mapStore.getRoom($selectedRoom);
</script>

<div class="room">
	<div class="absolute w-full h-full" style="grid-area: 2 / 2 / 3 / 3;">
		<RoomCanvas room={currentRoom} startColor="#1F2937" solidColor="#030712" />
	</div>
	<LinksDrawer />
	<LinksCollectablesDrawer />
	<div
		class="h-52 w-52 grid place-items-center self-center justify-self-center"
		style="grid-area: 2 / 2 / 3 / 3;"
	>
		<Collectable />
	</div>
	{#each wallsPositions as wallPosition}
		<Wall {wallPosition} />
	{/each}
</div>

<style lang="postcss">
	.room {
		@apply grid relative;
		grid-template-columns: 100px auto 100px;
		grid-template-rows: 100px auto 100px;
		width: 900px;
		height: 900px;
	}
</style>
