<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
	import { mapStore, type CollectableLinkData } from '../stores/MapStore';

	export let link: CollectableLinkData;

	function deleteCollectable() {
		mapStore.removeCollectableLink(link.id);
	}
</script>

<Card class="mb-2">
	{link.isIn ? 'from' : 'to'} - {mapStore.getHole(link.holeID).position}
	{mapStore.getHole(link.holeID).index}
	<Button color="red" on:click={deleteCollectable}>Delete</Button>
</Card>
