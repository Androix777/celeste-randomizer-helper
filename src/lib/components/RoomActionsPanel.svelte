<script lang="ts">
	import { Tabs, TabItem } from 'flowbite-svelte';
	import ExportPanel from './ExportPanel.svelte';
	import RoomSettingsPanel from './RoomSettingsPanel.svelte';
	import ImportPanel from './ImportPanel.svelte';
	import RoomsList from './RoomsList.svelte';
	import LinksList from './LinksList.svelte';
	import CollectablesList from './CollectablesList.svelte';
	import CustomYamlPanel from './CustomYamlPanel.svelte';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	setContext('isInited', writable<boolean>(false));
</script>

<Tabs>
	<TabItem open title="Import">
		<ImportPanel />
	</TabItem>
	<TabItem title="Rooms">
		<RoomsList />
	</TabItem>
	<TabItem title="Links">
		<LinksList />
	</TabItem>
	<TabItem title="Special subrooms">
		<CollectablesList />
	</TabItem>
	<TabItem title="Room settings">
		<RoomSettingsPanel />
	</TabItem>
	<TabItem title="Custom YAML">
		<CustomYamlPanel />
	</TabItem>
	<TabItem title="Export">
		<ExportPanel />
	</TabItem>
</Tabs>
