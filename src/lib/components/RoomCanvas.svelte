<script lang="ts">
	import type { RoomData } from '$lib/stores/MapStore';
	import { onMount, afterUpdate } from 'svelte';

	export let room: RoomData;
	export let color: string = '#cd523d';
	export let backgroundColor: string = '#FFFFFF';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let cellSize: number;

	onMount(() => {
		ctx = canvas.getContext('2d');
		drawRoom();
	});

	afterUpdate(drawRoom);

	function fitToContainer() {
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
	}

	function drawRoom() {
		if (!room.solids || !ctx) {
			clearCanvas();
			return;
		}

		fitToContainer();

		const roomWidth = room.solids[0]?.length || 0;
		const roomHeight = room.solids.length;

		cellSize = Math.round(Math.min(canvas.width / roomWidth, canvas.height / roomHeight));
		let detailLevel = 1;
		if (cellSize === 0) {
			detailLevel = Math.ceil(Math.max(roomWidth / canvas.width, roomHeight / canvas.height));
			cellSize = 1;
			console.log(detailLevel);
		}

		const offsetX = Math.round((canvas.width - (cellSize * roomWidth) / detailLevel) / 2);
		const offsetY = Math.round((canvas.height - (cellSize * roomHeight) / detailLevel) / 2);

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = backgroundColor;
		ctx.fillRect(
			offsetX,
			offsetY,
			(cellSize * roomWidth) / detailLevel,
			(cellSize * roomHeight) / detailLevel
		);

		ctx.fillStyle = color;

		for (let y = 0; y < room.solids.length; y++) {
			for (let x = 0; x < room.solids[y].length; x++) {
				if (room.solids[y][x] !== '0' && x % detailLevel == 0 && y % detailLevel == 0) {
					ctx.fillRect(
						offsetX + (x / detailLevel) * cellSize,
						offsetY + (y / detailLevel) * cellSize,
						cellSize,
						cellSize
					);
				}
			}
		}
	}

	function clearCanvas() {
		if (ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	}
</script>

<canvas bind:this={canvas} />
