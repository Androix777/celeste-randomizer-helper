<script>
	import { Tabs, TabItem } from 'flowbite-svelte';
	import LinkEditor from './LinkEditor.svelte';
	import ExportPanel from './ExportPanel.svelte';
	import RoomSettingsPanel from './RoomSettingsPanel.svelte';
	import ImportPanel from './ImportPanel.svelte';
	import RoomsList from './RoomsList.svelte';
	import LinksList from './LinksList.svelte';
</script>

<Tabs>
	<TabItem title="Import">
		<ImportPanel />
	</TabItem>
	<TabItem title="Rooms">
		<RoomsList />
	</TabItem>
	<TabItem title="Room settings">
		<RoomSettingsPanel />
	</TabItem>
	<TabItem open title="Links">
		<LinkEditor />
		<LinksList />
	</TabItem>
	<TabItem title="Export">
		<ExportPanel />
	</TabItem>
</Tabs>
