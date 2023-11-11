<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import {
		CollectableType,
		Dashes,
		Difficulty,
		collectablesMode,
		mapStore,
		selectedCollectable,
		selectedHoleStart
	} from '$lib/stores/MapStore';
	import type { CollectableData } from '$lib/stores/MapStore';

	function deleteSpawns() {
		closeCollectableView();

		let spawns: string[] = [];
		for (const collectable of mapStore.getRoom().collectables) {
			if (collectable.collectableType == CollectableType.SPAWN) {
				spawns.push(collectable.id);
			}
		}

		for (const spawnId of spawns) {
			mapStore.removeCollectable(spawnId);
		}
	}

	function addSpawn() {
		deleteSpawns();

		mapStore.addCollectable({ collectableType: CollectableType.SPAWN, index: 0 });
		const collectable: CollectableData = mapStore.getRoom().collectables.slice(-1)[0];
		collectablesMode.set(true);
		selectedCollectable.set(collectable.id);
	}

	function addStartSpawn() {
		if ($selectedHoleStart == '') return;

		deleteSpawns();

		mapStore.addCollectable({ collectableType: CollectableType.SPAWN, index: 0 });
		const collectable: CollectableData = mapStore.getRoom().collectables.slice(-1)[0];
		collectablesMode.set(true);
		selectedCollectable.set(collectable.id);

		mapStore.addCollectableLink({
			collectableID: $selectedCollectable,
			holeID: $selectedHoleStart,
			dashes: Dashes.ZERO,
			difficulty: Difficulty.EASY,
			isIn: false
		});
	}

	function closeCollectableView() {
		collectablesMode.set(false);
		selectedCollectable.set('');
	}
</script>

<div class="link-editor flex items-center mt-3">
	<Button class="shrink-0 mr-2" color={'alternative'} on:click={addSpawn}>Add spawn</Button>
	<Button class="shrink-0 mr-2" color={'alternative'} on:click={addStartSpawn}
		>Add start spawn</Button
	>
	<Button class="shrink-0 mr-2" color={'alternative'} on:click={closeCollectableView}
		>Close subroom view</Button
	>
</div>
