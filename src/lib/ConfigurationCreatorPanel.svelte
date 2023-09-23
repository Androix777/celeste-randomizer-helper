<script lang="ts">
	import { Button, Textarea, Label, Input } from 'flowbite-svelte';
	import { getYaml } from './YamlGenerator';
	import { roomName } from './HolesStore';

	let generatedYaml: string = '';

	function generate(event: Event) {
		generatedYaml = getYaml();
	}
</script>

<div class="mb-6">
	<Label for="room-input" class="block mb-2">Room name</Label>
	<Input id="room-input" placeholder="" bind:value={$roomName} />
</div>

<div class="mb-6">
	<Label for="yaml-textarea" class="block mb-2">Generated yaml</Label>
	<Textarea id="yaml-textarea" class="mb-6" rows="20" placeholder="yaml" bind:value={generatedYaml} />
</div>

<Button on:click={generate}>Generate</Button>
