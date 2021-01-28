(() => {
    /*
    
    */


    const landHeight = 1000;
    const landWidth = 1500;

    const fs = {
        boxel: 10,
        mouse: {
            x: 0,
            y: 0,
            down: {
                is: 0,
                x: 0,
                y: 0,
                ogCameraX: 0,
                ogCameraY: 0,
            }
        },
        camera: {
            x: landWidth / 2,
            y: landHeight / 2,
            zoom: 1,
        },
        canvas: {
            w: 0,
            h: 0,
        }
    };

    const pixelSize = 20;
    const assets = {
        farm: null,
        rabbit: null,
    };
    const animals = {};
    const landBoundaries = { xMin: 0, xMax: 0, yMin: 0, yMax: 0 };

    class Animal {
        constructor(x, y, src, size) {
            this.x = x;
            this.y = y;
            this.img = src;
            this.size = size;
        }

        update() {
            const xDir = (Math.random() * 2) - 1;
            const yDir = (Math.random() * 2) - 1;
            this.x += xDir * pixelSize;
            this.y += yDir * pixelSize;
            
            if (this.x < landBoundaries.xMin) this.x = landBoundaries.xMin;
            if (this.x > landBoundaries.xMax) this.x = landBoundaries.xMax;
            if (this.y < landBoundaries.yMin) this.y = landBoundaries.yMin;
            if (this.y > landBoundaries.xMax) this.y = landBoundaries.yMax;
        }

        draw(ctx, img) {
            ctx.drawImage(img, this.x, this.y, this.size * pixelSize, this.size * pixelSize);
        }
    }

    const init = () => {
        const toLoad = 2;
        let loaded = 0;

        const isLoaded = () => {
            loaded++;
            if (loaded === toLoad ) {
                window.requestAnimationFrame(draw);
            }
        };

        const farmImg = document.createElement('img');
        farmImg.src = 'assets/farm.png';
        farmImg.onload = () => {
            assets.farm = farmImg;
            isLoaded();
        };

        const rabbitImg = document.createElement('img');
        rabbitImg.src = 'assets/rabbit.png';
        rabbitImg.onload = () => {
            assets.rabbit = rabbitImg;
            isLoaded();
        };

        const goatImg = document.createElement('img');
        goatImg.src = 'assets/goat.png';
        goatImg.onload = () => {
            assets.goat = goatImg;
            isLoaded();
        };

        const acreImg = document.createElement('img');
        acreImg.src = state.landscapeShop['acre'].img;
        acreImg.onload = () => {
            assets.acre = acreImg;
            isLoaded();
        };

        document.getElementById("canvas").addEventListener('mousemove', (evt) => {
            var rect = canvas.getBoundingClientRect();
            fs.mouse.x = (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
            fs.mouse.y = (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;

            if (fs.mouse.down.is) {
                const dx = fs.mouse.x - fs.mouse.down.x;
                const dy = fs.mouse.y - fs.mouse.down.y;
                fs.camera.x = fs.mouse.down.ogCameraX - dx;
                fs.camera.y = fs.mouse.down.ogCameraY - dy;
            }
        });
        // Drag
        document.getElementById("canvas").addEventListener('mousedown', (evt) => {
            var rect = canvas.getBoundingClientRect();
            fs.mouse.down.x = (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
            fs.mouse.down.y = (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
            fs.mouse.down.ogCameraX = fs.camera.x;
            fs.mouse.down.ogCameraY = fs.camera.y;
            ++fs.mouse.down.is;
            if (state.cart.length) {
                const mouseGameX = fs.camera.x - (fs.canvas.w / (2 * fs.camera.zoom)) + (fs.mouse.x / fs.camera.zoom); // Canvas to Game Coordinate Conversion
                const mouseGameY = fs.camera.y - (fs.canvas.h / (2 * fs.camera.zoom)) + (fs.mouse.y / fs.camera.zoom);
                const mr = Math.floor(mouseGameY / fs.boxel);
                const mc = Math.floor(mouseGameX / fs.boxel);
                
            }
        });
        document.getElementById("canvas").addEventListener('mouseup', (evt) => {
            --fs.mouse.down.is;
        });
        document.getElementById("canvas").addEventListener('wheel', (e) => {
            e.preventDefault();
            const newZoom = fs.camera.zoom + e.deltaY * -0.01;
            if (newZoom < 5 && newZoom > 0.4) {
                fs.camera.zoom+= e.deltaY * -0.005;
            }

        });

    };

    const p = (x) => {
        return pixelSize * Math.round(x / pixelSize);
    };
    const toCanvas = (x) => {
        return x * pixelSize;
    };

    const pixelate = (cx, cy, size) => {
        const shift = Math.floor(size / 2);
        const xPixel = cx - shift;
        const yPixel = cy - shift;
        return { x: toCanvas(xPixel), y: toCanvas(yPixel), w: pixelSize * size, h: pixelSize * size };

    };

    const renderGrid = (ctx, canvas, boxel, distanceFromTop, distanceFromLeft) => {
        ctx.lineWidth = 0.25;
        const verticalBoxes = Math.ceil((canvas.height) / boxel);
        const horizontalBoxes = Math.ceil(canvas.width / boxel);

        for(let i = 0; i <= verticalBoxes; i++) {
            ctx.beginPath();
            const rowCoordinate = (i * boxel) - (distanceFromTop);

            ctx.moveTo(0, rowCoordinate);
            ctx.lineTo(verticalBoxes * boxel, rowCoordinate);
            ctx.stroke();
        }
        // Draw Columns - Vertical Lines
        for (let i = 0; i <= horizontalBoxes; i++) {
            ctx.beginPath();
            const rowCoordinate = (i * boxel) - (distanceFromLeft);

            ctx.moveTo(rowCoordinate, 0);
            ctx.lineTo(rowCoordinate, verticalBoxes * boxel);
            ctx.stroke();
        }
    };

    const draw = () => {
        const canvas = document.getElementById("canvas");
        const size = 400;
        fs.canvas.w = size;
        fs.canvas.h = size;

        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');



        // Step 1: Figure out which boxel the camera is in
        const r = Math.floor(fs.camera.y / fs.boxel);
        const c = Math.floor(fs.camera.x / fs.boxel);
        const distanceFromTop = (fs.camera.y % fs.boxel) * fs.camera.zoom; // Pixels away from the top of the boxel the camera is in. Game scale.
        const distanceFromLeft = (fs.camera.x % fs.boxel) * fs.camera.zoom;

        // Step 1.5: Figure out which boxel the mouse is in
        const mouseGameX = fs.camera.x - (fs.canvas.w / (2 * fs.camera.zoom)) + (fs.mouse.x / fs.camera.zoom); // Canvas to Game Coordinate Conversion
        const mouseGameY = fs.camera.y - (fs.canvas.h / (2 * fs.camera.zoom)) + (fs.mouse.y / fs.camera.zoom);
        const mr = Math.floor(mouseGameY / fs.boxel);
        const mc = Math.floor(mouseGameX / fs.boxel);
        // console.log(mr, mc);

        // Step 2: Draw the box we are in according to the zoom
        const boxel = fs.boxel * fs.camera.zoom;


        if (state.cart.length) {
            renderGrid(ctx, canvas, boxel, distanceFromTop, distanceFromLeft);

            // Render Cart Item
            if (state.cart[0] === 'acre') {
                const itemX = (Math.floor((fs.mouse.x + distanceFromLeft) / boxel) * boxel) - distanceFromLeft;
                const itemY = (Math.floor((fs.mouse.y + distanceFromTop) / boxel) * boxel) - distanceFromTop;
                ctx.drawImage(assets['acre'], itemX, itemY, state.landscapeShop['acre'].w * boxel, state.landscapeShop['acre'].h * boxel);
            }

        }
        


        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 2, 0, 2 * Math.PI * 2, false);
        ctx.fillStyle = 'red';
        ctx.fill();

        // Highlight the boxel the mouse is in

        ctx.beginPath();
        ctx.rect((Math.floor((fs.mouse.x + distanceFromLeft) / boxel) * boxel) - distanceFromLeft, (Math.floor((fs.mouse.y + distanceFromTop) / boxel) * boxel) - distanceFromTop, boxel, boxel);
        ctx.fillStyle = 'blue';
        ctx.fill();

       



        // setTimeout(() => { window.requestAnimationFrame(draw) }, 500);
        window.requestAnimationFrame(draw)
    };
    
    init();
})();
