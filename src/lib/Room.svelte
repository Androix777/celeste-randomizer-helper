<script lang="ts">
	import { HOLE_ELEMENTS, FOCUSED_HOLE } from './ContextConstants';
	import { setContext } from 'svelte';
	import Wall from './Wall.svelte';
	import LinksDrawer from './LinksDrawer.svelte';
	import { WallPosition } from './HolesStore';
	import { writable } from 'svelte/store';

	let holeElements = writable<{ [key: string]: HTMLElement }>({});
	setContext(HOLE_ELEMENTS, holeElements);

	let focusedHole = writable<string>('');
	setContext(FOCUSED_HOLE, focusedHole);

	let wallsPositions = [
		WallPosition.TOP,
		WallPosition.BOTTOM,
		WallPosition.LEFT,
		WallPosition.RIGHT
	];
</script>

<div class="room">
	<LinksDrawer />
	{#each wallsPositions as wallPosition}
		<Wall {wallPosition} />
	{/each}
</div>

<style>
	.room {
		display: grid;
		grid-template-columns: 200px auto 200px;
		grid-template-rows: 200px auto 200px;
		position: relative;
		width: 1000px;
		height: 1000px;
		margin: 50px;
		background-color: #333;
	}
</style>
