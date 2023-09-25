<script lang="ts">
	import { mapStore } from '../stores/MapStore';
	import LinkInfoPanel from './LinkInfoPanel.svelte';

	$: links = mapStore.getRoom(undefined, $mapStore).links;
</script>

<div class="overflow-scroll" style="max-height: 800px; min-height: 100px;">
	{#each Object.values(links) as link (link.id)}
		<div class="mb-4">
			<LinkInfoPanel {link} />
		</div>
	{/each}
</div>
