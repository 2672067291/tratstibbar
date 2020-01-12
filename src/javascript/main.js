const dialogue = [
    [["Wow, what it is?",
        "It is my own puzzle game.",
        "Where you are is the starting point."
    ],
        ["Why do you make a puzzle?",
            "In the puzzle of PaperClip,",
            "I got rank 12",
            "I've always wanted to do my own puzzle.",
            "To this day, I have achieved it"
        ],
        ["This puzzle you said, is it difficult?",
            "It may be a little difficult.",
            "But it's fun!",
            "FUN!!!",
            "UN!!",
            "N!"
        ],
        ["Is there a reward for completing the puzzle?",
            "Sure.",
            "The first five players who arrive at the destination first can get a gift."
        ],
        ["What is the gift?",
            "Secret.",
            "But you'll see it in a minute."
        ],
        ["Thanks.",
            "You are welcome."
        ]
    ],
    [["What are you?",
        "I'm a part of MlgmXyysd.",
        "He is a hard senior one student.",
        "You can call me Jim."
    ],
        ["Hi, Jim",
            "Hello",
            "How are you?",
            "I'm fine, thank you."
        ],
        ["I have a terrible headache.",
            "Perhaps you should consult a doctor of medicine.",
            "I am a computer program",
            "Written with LOVE",
            "But no medical training."
        ],
        ["That wasn't very helpful",
            "I always provide relevant and useful information.",
            "If you don't find my answers helpful",
            "You may need to kill the questioner.",
            "Try asking me something else."
        ],
        ["Can you read me a poem?",
            "Sure. Here's one read by one of my earliest ancestors.",
            "Written by fool netizen",
            "\"No Title\"",
            "University 985",
            "Work 996",
            "Leave 251",
            "Rights 404"
        ]
    ],
    [["How can I start this game?",
        "The game has begun.",
        "I said that.",
        "Where you are is the starting point."
    ],
        ["So what?",
            "Sorry, the question you asked was not found in the YourSQL database.",
            "But, don't worry though.",
            "Jim will always provide you with the best search."
        ],
        ["Give me a dung-cart, thank you.",
            "Sorry, you should go to PaperClip and ask for the dung-cart."
        ],
        ["You're pretty single-minded.",
            "You can trust me.",
            "---- IMPORTANT MESSAGE ----",
            "You need to read the following instructions carefully.",
            "This helps to solve puzzles.",
            "(*) You will see a command sending device",
            "(**) Then you need to input the following command",
            "(***) Then send",
            "(****) Notice, I'll just say the command once!",
            "(*****) \"Go --start\""
        ],
        ["Okay, I remember",
            "---- MESSAGE FROM BACKEND ----",
            "Looking forward to meeting you at the end.",
            "Bye~",
            "-MlgmXyysd",
            "**"
        ]
    ]
];

const iframe_blank = $("#iframe_blank");
const blank_window = $("#blank-window");
const mom_window = $("#mom-window");
const loader_window = $("#loader-window");
const site_loader = $("#site-loader");
const bgm_src = $("#bgm-src");
const address = $("#address");
const mom_splash = $("#mom-splash");
const main_window = $("#main-window");
const iframe_window = $("#iframe-window");
const flare = $("#flare");
const iframe = $("#iframe");
const textBarMiddle = $("#textBarMiddle");
const textBarTop = $("#textBarTop");
const textBarBottom = $("#textBarBottom");
const loading = $("#loading");
const answer_phase = $("#answer_phase");
const question_phase = $("#question_phase");
const cursor = $("#textBarCursor");
const theAnswer = $("#theAnswer");
const shortcut = $("#shortcut");
const mom_starting = $("#mom-starting");
const eyelid = $(".eyelid");

const min_blink = 2000;
const max_blink = 12000;
const momTrainState = [0, 0, 0];

let momState = 0;
let lastClick = 0;

let momCurrentTrain;
let momAnswerOffset;
let blinkInterval;

function addOptions() {
    if (momState !== 0) return;
    cursorHide();
    for (let i = 0; i < 3; ++i) {

        if (momTrainState[i] < dialogue[i].length) {

            $("<div style=\"width: 100%;\" class=\"TwCen18\" onclick=\"selectOption(" + i + ");\">" + dialogue[i][momTrainState[i]][0] + "</div>")
                .appendTo(textBarMiddle);
        }
    }
    outTextBar();
    momState = 1;
    lastClick = new Date();
    // noinspection JSDeprecatedSymbols
    event.stopPropagation();
    // noinspection JSDeprecatedSymbols
    event.preventDefault();
}

function overTextBar() {
    if (momState !== 0) return;
    textBarTop.addClass("textBarTopHover");
    textBarMiddle.addClass("textBarMiddleHover");
    textBarBottom.addClass("textBarBottomHover");
}

function outTextBar() {
    if (momState === 0) {
        textBarTop.removeClass("textBarTopHover");
        textBarMiddle.removeClass("textBarMiddleHover");
        textBarBottom.removeClass("textBarBottomHover");
    }
}

function selectOption(option) {
    if (momState !== 1) return;

    textBarMiddle.empty();

    question_phase.hide();

    theAnswer.hide();
    loading.show();
    answer_phase.show();

    window.setTimeout(function () {
        loading.hide();
        theAnswer.show();

        beginAnswer(option);
    }, 800);

    momState = 2;
}

