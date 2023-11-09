<script lang="ts">
	import type { HoleData } from '$lib/stores/MapStore';
	import {
		ButtonGroup,
		Card,
		Checkbox,
		Heading,
		InputAddon,
		Label,
		NumberInput
	} from 'flowbite-svelte';

	export let hole: HoleData;

	let lowBound = hole.lowBound;
	let isLowBound = lowBound != undefined;
	function updateLowBound() {
		hole.lowBound = isLowBound ? lowBound : undefined;
	}

	let highBound = hole.highBound;
	let isHighBound = highBound != undefined;
	function updateHighBound() {
		hole.highBound = isHighBound ? highBound : undefined;
	}

	let launch = hole.launch;
	let isLaunch = launch != undefined;
	function updateLaunch() {
		hole.launch = isLaunch ? launch : undefined;
	}

	let highOpen = hole.highOpen;
	function updateHighOpen() {
		hole.highOpen = highOpen;
	}
</script>

<Card class="max-w-none relative flex flex-wrap">
	<Heading tag="h5" class="mb-4 w-full">{hole.position} {hole.index}</Heading>

	<div class="w-full flex flex-wrap">
		<div class="w-1/2 pr-2">
			<Label class="mb-2" for="lowBound-input">LowBound</Label>
			<ButtonGroup class="w-full mb-2">
				<InputAddon>
					<Checkbox bind:checked={isLowBound} on:change={updateLowBound} />
				</InputAddon>
				<NumberInput id="lowBound-input" bind:value={lowBound} on:input={updateLowBound} />
			</ButtonGroup>
		</div>

		<div class="w-1/2 pl-2">
			<Label class="mb-2" for="highBound-input">HighBound</Label>
			<ButtonGroup class="w-full mb-2">
				<InputAddon>
					<Checkbox bind:checked={isHighBound} on:change={updateHighBound} />
				</InputAddon>
				<NumberInput id="highBound-input" bind:value={highBound} on:input={updateHighBound} />
			</ButtonGroup>
		</div>
	</div>

	<div class="w-full flex flex-wrap">
		<div class="w-1/2 pr-2">
			<Label class="mb-2" for="launch-input">Launch</Label>
			<ButtonGroup class="w-full mb-2">
				<InputAddon>
					<Checkbox bind:checked={isLaunch} on:change={updateLaunch} />
				</InputAddon>
				<NumberInput id="launch-input" bind:value={launch} on:input={updateLaunch} />
			</ButtonGroup>
		</div>

		<div class="w-1/2 pl-2 flex items-center pt-6">
			<Checkbox class="mb-2" bind:checked={highOpen} on:change={updateHighOpen}>HighOpen</Checkbox>
		</div>
	</div>
</Card>
