<script lang="ts">
	import Room from '../lib/components/Room.svelte';
	import RoomActionsPanel from '$lib/components/RoomActionsPanel.svelte';
	import LinkEditor from '$lib/components/LinkEditor.svelte';
</script>

<div class="grid grid-cols-2 w-screen h-screen">
	<div class="col-span-1 flex flex-col items-center justify-start">
		<div class="mb-5" style="width: 700px;">
			<LinkEditor />
		</div>
		<Room />
	</div>
	<div class="col-span-1 mt-5">
		<RoomActionsPanel />
	</div>
</div>
