<script>
	import { Tabs, TabItem } from 'flowbite-svelte';
	import LinkEditor from './LinkEditor.svelte';
	import ConfigurationCreatorPanel from './ConfigurationCreatorPanel.svelte';
	import RoomSettingsPanel from './RoomSettingsPanel.svelte';
	import ImportPanel from './ImportPanel.svelte';
	import RoomsList from './RoomsList.svelte';
	import LinksList from './LinksList.svelte';
</script>

<Tabs>
	<TabItem open title="Links">
		<LinkEditor />
		<LinksList />
	</TabItem>
	<TabItem title="Settings">
		<RoomSettingsPanel />
	</TabItem>
	<TabItem title="Export">
		<ConfigurationCreatorPanel />
	</TabItem>
	<TabItem title="Import">
		<ImportPanel />
	</TabItem>
	<TabItem title="Rooms">
		<RoomsList />
	</TabItem>
</Tabs>
