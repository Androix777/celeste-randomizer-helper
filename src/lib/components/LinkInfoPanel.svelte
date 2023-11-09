<script lang="ts">
	import type { LinkData } from '../stores/MapStore';
	import { P, Card, Button, Heading } from 'flowbite-svelte';
	import { mapStore } from '../stores/MapStore';

	export let link: LinkData;

	function deleteLink() {
		mapStore.removeLink(link.id);
	}
</script>

<Card class="max-w-none">
	<div class="mb-4 flex space-x-4">
		<Heading tag="h5"
			>{mapStore.getHole(link.idStart).position}
			{mapStore.getHole(link.idStart).index} - {mapStore.getHole(link.idFinish).position}
			{mapStore.getHole(link.idFinish).index}</Heading
		>
	</div>
	<div class="mb-4 flex space-x-4">
		<Button color="red" on:click={deleteLink}>Delete</Button>
	</div>
</Card>
