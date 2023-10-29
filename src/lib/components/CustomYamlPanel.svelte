<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import { configureMonacoYaml } from 'monaco-yaml';
	import schema from '../schema/schema.json';
	import { mapStore } from '$lib/stores/MapStore';
	import type { Writable } from 'svelte/store';
	import { calcErrors } from '$lib/SchemaTools';

	let editor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;
	let editorContainer: HTMLElement;

	let room = mapStore.getRoom();
	let isInited: Writable<boolean> = getContext('isInited');

	onMount(async () => {
		monaco = (await import('./../monaco')).default;
		if (!$isInited) {
			configureMonacoYaml(monaco, {
				schemas: [
					{
						fileMatch: ['**'],
						// @ts-expect-error TypeScript can’t narrow down the type of JSON imports
						schema: schema,
						uri: 'file:///myschema.json'
					}
				]
			});
			isInited.set(true);
		}

		const editor = monaco.editor.create(editorContainer);

		const model = monaco.editor.createModel(room.customYaml, 'yaml');
		editor.setModel(model);
		monaco.editor.setTheme('vs-dark');

		model.onDidChangeContent(() => {
			room.customYaml = model.getValue();
		});
	});

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		editor?.dispose();
		calcErrors(room);
	});
</script>

<div>
	<div class="container" bind:this={editorContainer} />
</div>

<style>
	.container {
		width: 100%;
		height: 800px;
	}
</style>
