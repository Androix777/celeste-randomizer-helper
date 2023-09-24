<script lang="ts">
	import { Button, Label, Textarea } from 'flowbite-svelte';
	import { parseData } from '$lib/LoennDataParser';

	let data: string = '';

	function processData(event: Event) {
		parseData(data);
	}
</script>

<div class="mb-6">
	<Label for="yaml-textarea" class="block mb-2">Loenn data</Label>
	<Textarea id="yaml-textarea" rows="20" placeholder="data" bind:value={data} />
</div>

<Button class="mb-6" on:click={processData}>Process Data</Button>
