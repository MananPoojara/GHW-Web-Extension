document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('blockBtn').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            let activeTab = tabs[0];
            chrome.storage.sync.get({ blockedSites: [] }, (data) => {
                let blockedSites = data.blockedSites;
                blockedSites.push(activeTab.url);
                chrome.storage.sync.set({ blockedSites }, () => {
                    alert('Site blocked!');
                });
            });
        });
    });

    document.getElementById('highlightBtn').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            let activeTab = tabs[0];
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                func: highlightSelection
            });
        });
    });

    document.getElementById('noteBtn').addEventListener('click', () => {
        let note = prompt('Enter your note:');
        if (note) {
            chrome.storage.sync.get({ notes: [] }, (data) => {
                let notes = data.notes;
                notes.push(note);
                chrome.storage.sync.set({ notes }, () => {
                    displayNotes();
                    alert('Note saved!');
                });
            });
        }
    });

    document.getElementById('bookmarkBtn').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            let activeTab = tabs[0];
            chrome.bookmarks.create({
                title: activeTab.title,
                url: activeTab.url
            }, () => {
                alert('Bookmark added!');
            });
        });
    });

    function displayNotes() {
        chrome.storage.sync.get({ notes: [] }, (data) => {
            let noteList = document.getElementById('noteList');
            noteList.innerHTML = '';
            data.notes.forEach((note) => {
                let li = document.createElement('li');
                li.textContent = note;
                noteList.appendChild(li);
            });
        });
    }

    displayNotes();
});

function highlightSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.backgroundColor = 'yellow';
        range.surroundContents(span);
        selection.removeAllRanges();
    }
}
