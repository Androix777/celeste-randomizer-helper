<script lang="ts">
	import { getContext } from 'svelte';
	import {
		selectedCollectable,
		mapStore,
		type CollectableLinkData,
		Difficulty,
		Dashes,
		WallPosition,
		isLastSelectedholeStart,
		selectedHoleStart,
		selectedHoleFinish
	} from '$lib/stores/MapStore';
	import type { Writable } from 'svelte/store';
	import LeaderLine from 'leader-line-new';
	import type { SocketType } from 'leader-line-new';
	import { HOLE_ELEMENTS, COLLECTABLE_ELEMENT } from '../ContextConstants';
	import { collectablesMode } from '$lib/stores/MapStore';

	interface Lines {
		[key: string]: LeaderLine;
	}

	interface HoleElements {
		[key: string]: HTMLElement;
	}

	let holeElements: Writable<HoleElements> = getContext(HOLE_ELEMENTS);
	let collectableElement: Writable<HTMLElement> = getContext(COLLECTABLE_ELEMENT);
	let previewLine: LeaderLine | null = null;
	let lines: Lines = {};

	const socketMap = {
		[WallPosition.DOWN]: 'top' as SocketType,
		[WallPosition.UP]: 'bottom' as SocketType,
		[WallPosition.LEFT]: 'right' as SocketType,
		[WallPosition.RIGHT]: 'left' as SocketType
	};

	const invertedWall = {
		[WallPosition.DOWN]: WallPosition.UP,
		[WallPosition.UP]: WallPosition.DOWN,
		[WallPosition.LEFT]: WallPosition.RIGHT,
		[WallPosition.RIGHT]: WallPosition.LEFT
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
			case WallPosition.DOWN:
				return { x: `${offset * 100}%`, y: '0%' };
			case WallPosition.UP:
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

		if (!$collectablesMode || !$collectableElement) return;
		if (
			($isLastSelectedholeStart && $selectedHoleStart != '') ||
			(!$isLastSelectedholeStart && $selectedHoleFinish != '')
		) {
			previewLine = new LeaderLine({
				start: $isLastSelectedholeStart ? $holeElements[$selectedHoleStart] : $collectableElement,
				end: $isLastSelectedholeStart ? $collectableElement : $holeElements[$selectedHoleFinish],
				startSocket: $isLastSelectedholeStart
					? socketMap[mapStore.getHole($selectedHoleStart).position]
					: socketMap[invertedWall[mapStore.getHole($selectedHoleFinish).position]],
				endSocket: $isLastSelectedholeStart
					? socketMap[invertedWall[mapStore.getHole($selectedHoleStart).position]]
					: socketMap[mapStore.getHole($selectedHoleFinish).position],
				color: 'rgba(0, 255, 0, 0.3)',
				path: 'straight',
				size: 25
			});
		}
	}

	function drawLines(): void {
		if (Object.keys(mapStore.getRoom().holes).length !== Object.keys($holeElements).length) {
			return;
		}

		Object.values(lines).forEach((line) => line.remove());
		lines = {};

		if (!$collectablesMode || !$collectableElement) return;

		Object.values(mapStore.getRoom().collectablesLinks).forEach((link: CollectableLinkData) => {
			if (link.collectableID !== $selectedCollectable) return;

			lines[link.id] = new LeaderLine({
				start: link.isIn ? $holeElements[link.holeID] : $collectableElement,
				end: link.isIn ? $collectableElement : $holeElements[link.holeID],
				startSocket: link.isIn
					? socketMap[mapStore.getHole(link.holeID).position]
					: socketMap[invertedWall[mapStore.getHole(link.holeID).position]],
				endSocket: link.isIn
					? socketMap[invertedWall[mapStore.getHole(link.holeID).position]]
					: socketMap[mapStore.getHole(link.holeID).position],
				color: dashColorMap[link.dashes],
				size: 12,
				outline: true,
				outlineColor: difficultyColorMap[link.difficulty],
				path: 'straight',
				outlineSize: 0.2
			});
		});
	}

	$: $selectedHoleStart,
		$selectedHoleFinish,
		$selectedCollectable,
		$mapStore,
		$holeElements,
		$collectablesMode,
		$collectableElement,
		$isLastSelectedholeStart,
		drawPreviewLine();
	$: $mapStore,
		$holeElements,
		$collectablesMode,
		$collectableElement,
		$selectedCollectable,
		drawLines();
</script>
