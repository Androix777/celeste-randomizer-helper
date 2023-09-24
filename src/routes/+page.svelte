<script lang="ts">
	import { DarkMode } from 'flowbite-svelte';
	import Room from '../lib/components/Room.svelte';
	import RoomActionsPanel from '$lib/components/RoomActionsPanel.svelte';
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
		<RoomActionsPanel />
	</div>
</div>
