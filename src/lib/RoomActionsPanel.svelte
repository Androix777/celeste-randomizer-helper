<script>
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import LinkEditor from './LinkEditor.svelte';
	import RoomSettingsPanel from './RoomSettingsPanel.svelte';
	import ConfigurationCreatorPanel from './ConfigurationCreatorPanel.svelte';
</script>

<Accordion>
	<AccordionItem>
		<span slot="header">Adding links</span>
		<LinkEditor />
	</AccordionItem>
	<AccordionItem>
		<span slot="header">Room settings</span>
		<RoomSettingsPanel />
	</AccordionItem>
	<AccordionItem>
		<span slot="header">Creating yaml configuration</span>
		<ConfigurationCreatorPanel />
	</AccordionItem>
</Accordion>
