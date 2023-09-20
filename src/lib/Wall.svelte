<script lang="ts">
	import { holesStore, WallPosition } from './HolesStore';
	import Hole from './Hole.svelte';

	export let wallPosition: WallPosition;

	function addHole() {
		holesStore.addHole({
			position: wallPosition,
			name: 'new'
		});
	}
</script>

<div class={`wall ${wallPosition}`}>
	<button on:click={addHole}>+</button>
	{#each Object.values($holesStore).filter((hole) => hole.position === wallPosition) as hole (hole.id)}
		<Hole {hole} />
	{/each}
</div>

<style>
	.wall {
		background-color: #474747;
		display: flex;
		align-items: stretch;
	}

	.wall.top,
	.wall.bottom {
		flex-direction: row;
	}

	.wall.left,
	.wall.right {
		flex-direction: column;
	}

	.wall.top {
		grid-area: 1 / 2 / 2 / 3;
	}

	.wall.bottom {
		grid-area: 3 / 2 / 4 / 3;
	}

	.wall.left {
		grid-area: 2 / 1 / 3 / 2;
	}
	.wall.right {
		grid-area: 2 / 3 / 3 / 4;
	}
</style>
