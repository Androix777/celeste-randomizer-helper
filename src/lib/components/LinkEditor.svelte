<script lang="ts">
	import { Button, Select, Label } from 'flowbite-svelte';
	import {
		selectedHoleStart,
		selectedHoleFinish,
		mapStore,
		Dashes,
		Difficulty,
		collectablesMode,
		selectedCollectable,
		isLastSelectedholeStart
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

	function createLink(dashes: Dashes, difficulty: Difficulty ) {
		if ($collectablesMode) {
			if (
				($isLastSelectedholeStart && $selectedHoleStart != '') ||
				(!$isLastSelectedholeStart && $selectedHoleFinish != '')
			) {
				mapStore.addCollectableLink({
					collectableID: $selectedCollectable,
					holeID: $isLastSelectedholeStart ? $selectedHoleStart : $selectedHoleFinish,
					dashes: dashes,
					difficulty: difficulty,
					isIn: $isLastSelectedholeStart
				});
			}
		} else {
			if (holeStart && holeFinish) {
				mapStore.addLink({
					idStart: $selectedHoleStart,
					idFinish: $selectedHoleFinish,
					dashes: dashes,
					difficulty: difficulty
				});
			}
		}
	}

	function createLinkFromSelects(event: Event){
		createLink(selectedDashes, selectedDifficulty);
	}

	function createLinkFree(event: Event){
		createLink(Dashes.ZERO, Difficulty.EASY);
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
	<Button class="shrink-0 mr-2" on:click={createLinkFromSelects}>Add link</Button>
	<Button class="shrink-0" on:click={createLinkFree}>Add free link</Button>
</div>
