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

	let wallsPositions = [WallPosition.UP, WallPosition.DOWN, WallPosition.LEFT, WallPosition.RIGHT];
</script>

<div class="room">
	<LinksDrawer />
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
