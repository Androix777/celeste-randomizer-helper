<script lang="ts">
	import { Button, Textarea } from 'flowbite-svelte';
	import { getYaml } from './YamlGenerator';

	let generatedYaml: string = '';

	function generate(event: Event) {
		generatedYaml = getYaml();
	}
</script>

<Textarea class="mt-10" rows="30" placeholder="yaml" bind:value={generatedYaml} />
<Button class="mt-2" on:click={generate}>Generate</Button>
