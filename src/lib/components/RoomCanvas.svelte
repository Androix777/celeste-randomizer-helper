<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let width = 70;
	let height = 23;
	let data =
		'00000000AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n00000000AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n00000000AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n000000000AAAAAAAAA000000000AAAAAAAAA00000AAAAA0AAAAAAAAAAAAAAAAAAAAAAA\n0000000000AAAAAAA00000000000AAAAAAA0000000000000AAAAAAAAAAAAAAAAAAAAAA\n00000000000AAAAAA000000000000AAAAA000000000000000AAA000AAAAAAAAAAAAAAA\n000000000000AA0AA0000000000000AAAA00000000000000000000000AAAAAAAAAA\n000000000000000000000000000000AAAA0000000000000000000000000AAAAAA\n000000000000000000000000000000AAAA00000000000000000000000000AAAA\n000000000000000000000000000000AAAA00000000000000000000000000AAAA\n000000000000000000000000000000AAAA00000000000000000000000000AAAA\nAAA000000000000000000000000000000000000000000000000000000000AAAAA\nAAAAAA000000000000000CCC0000000000000000CCC00000000000000000AAAAA\nAAAAAA000000000000000CCC0000000000000000CCC0000000000000000AAAAAAA\nAAAAAAA0000000000000CCCC000000000000000CCCC00000000AAAAAAAAAAAAAAAAAAA\nAAAAAAAA000000000000CCCCC00000000000000CCCC00000000AAAAAAAAAAAAAAAAAAA\nAAAAAAAA000000000000CCCCC00000000000000CCCAAA0000AAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAAAA0000AAAAACCC00000000000000CCCAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAAAAAAAAAAAAAAAAAA000000000000AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0000000AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

	function drawMatrix() {
		ctx = canvas.getContext('2d');
		if (ctx === null) {
			console.error('Failed to get 2d context');
			return;
		}
		let rows = data.split('\n');
		let matrix = rows.map((row) => row.split(''));

		// Добавляем нулевые строки в конце
		while (matrix.length < height) {
			matrix.push(new Array(width).fill('0'));
		}

		matrix = matrix.map((row) => {
			// Добавляем нулевые столбцы справа
			while (row.length < width) {
				row.push('0');
			}
			return row;
		});

		let cellWidth = Math.floor(canvas.width / width);
		let cellHeight = Math.floor(canvas.height / height);

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		matrix.forEach((row, rowIndex) => {
			row.forEach((cell, colIndex) => {
				ctx!.fillStyle = cell === '0' ? 'white' : 'black';
				ctx!.fillRect(
					Math.floor(colIndex * cellWidth),
					Math.floor(rowIndex * cellHeight),
					cellWidth,
					cellHeight
				);
			});
		});
	}

	onMount(() => {
		drawMatrix();
	});

	afterUpdate(() => {
		drawMatrix();
	});

	$: {
		if (canvas) {
			let canvasRatio = width / height;
			let containerRatio = 1;
			let scale = canvasRatio > containerRatio ? 700 / width : 700 / height;
			canvas.width = scale * width;
			canvas.height = scale * height;
			drawMatrix();
		}
	}
</script>

<div class="room-canvas">
	<canvas bind:this={canvas} />
</div>

<style>
	.room-canvas {
		grid-area: 2 / 2 / 3 / 3;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 700px;
		height: 700px;
		overflow: hidden;
	}

	canvas {
		max-width: 100%;
		max-height: 100%;
	}
</style>
