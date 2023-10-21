<script lang="ts">
	import type { CollectableData } from '../stores/MapStore';
	import { Card, Button, Select, Input } from 'flowbite-svelte';
	import {
		CollectableType,
		collectablesMode,
		mapStore,
		selectedCollectable
	} from '../stores/MapStore';
	import CollectableLink from './CollectableLink.svelte';

	export let collectable: CollectableData;

	$: collectableLinks = mapStore
		.getRoom(undefined, $mapStore)
		.collectablesLinks.filter((link) => link.collectableID === collectable.id);

	let collectableTypes = [
		{ value: CollectableType.STRAWBERRY, name: 'Strawberry' },
		{ value: CollectableType.KEY, name: 'Key' }
	];

	function deleteCollectable() {
		mapStore.removeCollectable(collectable.id);
	}

	function editCollectableLinks() {
		if ($selectedCollectable == collectable.id) {
			collectablesMode.set(false);
			selectedCollectable.set('');
		} else {
			collectablesMode.set(true);
			selectedCollectable.set(collectable.id);
		}
	}
</script>

<Card class="max-w-none" color="navbar">
	<div class="mb-4 flex space-x-4">
		<div class="flex items-center space-x-2">
			<label for="dashes-select">Type:</label>
			<Select
				id="dashes-select"
				placeholder=""
				items={collectableTypes}
				bind:value={collectable.collectableType}
			/>
		</div>
		<div class="flex items-center space-x-2">
			<label for="index-input">Index:</label>
			<Input id="index-input" bind:value={collectable.index} />
		</div>
		<div class="flex items-center space-x-2">
			<Button color="red" on:click={deleteCollectable}>Delete Collectable</Button>
			<Button on:click={editCollectableLinks}>Edit Collectable links</Button>
		</div>
	</div>
	<div class="mb-4 flex-col space-y-4">
		{#each collectableLinks as link (link.id)}
			<CollectableLink {link} />
		{/each}
	</div>
	<div class="mb-4 flex space-x-4" />
</Card>
