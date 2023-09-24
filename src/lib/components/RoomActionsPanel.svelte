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
	<TabItem title="Yaml">
		<ConfigurationCreatorPanel />
	</TabItem>
	<TabItem title="Loenn data">
		<MapLoennDataLoaderPanel />
	</TabItem>
</Tabs>
