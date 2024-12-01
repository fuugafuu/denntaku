<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>シンプル電卓作者「ふうが」</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
        }
        .calculator {
            display: inline-block;
            margin-top: 50px;
            padding: 20px;
            border-radius: 10px;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .display {
            width: 100%;
            height: 50px;
            margin-bottom: 10px;
            font-size: 1.5rem;
            text-align: right;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 5px;
            box-sizing: border-box;
        }
        .buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }
        .button {
            font-size: 1.2rem;
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .button.clear {
            background-color: #dc3545;
        }
        .button.clear:hover {
            background-color: #a71d2a;
        }
    </style>
</head>
<body>
    <div class="calculator">
        <input type="text" id="display" class="display" disabled>
        <div class="buttons">
            <button class="button" onclick="appendValue('7')">7</button>
            <button class="button" onclick="appendValue('8')">8</button>
            <button class="button" onclick="appendValue('9')">9</button>
            <button class="button" onclick="appendValue('/')">÷</button>
            <button class="button" onclick="appendValue('4')">4</button>
            <button class="button" onclick="appendValue('5')">5</button>
            <button class="button" onclick="appendValue('6')">6</button>
            <button class="button" onclick="appendValue('*')">×</button>
            <button class="button" onclick="appendValue('1')">1</button>
            <button class="button" onclick="appendValue('2')">2</button>
            <button class="button" onclick="appendValue('3')">3</button>
            <button class="button" onclick="appendValue('-')">−</button>
            <button class="button" onclick="appendValue('0')">0</button>
            <button class="button" onclick="appendValue('.')">.</button>
            <button class="button" onclick="calculate()">=</button>
            <button class="button" onclick="appendValue('+')">＋</button>
            <button class="button clear" onclick="clearDisplay()">C</button>
        </div>
    </div>
    <script>
        const display = document.getElementById('display');
        function appendValue(value) {
            display.value += value;
        }
        function calculate() {
            try {
                display.value = eval(display.value);
            } catch (error) {
                display.value = "エラー";
            }
        }
        function clearDisplay() {
            display.value = '';
        }
    </script>
</body>
</html>
