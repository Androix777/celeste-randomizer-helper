<script lang="ts">
	import { mapStore } from '../stores/MapStore';
	import HoleInfoPanel from './HoleInfoPanel.svelte';

	$: holes = mapStore.getRoom(undefined, $mapStore).holes;
</script>

<div class="overflow-scroll" style="max-height: 600px; min-height: 100px;">
	{#each Object.values(holes) as hole (hole.id)}
		<div class="mb-4">
			<HoleInfoPanel {hole} />
		</div>
	{/each}
</div>
