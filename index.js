const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const applyBtn = document.getElementById('applyBtn')
const speedY = document.getElementById('speedY')
const speedX = document.getElementById('speedX')
const timeFromStart = document.getElementById('timeFromStart')
/* 1px - 1m */
function start() {

    let timeFromStarCount = 0

    let ball = {
        x: (canvas.width / 2), // Начальная координата x
        y: 10, // Начальная координата Y
        radius: 10,
        mass: parseFloat(document.getElementById('mass').value), // Масса мячика в кг
        velocity: parseFloat(document.getElementById('velocity').value), // Начальная скорость
        angle: Math.PI * parseFloat(document.getElementById('angle').value) / 180, // Начальный угол
        gravity: parseFloat(document.getElementById('gravity').value), // Ускорение свободного падения (на земле 9.8)
        airDensity: parseFloat(document.getElementById('airResistance').value), // Плотность. воздуха (на земле = 1) (кг/м3)
        elasticity: parseFloat(document.getElementById('elasticity').value), // Упругость мяча (от 0 до 1)
        vX: parseFloat(document.getElementById('velocity').value) * Math.cos(Math.PI * parseFloat(document.getElementById('angle').value) / 180),
        vY: parseFloat(document.getElementById('velocity').value) * Math.sin(Math.PI * parseFloat(document.getElementById('angle').value) / 180),
        tick: 1
    };

    function drawBall() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Метод интегрирования Эйлера для моделирования плоского движения мяча с учетом
    // притяжения земли и сопротивления воздуха.
    function updateBall() {
        // данная проверка связана с тем, что сила сопротивления атмосферы вседа противонаправлена вектору скорости
        if (Math.sign(ball.vX) > 0) {  //Если скорость по X больше 0 ( то мы вычитаем приращение скорости от атмфосферы) иначе прибавляем
            ball.vX -= aSopr()['aX'] * (ball.tick/60) // V(скорость) = ускорение на шаг интегрирования(время)
        } else {
            ball.vX += aSopr()['aX'] * (ball.tick/60)
        }

        // данная проверка связана с тем, что сила сопротивление атмосферы вседа противонаправлена вектору скорости
        // ускорение от гравитации земли всегда направлено вниз
        if (Math.sign(ball.vY) > 0) {  //Если скорость по Y больше 0 ( то мы вычитаем приращение скорости от атмфосферы и земли) иначе прибавляем
            ball.vY += -aSopr()['aY'] * (ball.tick/60) + ball.gravity * (ball.tick/60) //(если мячь летит вниз - то гравитация добавляет ускорение)
        } else {
            ball.vY -= -aSopr()['aY'] * (ball.tick/60) - ball.gravity * (ball.tick/60) // (Мячь летит вверх - то гравитация забирает ускорение)
        }

        speedY.innerText = ball.vY
        speedX.innerText = ball.vX

        ball.x += ball.vX * (ball.tick/60) // Добавляем приращение координаты
        ball.y += ball.vY * (ball.tick/60)

        //Левая
        if (ball.x - ball.radius < 0) {
            ball.x = ball.radius
            ball.vX = -ball.vX * ball.elasticity
        }

        // правая граница
        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius
            ball.vX = -ball.vX * ball.elasticity
        }

        //Нижняя граница
        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius
            ball.vY = -ball.vY * ball.elasticity
        }

        //Верхняя
        if (ball.y - ball.radius <= 0) {
            ball.y = ball.radius
            ball.vY = -ball.vY * ball.elasticity
        }

        timeFromStarCount += ball.tick/60

        timeFromStart.innerText = timeFromStarCount

        // Отрисовываем мяч с учетом обновленных координат
        drawBall();
    }

    function aSopr() {
        let ballAirResistance = 0.47; // Коэффициент сопротивления формы шара взятый из справочника по аеродинамике
        // Упрощенная формула сопротивления вычисленная по миделеву сечению.
        //Формулы ускорения лобового сопротивления. f = m* a => a = f / m, где f(сила лобового сопротивления)
        let aX = (ballAirResistance * ((ball.airDensity * ball.vX * ball.vX) / 2) * (Math.PI * 0.01 * 0.01)) / ball.mass
        let aY = (ballAirResistance * ((ball.airDensity * ball.vY * ball.vY) / 2) * (Math.PI * 0.01 * 0.01)) / ball.mass
        return {
            aX, aY
        };
    }

    setInterval(updateBall, 1000 / 60);
}

applyBtn.addEventListener('click', start)