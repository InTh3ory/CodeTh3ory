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
            x: 0,
            y: 0,
            zoom: 2,
        },
        canvas: {
            w: 0,
            h: 0,
        },
        acre: {
            isCollision: (row, col, width, height) => {
                let collision = false;
                const acre = state.landscapeShop.acre;
                state.landscapeShop.acre.instances.forEach(a => {
                    const rect1 = { x: col, y: row, width, height };
                    const rect2 = { x: a.col, y: a.row, width: acre.w, height: acre.h }
                    if (rect1.x < rect2.x + rect2.width &&
                        rect1.x + rect1.width > rect2.x &&
                        rect1.y < rect2.y + rect2.height &&
                        rect1.y + rect1.height > rect2.y) {
                         collision = true;
                     }
                });
                return collision;
            }
        }
    };

    const pixelSize = 20;
    const assets = {};

    class Animal {
        constructor(x, y, src, size) {
            this.x = x;
            this.y = y;
            this.img = src;
            this.size = size;
        }

        update() {
            if (Math.random() < 0.02) {
                const xDir = (Math.random() * 2) - 1;
                const yDir = (Math.random() * 2) - 1;
                const newX = this.x + xDir * fs.boxel;
                const newY = this.y + yDir * fs.boxel;
                // Figure out which row and column we are in
                const newRow = Math.floor(newY / fs.boxel);
                const newCol = Math.floor(newX / fs.boxel);
                // Is this on an acre?
                let canMove = false;

                const acre = state.landscapeShop.acre;
                acre.instances.forEach(a => {
                    if (newRow >= a.row && newRow < (a.row + acre.w) && newCol >= a.col && newCol < (a.col + acre.h) ) {
                        canMove = true;
                    }
                });
                if (canMove) {
                    this.x = newX;
                    this.y = newY;
                }
            }
        }

        draw(ctx) {
            // Convert x and y to canvas coordinates
            // Game to canvas
            const canvasX = (this.x - fs.camera.x + (fs.canvas.w / (2 * fs.camera.zoom))) * fs.camera.zoom; // Game to Canvas
            const canvasY = (this.y - fs.camera.y + (fs.canvas.h / (2 * fs.camera.zoom))) * fs.camera.zoom;
            ctx.drawImage(this.img, canvasX, canvasY, this.size * fs.boxel * fs.camera.zoom, this.size * fs.boxel * fs.camera.zoom);
        }
    }

    class Acre {
        constructor(row, col, src, w, h) {
            this.row = row;
            this.col = col;
            this.img = src;
            this.w = w;
            this.h = h;
        }
        update() {

        }
        draw(ctx, itemX, itemY, boxel) {
            ctx.drawImage(this.img, itemX, itemY, this.w * boxel, this.h * boxel);
        }
    }
    class Wall {
        constructor(row, col, src, w, h) {
            this.row = row;
            this.col = col;
            this.img = src;
            this.w = w;
            this.h = h;
        }
        update() {

        }
        draw(ctx, itemX, itemY, boxel) {
            ctx.drawImage(this.img, itemX, itemY, this.w * boxel, this.h * boxel);
        }
    }

    class Sentry {
        constructor(row, col, src, w, h) {
            this.row = row;
            this.col = col;
            this.img = src;
            this.w = w;
            this.h = h;
        }
        update() {

        }
        draw(ctx, itemX, itemY, boxel) {
            ctx.drawImage(this.img, itemX, itemY, this.w * boxel, this.h * boxel);
        }
    }

    const init = () => {

        const toLoad = Object.keys(state.shop).length + Object.keys(state.landscapeShop).length;
        let loaded = 0;
        const isLoaded = () => {
            loaded++;
            if (loaded === toLoad ) {
                window.requestAnimationFrame(draw);
            }
        };

        // Load Animal Assets
        Object.keys(state.shop).forEach((key) => {
            const img = document.createElement('img');
            img.src = `assets/${key}.png`;
            img.onload = () => {
                assets[key] = img;
                isLoaded();
            };
            img.onerror= () => {
                isLoaded();
            };
        });

        // Load Landscape Assets
        Object.keys(state.landscapeShop).forEach((key) => {
            const img = document.createElement('img');
            img.src = `assets/${key}.png`;
            img.onload = () => {
                assets[key] = img;
                isLoaded();
            };
            img.onerror= () => {
                isLoaded();
            };
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                state.cart = [];
                rs.all();
            }
        });

        document.getElementById("canvas").addEventListener('mousemove', (evt) => {
            var rect = canvas.getBoundingClientRect();
            fs.mouse.x = (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
            fs.mouse.y = (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;

            const mouseGameX = fs.camera.x - (fs.canvas.w / (2 * fs.camera.zoom)) + (fs.mouse.x / fs.camera.zoom); // Canvas to Game Coordinate Conversion
            const mouseGameY = fs.camera.y - (fs.canvas.h / (2 * fs.camera.zoom)) + (fs.mouse.y / fs.camera.zoom);
            fs.mouse.row = Math.floor(mouseGameY / fs.boxel);
            fs.mouse.col = Math.floor(mouseGameX / fs.boxel);

            if (fs.mouse.down.is) {
                const dx = fs.mouse.x - fs.mouse.down.x;
                const dy = fs.mouse.y - fs.mouse.down.y;

                fs.camera.x = fs.mouse.down.ogCameraX - (dx / fs.camera.zoom);
                fs.camera.y = fs.mouse.down.ogCameraY - (dy / fs.camera.zoom);
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

            const cartItem = state.cart[0];
            if (state.cart.length) {
                if (cartItem === 'wall' || cartItem === 'sentry' || (cartItem === 'acre' && !fs.acre.isCollision(fs.mouse.row, fs.mouse.col, state.landscapeShop.acre.w, state.landscapeShop.acre.h))) {
                    const item = state.landscapeShop[cartItem];
                    const itemCost = (item.instances.length + 1) * item.cost;
                    if (itemCost <= state.monies) {

                        let instance;
                        switch (cartItem) {
                            case 'acre':
                                instance = new Acre(fs.mouse.row, fs.mouse.col, assets[cartItem], item.w, item.h);
                                break;
                            case 'wall':
                                instance = new Wall(fs.mouse.row, fs.mouse.col, assets[cartItem], item.w, item.h);
                                break;
                            case 'sentry':
                                instance = new Sentry(fs.mouse.row, fs.mouse.col, assets[cartItem], item.w, item.h);
                                break;
                        }
                        item.instances.push(instance);
    
                        state.monies -= itemCost;
    
                        state.cart.pop();
                        rs.all();
                    } else {
                        console.error('You cannot afford this. Press ESC to clear cart');
                    }
                }


                const animalKeys = Object.keys(state.shop);
                if (animalKeys.includes(cartItem) && fs.acre.isCollision(fs.mouse.row, fs.mouse.col, 1, 1)) {

                    const itemCost = (state.shop[cartItem].instances.length + 1) * state.shop[cartItem].cost;
                    if (itemCost <= state.monies) {
                        const animalX = fs.mouse.col * fs.boxel; // Column to game coordinates
                        const animalY = fs.mouse.row * fs.boxel; // Row to game coordinates
                        const animal = new Animal(animalX, animalY, assets[cartItem], state.shop[cartItem].size);
                        state.shop[cartItem].instances.push(animal);
    
                        state.monies -= itemCost;
    
                        state.cart.pop();
                        rs.shop();
                    } else {
                        console.error('You cannot afford this. Press ESC to clear cart');
                    }
                }    
                
                
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

    const toCanvas = (x) => {
        return x * pixelSize;
    };

    const renderGrid = (ctx, canvas, boxel, canvasZeroDFT, canvasZeroDFL) => {
        ctx.lineWidth = 0.25;
        const verticalBoxes = Math.ceil((canvas.height) / boxel);
        const horizontalBoxes = Math.ceil(canvas.width / boxel);

        // How far is 0,0 away from the nearest point


        for(let i = 0; i <= verticalBoxes; i++) {
            ctx.beginPath();
            const rowCoordinate = (i * boxel) - (canvasZeroDFT);

            ctx.moveTo(0, rowCoordinate);
            ctx.lineTo(verticalBoxes * boxel, rowCoordinate); // Draw Lines Left to Right
            ctx.stroke();
        }
        
        for (let i = 0; i <= horizontalBoxes; i++) {
            ctx.beginPath();
            const rowCoordinate = (i * boxel) - (canvasZeroDFL);

            ctx.moveTo(rowCoordinate, 0);
            ctx.lineTo(rowCoordinate, verticalBoxes * boxel); // Draw lines top to bottom
            ctx.stroke();
        }
    };
    const renderScene = (ctx, canvas, boxel, distanceFromTop, distanceFromLeft) => {
        // Determine game row / column of canvas pixel 0,0

        // How Many Columns?
        const numColumns = Math.ceil(canvas.width / boxel);
        const numRows = Math.ceil(canvas.width / boxel);
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numColumns; j++) {
                const mouseGameX = fs.camera.x - (fs.canvas.w / (2 * fs.camera.zoom)) + ((j * boxel) / fs.camera.zoom); // Canvas to Game Coordinate Conversion
                const mouseGameY = fs.camera.y - (fs.canvas.h / (2 * fs.camera.zoom)) + ((i * boxel) / fs.camera.zoom);
                const mr = Math.floor(mouseGameY / fs.boxel);
                const mc = Math.floor(mouseGameX / fs.boxel);

                // Debugging - Show Coordinates
                // ctx.fillStyle = 'rgba(0,0,0,0.4)';
                // ctx.fillText(`${mr} ${mc}`, (j * boxel) + 10 - distanceFromLeft, (i * boxel) + 10 - distanceFromTop);
                
                // Is there something in this box? If yes, draw it
                Object.values(state.landscapeShop).forEach(shopItem => {
                    shopItem.instances.forEach(instance => {
                        if (instance.row === mr && instance.col === mc) {
                            const canvasX = j * boxel;
                            const canvasY = i * boxel;
                            const itemX = (canvasX) - distanceFromLeft;
                            const itemY = (canvasY) - distanceFromTop;
                            instance.draw(ctx, itemX, itemY, boxel)
                        }
                    });
                });
            }
        }

        const animalKeys = Object.keys(state.shop);

        animalKeys.forEach(k => {
            state.shop[k].instances.forEach(i => i.draw(ctx));
        });
    };

    const update = (ctx) => {
        const animalKeys = Object.keys(state.shop);

        animalKeys.forEach(k => {
            state.shop[k].instances.forEach(i => i.update());
        });
    };

    const draw = () => {
        update();

        const canvas = document.getElementById("canvas");
        const size = 800;
        fs.canvas.w = size;
        fs.canvas.h = size;

        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');



        // Step 1: Figure out which boxel the camera is in
        const r = Math.floor(fs.camera.y / fs.boxel);
        const c = Math.floor(fs.camera.x / fs.boxel);
        // const distanceFromTop = fs.camera.y % (fs.boxel * fs.camera.zoom); // Pixels away from the top of the boxel the camera is in. Game scale.
        // const distanceFromLeft = fs.camera.x % (fs.boxel * fs.camera.zoom);

        const canvasZeroGameX = fs.camera.x - (canvas.width / (2 * fs.camera.zoom)); // x coordinate of canvas 0,0
        let canvasZeroDFL = 0;
        if (canvasZeroGameX < 0 ) {
            if (canvasZeroGameX % fs.boxel) {
                canvasZeroDFL = Math.abs(fs.boxel + (canvasZeroGameX % fs.boxel)) * fs.camera.zoom;
            }

        } else {
            canvasZeroDFL = Math.abs(canvasZeroGameX % (fs.boxel)) * fs.camera.zoom;
        }

        const canvasZeroGameY = fs.camera.y - (canvas.height / (2 * fs.camera.zoom)); // y coordinate of canvas 0,0
        let canvasZeroDFT = 0;
        if (canvasZeroGameX < 0 ) {
            if (canvasZeroGameY % fs.boxel) {
                canvasZeroDFT = Math.abs(fs.boxel + (canvasZeroGameY % fs.boxel)) * fs.camera.zoom;
            }
        } else {
            canvasZeroDFT = Math.abs(canvasZeroGameY % (fs.boxel)) * fs.camera.zoom;
        }


        // Step 1.5: Figure out which boxel the mouse is in
        const mouseGameX = fs.camera.x - (fs.canvas.w / (2 * fs.camera.zoom)) + (fs.mouse.x / fs.camera.zoom); // Canvas to Game Coordinate Conversion
        const mouseGameY = fs.camera.y - (fs.canvas.h / (2 * fs.camera.zoom)) + (fs.mouse.y / fs.camera.zoom);
        const mr = Math.floor(mouseGameY / fs.boxel);
        const mc = Math.floor(mouseGameX / fs.boxel);
        // console.log(mr, mc);

        // Step 2: Draw the box we are in according to the zoom
        const boxel = fs.boxel * fs.camera.zoom;



        if (state.cart.length) renderGrid(ctx, canvas, boxel, canvasZeroDFT, canvasZeroDFL);
        renderScene(ctx, canvas, boxel, canvasZeroDFT, canvasZeroDFL);

        if (state.cart.length) {
            const animalKeys = Object.keys(state.shop);
            // Render Cart Item
            const cartItem = state.cart[0];
            if (cartItem === 'acre') {
                const itemX = (Math.floor((fs.mouse.x + canvasZeroDFL) / boxel) * boxel) - canvasZeroDFL; // Canvas to Canvas
                const itemY = (Math.floor((fs.mouse.y + canvasZeroDFT) / boxel) * boxel) - canvasZeroDFT;
                const acre = state.landscapeShop['acre'];
                ctx.drawImage(assets['acre'], itemX, itemY, acre.w * boxel, acre.h * boxel);

                // Is there a collision?
                let isCollision = fs.acre.isCollision(fs.mouse.row, fs.mouse.col, acre.w, acre.h);
                if (isCollision) {
                    ctx.beginPath();
                    ctx.rect(itemX, itemY, acre.w * boxel, acre.h * boxel);
                    ctx.fillStyle = 'rgba(255,0,0,0.5)';
                    ctx.fill();
                }
            } else if (cartItem === 'wall' || cartItem === 'sentry') {
                const itemX = (Math.floor((fs.mouse.x + canvasZeroDFL) / boxel) * boxel) - canvasZeroDFL; // Canvas to Canvas
                const itemY = (Math.floor((fs.mouse.y + canvasZeroDFT) / boxel) * boxel) - canvasZeroDFT;
                const shopItem = state.landscapeShop[cartItem];
                ctx.drawImage(assets[cartItem], itemX, itemY, shopItem.w * boxel, shopItem.h * boxel);

            } else if (animalKeys.includes(cartItem)) {
                const animal = state.shop[cartItem];
                ctx.drawImage(assets[cartItem], fs.mouse.x, fs.mouse.y, animal.size * fs.boxel * fs.camera.zoom, animal.size * fs.boxel * fs.camera.zoom);
            }


        }


        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 2, 0, 2 * Math.PI * 2, false);
        ctx.fillStyle = 'red';
        ctx.fill();

        // Highlight the boxel the mouse is in
        // ctx.beginPath();
        // ctx.rect((Math.floor((fs.mouse.x + canvasZeroDFL) / boxel) * boxel) - canvasZeroDFL, (Math.floor((fs.mouse.y + canvasZeroDFT) / boxel) * boxel) - canvasZeroDFT, boxel, boxel);
        // ctx.fillStyle = 'rgba(0,0,255,0.1)';
        // ctx.fill();

       



        // setTimeout(() => { window.requestAnimationFrame(draw) }, 500);
        window.requestAnimationFrame(draw)
    };
    
    init();
})();