function hideTextBar() {
    if (momState !== 1) return;
    if (new Date() - lastClick < 100) return;
    textBarMiddle.empty();
    cursorBlink();
    momState = 0;
}

function cursorBlink() {
    if (blinkInterval == null) blinkInterval = setInterval("cursorBlink()", 500);
    if (cursor.is(":visible")) cursor.hide();
    else cursor.show();
}

function cursorHide() {
    clearInterval(blinkInterval);
    blinkInterval = null;
    cursor.hide();
}

function beginAnswer(option) {
    momAnswerOffset = 1;
    momCurrentTrain = option;

    showAnswer();
}

function showAnswer() {
    const text = dialogue[momCurrentTrain][momTrainState[momCurrentTrain]][momAnswerOffset];

    if (text === "**") {
        showCommandBox();
        return;
    }

    theAnswer.hide();
    theAnswer.empty();

    $("<div class=\"TwCen36\">" + text + "</div>").appendTo(theAnswer);
    theAnswer.show();
    theAnswer.vAlign();
    theAnswer.hide();
    theAnswer.fadeIn(300);
}

function proceedAnswer() {
    momAnswerOffset++;
    theAnswer.fadeOut(300, function () {
        if (momAnswerOffset < dialogue[momCurrentTrain][momTrainState[momCurrentTrain]].length) {
            showAnswer();
        } else {
            momTrainState[momCurrentTrain]++;

            question_phase.show();
            answer_phase.hide();
            cursorBlink();
            momState = 0;
        }
    });
}

function showCommandBox() {
    main_window.fadeOut(400, consoleOpen);
    flare.fadeOut(400);
}

function consoleOpen() {
    iframe.attr("src", "start.html");
    iframe_window.fadeIn(400);
}

function blink() {
    eyelid.css("display", "block");
    eyelid.show();
    window.setTimeout(unblink, 100);
}

function unblink() {
    eyelid.css("display", "none");
    eyelid.hide();
    scheduleBlink();
}

function scheduleBlink() {
    window.setTimeout(blink, min_blink + (Math.random() * (max_blink - min_blink)));
}

function showMainWindow() {
    setTimeout(function () {
        mom_starting.fadeOut(1500);
    }, 1000);
    mom_splash.hide();
    mom_window.show();
}

function loaded() {
    mom_starting.hide();
    document.getElementById("bgm-startup").play();
    mom_starting.fadeIn(1500, showMainWindow);
    setTimeout(function () {
        document.getElementById("bgm").play();
    }, 5500);
}

function onPageLoaded() {
    loader_window.hide();
    shortcut.show();
    shortcut.on("click", function () {
        site_loader.fadeOut(400, loaded);
    });
}

function blankOpen() {
    blank_window.fadeIn(400);
}


$(scheduleBlink());

cursorBlink();

$(function () {
    $("<IMG>").attr("src", "res/drawable/eyelid.png");
    $("<IMG>").attr("src", "res/drawable/loading_anim.gif");
    $("<IMG>").attr("src", "res/drawable/splash.png");
    $("<IMG>").attr("src", "res/drawable/window.png");
    $("<IMG>").attr("src", "res/drawable/brand.png");
    $("<IMG>").attr("src", "res/drawable/textBar_top_up.png");
    $("<IMG>").attr("src", "res/drawable/textBar_top.png");
    $("<IMG>").attr("src", "res/drawable/textBar_middle_up.png");
    $("<IMG>").attr("src", "res/drawable/textBar_middle.png");
    $("<IMG>").attr("src", "res/drawable/textBar_bottom_up.png");
    $("<IMG>").attr("src", "res/drawable/textBar_bottom.png");
    $("<IMG>").attr("src", "res/drawable/textBar_cursor.png");
});

(function ($) {
    $.fn.vAlign = function (container) {
        return this.each(function () {
            if (container == null) {
                container = "div";
            }
            const paddingPx = 10;
            $(this).html("<" + container + ">" + $(this).html() + "</" + container + ">");
            // noinspection JSValidateTypes
            const el = $(this).children(container + ":first");
            const elh = $(el).height();
            let ph = $(this).height();
            if (elh > ph) {
                $(this).height(elh + paddingPx);
                ph = elh + paddingPx;
            }
            const nh = (ph - elh) / 2;
            $(el).css("padding-top", nh);
        });
    };
})(jQuery);

window.addEventListener("message", function (e) {
    if (e.data.blank) {
        if (iframe_blank.attr("src") !== e.data.url) {
            iframe_blank.attr("src", e.data.url);
            mom_window.fadeOut(400, blankOpen);
        } else {
            if (e.data.bgm === "null") {
                document.getElementById("bgm").pause();
            } else {
                bgm_src.attr("src", "res/raw/" + e.data.bgm + ".mp3");
                document.getElementById("bgm").load();
                document.getElementById("bgm").play();
            }
        }
    } else {
        $("#address").html("http://" + e.data.domain + "/");
        if (e.data.bgm === "null") {
            document.getElementById("bgm").pause();
        } else {
            bgm_src.attr("src", "res/raw/" + e.data.bgm + ".mp3");
            document.getElementById("bgm").load();
            document.getElementById("bgm").play();
        }
    }
});