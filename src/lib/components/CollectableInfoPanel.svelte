<script lang="ts">
	import type { CollectableData, CollectableLinkData } from '../stores/MapStore';
	import { P, Card, Button, Select, Input } from 'flowbite-svelte';
	import { CollectableType, Dashes, Difficulty, mapStore } from '../stores/MapStore';
	import CollectableLink from './CollectableLink.svelte';

	export let collectable: CollectableData;

	let collectableTypes = [
		{ value: CollectableType.STRAWBERRY, name: 'Strawberry' },
		{ value: CollectableType.KEY, name: 'Key' }
	];

	function deleteCollectable() {
		mapStore.removeCollectable(collectable.id);
	}

	function addLink() {
		let newLink: CollectableLinkData = {
			holeID: '',
			dashesIn: Dashes.ONE,
			difficultyIn: Difficulty.EASY,
			isOnlyIn: false,
			dashesOut: Dashes.ONE,
			difficultyOut: Difficulty.EASY
		};

		let updatedCollectable = { ...collectable };
		updatedCollectable.links.push(newLink);
		mapStore.updateCollectable(updatedCollectable);
	}

	function deleteLink(index: number) {
		let updatedCollectable = { ...collectable };
		updatedCollectable.links.splice(index, 1);
		mapStore.updateCollectable(updatedCollectable);
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
			<label for="id-input">ID:</label>
			<Input id="id-input" class="mb-2" placeholder="id" bind:value={collectable.loennID} />
		</div>
	</div>
	<div class="mb-4 flex-col space-y-4">
		<Button color="green" on:click={addLink}>Add Link</Button>
		{#each collectable.links as link, index}
			<CollectableLink {link} {index} {deleteLink} />
		{/each}
	</div>
	<div class="mb-4 flex space-x-4">
		<Button color="red" on:click={deleteCollectable}>Delete Collectable</Button>
	</div>
</Card>
