/* eslint-disable no-promise-executor-return */
function getNewPageWhenLoaded(browser) {
  return new Promise((x) =>
    browser.once("targetcreated", async (target) => {
      const newPage = await target.page();
      const newPagePromise = new Promise(() =>
        newPage.once("domcontentloaded", () => x(newPage))
      );
      const isPageLoaded = await newPage.evaluate(() => document.readyState);
      return isPageLoaded.match("complete|interactive")
        ? x(newPage)
        : newPagePromise;
    })
  );
}

module.exports = {
  getNewPageWhenLoaded,
};
