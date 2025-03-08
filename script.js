let isResultDisplayed = false;

function clearDisplay() {
    document.getElementById("display");
    document.getElementById("result");

    // Function to clear one character at a time from the display
    function clearDisplayCharacters() {
        return new Promise((resolve) => {
            function clearOneCharacter() {
                if (display.value.length > 0) {
                    display.value = display.value.slice(0, -1);
                    setTimeout(clearOneCharacter, 50); // Adjust the timeout for the desired speed
                } else {
                    resolve();
                }
            }
            clearOneCharacter();
        });
    }

    // Function to clear one character at a time from the result
    function clearResultCharacters() {
        return new Promise((resolve) => {
            function clearOneCharacter() {
                if (result.value.length > 0) {
                    result.value = result.value.slice(0, -1);
                    setTimeout(clearOneCharacter, 50); // Adjust the timeout for the desired speed
                } else {
                    resolve();
                }
            }
            clearOneCharacter();
        });
    }

    // Clear both fields simultaneously
    Promise.all([clearDisplayCharacters(), clearResultCharacters()]).then(() => {
        isResultDisplayed = false;
    });
}

function deleteChar() {
    let display = document.getElementById("display");
    let start = display.selectionStart;
    let end = display.selectionEnd;
    if (isResultDisplayed) {
        display.value = '';
        isResultDisplayed = false;
    } else {
        if (start === end) {
            display.value = display.value.slice(0, start - 1) + display.value.slice(end);
            display.setSelectionRange(start - 1, start - 1);
        } else {
            display.value = display.value.slice(0, start) + display.value.slice(end);
            display.setSelectionRange(start, start);
        }
    }
    display.scrollLeft = display.scrollWidth;
}

function appendChar(char) {
    let display = document.getElementById("display");
    let start = display.selectionStart;
    let end = display.selectionEnd;
    let lastChar = display.value.slice(-1);

    if (isResultDisplayed) {
        display.value = char;
        display.setSelectionRange(1, 1);
        isResultDisplayed = false;
    } else {
        if (display.value === '' && (char === '*' || char === '/')) {
            return; //Do nothing if initial char is * or /
        }

        if (['+', '-', '*', '/'].includes(lastChar) && ['+', '-', '*', '/'].includes(char)) {
            display.value = display.value.slice(0, -1) + char; //Replace precious symbol with new one
            display.setSelectionRange(start, start);
        } else {
            let segments = display.value.split(/[\+\-\*\/]/);
            let lastSegment = segments[segments.length - 1];
            if (lastSegment.includes('.') && char === '.') {
                return; //Do nothing if last segment already contains a decimal point
            }
            if (char === '.' && (display.value === '' || ['+', '-', '*', '/'].includes(lastChar))) {
                display.value = display.value.slice(0, start) + '0' + display.value.slice(start); //Add 0 before decimal point if it is the first character or after a symbol
                start++;
                end++;
            }
            display.value = display.value.slice(0, start) + char + display.value.slice(end);
            display.setSelectionRange(start + 1, start + 1);
        }
    }
    display.scrollLeft = display.scrollWidth;
}

function useAns() {
    let display = document.getElementById("display");
    let result = document.getElementById("result").value;
    if (result !== '') {
        display.value = '';
        display.value += result;
        isResultDisplayed = false;
    }
}

function calculate() {
    let display = document.getElementById("display");
    let result = document.getElementById("result");
    try {
        result.value = eval(display.value);
        isResultDisplayed = true;
    } catch (e) {
        result.value = 'Error';
        isResultDisplayed = true;
    }
}

// Add event listener for keypress events
document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (!isNaN(key) || key === '.') {
        appendChar(key);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        deleteChar();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendChar(key);
    } else if (key.toLowerCase() === 'a') {
        useAns();
    }
});