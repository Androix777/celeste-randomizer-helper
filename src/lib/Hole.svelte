<script lang="ts">
	import { HOLE_ELEMENTS, FOCUSED_HOLE } from './ContextConstants';
	import { getContext, onMount, onDestroy } from 'svelte';
	import { holesStore, selectedHoleStart, selectedHoleFinish, type HoleData } from './HolesStore';
	import type { Writable } from 'svelte/store';

	export let hole: HoleData;

	let holeElement: HTMLElement;

	let holeElements: Writable<{ [key: string]: HTMLElement }> = getContext(HOLE_ELEMENTS);
	let focusedHole: Writable<string> = getContext(FOCUSED_HOLE);

	function removeHole() {
		holesStore.removeHole(hole.id);
	}

	function addStart() {
		selectedHoleStart.set(hole.id);
	}

	function addFinish() {
		selectedHoleFinish.set(hole.id);
	}

	function updateName(event: Event) {
		hole.name = (event.target as HTMLInputElement).value;
		holesStore.updateHole(hole);
	}
	let holeNumber: number;

	$: {
		const holesOnThisWall = Object.values($holesStore).filter((h) => h.position === hole.position);
		holeNumber = holesOnThisWall.indexOf(hole);
	}

	onMount(() => {
		$holeElements[hole.id] = holeElement;
	});

	onDestroy(() => {
		holeElements.update((currentHoles) => {
			delete currentHoles[hole.id];
			return currentHoles;
		});
	});

	function onMouseEnter() {
		focusedHole.set(hole.id);
	}

	function onMouseLeave() {
		focusedHole.set('');
	}
</script>

<div
	class="hole"
	bind:this={holeElement}
	on:mouseenter={onMouseEnter}
	on:mouseleave={onMouseLeave}
	role="none"
>
	<p>{hole.position} {holeNumber}</p>
	<input type="text" bind:value={hole.name} on:input={updateName} />
	<button on:click={removeHole}>-</button>
	<button on:click={addStart}>Start</button>
	<button on:click={addFinish}>Finish</button>
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
