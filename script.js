//   <!-- Include THREE.js library -->

        let scene, camera, renderer, cake, candles = [], candleLights = [];
        let cakeClicked = false;
        let scrollEnabled = false;

        function initCake() {
            // Create scene
            scene = new THREE.Scene();

            // Create camera
            camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );

            // Create renderer
            renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById("cake-canvas").appendChild(renderer.domElement);

            // Add lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(10, 10, 10);
            scene.add(directionalLight);

            // Create cake group
            const cakeGroup = new THREE.Group();

            // Bottom layer
            const bottomLayer = new THREE.CylinderGeometry(5, 5, 2, 32);
            const bottomMaterial = new THREE.MeshPhongMaterial({
                color: 0xffb6c1
            });
            const bottomCake = new THREE.Mesh(bottomLayer, bottomMaterial);
            cakeGroup.add(bottomCake);

            // Middle layer
            const middleLayer = new THREE.CylinderGeometry(4, 4, 2, 32);
            const middleMaterial = new THREE.MeshPhongMaterial({
                color: 0xffc0cb
            });
            const middleCake = new THREE.Mesh(middleLayer, middleMaterial);
            middleCake.position.y = 2;
            cakeGroup.add(middleCake);

            // Top layer
            const topLayer = new THREE.CylinderGeometry(3, 3, 2, 32);
            const topMaterial = new THREE.MeshPhongMaterial({
                color: 0xffcccb
            });
            const topCake = new THREE.Mesh(topLayer, topMaterial);
            topCake.position.y = 4;
            cakeGroup.add(topCake);

            // Add frosting and candles
            addFrosting(cakeGroup);
            addCandles(cakeGroup);

            // Add cake to scene
            scene.add(cakeGroup);
            cake = cakeGroup;

            // Position camera
            camera.position.z = 15;
            camera.position.y = 5;

            // Start animation
            animate();

            // Add click event listener
            renderer.domElement.addEventListener("click", handleCakeClick);
        }

        function addFrosting(cakeGroup) {
            // Bottom layer frosting
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                const x = Math.cos(angle) * 5;
                const z = Math.sin(angle) * 5;
                const frosting = new THREE.SphereGeometry(0.5, 8, 8);
                const frostingMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffffff
                });
                const frostingMesh = new THREE.Mesh(frosting, frostingMaterial);
                frostingMesh.position.set(x, 0.8, z);
                cakeGroup.add(frostingMesh);
            }

            // Middle layer frosting
            for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * Math.PI * 2;
                const x = Math.cos(angle) * 4;
                const z = Math.sin(angle) * 4;
                const frosting = new THREE.SphereGeometry(0.4, 8, 8);
                const frostingMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffffff
                });
                const frostingMesh = new THREE.Mesh(frosting, frostingMaterial);
                frostingMesh.position.set(x, 2.8, z);
                cakeGroup.add(frostingMesh);
            }

            // Top layer frosting
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const x = Math.cos(angle) * 3;
                const z = Math.sin(angle) * 3;
                const frosting = new THREE.SphereGeometry(0.3, 8, 8);
                const frostingMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffffff
                });
                const frostingMesh = new THREE.Mesh(frosting, frostingMaterial);
                frostingMesh.position.set(x, 4.8, z);
                cakeGroup.add(frostingMesh);
            }
        }

        function addCandles(cakeGroup) {
            const positions = [
                { x: 0, y: 5.5, z: 0 },      // Center
                { x: 1.5, y: 5.5, z: 0 },    // Right
                { x: -1.5, y: 5.5, z: 0 },   // Left
                { x: 0, y: 5.5, z: 1.5 },    // Front
                { x: 0, y: 5.5, z: -1.5 }    // Back
            ];

            positions.forEach((pos, index) => {
                // Create candle
                const candleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
                const candleMaterial = new THREE.MeshPhongMaterial({
                    color: 0xf5deb3
                });
                const candle = new THREE.Mesh(candleGeometry, candleMaterial);
                candle.position.set(pos.x, pos.y, pos.z);
                cakeGroup.add(candle);
                candles.push(candle);

                // Create candle light
                const candleLight = new THREE.PointLight(0xffcc00, 1, 3);
                candleLight.position.set(pos.x, pos.y + 0.7, pos.z);
                cakeGroup.add(candleLight);
                candleLights.push(candleLight);

                // Create flame
                const flameGeometry = new THREE.ConeGeometry(0.15, 0.4, 16);
                const flameMaterial = new THREE.MeshPhongMaterial({
                    color: 0xff9900,
                    emissive: 0xff6600,
                    transparent: true,
                    opacity: 0.9
                });
                const flame = new THREE.Mesh(flameGeometry, flameMaterial);
                flame.position.set(pos.x, pos.y + 0.7, pos.z);
                cakeGroup.add(flame);
                candles.push(flame);
            });
        }

        function animate() {
            requestAnimationFrame(animate);

            // Animate candles
            candles.forEach((obj, index) => {
                if (index % 2 === 1 && !cakeClicked) {
                    obj.rotation.y += 0.05;
                    obj.position.y += Math.sin(Date.now() * 0.01) * 0.001;
                }
            });

            // Rotate cake if clicked
            if (cakeClicked) {
                cake.rotation.y += 0.03;
            }

            renderer.render(scene, camera);
        }

        function handleCakeClick() {
            if (!cakeClicked) {
                cakeClicked = true;
                document.getElementById("instructions").style.display = "none";

                // Hide flames
                candles.forEach((obj, index) => {
                    if (index % 2 === 1) {
                        obj.visible = false;
                    }
                });

                // Turn off lights
                candleLights.forEach((light) => {
                    light.intensity = 0;
                });

                // Show confetti
                document.getElementById("confetti-canvas").style.display = "block";
                createConfetti();

                // Enable scrolling
                scrollEnabled = true;

                // Show scroll instruction
                setTimeout(() => {
                    document.getElementById("scroll-instruction").style.display = "block";
                }, 1000);
            }
        }

        function createConfetti() {
            const canvas = document.getElementById("confetti-canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const confettiCount = 200;
            const confettiColors = [
                "#ff4081", "#ff9e80", "#ffff8d", "#b9f6ca",
                "#80d8ff", "#8c9eff", "#ea80fc"
            ];

            const confetti = [];

            for (let i = 0; i < confettiCount; i++) {
                confetti.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height * 2 - canvas.height,
                    size: Math.random() * 5 + 5,
                    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                    speed: Math.random() * 3 + 2,
                    angle: Math.random() * 360,
                    rotation: 0,
                    rotationSpeed: Math.random() * 10 - 5
                });
            }

            function drawConfetti() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let stillActive = false;

                confetti.forEach((c) => {
                    if (c.y < canvas.height) {
                        stillActive = true;
                        ctx.save();
                        ctx.translate(c.x, c.y);
                        ctx.rotate((c.rotation * Math.PI) / 180);
                        ctx.fillStyle = c.color;
                        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
                        ctx.restore();
                        c.y += c.speed;
                        c.rotation += c.rotationSpeed;
                    }
                });

                if (stillActive) {
                    requestAnimationFrame(drawConfetti);
                } else {
                    canvas.style.display = "none";
                }
            }

            drawConfetti();
        }

        // Handle window resize
        window.addEventListener("resize", () => {
            if (camera && renderer) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });

        // Handle scrolling
        window.addEventListener("scroll", function () {
            if (!scrollEnabled) {
                window.scrollTo(0, 0);
                return;
            }

            const scrollPosition = window.scrollY || document.documentElement.scrollTop;

            if (scrollPosition > 100) {
                document.getElementById("cake-canvas").style.transform = "translate(-40%, 0) scale(0.5)";
                document.getElementById("letter").style.right = "10%";
                document.getElementById("scroll-instruction").style.display = "none";
            } else {
                document.getElementById("cake-canvas").style.transform = "translate(0, 0) scale(1)";
                document.getElementById("letter").style.right = "-100%";
                if (cakeClicked) {
                    document.getElementById("scroll-instruction").style.display = "block";
                }
            }
        });

        // Initialize on window load
        window.onload = function () {
            initCake();
        };
        let w = (c.width = window.innerWidth),
        h = (c.height = window.innerHeight),
        ctx = c.getContext("2d"),
        hw = w / 2;
      (hh = h / 2),
        (opts = {
          // change the text in here //
          strings: ["HAPPY", "BIRTHDAY!", "to You"],
          charSize: 30,
          charSpacing: 35,
          lineHeight: 40,
      
          cx: w / 2,
          cy: h / 2,
      
          fireworkPrevPoints: 10,
          fireworkBaseLineWidth: 5,
          fireworkAddedLineWidth: 8,
          fireworkSpawnTime: 200,
          fireworkBaseReachTime: 30,
          fireworkAddedReachTime: 30,
          fireworkCircleBaseSize: 20,
          fireworkCircleAddedSize: 10,
          fireworkCircleBaseTime: 30,
          fireworkCircleAddedTime: 30,
          fireworkCircleFadeBaseTime: 10,
          fireworkCircleFadeAddedTime: 5,
          fireworkBaseShards: 5,
          fireworkAddedShards: 5,
          fireworkShardPrevPoints: 3,
          fireworkShardBaseVel: 4,
          fireworkShardAddedVel: 2,
          fireworkShardBaseSize: 3,
          fireworkShardAddedSize: 3,
          gravity: 0.1,
          upFlow: -0.1,
          letterContemplatingWaitTime: 360,
          balloonSpawnTime: 20,
          balloonBaseInflateTime: 10,
          balloonAddedInflateTime: 10,
          balloonBaseSize: 20,
          balloonAddedSize: 20,
          balloonBaseVel: 0.4,
          balloonAddedVel: 0.4,
          balloonBaseRadian: -(Math.PI / 2 - 0.5),
          balloonAddedRadian: -1,
        }),
        (calc = {
          totalWidth:
            opts.charSpacing *
            Math.max(opts.strings[0].length, opts.strings[1].length),
        }),
        (Tau = Math.PI * 2),
        (TauQuarter = Tau / 4),
        (letters = []);
      
      ctx.font = opts.charSize + "px Verdana";
      
      function Letter(char, x, y) {
        this.char = char;
        this.x = x;
        this.y = y;
      
        this.dx = -ctx.measureText(char).width / 2;
        this.dy = +opts.charSize / 2;
      
        this.fireworkDy = this.y - hh;
      
        var hue = (x / calc.totalWidth) * 360;
      
        this.color = "hsl(hue,80%,50%)".replace("hue", hue);
        this.lightAlphaColor = "hsla(hue,80%,light%,alp)".replace("hue", hue);
        this.lightColor = "hsl(hue,80%,light%)".replace("hue", hue);
        this.alphaColor = "hsla(hue,80%,50%,alp)".replace("hue", hue);
      
        this.reset();
      }
      Letter.prototype.reset = function () {
        this.phase = "firework";
        this.tick = 0;
        this.spawned = false;
        this.spawningTime = (opts.fireworkSpawnTime * Math.random()) | 0;
        this.reachTime =
          (opts.fireworkBaseReachTime + opts.fireworkAddedReachTime * Math.random()) |
          0;
        this.lineWidth =
          opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();
        this.prevPoints = [[0, hh, 0]];
      };
      Letter.prototype.step = function () {
        if (this.phase === "firework") {
          if (!this.spawned) {
            ++this.tick;
            if (this.tick >= this.spawningTime) {
              this.tick = 0;
              this.spawned = true;
            }
          } else {
            ++this.tick;
      
            var linearProportion = this.tick / this.reachTime,
              armonicProportion = Math.sin(linearProportion * TauQuarter),
              x = linearProportion * this.x,
              y = hh + armonicProportion * this.fireworkDy;
      
            if (this.prevPoints.length > opts.fireworkPrevPoints)
              this.prevPoints.shift();
      
            this.prevPoints.push([x, y, linearProportion * this.lineWidth]);
      
            var lineWidthProportion = 1 / (this.prevPoints.length - 1);
      
            for (var i = 1; i < this.prevPoints.length; ++i) {
              var point = this.prevPoints[i],
                point2 = this.prevPoints[i - 1];
      
              ctx.strokeStyle = this.alphaColor.replace(
                "alp",
                i / this.prevPoints.length
              );
              ctx.lineWidth = point[2] * lineWidthProportion * i;
              ctx.beginPath();
              ctx.moveTo(point[0], point[1]);
              ctx.lineTo(point2[0], point2[1]);
              ctx.stroke();
            }
      
            if (this.tick >= this.reachTime) {
              this.phase = "contemplate";
      
              this.circleFinalSize =
                opts.fireworkCircleBaseSize +
                opts.fireworkCircleAddedSize * Math.random();
              this.circleCompleteTime =
                (opts.fireworkCircleBaseTime +
                  opts.fireworkCircleAddedTime * Math.random()) |
                0;
              this.circleCreating = true;
              this.circleFading = false;
      
              this.circleFadeTime =
                (opts.fireworkCircleFadeBaseTime +
                  opts.fireworkCircleFadeAddedTime * Math.random()) |
                0;
              this.tick = 0;
              this.tick2 = 0;
      
              this.shards = [];
      
              var shardCount =
                  (opts.fireworkBaseShards +
                    opts.fireworkAddedShards * Math.random()) |
                  0,
                angle = Tau / shardCount,
                cos = Math.cos(angle),
                sin = Math.sin(angle),
                x = 1,
                y = 0;
      
              for (var i = 0; i < shardCount; ++i) {
                var x1 = x;
                x = x * cos - y * sin;
                y = y * cos + x1 * sin;
      
                this.shards.push(new Shard(this.x, this.y, x, y, this.alphaColor));
              }
            }
          }
        } else if (this.phase === "contemplate") {
          ++this.tick;
      
          if (this.circleCreating) {
            ++this.tick2;
            var proportion = this.tick2 / this.circleCompleteTime,
              armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;
      
            ctx.beginPath();
            ctx.fillStyle = this.lightAlphaColor
              .replace("light", 50 + 50 * proportion)
              .replace("alp", proportion);
            ctx.beginPath();
            ctx.arc(this.x, this.y, armonic * this.circleFinalSize, 0, Tau);
            ctx.fill();
      
            if (this.tick2 > this.circleCompleteTime) {
              this.tick2 = 0;
              this.circleCreating = false;
              this.circleFading = true;
            }
          } else if (this.circleFading) {
            ctx.fillStyle = this.lightColor.replace("light", 70);
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
      
            ++this.tick2;
            var proportion = this.tick2 / this.circleFadeTime,
              armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;
      
            ctx.beginPath();
            ctx.fillStyle = this.lightAlphaColor
              .replace("light", 100)
              .replace("alp", 1 - armonic);
            ctx.arc(this.x, this.y, this.circleFinalSize, 0, Tau);
            ctx.fill();
      
            if (this.tick2 >= this.circleFadeTime) this.circleFading = false;
          } else {
            ctx.fillStyle = this.lightColor.replace("light", 70);
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
          }
      
          for (var i = 0; i < this.shards.length; ++i) {
            this.shards[i].step();
      
            if (!this.shards[i].alive) {
              this.shards.splice(i, 1);
              --i;
            }
          }
      
          if (this.tick > opts.letterContemplatingWaitTime) {
            this.phase = "balloon";
      
            this.tick = 0;
            this.spawning = true;
            this.spawnTime = (opts.balloonSpawnTime * Math.random()) | 0;
            this.inflating = false;
            this.inflateTime =
              (opts.balloonBaseInflateTime +
                opts.balloonAddedInflateTime * Math.random()) |
              0;
            this.size =
              (opts.balloonBaseSize + opts.balloonAddedSize * Math.random()) | 0;
      
            var rad =
                opts.balloonBaseRadian + opts.balloonAddedRadian * Math.random(),
              vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();
      
            this.vx = Math.cos(rad) * vel;
            this.vy = Math.sin(rad) * vel;
          }
        } else if (this.phase === "balloon") {
          ctx.strokeStyle = this.lightColor.replace("light", 80);
      
          if (this.spawning) {
            ++this.tick;
            ctx.fillStyle = this.lightColor.replace("light", 70);
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
      
            if (this.tick >= this.spawnTime) {
              this.tick = 0;
              this.spawning = false;
              this.inflating = true;
            }
          } else if (this.inflating) {
            ++this.tick;
      
            var proportion = this.tick / this.inflateTime,
              x = (this.cx = this.x),
              y = (this.cy = this.y - this.size * proportion);
      
            ctx.fillStyle = this.alphaColor.replace("alp", proportion);
            ctx.beginPath();
            generateBalloonPath(x, y, this.size * proportion);
            ctx.fill();
      
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, this.y);
            ctx.stroke();
      
            ctx.fillStyle = this.lightColor.replace("light", 70);
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
      
            if (this.tick >= this.inflateTime) {
              this.tick = 0;
              this.inflating = false;
            }
          } else {
            this.cx += this.vx;
            this.cy += this.vy += opts.upFlow;
      
            ctx.fillStyle = this.color;
            ctx.beginPath();
            generateBalloonPath(this.cx, this.cy, this.size);
            ctx.fill();
      
            ctx.beginPath();
            ctx.moveTo(this.cx, this.cy);
            ctx.lineTo(this.cx, this.cy + this.size);
            ctx.stroke();
      
            ctx.fillStyle = this.lightColor.replace("light", 70);
            ctx.fillText(this.char, this.cx + this.dx, this.cy + this.dy + this.size);
      
            if (this.cy + this.size < -hh || this.cx < -hw || this.cy > hw)
              this.phase = "done";
          }
        }
      };
      function Shard(x, y, vx, vy, color) {
        var vel =
          opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();
      
        this.vx = vx * vel;
        this.vy = vy * vel;
      
        this.x = x;
        this.y = y;
      
        this.prevPoints = [[x, y]];
        this.color = color;
      
        this.alive = true;
      
        this.size =
          opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
      }
      Shard.prototype.step = function () {
        this.x += this.vx;
        this.y += this.vy += opts.gravity;
      
        if (this.prevPoints.length > opts.fireworkShardPrevPoints)
          this.prevPoints.shift();
      
        this.prevPoints.push([this.x, this.y]);
      
        var lineWidthProportion = this.size / this.prevPoints.length;
      
        for (var k = 0; k < this.prevPoints.length - 1; ++k) {
          var point = this.prevPoints[k],
            point2 = this.prevPoints[k + 1];
      
          ctx.strokeStyle = this.color.replace("alp", k / this.prevPoints.length);
          ctx.lineWidth = k * lineWidthProportion;
          ctx.beginPath();
          ctx.moveTo(point[0], point[1]);
          ctx.lineTo(point2[0], point2[1]);
          ctx.stroke();
        }
      
        if (this.prevPoints[0][1] > hh) this.alive = false;
      };
      function generateBalloonPath(x, y, size) {
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
          x - size / 2,
          y - size / 2,
          x - size / 4,
          y - size,
          x,
          y - size
        );
        ctx.bezierCurveTo(x + size / 4, y - size, x + size / 2, y - size / 2, x, y);
      }
      
      function anim() {
        window.requestAnimationFrame(anim);
      
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, w, h);
      
        ctx.translate(hw, hh);
      
        var done = true;
        for (var l = 0; l < letters.length; ++l) {
          letters[l].step();
          if (letters[l].phase !== "done") done = false;
        }
      
        ctx.translate(-hw, -hh);
      
        if (done) for (var l = 0; l < letters.length; ++l) letters[l].reset();
      }
      
      for (let i = 0; i < opts.strings.length; ++i) {
        for (var j = 0; j < opts.strings[i].length; ++j) {
          letters.push(
            new Letter(
              opts.strings[i][j],
              j * opts.charSpacing +
                opts.charSpacing / 2 -
                (opts.strings[i].length * opts.charSize) / 2,
              i * opts.lineHeight +
                opts.lineHeight / 2 -
                (opts.strings.length * opts.lineHeight) / 2
            )
          );
        }
      }
      
      anim();
      
      window.addEventListener("resize", function () {
        w = c.width = window.innerWidth;
        h = c.height = window.innerHeight;
      
        hw = w / 2;
        hh = h / 2;
      
        ctx.font = opts.charSize + "px Verdana";
      });
      