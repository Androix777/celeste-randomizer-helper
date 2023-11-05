<script lang="ts">
	import { CollectableType, type RoomData } from '$lib/stores/MapStore';
	import { onMount, afterUpdate } from 'svelte';

	export let room: RoomData;
	export let solidColor: string = '#cd523d';
	export let startColor: string = '#FFFFFF';
	export let bgColor: string = '#18202a';

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
		if (!room.loennData || !ctx) {
			clearCanvas();
			return;
		}

		fitToContainer();

		const roomWidth = room.loennData.solids[0]?.length || 0;
		const roomHeight = room.loennData.solids.length;

		cellSize = Math.round(Math.min(canvas.width / roomWidth, canvas.height / roomHeight));
		let detailLevel = 1;
		if (cellSize === 0) {
			detailLevel = Math.ceil(Math.max(roomWidth / canvas.width, roomHeight / canvas.height));
			cellSize = 1;
		}

		const offsetX = Math.round((canvas.width - (cellSize * roomWidth) / detailLevel) / 2);
		const offsetY = Math.round((canvas.height - (cellSize * roomHeight) / detailLevel) / 2);

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// start
		ctx.fillStyle = startColor;
		ctx.fillRect(
			offsetX,
			offsetY,
			(cellSize * roomWidth) / detailLevel,
			(cellSize * roomHeight) / detailLevel
		);

		// bg
		ctx.fillStyle = bgColor;
		for (let y = 0; y < room.loennData.bg.length; y++) {
			for (let x = 0; x < room.loennData.bg[y].length; x++) {
				if (room.loennData.bg[y][x] !== '0' && x % detailLevel == 0 && y % detailLevel == 0) {
					ctx.fillRect(
						offsetX + (x / detailLevel) * cellSize,
						offsetY + (y / detailLevel) * cellSize,
						cellSize,
						cellSize
					);
				}
			}
		}

		// solids
		ctx.fillStyle = solidColor;
		for (let y = 0; y < room.loennData.solids.length; y++) {
			for (let x = 0; x < room.loennData.solids[y].length; x++) {
				if (room.loennData.solids[y][x] !== '0' && x % detailLevel == 0 && y % detailLevel == 0) {
					ctx.fillRect(
						offsetX + (x / detailLevel) * cellSize,
						offsetY + (y / detailLevel) * cellSize,
						cellSize,
						cellSize
					);
				}
			}
		}

		// collectables
		for (const collectable of room.loennData.collectables) {
			const x = collectable.x / 8;
			const y = collectable.y / 8;

			if (collectable.collectableType === CollectableType.STRAWBERRY) {
				ctx.fillStyle = 'red';
			} else if (collectable.collectableType === CollectableType.KEY) {
				ctx.fillStyle = 'yellow';
			}

			ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
		}

		// spawns
		for (const spawn of room.loennData.spawns) {
			const x = spawn.x / 8;
			const y = spawn.y / 8;
			
			if(spawn.isFirst){
				ctx.fillStyle = 'Chartreuse';
			}else{
				ctx.fillStyle = 'green';
			}
			
			ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
		}

		// finishes
		for (const finish of room.loennData.finishes) {
			const x = finish.x / 8;
			const y = finish.y / 8;
			
			ctx.fillStyle = 'Pink';
			
			ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
		}
	}

	function clearCanvas() {
		if (ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	}
</script>

<canvas bind:this={canvas} />
