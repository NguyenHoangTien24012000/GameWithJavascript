document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const doodle = document.createElement('div');
    let doodleLeftSpace;
    let doodleBottomSpace = 115;
    let isGameOver = false;
    let platformCount = 5;
    let platformsArr = [];
    let upTimeId;
    let downTimeID;
    let isJumping = true;
    let startPoint = doodleBottomSpace;
    let isGoingleft = false;
    let isGoingRight = false;
    let leftTimeId;
    let rightTimeId;
    let current = 0;
    function createDoodle() {
        grid.appendChild(doodle);
        doodle.classList.add('doodle');
        doodle.style.left = doodleLeftSpace + 'px';
        doodle.style.bottom = doodleBottomSpace + 'px';
    }

    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual);
        }
    }

    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platGap = 600 / platformCount;
            let newPlatBottom = 100 + i * platGap;
            let newPlatform = new Platform(newPlatBottom);
            platformsArr.push(newPlatform);

            // console.log(platformsArr)
        }
        doodleLeftSpace = platformsArr[0].left;
        // doodleBottomSpace = platformsArr[0].bottom + 15;
        // console.log(doodleBottomSpace)
    }

    function movePlatforms() {
        if (doodleBottomSpace > 0) {
            platformsArr.forEach(platform => {
                platform.bottom -= 1;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';
                if(platform.bottom < 10){
                    let firstPlatForm = platformsArr[0].visual;
                    firstPlatForm.classList.remove('platform');
                    platformsArr.shift();
                    let newPlatform = new Platform(585);
                    platformsArr.push(newPlatform)
                    current += 1;
                }
            })
        }
    }

    function fall() {
        clearInterval(upTimeId)
        isJumping = false;
        downTimeID = setInterval(function () {
            doodleBottomSpace -= 1;
            doodle.style.bottom = doodleBottomSpace + 'px';
            if (doodleBottomSpace <= 0) {
                gameOver();
            }
            platformsArr.forEach(platform => {
                if (
                    (doodleBottomSpace >= platform.bottom) && (doodleBottomSpace <= platform.bottom + 15) &&
                    ((doodleLeftSpace + 60) >= platform.left) && (doodleLeftSpace <= (platform.left + 85)) && !isJumping
                ) {
                    // console.log("jump")
                    // isJumping = true;
                    jump();
                    startPoint = doodleBottomSpace;
                    // clearInterval(leftTimeId)
                }
            })
        }, 2)
    }

 

    function jump() {
        clearInterval(downTimeID);
        isJumping = true;
        upTimeId = setInterval(function () {
            doodleBottomSpace += 1;
            doodle.style.bottom = doodleBottomSpace + 'px';
            if (doodleBottomSpace > startPoint + 180 || doodleBottomSpace > 600) {
                fall();
            }
        }, 5)
    }

    function controls(e) {
        if (e.key === "ArrowLeft") {
            moveLeft();
        } else if (e.key === "ArrowRight") {
            moveRight()
        } else if (e.key === "ArrowUp") {
            moveStraight();
        }
    }

    function moveLeft() {
        if(isGoingRight){
            isGoingleft = false;
            clearInterval(rightTimeId);
        }
        isGoingleft = true;
        // if (doodleLeftSpace >= 10) {
        //     doodleLeftSpace -= 20;
        //     doodle.style.left = doodleLeftSpace + 'px';
        // }
        leftTimeId = setInterval(function(){
            if(doodleLeftSpace >= 0){
                doodleLeftSpace -= 1;
                doodle.style.left = doodleLeftSpace + 'px';
            }else moveRight();
        }, 20)
    }
    function moveRight() {
        if(isGoingleft){
            isGoingRight = false;
            clearInterval(leftTimeId);
        }
        isGoingRight = true;
        // if (doodleLeftSpace <= 340) {
        //     doodleLeftSpace += 20;
        //     doodle.style.left = doodleLeftSpace + 'px';
        // }
        rightTimeId = setInterval(function(){
            if(doodleLeftSpace <= 340){
                doodleLeftSpace += 1;
                doodle.style.left = doodleLeftSpace + 'px';
            }else moveLeft();
        }, 20)
    }

    function moveStraight(){
        isGoingRight = false;
        isGoingleft = false;
        clearInterval(leftTimeId);
        clearInterval(rightTimeId);
    }

    function start() {
        if (!isGameOver) {
            createPlatforms();
            createDoodle();
            movePlatforms();
            setInterval(movePlatforms, 15);
            jump();
            document.addEventListener('keydown', controls)
        }
    }

    //attach to button
    start();
    function gameOver() {
        isGameOver = true;
        clearInterval(downTimeID);
        clearInterval(upTimeId);
        clearInterval(leftTimeId);
        clearInterval(rightTimeId);
        isGoingRight = false;
        isGoingleft = false;
        moveStraight();
        let scores = document.createElement("h2");
        scores.innerText = current + " Star";
        grid.appendChild(scores)
    }
})