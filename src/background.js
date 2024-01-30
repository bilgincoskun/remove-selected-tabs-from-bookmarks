const menuItemId = "remove-tabs";

function findAndRemove(tab_url) {
    try{
        return browser.bookmarks
            .search({url:tab_url})
            .then(r => r
                .map(b => {
                    browser.bookmarks.remove(b.id);
                    console.log('Removed ' + tab_url + ' from bookmarks')
                }), console.error
            );
    }catch(error){
        console.log('Cannot remove ' + tab_url + ' from bookmarks');
    }
}

function removeSelectedTabs(tabs) {
    Promise.all(
        tabs.map(
            t => findAndRemove(t.url)
        )
        .flat()
    );
}

function handleHighlighted(highlightInfo) {
    if (highlightInfo.tabIds.length > 1) {
        browser.menus.create({
            id: menuItemId,
            title: "Remove Selected Tabs from Bookmarks",
            contexts: ["tab"]
        });
    } else {
        browser.menus.remove(menuItemId);
    }
}

browser.tabs.onHighlighted.addListener(handleHighlighted);

browser.menus.onClicked.addListener(
    (info, tab) => {
        if (info.menuItemId == menuItemId) {
            browser.tabs
                .query({
                    currentWindow: true,
                    highlighted: true
                })
                .then(removeSelectedTabs, console.error);
        }
    }
)
