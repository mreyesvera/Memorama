/*
    Author: Silvia Mariana Reyesvera Quijano - 000813686 
    Date: November 14th, 2020

    This code defines the events for different elements of both the
    form and the game display from the file index.html, 
    allowing the user to interact with the elements in the window. 
    The whole game details are managed to give the user a good
    playing experience. 
    
    The game represented here is a memory training game 
    with a set of 36 cards (18 distinct cards with a matching card). The user
    has to find all of the matching cards to win the game.
*/
window.addEventListener("load", function () {
    let informationForm = document.getElementById("information"); // form
    let gameContainer = document.getElementById("game"); // game display

    let validName = false;
    let validAge = false;

    // form fields
    let nameField = document.getElementById("name");
    let ageField = document.getElementById("age");
    let colorField = document.getElementById("color");
    let submitButton = document.getElementById("submit");

    // error in fields elements
    let nameError = document.getElementById("nameError")
    let ageError = document.getElementById("ageError");
    let submitError = document.getElementById("submitError");

    colorField.addEventListener("change",
        /**
         * Changes the body's background color based on the user's choice.
         */
        function () {
            document.body.style.backgroundColor = colorField.value;
        });

    /**
     * Validates the name's value and 
     * displays an error message in the form if the name is missing.
     */
    function validateName() {
        if (nameField.value === "") {
            nameField.style.backgroundColor = "indianred";
            nameError.innerHTML = "Name missing";
            nameField.style.color = "white";
            validName = false;
        } else {
            nameField.style.backgroundColor = "white";
            nameError.innerHTML = "";
            nameField.style.color = "black";
            validName = true;
        }
    }
    nameField.addEventListener("keyup", validateName); // validate name every time a key press is released

    /**
     * Validates the age's value and 
     * displays an error message in the form if the age is missing or out of range.
     */
    function validateAge() {
        if (ageField.value === "") {
            ageField.style.backgroundColor = "indianred";
            ageError.innerHTML = "Age missing";
            ageField.style.color = "white";
            validAge = false;
        } else if (ageField.value < 1 || ageField.value > 200) {
            ageField.style.backgroundColor = "indianred";
            ageError.innerHTML = "Age range [0, 200]";
            ageField.style.color = "white";
            validAge = false;
        } else {
            ageField.style.backgroundColor = "white";
            ageError.innerHTML = "";
            ageField.style.color = "black";
            validAge = true;
        }
    }
    ageField.addEventListener("input", validateAge); // validate age when any sort of input happens

    submitButton.addEventListener("click",
        /**
         * Re-validates name for assurance and
         * if they are invalid presents an additional error message stating incorrect information.
         */
        function () {
            validateName();
            validateAge();
            if (!(validName && validAge)) {
                submitError.innerHTML = "There is missing or incorrect information.";
            }
        })

    /**
     * Gets the last player information and
     * if it is present add it to document field's values.
     */
    function updateForm() {
        let lastPlayerName = localStorage.getItem("lastPlayerName");

        if (!(lastPlayerName === null)) {
            let lastPlayerAge = localStorage.getItem("lastPlayerAge");
            let lastPlayerColor = localStorage.getItem("lastPlayerColor");

            nameField.value = lastPlayerName;
            ageField.value = lastPlayerAge;
            colorField.value = lastPlayerColor;
            document.body.style.backgroundColor = colorField.value;
        }
    }

    updateForm(); // display last player's stored information

    // variables for timer
    let stopwatch;
    let currentSeconds;
    let currentMinutes;
    let time = document.getElementById("time");

    /**
     * Displays the minutes and seconds in the 00 : 00 format.
     * 
     * @param {Integer} minutes 
     * @param {Integer} seconds 
     * @returns A string displaying the time
     */
    function displayTime(minutes, seconds) {
        let secondsDisplay;
        let minutesDisplay;

        if (minutes < 10) { // if minutes is only one integer
            minutesDisplay = "0" + minutes; // put a zero before it
        } else {
            minutesDisplay = minutes;
        }

        if (seconds < 10) { // if seconds is only one integer
            secondsDisplay = "0" + seconds; // put a zero before it
        } else {
            secondsDisplay = seconds;
        }

        return minutesDisplay + " : " + secondsDisplay;
    }

    informationForm.addEventListener("submit",
        /**
         * Sets up the game elements and the events for
         * them. 
         * 
         * @param {Event} e
         */
        function (e) {
            e.preventDefault(); // avois the submition, no page reloading

            console.log("game started!");
            document.body.style.backgroundColor = "white"; // set body background color to white

            // save local storage last player information to current player's information (form values)
            localStorage.setItem("lastPlayerName", nameField.value);
            localStorage.setItem("lastPlayerAge", ageField.value);
            localStorage.setItem("lastPlayerColor", colorField.value);

            // current player's information elements
            let nameDisplay = document.getElementById("nameDisplay");
            let ageDisplay = document.getElementById("ageDisplay");
            let endGameWindow = document.getElementById("endOfGame");

            nameDisplay.innerHTML = "Name: " + nameField.value;
            ageDisplay.innerHTML = "Age: " + ageField.value;

            endGameWindow.style.display = "none"; // don't display the end of game window
            let endGameMessage = document.getElementById("message"); // get the end of game message element

            // stored player's information elements
            let storedNameDisplay = document.getElementById("storedName");
            let storedAgeDisplay = document.getElementById("storedAge");
            let storedScoreDisplay = document.getElementById("stopwatchScore");

            // stored player's information from local storage
            let storedName = localStorage.getItem("storedName");
            console.log(storedName);
            let storedAge = localStorage.getItem("storedAge");
            let storedMinutes = parseInt(localStorage.getItem("storedMinutes"));
            let storedSeconds = parseInt(localStorage.getItem("storedSeconds"));

            let cards; // array containing the td's of the table representing each card

            // if there is no stored name yet
            if (storedName === "Undefined" || storedName === null) {
                // set up some values to stored places
                storedNameDisplay.innerHTML = "No Best Score Yet";
                localStorage.setItem("storedName", "Undefined");
                localStorage.setItem("storedAge", "Undefined");
                localStorage.setItem("storedMinutes", "-1");
                localStorage.setItem("storedSeconds", "-1");

                // save these albitrary values
                storedName = localStorage.getItem("storedName");
                storedAge = localStorage.getItem("storedAge");
                storedMinutes = parseInt(localStorage.getItem("storedMinutes"));
                storedSeconds = parseInt(localStorage.getItem("storedSeconds"));
            } else {
                // use the stored values to display them for the best score information
                storedNameDisplay.innerHTML = "Name: " + storedName;
                storedAgeDisplay.innerHTML = "Age: " + storedAge;
                storedScoreDisplay.innerHTML = displayTime(storedMinutes, storedSeconds);
            }

            // initialize timer elements and variables
            currentSeconds = 0;
            currentMinutes = 0;
            time = document.getElementById("time");

            time.innerHTML = displayTime(0, 0); // displays an initial time of 00 : 00

            stopwatch = setInterval(
                /**
                 * Adds one to currentSeconds each second and
                 * adjusts the display of the time appropriately.
                 * Time is also displayed to the screen.
                 */
                function () {
                    currentSeconds += 1;
                    if (currentSeconds === 60) { // if seconds reach 60, reset and add one to minutes
                        currentSeconds = 0;
                        currentMinutes += 1;
                    }

                    if (currentMinutes === 60) { // if minutes reach 60, end the game in failure
                        currentMinutes = 0;
                        clearInterval(stopwatch); // stop the stopwatch
                        for (let i = 0; i < cards.length; i++) { // deactivate the cards (to avoid fliping when clicking)
                            cards[i].active = false;
                        }
                        endGameMessage.innerHTML = "Seems like your time ran out!"; // out of time message
                        endGameWindow.style.display = "block"; // display the end of game window
                    }

                    time.innerHTML = displayTime(currentMinutes, currentSeconds); // format and display time

                }, 1000);

            setTimeout(
                /**
                 * Does nothing, just used for mandatory function
                 */
                function () {}, 1000);
            informationForm.style.display = "none"; // remove the form display
            gameContainer.style.display = "grid"; // display game

            let max = 18; // maximum amount of different cards
            loadGame(max); // create the cards table

            // card event variables
            let indexes = [];
            let turnedAround = 0;
            let allowClicks = true;
            let countTurned = 0;

            cards = document.querySelectorAll(".cardInside"); // get the cards based on the cardInside class
            for (let i = 0; i < cards.length; i++) { // for each card
                cards[i].index = i; // add a property called index, indicating the index of its location in the cards array
                cards[i].active = true; // activate the card

                // adding an event when clicking the card
                cards[i].addEventListener("click",
                    /**
                     * Logic for managing the card when clicked
                     * based on the possible paths.
                     */
                    function () {
                        // if it's the first card turned, it is active and there is no processing done at the moment
                        if (turnedAround === 0 && this.active === true && allowClicks) {
                            allowClicks = false; // avoid further clicks while processing

                            indexes[0] = this.index; // saving the card's index
                            this.style.transform = "rotateY(180deg)"; // flip the card
                            turnedAround += 1; // state a card has been turned

                            allowClicks = true;
                        } // if it's the second card, it is active, there is no processing done at the moment and it is not the first card selected
                        else if (turnedAround === 1 && this.active === true && allowClicks && this.index !== indexes[0]) {
                            allowClicks = false; // avoid further clicks while processing

                            indexes[1] = this.index; // saving the second card's index
                            this.style.transform = "rotateY(180deg)"; // flip the card

                            // retrieve the cards
                            let firstCard = cards[indexes[0]];
                            let secondCard = cards[indexes[1]];

                            // retrieve the cards images
                            let firstImage = firstCard.getElementsByClassName("computerPart")[0];
                            let secondImage = secondCard.getElementsByClassName("computerPart")[0];

                            // compare the cards images sources
                            if (firstImage.src === secondImage.src) { // if they match
                                console.log("found a match!");

                                // deactivate the cards
                                firstCard.active = false;
                                secondCard.active = false;

                                countTurned += 1; // add one to the count of turned matches of cards

                                if (countTurned === max) { // if the count of turned is equal to the maximum, they won
                                    console.log("you won!");

                                    clearInterval(stopwatch); // clear the stopwatch

                                    let flashStopwatch = setInterval(
                                        /**
                                         * flash crimson the current players information
                                         */
                                        function () {
                                            let stopwatchDisplay = document.getElementById("stopwatch");
                                            stopwatchDisplay.style.color = "crimson";
                                            setTimeout(
                                                /**
                                                 * chaging players info color from crimson to black
                                                 */
                                                function () {
                                                    stopwatchDisplay.style.color = "black";
                                                }, 1000);
                                        }, 1000);

                                    setTimeout(
                                        /**
                                         * clear the flashing interval
                                         */
                                        function () {
                                            clearInterval(flashStopwatch);
                                        }, 3000);

                                    // if there is no player information in local storage or
                                    // the current timer's values are smaller or equal to the best score
                                    // save this player's value to local storage
                                    if ((storedMinutes === -1) ||
                                        (storedMinutes > currentMinutes) ||
                                        ((storedMinutes === currentMinutes) && (storedSeconds > currentSeconds)) ||
                                        ((storedMinutes === currentMinutes) && (storedSeconds === currentSeconds))) {
                                        localStorage.setItem("storedName", nameField.value);
                                        localStorage.setItem("storedAge", ageField.value);
                                        localStorage.setItem("storedMinutes", currentMinutes);
                                        localStorage.setItem("storedSeconds", currentSeconds);
                                    }

                                    // display end of game window with congratulations message
                                    endGameMessage.innerHTML = "Congratulations " + nameField.value + "!!!<br>Time: " + displayTime(currentMinutes, currentSeconds);
                                    endGameWindow.style.display = "block";
                                }
                            } else { // if the images' source doesn't match
                                setTimeout(
                                    /**
                                     * rotate back the images
                                     */
                                    function () {
                                        firstCard.style.transform = "rotateY(0deg)";
                                        secondCard.style.transform = "rotateY(0deg)";
                                    }, 500);
                            }

                            // reset variables
                            turnedAround = 0;
                            indexes[0] = null;
                            indexes[1] = null;

                            allowClicks = true;
                        }
                    });
            }


        });


    /**
     * Creates the table with the cards.
     * 
     * @param {Integer} max 
     */
    function loadGame(max) {
        let cards = document.getElementById("cards"); // retrieve the card table
        let cardsNumbers = []; // set up an array that will solve the possible numbers

        // add to the array an integer from 1 to the max, twice
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < max; j++) {
                cardsNumbers[j + i * max] = j + 1;
            }
        }

        // shuffle the cards numbers
        cardsNumbers = shuffle(cardsNumbers);

        let numRowCol = Math.sqrt(max * 2); // get the needed amount of rows
        let addCards = ""; // will save all of the cards html representation

        // create the cards with a different image source based on the cardsNumbers array
        for (let i = 0; i < numRowCol; i++) {
            addCards += "<tr>";
            for (let j = 0; j < numRowCol; j++) {
                addCards += "<td class='card'><div class='cardInside'><div class='frontCard'></div><div class='backCard'><img class='computerPart' src='img/computerPart" + cardsNumbers[j + i * numRowCol] + ".png'></div></div></td>";
            }
            addCards += "</tr>";
        }

        cards.innerHTML = addCards; // add the cards html representation to inside the cards table

        let frontCards = document.getElementsByClassName("frontCard");
        for (let i = 0; i < frontCards.length; i++) {
            frontCards[i].style.backgroundColor = colorField.value; // change the cards color to the player's favorite color
        }

    }

    /**
     * Shuffling an array using the Fisher-Yates shuffle algorithm
     * obtained from: 
     * 
     * https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
     * @param {Integer} array 
     * @return shuffled array
     */
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    let helpDisplayed = false; // whether the instructions are displayed or not

    /**
     * Display the elements appropriately
     * when the help button is clicked
     * depending on whether the instructions 
     * are already displayed or not.
     */
    function displayElements() {
        if (!helpDisplayed) { // if the instructions are not displayed, display them
            helpDisplayed = true;
        } else { // if they are, don't display them
            helpDisplayed = false;
        }
        responsiveView(); // method that actually makes the view changes
    }

    // other game elements such as the buttons and the window
    let help = document.getElementById("help");
    let back = document.getElementById("back");
    let windowMedia = window.matchMedia("(max-width: 880px)"); // used for the responsiveness of the window

    let playAgain = document.getElementById("playAgain");
    let backToForm = document.getElementById("backToForm");

    // adding events to the buttons and the window
    help.addEventListener("click", displayElements);
    back.addEventListener("click", goToForm);
    windowMedia.addEventListener("change", responsiveView);

    playAgain.addEventListener("click",
        /**
         * Restart the game.
         */
        function () {
            updateForm();
            document.information.submit.click();
        });
    backToForm.addEventListener("click", goToForm);

    /**
     * Go from the game display to the form display.
     */
    function goToForm() {
        clearInterval(stopwatch); // clear the stopwatch

        // display form instead of game
        informationForm.style.display = "block";
        gameContainer.style.display = "none";
        updateForm();
    }

    /**
     * Makes changes to elements properties to 
     * display them properly based on window size
     */
    function responsiveView() {
        let helpWindow = document.getElementById("helpWindow");
        let stopwatch = document.getElementById("stopwatch");
        let bestScore = document.getElementById("bestScore");
        let cardsTable = document.getElementById("cardsTable");
        let helpButton = document.getElementById("helpButton");

        if (!windowMedia.matches) { // if the window's width is more than 880px
            if (helpDisplayed) { // if the instructions are being displayed
                helpWindow.style.display = "block"; // display instructions

                // alter elements grid properties
                helpWindow.style.gridColumn = "3";
                helpWindow.style.gridRow = "3";

                stopwatch.style.gridColumn = "1";
                stopwatch.style.gridRow = "2";

                bestScore.style.gridColumn = "2";
                bestScore.style.gridRow = "2";

                cardsTable.style.gridColumnStart = "1";
                cardsTable.style.gridColumnEnd = "3";
                cardsTable.style.gridRow = "3";

                helpButton.style.gridColumn = "3";
                helpButton.style.gridRowStart = "1";
                helpButton.style.gridRowEnd = "3";

            } else { // if the instructions are not being displayed
                helpWindow.style.display = "none"; // remove instructions

                // alter elements grid properties
                helpWindow.style.gridColumn = "3";
                helpWindow.style.gridRow = "3";

                stopwatch.style.gridColumn = "3";
                stopwatch.style.gridRow = "2";

                bestScore.style.gridColumn = "3";
                bestScore.style.gridRow = "3";

                cardsTable.style.gridColumnStart = "1";
                cardsTable.style.gridColumnEnd = "3";
                cardsTable.style.gridRowStart = "2";
                cardsTable.style.gridRowEnd = "4";

                helpButton.style.gridColumn = "3";
                helpButton.style.gridRowStart = "1";
                helpButton.style.gridRowEnd = "2";
            }
        } else { // if the window's width is less than 880px
            if (helpDisplayed) { // if the instructions are being displayed
                helpWindow.style.display = "block"; // display instructions

                // alter elements grid properties
                helpWindow.style.gridColumnStart = "1";
                helpWindow.style.gridColumnEnd = "7";
                helpWindow.style.gridRow = "2";

                stopwatch.style.gridColumnStart = "1";
                stopwatch.style.gridColumnEnd = "4";
                stopwatch.style.gridRow = "3";

                bestScore.style.gridColumnStart = "4";
                bestScore.style.gridColumnEnd = "7"
                bestScore.style.gridRow = "3";

                cardsTable.style.gridColumnStart = "1";
                cardsTable.style.gridColumnEnd = "7";
                cardsTable.style.gridRow = "4";

                helpButton.style.gridColumn = "6";
                helpButton.style.gridRow = "1";
            } else { // if the instructions are not being displayed
                helpWindow.style.display = "none"; // remove instructions

                // alter elements grid properties
                helpWindow.style.gridColumnStart = "1";
                helpWindow.style.gridColumnEnd = "7";
                helpWindow.style.gridRow = "2";

                stopwatch.style.gridColumnStart = "1";
                stopwatch.style.gridColumnEnd = "4";
                stopwatch.style.gridRow = "2";

                bestScore.style.gridColumnStart = "4";
                bestScore.style.gridColumnEnd = "7"
                bestScore.style.gridRow = "2";

                cardsTable.style.gridColumnStart = "1";
                cardsTable.style.gridColumnEnd = "7";
                cardsTable.style.gridRow = "3";

                helpButton.style.gridColumn = "6";
                helpButton.style.gridRow = "1";

            }
        }
    }
});