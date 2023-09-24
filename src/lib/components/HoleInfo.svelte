<script lang="ts">
	import { holesStore, type HoleData } from '../stores/MapStore';

	export let hole: HoleData | null;

	let holeNumber: number | null;

	$: if (hole) {
		const holesOnThisWall = Object.values($holesStore).filter((h) => h.position === hole?.position);
		holeNumber = holesOnThisWall.indexOf(hole);
	} else {
		holeNumber = null;
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
