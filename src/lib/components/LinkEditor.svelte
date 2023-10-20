<script lang="ts">
	import { Button, Select, Label } from 'flowbite-svelte';
	import {
		selectedHoleStart,
		selectedHoleFinish,
		mapStore,
		Dashes,
		Difficulty
	} from '$lib/stores/MapStore';

	$: holeStart =
		$selectedHoleStart != ''
			? mapStore.getHole($selectedHoleStart, undefined, $mapStore)
			: undefined;
	$: holeFinish =
		$selectedHoleFinish != ''
			? mapStore.getHole($selectedHoleFinish, undefined, $mapStore)
			: undefined;

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
			mapStore.addLink({
				idStart: $selectedHoleStart,
				idFinish: $selectedHoleFinish,
				dashes: selectedDashes,
				difficulty: selectedDifficulty
			});
		}
	}
</script>

<div class="link-editor flex items-center mt-3">
	<Label for="dashes-select" class="mr-2 block">Dashes</Label>
	<Select
		id="dashes-select"
		placeholder=""
		items={dashes}
		bind:value={selectedDashes}
		class="mr-2"
	/>
	<Label for="difficulty-select" class="mr-2 block">Difficulty</Label>
	<Select
		id="difficulty-select"
		placeholder=""
		items={difficulties}
		bind:value={selectedDifficulty}
		class="mr-2"
	/>
	<Button class="shrink-0" on:click={createLink}>Add link</Button>
</div>
