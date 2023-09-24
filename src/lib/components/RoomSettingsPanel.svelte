<script lang="ts">
	import { roomName } from '../stores/MapStore';
	import { Label, Input } from 'flowbite-svelte';
</script>

<div class="mb-6">
	<Label for="room-input" class="block mb-2">Room name</Label>
	<Input id="room-input" placeholder="" bind:value={$roomName} />
</div>
