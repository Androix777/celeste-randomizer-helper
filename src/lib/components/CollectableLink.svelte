<script lang="ts">
	import { Card, Button, Select, Input, Toggle, Label } from 'flowbite-svelte';
	import { Dashes, Difficulty, mapStore } from '../stores/MapStore';
	import type { CollectableLinkData } from '../stores/MapStore';

	export let link: CollectableLinkData;
	export let index: number;

	let holes = mapStore.getRoom().holes;
	let formattedHoles = holes.map((hole) => ({
		value: hole.id,
		name: `${hole.position} - ${hole.index}`
	}));

	export let deleteLink: (index: number) => void;
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
</script>

<Card class="mb-2">
	<div class="flex items-center space-x-2">
		<Label for={`hole-id`}>Hole ID:</Label>
		<Select
			id={`hole-id`}
			class="mb-2"
			placeholder="Select a hole"
			items={formattedHoles}
			bind:value={link.holeID}
		/>
	</div>
	<div class="flex items-center space-x-2">
		<Label for={`only-in`}>Only In (bubble):</Label>
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
