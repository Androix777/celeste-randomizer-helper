<script lang="ts">
	import { CollectableType, mapStore } from '../stores/MapStore';
	import CollectableInfoPanel from './CollectableInfoPanel.svelte';
	import { Button } from 'flowbite-svelte';

	$: collectables = mapStore.getRoom(undefined, $mapStore).collectables;

	function addCollectable() {
		mapStore.addCollectable({ collectableType: CollectableType.STRAWBERRY, loennID: 0, links: [] });
	}
</script>

<Button class="mb-6" on:click={addCollectable}>Add new</Button>
<div class="overflow-scroll" style="max-height: 800px">
	{#each Object.values(collectables) as collectable (collectable.id)}
		<div class="mb-4">
			<CollectableInfoPanel {collectable} />
		</div>
	{/each}
</div>
