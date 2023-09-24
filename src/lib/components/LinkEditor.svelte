<script lang="ts">
	import { Button, Select, Label } from 'flowbite-svelte';
	import {
		selectedHoleStart,
		selectedHoleFinish,
		holesStore,
		linksStore,
		Dashes,
		Difficulty
	} from '$lib/stores/MapStore';

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
	<div class="mb-4">
		<Label for="dashes-select" class="block mb-2">Dashes</Label>
		<Select id="dashes-select" placeholder="" items={dashes} bind:value={selectedDashes} />
	</div>

	<div class="mb-4">
		<Label for="difficulty-select" class="block mb-2">Difficulty</Label>
		<Select
			id="difficulty-select"
			placeholder=""
			items={difficulties}
			bind:value={selectedDifficulty}
		/>
	</div>

	<Button on:click={createLink}>Add link</Button>
</div>
