<script lang="ts">
	import { DarkMode } from 'flowbite-svelte';
	import Room from '../lib/Room.svelte';
	import LinkEditor from '$lib/LinkEditor.svelte';
</script>

<div class="grid grid-cols-2 w-screen h-screen">
	<div class="col-span-1">
		<div class="flex items-start justify-start">
			<DarkMode />
		</div>
		<div class="flex items-center justify-center">
			<Room />
		</div>
	</div>
	<div class="col-span-1">
		<LinkEditor />
	</div>
</div>
