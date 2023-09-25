<script lang="ts">
	import type { RoomData } from '$lib/stores/MapStore';
	import { onMount, afterUpdate } from 'svelte';

	export let room: RoomData;
	export let color: string = '#000000';
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
		if (!room.solids || !ctx) return;

		fitToContainer();

		const roomWidth = room.solids[0]?.length || 0;
		const roomHeight = room.solids.length;

		cellSize = Math.round(Math.min(canvas.width / roomWidth, canvas.height / roomHeight));

		const offsetX = Math.round((canvas.width - cellSize * roomWidth) / 2);
		const offsetY = Math.round((canvas.height - cellSize * roomHeight) / 2);

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = backgroundColor;
		ctx.fillRect(offsetX, offsetY, cellSize * roomWidth, cellSize * roomHeight);

		ctx.fillStyle = color;

		for (let y = 0; y < room.solids.length; y++) {
			for (let x = 0; x < room.solids[y].length; x++) {
				if (room.solids[y][x] !== '0') {
					ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
				}
			}
		}
	}
</script>

<canvas bind:this={canvas} />
