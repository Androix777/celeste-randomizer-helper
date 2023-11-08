<script lang="ts">
	import { createEventDispatcher, getContext, onDestroy, onMount } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
	import { configureMonacoYaml } from 'monaco-yaml';
	import type { Writable } from 'svelte/store';
	import roomSchema from '$lib/schema/roomSchema.json';
	import tweaksSchema from '$lib/schema/tweaksSchema.json';

	export let text: string;
	export let uri: 'roomSchema.yaml' | 'tweaksSchema.yaml';

	let editor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;
	let editorContainer: HTMLElement;

	let isInited: Writable<boolean> = getContext('isInited');

	const dispatch = createEventDispatcher<{ textChanged: string }>();

	onMount(async () => {
		monaco = (await import('../monaco')).default;

		if (!$isInited!) {
			configureMonacoYaml(monaco, {
				schemas: [
					{
						fileMatch: ['roomSchema.yaml'],
						// @ts-expect-error TypeScript can’t narrow down the type of JSON imports
						schema: roomSchema,
						uri: 'file:///roomSchema.json'
					},
					{
						fileMatch: ['tweaksSchema.yaml'],
						// @ts-expect-error TypeScript can’t narrow down the type of JSON imports
						schema: tweaksSchema,
						uri: 'file:///tweaksSchema.json'
					}
				]
			});
			isInited.set(true);
		}

		const editor = monaco.editor.create(editorContainer);

		const model = monaco.editor.createModel(text, 'yaml', monaco.Uri.parse(uri));
		editor.setModel(model);
		monaco.editor.setTheme('vs-dark');

		model.onDidChangeContent(() => {
			dispatch('textChanged', model.getValue());
		});
	});

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		editor?.dispose();
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
