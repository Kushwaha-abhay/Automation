const puppeteer = require("puppeteer");
let tab;
let idx;
let gCode;
let browserOpen = puppeteer.launch({ headless: false });
browserOpen
  .then(function (browser) {
    let pages = browser.pages();
    return pages;
  })
  .then(function (pages) {
    let page = pages[0];
    tab = page;
    let pageopen = page.goto(
      "https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login"
    );
    return pageopen;
  })
  .then(function () {
    console.log("Opened");
    let idtyped = tab.type("#input-1", "pivaxe6361@flmcat.com");
    return idtyped;
  })
  .then(function () {
    let passtyped = tab.type("#input-2", "123456");
    return passtyped;
  })
  .then(function () {
    let loginClicked = tab.click(
      ".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled"
    );
    console.log("login " + loginClicked);
    return loginClicked;
  })
  .then(function () {
    let ipclicked = waitAndClick(
      ".ui-btn.ui-btn-normal.ui-btn-large.ui-btn-primary.ui-btn-link.ui-btn-styled"
    );
    console.log(ipclicked);
    return ipclicked;
  })
  .then(function () {
    let warmUpChallege = waitAndClick("#base-card-1-link");
    return warmUpChallege;
  })
  .then(function () {
    return tab.waitForSelector(".js-track-click.challenge-list-item", {
      visible: true,
    });
  })
  .then(function () {
    return tab.$$(".js-track-click.challenge-list-item");
  })
  .then(function (allquestion) {
    let alllink = [];
    for (let i = 0; i < allquestion.length; i++) {
      let allhreflink = tab.evaluate(function (elem) {
        return elem.getAttribute("href");
      }, allquestion[i]);
      alllink.push(allhreflink);
    }
    return Promise.all(alllink);
  })
  .then(function (alllink) {
    let completeLinks = allLinks.map(function (link) {
      return "https://www.hackerrank.com" + link;
    });
    // console.log(completeLinks);
    // using loops => chaining effect

    let quesSolvedPromise = solveQuestion(completeLinks[0]);
    for (let i = 1; i < completeLinks.length; i++) {
      quesSolvedPromise = quesSolvedPromise.then(function () {
        let nextQuesSolvedPromise = solveQuestion(completeLinks[i]);
        return nextQuesSolvedPromise;
      });
    }
    return quesSolvedPromise;
  })
  .then(function () {
    console.log("All ques solved");
  })
  .catch(function (error) {
    console.log(error);
  });

function waitAndClick(selector) {
  return new Promise(function (resolve, reject) {
    let waitPromose = tab.waitForSelector(selector, { visible: true });

    waitPromose
      .then(function () {
        return tab.click(selector);
      })
      .then(function () {
        resolve();
      })
      .catch(function () {
        reject(error);
      });
  });
}
function getCode() {
  return new Promise(function (resolve, reject) {
    let waitPromise = tab.waitForSelector(".hackdown-content h3", {
      visible: true,
    });
    waitPromise
      .then(function () {
        let codeNamesTagsPromise = tab.$$(".hackdown-content h3");
        return codeNamesTagsPromise;
      })
      .then(function (codeNamesTags) {
        // [ <h3>C++</h3> , <h3>Python</h3> , <h3>Java</h3>    ]
        let allCodeNamesPromise = [];
        for (let i = 0; i < codeNamesTags.length; i++) {
          let codeNamePromise = tab.evaluate(function (elem) {
            return elem.textContent;
          }, codeNamesTags[i]);
          allCodeNamesPromise.push(codeNamePromise);
        }
        let pendingPromise = Promise.all(allCodeNamesPromise);
        return pendingPromise;
      })
      .then(function (allCodeNames) {
        // [ "C++" , "Python" , "Java"  ];
        idx;
        for (let i = 0; i < allCodeNames.length; i++) {
          if (allCodeNames[i] == "C++") {
            idx = i;
            break;
          }
        }
        let allCodeElementsPromise = tab.$$(".hackdown-content .highlight");
        return allCodeElementsPromise;
      })
      .then(function (allCodeElements) {
        // [  <div class="highlight"> </div>  , <div class="highlight"> </div>  , <div class="highlight"> </div>  ];
        let codeDiv = allCodeElements[idx];
        let codePromise = tab.evaluate(function (elem) {
          return elem.textContent;
        }, codeDiv);
        return codePromise;
      })
      .then(function (code) {
        // console.log(code);
        gCode = code;
        resolve();
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

function pasteCode() {
  return new Promise(function (resolve, reject) {
    let waitAndClickPromise = waitAndClick(".custom-input-checkbox");
    waitAndClickPromise
      .then(function () {
        let codeTypedPromise = tab.type(".custominput", gCode);
        return codeTypedPromise;
      })
      .then(function () {
        let ctrlKeyHoldPromise = tab.keyboard.down("Control");
        return ctrlKeyHoldPromise;
      })
      .then(function () {
        let aKeyPressedPromise = tab.keyboard.press("A");
        return aKeyPressedPromise;
      })
      .then(function () {
        let xKeyPressedPromise = tab.keyboard.press("X");
        return xKeyPressedPromise;
      })
      .then(function () {
        let codeBoxClickedPromise = tab.click(
          ".monaco-scrollable-element.editor-scrollable.vs"
        );
        return codeBoxClickedPromise;
      })
      .then(function () {
        let aKeyPressedPromise = tab.keyboard.press("A");
        return aKeyPressedPromise;
      })
      .then(function () {
        let aKeyPressedPromise = tab.keyboard.press("V");
        return aKeyPressedPromise;
      })
      .then(function () {
        let ctrlKeyUpPromise = tab.keyboard.up("Control");
        return ctrlKeyUpPromise;
      })
      .then(function () {
        resolve();
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

function solveQuestion(question) {
  return new Promise(function (resolve, reject) {
    let questionOpenedPromise = tab.goto(question);
    questionOpenedPromise
      .then(function () {
        let waitAndClickPromise = waitAndClick("#tab-1-item-4");
        return waitAndClickPromise;
      })
      .then(function () {
        let getCodePromise = getCode();
        return getCodePromise;
      })
      .then(function () {
        let problemTabClickedPromise = tab.click("#tab-1-item-0");
        return problemTabClickedPromise;
      })
      .then(function () {
        let codePastedPromise = pasteCode();
        return codePastedPromise;
      })
      .then(function () {
        resolve();
      })
      .catch(function (error) {
        reject(error);
      });
  });
}
