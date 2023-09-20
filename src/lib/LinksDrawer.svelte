<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import {
		selectedHoleStart,
		selectedHoleFinish,
		holesStore,
		linksStore,
		type LinkData,
		Difficulty,
		Dashes
	} from '$lib/HolesStore';
	import type { default as ImportedLeaderLine } from 'leader-line-new';
	import { WallPosition } from '$lib/HolesStore';
	import type { Writable } from 'svelte/store';

	let holeElements: Writable<{ [key: string]: HTMLElement }> = getContext('holeElements');
	let previewLine: ImportedLeaderLine | null = null;
	let LeaderLine: typeof ImportedLeaderLine | null = null;
	let lines: { [key: string]: ImportedLeaderLine } = {};

	function getSocket(position: WallPosition): 'top' | 'bottom' | 'left' | 'right' {
		switch (position) {
			case WallPosition.BOTTOM:
				return 'top';
			case WallPosition.TOP:
				return 'bottom';
			case WallPosition.LEFT:
				return 'right';
			case WallPosition.RIGHT:
				return 'left';
			default:
				throw new Error('Unknown wall position: ${position}');
		}
	}

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

	function getDifficultyColor(difficulty: Difficulty): string {
		switch (difficulty) {
			case Difficulty.EASY:
				return 'green';
			case Difficulty.NORMAL:
				return 'yellow';
			case Difficulty.HARD:
				return 'orange';
			case Difficulty.EXPERT:
				return 'red';
			case Difficulty.MASTER:
				return 'purple';
			case Difficulty.PERFECT:
				return 'black';
			default:
				throw new Error(`Unknown difficulty level: ${difficulty}`);
		}
	}

	function getDashesColor(dashes: Dashes): string {
		switch (dashes) {
			case Dashes.ZERO:
				return 'blue';
			case Dashes.ONE:
				return 'red';
			case Dashes.TWO:
				return 'pink';
			default:
				throw new Error(`Unknown dashes number: ${dashes}`);
		}
	}

	onMount(async () => {
		const { default: ImportedLeaderLine } = await import('leader-line-new');
		LeaderLine = ImportedLeaderLine;
	});

	$: {
		if (previewLine) {
			previewLine.remove();
			previewLine = null;
		}
		if (
			!LeaderLine ||
			!$selectedHoleStart ||
			!$selectedHoleFinish ||
			$selectedHoleStart == $selectedHoleFinish
		)
			break $;

		previewLine = new LeaderLine({
			start: $holeElements[$selectedHoleStart],
			end: $holeElements[$selectedHoleFinish],
			startSocket: getSocket($holesStore[$selectedHoleStart].position),
			endSocket: getSocket($holesStore[$selectedHoleFinish].position),
			color: 'rgba(255, 255, 255, 0.2)',
			size: 20
		});
	}

	$: {
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
			if (!LeaderLine || link.idStart == link.idFinish) return;

			holeConnectionsDone[link.idStart] = (holeConnectionsDone[link.idStart] || 0) + 1;
			holeConnectionsDone[link.idFinish] = (holeConnectionsDone[link.idFinish] || 0) + 1;

			let stepStart = 1 / (holeConnections[link.idStart] + 1);
			let stepFinish = 1 / (holeConnections[link.idFinish] + 1);

			let startOffset = holeConnectionsDone[link.idStart] * stepStart;
			let finishOffset = holeConnectionsDone[link.idFinish] * stepFinish;

			lines[link.id] = new LeaderLine({
				start: LeaderLine.pointAnchor($holeElements[link.idStart] , getSocketCoordinates($holesStore[link.idStart].position, startOffset)),
				end: LeaderLine.pointAnchor($holeElements[link.idFinish] , getSocketCoordinates($holesStore[link.idFinish].position, finishOffset)),
				startSocket: getSocket($holesStore[link.idStart].position),
				endSocket: getSocket($holesStore[link.idFinish].position),
				color: getDashesColor(link.dashes),
				size: 12,
				outline: true,
				outlineColor: getDifficultyColor(link.difficulty),
				outlineSize: 0.3,
			});
		});
	}
</script>
