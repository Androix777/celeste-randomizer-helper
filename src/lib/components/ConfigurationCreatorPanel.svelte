<script lang="ts">
	import { Button, Textarea, Label } from 'flowbite-svelte';
	import { getYaml } from '../YamlGenerator';
	import { holesStore } from '../stores/MapStore';

	let generatedYaml: string = '';

	function generate(event: Event) {
		generatedYaml = getYaml();
	}

	function clearAll(event: Event) {
		holesStore.clear();
	}
</script>

<div class="mb-6">
	<Label for="yaml-textarea" class="block mb-2">Generated yaml</Label>
	<Textarea id="yaml-textarea" rows="20" placeholder="yaml" bind:value={generatedYaml} />
</div>

<Button class="mb-6" on:click={generate}>Generate</Button>
<br />
<Button on:click={clearAll}>Reset all</Button>
