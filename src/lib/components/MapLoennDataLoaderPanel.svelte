<script lang="ts">
	import { Button, Label, Textarea } from 'flowbite-svelte';

	let data: string = '';

	function processData(event: Event) {}
</script>

<div class="mb-6">
	<Label for="yaml-textarea" class="block mb-2">Loenn data</Label>
	<Textarea id="yaml-textarea" class="mb-6" rows="20" placeholder="data" bind:value={data} />
</div>

<Button class="mb-6" on:click={processData}>Process Data</Button>
