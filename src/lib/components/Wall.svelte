<script lang="ts">
	import { mapStore, WallPosition } from '../stores/MapStore';
	import Hole from './Hole.svelte';
	import { Button } from 'flowbite-svelte';

	export let wallPosition: WallPosition;

	$: holes = mapStore
		.getRoom(undefined, $mapStore)
		.holes.filter((hole) => hole.position === wallPosition);

	function addHole() {
		mapStore.addHole({
			position: wallPosition,
			name: 'new'
		});
	}
</script>

<div class={`wall ${wallPosition}`}>
	<Button on:click={addHole}>+</Button>
	{#each Object.values(holes) as hole (hole.id)}
		<Hole {hole} />
	{/each}
</div>

<style>
	.wall {
		background-color: #474747;
		display: flex;
		align-items: stretch;
	}

	.wall.up,
	.wall.down {
		flex-direction: row;
	}

	.wall.left,
	.wall.right {
		flex-direction: column;
	}

	.wall.up {
		grid-area: 1 / 2 / 2 / 3;
	}

	.wall.down {
		grid-area: 3 / 2 / 4 / 3;
	}

	.wall.left {
		grid-area: 2 / 1 / 3 / 2;
	}
	.wall.right {
		grid-area: 2 / 3 / 3 / 4;
	}
</style>
