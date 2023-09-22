<script lang="ts">
	import { Button, Select, P } from 'flowbite-svelte';
	import {
		selectedHoleStart,
		selectedHoleFinish,
		holesStore,
		linksStore,
		Dashes,
		Difficulty
	} from '$lib/HolesStore';

	$: holeStart =
		$selectedHoleStart != '' ? holesStore.getHole($selectedHoleStart, $holesStore) : undefined;
	$: holeFinish =
		$selectedHoleFinish != '' ? holesStore.getHole($selectedHoleFinish, $holesStore) : undefined;

	let selectedDashes = Dashes.ZERO;
	let selectedDifficulty = Difficulty.EASY;

	let dashes = [
		{ value: Dashes.ZERO, name: 'Zero' },
		{ value: Dashes.ONE, name: 'One' },
		{ value: Dashes.TWO, name: 'Two' }
	];

	let difficulties = [
		{ value: Difficulty.EASY, name: 'Easy' },
		{ value: Difficulty.NORMAL, name: 'Normal' },
		{ value: Difficulty.HARD, name: 'Hard' },
		{ value: Difficulty.EXPERT, name: 'Expert' },
		{ value: Difficulty.MASTER, name: 'Master' },
		{ value: Difficulty.PERFECT, name: 'Perfect' }
	];

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
	<P>Dashes</P>
	<Select
		id="dashes-select"
		class="mt-2"
		placeholder=""
		items={dashes}
		bind:value={selectedDashes}
	/>

	<P>Difficulty</P>
	<Select
		id="difficulty-select"
		class="mt-2"
		placeholder=""
		items={difficulties}
		bind:value={selectedDifficulty}
	/>

	<Button class="mt-2" on:click={createLink}>Add link</Button>
</div>
