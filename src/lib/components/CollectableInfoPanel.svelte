<script lang="ts">
	import type { CollectableData, CollectableLinkData } from '../stores/MapStore';
	import { P, Card, Button, Select, Input, Toggle, Label } from 'flowbite-svelte';
	import { CollectableType, Dashes, Difficulty, mapStore } from '../stores/MapStore';

	export let collectable: CollectableData;

	let collectableTypes = [
		{ value: CollectableType.STRAWBERRY, name: 'Strawberry' },
		{ value: CollectableType.KEY, name: 'Key' }
	];

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

	function deleteCollectable() {
		mapStore.removeCollectable(collectable.id);
	}

	function addLink() {
		let newLink: CollectableLinkData = {
			holeID: 'default',
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

<Card class="max-w-none">
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
			<Card class="mb-2">
				<div class="flex items-center space-x-2">
					<Label for={`hole-id`}>Hole ID:</Label>
					<Input id={`hole-id`} class="mb-2" placeholder="Hole ID" bind:value={link.holeID} />
				</div>
				<div class="flex items-center space-x-2">
					<Label for={`only-in`}>Only In:</Label>
					<Toggle id={`only-in`} class="mb-2" bind:checked={link.isOnlyIn} />
				</div>
				<div class="flex items-center space-x-2">
					<Label for={`dashes-in`}>Dashes In:</Label>
					<Select
						id={`dashes-in`}
						class="mb-2"
						placeholder=""
						items={dashes}
						bind:value={link.dashesIn}
					/>
				</div>
				<div class="flex items-center space-x-2">
					<Label for={`difficulty-in`}>Difficulty In:</Label>
					<Select
						id={`difficulty-in`}
						class="mb-2"
						placeholder=""
						items={difficulties}
						bind:value={link.difficultyIn}
					/>
				</div>
				{#if !link.isOnlyIn}
					<div class="flex items-center space-x-2">
						<Label for={`dashes-out`}>Dashes Out:</Label>
						<Select
							id={`dashes-out`}
							class="mb-2"
							placeholder=""
							items={dashes}
							bind:value={link.dashesOut}
						/>
					</div>
					<div class="flex items-center space-x-2">
						<Label for={`difficulty-out`}>Difficulty Out:</Label>
						<Select
							id={`difficulty-out`}
							class="mb-2"
							placeholder=""
							items={difficulties}
							bind:value={link.difficultyOut}
						/>
					</div>
				{/if}
				<Button color="red" on:click={() => deleteLink(index)}>Delete Link</Button>
			</Card>
		{/each}
	</div>
	<div class="mb-4 flex space-x-4">
		<Button color="red" on:click={deleteCollectable}>Delete</Button>
	</div>
</Card>
