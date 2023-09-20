<script lang="ts">
	import { selectedHoleStart, selectedHoleFinish, holesStore, linksStore } from '$lib/HolesStore';
	import HoleInfo from './HoleInfo.svelte';

	$: holeStart = $holesStore[$selectedHoleStart];
	$: holeFinish = $holesStore[$selectedHoleFinish];

	function createLink(event: Event) {
		if (holeStart && holeFinish) {
			linksStore.addLink({ idStart: $selectedHoleStart, idFinish: $selectedHoleFinish });
		}
	}
</script>

<div class="link-editor">
	<HoleInfo hole={holeStart} />
	<HoleInfo hole={holeFinish} />
	<button on:click={createLink}>Add link</button>
</div>
