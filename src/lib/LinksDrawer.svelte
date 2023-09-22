<script lang="ts">
	import { getContext } from 'svelte';
	import {
		selectedHoleStart,
		selectedHoleFinish,
		holesStore,
		linksStore,
		type LinkData,
		Difficulty,
		Dashes,
		WallPosition
	} from '$lib/HolesStore';
	import type { Writable } from 'svelte/store';
	import LeaderLine from 'leader-line-new';
	import type { SocketType } from 'leader-line-new';
	import { HOLE_ELEMENTS, FOCUSED_HOLE } from './ContextConstants';
	import chroma from 'chroma-js';

	interface Lines {
		[key: string]: LeaderLine;
	}

	interface HoleElements {
		[key: string]: HTMLElement;
	}

	let holeElements: Writable<HoleElements> = getContext(HOLE_ELEMENTS);
	let focusedHole: Writable<string> = getContext(FOCUSED_HOLE);
	let previewLine: LeaderLine | null = null;
	let lines: Lines = {};

	const socketMap = {
		[WallPosition.BOTTOM]: 'top' as SocketType,
		[WallPosition.TOP]: 'bottom' as SocketType,
		[WallPosition.LEFT]: 'right' as SocketType,
		[WallPosition.RIGHT]: 'left' as SocketType
	};

	const difficultyColorMap = {
		[Difficulty.EASY]: 'green',
		[Difficulty.NORMAL]: 'yellow',
		[Difficulty.HARD]: 'orange',
		[Difficulty.EXPERT]: 'red',
		[Difficulty.MASTER]: 'purple',
		[Difficulty.PERFECT]: 'black'
	};

	const dashColorMap = {
		[Dashes.ZERO]: 'blue',
		[Dashes.ONE]: 'red',
		[Dashes.TWO]: 'pink'
	};

	function getSocketCoordinates(position: WallPosition, offset: number): { x: string; y: string } {
		switch (position) {
			case WallPosition.BOTTOM:
				return { x: `${offset * 100}%`, y: '0%' };
			case WallPosition.TOP:
				return { x: `${offset * 100}%`, y: '100%' };
			case WallPosition.LEFT:
				return { x: '100%', y: `${offset * 100}%` };
			case WallPosition.RIGHT:
				return { x: '0%', y: `${offset * 100}%` };
			default:
				throw new Error(`Unknown wall position: ${position}`);
		}
	}

	function drawPreviewLine(): void {
		if (previewLine) {
			previewLine.remove();
			previewLine = null;
		}

		if ($selectedHoleStart && $selectedHoleFinish && $selectedHoleStart !== $selectedHoleFinish) {
			previewLine = new LeaderLine({
				start: $holeElements[$selectedHoleStart],
				end: $holeElements[$selectedHoleFinish],
				startSocket: socketMap[$holesStore[$selectedHoleStart].position],
				endSocket: socketMap[$holesStore[$selectedHoleFinish].position],
				color: 'rgba(255, 255, 255, 0.2)',
				size: 20
			});
		}
	}

	function drawLines(): void {
		if (Object.keys($holesStore).length !== Object.keys($holeElements).length) {
			return;
		}

		Object.values(lines).forEach((line) => line.remove());
		lines = {};

		let holeConnections: { [id: string]: number } = {};
		let holeConnectionsDone: { [id: string]: number } = {};

		Object.values($linksStore).forEach((link: LinkData) => {
			if (link.idStart === link.idFinish) return;
			holeConnections[link.idStart] = (holeConnections[link.idStart] || 0) + 1;
			holeConnections[link.idFinish] = (holeConnections[link.idFinish] || 0) + 1;
		});

		Object.values($linksStore).forEach((link: LinkData) => {
			if (link.idStart === link.idFinish) return;

			holeConnectionsDone[link.idStart] = (holeConnectionsDone[link.idStart] || 0) + 1;
			holeConnectionsDone[link.idFinish] = (holeConnectionsDone[link.idFinish] || 0) + 1;

			const stepStart = 1 / (holeConnections[link.idStart] + 1);
			const stepFinish = 1 / (holeConnections[link.idFinish] + 1);

			const startOffset = holeConnectionsDone[link.idStart] * stepStart;
			const finishOffset = holeConnectionsDone[link.idFinish] * stepFinish;

			lines[link.id] = new LeaderLine({
				start: LeaderLine.pointAnchor(
					$holeElements[link.idStart],
					getSocketCoordinates($holesStore[link.idStart].position, startOffset)
				),
				end: LeaderLine.pointAnchor(
					$holeElements[link.idFinish],
					getSocketCoordinates($holesStore[link.idFinish].position, finishOffset)
				),
				startSocket: socketMap[$holesStore[link.idStart].position],
				endSocket: socketMap[$holesStore[link.idFinish].position],
				color: dashColorMap[link.dashes],
				size: 12,
				outline: true,
				outlineColor: difficultyColorMap[link.difficulty],
				outlineSize: 0.2
			});
		});
	}

	function adjustLineOpacity(): void {
		const focusedHoleId = $focusedHole;
		for (const [key, line] of Object.entries(lines)) {
			const link = $linksStore[key];
			const isLineFocused = link.idStart === focusedHoleId;
			const opacity = focusedHoleId && !isLineFocused ? 0.2 : 1;
			line.color = chroma(dashColorMap[link.dashes]).alpha(opacity).css();
			line.outlineColor = chroma(difficultyColorMap[link.difficulty]).alpha(opacity).css();
		}
	}

	$: $selectedHoleStart, $selectedHoleFinish, $holesStore, $holeElements, drawPreviewLine();
	$: $holesStore, $holeElements, $linksStore, drawLines();
	$: $focusedHole, adjustLineOpacity();
</script>
