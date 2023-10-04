<script lang="ts">
	import { Button, Label, Textarea } from 'flowbite-svelte';
	import { importLoenn } from '$lib/LoennImport';
	import { importYaml } from '$lib/YamlImport';

	let loennData: string = '';
	let yamlData: string = '';

	function processData(event: Event) {
		importLoenn(loennData);
		importYaml(yamlData);
	}
</script>

<div class="mb-6">
	<Label for="yaml-textarea" class="block mb-2">Loenn data</Label>
	<Textarea id="yaml-textarea" rows="10" placeholder="Loenn data" class="mb-2" bind:value={loennData} />
	<Label for="yaml-textarea" class="block mb-2">Yaml data</Label>
	<Textarea id="yaml-textarea" rows="10" placeholder="Yaml data" bind:value={yamlData} />
</div>

<Button class="mb-6" on:click={processData}>Process Data</Button>
