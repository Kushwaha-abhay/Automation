const puppeteer = require("puppeteer");
let tab;
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
    let allLinks = [];
    for (let i = 0; i < alllink.length; i++) {
      allLinks.push("https://www.hackerrank.com/" + alllink[i]);
    }
    let completeQuestion = solveQuestion(allLinks[0]);
    return completeQuestion;
  })
  .then(function (allLinks) {
    console.log(allLinks);
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

function solveQuestion(question) {
  return new Promise(function (resolve, reject) {
    let questionOpenedPromise = tab.goto(question);
    questionOpenedPromise
      .then(function () {
        let waitAndClickPromise = waitAndClick("#tab-1-item-4");
        return waitAndClickPromise;
      })
      .then(function () {});
  });
}
