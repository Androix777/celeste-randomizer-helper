<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import type { CollectableLinkData } from '../stores/MapStore';

	export let link: CollectableLinkData;
</script>

<Card class="mb-2">
	Link {link.id}
</Card>
