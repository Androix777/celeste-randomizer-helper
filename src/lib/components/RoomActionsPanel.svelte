<script>
	import { Tabs, TabItem } from 'flowbite-svelte';
	import LinkEditor from './LinkEditor.svelte';
	import ConfigurationCreatorPanel from './ConfigurationCreatorPanel.svelte';
	import RoomSettingsPanel from './RoomSettingsPanel.svelte';
	import MapLoennDataLoaderPanel from './MapLoennDataLoaderPanel.svelte';
</script>

<Tabs>
	<TabItem open title="Links">
		<LinkEditor />
	</TabItem>
	<TabItem title="Settings">
		<RoomSettingsPanel />
	</TabItem>
	<TabItem title="Export Yaml">
		<ConfigurationCreatorPanel />
	</TabItem>
	<TabItem title="Import Loenn data">
		<MapLoennDataLoaderPanel />
	</TabItem>
</Tabs>
