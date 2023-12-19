chrome.action.onClicked.addListener((tab) => {
    chrome.storage.sync.get(
        { siteMappings: [], cookieName: '' },
        (items) => {
            const mapping = items.siteMappings.find((mapping) => tab.url.toLowerCase().includes(mapping[0].toLowerCase()));
            if (!mapping) return;

            chrome.cookies.get({ url: mapping[1], name: items.cookieName }, function (cookie) {
                if (!cookie?.value) return;

                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: async (cookie) => {
                        function changeValue(input, value) {

                            var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                                window.HTMLInputElement.prototype,
                                "value"
                            ).set;
                            nativeInputValueSetter.call(input, value);

                            var inputEvent = new Event("input", { bubbles: true });
                            input.dispatchEvent(inputEvent);
                        }

                        document.getElementsByClassName("btn authorize unlocked")[0].click();
                        const input = document.querySelector(".auth-container input[type='text']");
                        changeValue(input, cookie);
                        document.getElementsByClassName("btn modal-btn auth authorize button")[0].click();
                        document.getElementsByClassName("btn modal-btn auth btn-done button")[0].click();
                    },
                    args: [cookie.value]
                });
            });
        }
    );
});

