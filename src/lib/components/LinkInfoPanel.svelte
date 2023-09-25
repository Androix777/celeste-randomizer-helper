<script lang="ts">
	import type { LinkData } from '../stores/MapStore';
	import { P, Card, Button } from 'flowbite-svelte';
	import { mapStore } from '../stores/MapStore';

	export let link: LinkData;

	function deleteLink() {
		mapStore.removeLink(link.id);
	}
</script>

<Card class="max-w-none">
	<div class="mb-4 flex space-x-4">
		<P>{mapStore.getHoleName(link.idStart)} - {mapStore.getHoleName(link.idFinish)}</P>
	</div>
	<div class="mb-4 flex space-x-4">
		<Button color="red" on:click={deleteLink}>Delete</Button>
	</div>
</Card>
