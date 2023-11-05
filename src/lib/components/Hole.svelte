<script lang="ts">
	import { SpeedDial, ListgroupItem, Listgroup } from 'flowbite-svelte';
	import {
		ArrowDownToBracketOutline,
		ArrowUpFromBracketOutline,
		TrashBinOutline,
		StarSolid
	} from 'flowbite-svelte-icons';
	import { HOLE_ELEMENTS, FOCUSED_HOLE } from '../ContextConstants';
	import { getContext, onMount, onDestroy } from 'svelte';
	import {
		mapStore,
		selectedHoleStart,
		selectedHoleFinish,
		type HoleData,
		isLastSelectedholeStart
	} from '../stores/MapStore';
	import type { Writable } from 'svelte/store';

	export let hole: HoleData;

	let holeElement: HTMLElement;

	let holeElements: Writable<{ [key: string]: HTMLElement }> = getContext(HOLE_ELEMENTS);
	let focusedHole: Writable<string> = getContext(FOCUSED_HOLE);
	let isSpawn: boolean = false;

	function removeHole() {
		mapStore.removeHole(hole.id);
	}

	function addStart() {
		selectedHoleStart.set(hole.id);
		isLastSelectedholeStart.set(true);
	}

	function addFinish() {
		selectedHoleFinish.set(hole.id);
		isLastSelectedholeStart.set(false);
	}

	function setSpawn() {
		let room = mapStore.getRoom();
		room.spawnHoleID = room.spawnHoleID == hole.id ? '' : hole.id;
		mapStore.updateRoom(room);
	}

	$: {
		const room = mapStore.getRoom(undefined, $mapStore);
		isSpawn = room.spawnHoleID == hole.id;
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
	class="flex flex-1 border {isSpawn
		? 'bg-emerald-300'
		: 'bg-gray-400'}  items-center justify-center"
	bind:this={holeElement}
	on:mouseenter={onMouseEnter}
	on:mouseleave={onMouseLeave}
	role="none"
>
	<SpeedDial defaultClass="flex rounded-full">
		<div slot="icon" class="w-5 h-5">{hole.index}</div>
		<Listgroup class="divide-none" active>
			<ListgroupItem class="flex gap-2 md:px-5" on:click={addStart}>
				<ArrowUpFromBracketOutline class="w-3.5 h-3.5" />
				From
			</ListgroupItem>
			<ListgroupItem class="flex gap-2 md:px-5" on:click={addFinish}>
				<ArrowDownToBracketOutline class="w-3.5 h-3.5" />
				To
			</ListgroupItem>
			<ListgroupItem class="flex gap-2 md:px-5" on:click={setSpawn}>
				<StarSolid class="w-3.5 h-3.5" />
				Spawn point
			</ListgroupItem>
			<ListgroupItem class="flex gap-2 md:px-5" on:click={removeHole}>
				<TrashBinOutline class="w-3.5 h-3.5" />
				Delete
			</ListgroupItem>
		</Listgroup>
	</SpeedDial>
</div>
