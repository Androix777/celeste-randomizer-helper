<script lang="ts">
	import { selectedHoleStart, selectedHoleFinish, holesStore, linksStore, Dashes, Difficulty } from '$lib/HolesStore';
	import HoleInfo from './HoleInfo.svelte';

	$: holeStart = $holesStore[$selectedHoleStart];
	$: holeFinish = $holesStore[$selectedHoleFinish];

	let selectedDashes = Dashes.ZERO;
	let selectedDifficulty = Difficulty.EASY;

	function createLink(event: Event) {
		if (holeStart && holeFinish) {
			linksStore.addLink({ 
				idStart: $selectedHoleStart, 
				idFinish: $selectedHoleFinish,
				dashes: selectedDashes,
				difficulty: selectedDifficulty
			});
		}
	}
</script>

<div class="link-editor">
	<HoleInfo hole={holeStart} />
	<HoleInfo hole={holeFinish} />
	<select bind:value={selectedDashes}>
		<option value={Dashes.ZERO}>Zero</option>
		<option value={Dashes.ONE}>One</option>
		<option value={Dashes.TWO}>Two</option>
	</select>
	<select bind:value={selectedDifficulty}>
		<option value={Difficulty.EASY}>Easy</option>
		<option value={Difficulty.NORMAL}>Normal</option>
		<option value={Difficulty.HARD}>Hard</option>
		<option value={Difficulty.EXPERT}>Expert</option>
		<option value={Difficulty.MASTER}>Master</option>
		<option value={Difficulty.PERFECT}>Perfect</option>
	</select>
	<button on:click={createLink}>Add link</button>
</div>