<script lang="ts">
	import { COLLECTABLE_ELEMENT } from '../ContextConstants';
	import { getContext } from 'svelte';
	import { collectablesMode, mapStore, selectedCollectable } from '../stores/MapStore';
	import type { Writable } from 'svelte/store';
	import { P } from 'flowbite-svelte';

	$: collectable =
		$selectedCollectable != ''
			? mapStore.getCollectable($selectedCollectable, undefined, $mapStore)
			: undefined;

	let collectableElement: Writable<HTMLElement> = getContext(COLLECTABLE_ELEMENT);
</script>

{#if $collectablesMode && collectable}
	<div
		class="w-full h-full border bg-gray-700 dark:bg-gray-400 flex justify-center items-center z-10"
		bind:this={$collectableElement}
		role="none"
	>
		<P>Subroom</P>
	</div>
{/if}
