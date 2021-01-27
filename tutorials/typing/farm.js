(() => {
    /*
    
    */


    const landHeight = 1000;
    const landWidth = 1500;

    const fs = {
        boxel: 25,
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
        });
        document.getElementById("canvas").addEventListener('mouseup', (evt) => {
            --fs.mouse.down.is;
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


    const draw = () => {
        const canvas = document.getElementById("canvas");
        const size = 400;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');



        // Step 1: Figure out which boxel the camera is in
        const r = Math.floor(fs.camera.y / fs.boxel);
        const c = Math.floor(fs.camera.x / fs.boxel);
        const distanceFromTop = fs.camera.y % fs.boxel; // Pixels away from the top of the boxel the camera is in. Game scale.
        const distanceFromLeft = fs.camera.x % fs.boxel;

        // Step 1.5: Figure out which boxel the mouse is in
        const mouseGameX = fs.camera.x - (canvas.width / (2 * fs.camera.zoom)) + (fs.mouse.x / fs.camera.zoom); // Canvas to Game Coordinate Conversion
        const mouseGameY = fs.camera.y - (canvas.height / (2 * fs.camera.zoom)) + (fs.mouse.y / fs.camera.zoom);
        const mr = Math.floor(mouseGameY / fs.boxel);
        const mc = Math.floor(mouseGameX / fs.boxel);
        console.log(mr, mc);

        // Step 2: Draw the box we are in according to the zoom
        const boxel = fs.boxel * fs.camera.zoom;
        const verticalBoxes = Math.floor(canvas.height / boxel);
        const horizontalBoxes = Math.floor(canvas.width / boxel);

        // Draw Rows - Horizontal Lines
        for(let i = 0; i < verticalBoxes; i++) {
            ctx.beginPath();
            const rowCoordinate = (i * boxel) - distanceFromTop;

            ctx.moveTo(0, rowCoordinate);
            ctx.lineTo(verticalBoxes * boxel, rowCoordinate);
            ctx.stroke();
        }
        // Draw Columns - Vertical Lines
        for (let i = 0; i < horizontalBoxes; i++) {
            ctx.beginPath();
            const rowCoordinate = (i * boxel) - distanceFromLeft;

            ctx.moveTo(rowCoordinate, 0);
            ctx.lineTo(rowCoordinate, verticalBoxes * boxel);
            ctx.stroke();
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

        // const resolution = size / pixelSize;
        // const blockSize = resolution;

        // const rowNum = p(size / 2) / pixelSize;
        // const colNum = p(size / 2) / pixelSize;


        // Draw Land
        // const landCoords = pixelate( colNum, rowNum, state.land.size);
        // ctx.fillStyle = '#27ae60';
        // ctx.fillRect(landCoords.x, landCoords.y, landCoords.w, landCoords.h);
        // Draw Fence
        // ctx.lineWidth = 2;
        // ctx.strokeStyle = 'brown';
        // ctx.beginPath();
        // ctx.rect(landCoords.x, landCoords.y, landCoords.w, landCoords.h);
        // ctx.stroke();
        // Animal Boundaries
        // landBoundaries.xMin = landCoords.x;
        // landBoundaries.xMax = landCoords.x + landCoords.w - pixelSize;
        // landBoundaries.yMin = landCoords.y;
        // landBoundaries.yMax = landCoords.y + landCoords.h - pixelSize;

        // Object.entries(state.shop).forEach(([key, value]) => {
        //     if (!animals[key]) {
        //         animals[key] = [];
        //     }
        //     const animalsToAdd = value.owned - animals[key].length;
        //     if (animalsToAdd > 0) {

        //         for (let i =0; i < animalsToAdd; i++) {
        //             animals[key].push(new Animal(Math.random() * size, Math.random() * size, value.img, value.size));
        //         }

        //     } else if (animalsToAdd < 0) {

        //         for (let i = animalsToAdd; i < 0; i++) {
        //             animals[key].shift();
        //         }
        //     }
        // });

        // Object.entries(animals).forEach(([key, value]) => {
        //     value.forEach((animal) => {
        //         animal.update();
        //         animal.draw(ctx, assets[key]);
        //     });
        // });

        // const farmCoords = pixelate(colNum, rowNum, 5);
        // ctx.drawImage(assets.farm, farmCoords.x, farmCoords.y, farmCoords.w, farmCoords.h);


        // Grid Lines
        // ctx.lineWidth = 1;
        // for (let i = 0; i < resolution; i++) {
        //     ctx.strokeStyle = 'rgba(0,0,0,0.05)';
        //     ctx.beginPath();
        //     ctx.moveTo(i * pixelSize, 0);
        //     ctx.lineTo(i * pixelSize, size);
        //     ctx.stroke();
        //     ctx.moveTo(0, i * pixelSize);
        //     ctx.lineTo(size, i * pixelSize);
        //     ctx.stroke();
        // }


        setTimeout(() => { window.requestAnimationFrame(draw) }, 100);
    };
    
    init();
})();
