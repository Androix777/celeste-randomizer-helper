<script lang="ts">
	import { mapStore, type HoleData } from '../stores/MapStore';

	export let hole: HoleData | undefined;

	let holeNumber: number | undefined;

	$: if (hole) {
		const holesOnThisWall = mapStore
			.getRoom(undefined, $mapStore)
			.holes.filter((h) => h.position === hole?.position);
		holeNumber = holesOnThisWall!.indexOf(hole); //!
	} else {
		holeNumber = undefined;
	}
</script>

<div class="hole">
	{#if hole}
		<p>{hole.position}</p>
		<p>{holeNumber}</p>
		<p>{hole.id}</p>
		<p>{hole.name}</p>
	{:else}
		<p>Hole not selected</p>
	{/if}
</div>

<style>
	.hole {
		background-color: #555;
		color: white;
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border: 1px solid #444;
	}
</style>
