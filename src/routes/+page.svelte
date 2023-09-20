<script lang="ts">
	import Room from '../lib/Room.svelte';
	import LinkEditor from '$lib/LinkEditor.svelte';
</script>

<div class="app">
	<div class="top-panel panel">
		<center><h1>CELESTE RANDOMIZER HELPER</h1></center>
	</div>
	<div class="sidebar-panel panel">sidebar</div>
	<div class="room-editor-panel panel">
		<div class="room-panel panel">
			<Room />
		</div>
		<div class="room-settings-panel panel">
			<LinkEditor />
		</div>
	</div>
	<div class="bottom-panel panel">bottom panel</div>
</div>

<style>
	:global(body) {
		background-color: #121212;
		color: #ffffff;
		margin: 0;
	}

	.app {
		display: grid;
		grid-template-columns: 300px auto;
		grid-template-rows: 100px auto 100px;
		width: 100vw;
		height: 100vh;
		background-color: #242424;
	}

	.panel {
		background-color: #242424;
		border: 1px solid #444;
	}

	.sidebar-panel {
		grid-area: 2 / 1 / 3 / 2;
	}

	.top-panel {
		grid-area: 1 / 1 / 2 / 3;
	}

	.room-editor-panel {
		grid-area: 2 / 2 / 3 / 3;
		display: grid;
		grid-template-columns: 1100px auto;
	}

	.room-panel {
		grid-column: 1;
	}

	.room-settings-panel {
		grid-column: 2;
	}

	.bottom-panel {
		grid-area: 3 / 1 / 4 / 3;
	}
</style>
