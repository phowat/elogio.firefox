'use strict';
var buttons = require('sdk/ui/button/action');
var pageMod = require("sdk/page-mod");
var data = require('sdk/self').data;
var tabs = require('sdk/tabs');
var activeTab;
var limitPixels = 100;
var sidebarWorker = null;
var imageStorage = {};
var workersObject = {};
var wheelUrl = data.url('overlay.png');

var sidebar = require("sdk/ui/sidebar").Sidebar({
    id: 'elogio-firefox-plugin',
    title: 'Elog.io Image Catalog',
    url: require("sdk/self").data.url("panel.html"),
    onAttach: function (worker) {
        sidebarWorker = worker;
        sidebarWorker.port.on("panelLoaded", function () {
            sidebarWorker.port.emit('drawItems', imageStorage[activeTab.id]);
        });
    }
});

buttons.ActionButton({
    id: "elogio-button",
    label: "Get images",
    icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "64": "./icon-64.png"
    },
    onClick: function () {
        sidebar.show();
    }
});

function detachWorker(worker, workerArray) {
    var index = workerArray.indexOf(worker);
    if (index !== -1) {
        workerArray.splice(index, 1);
    }
}
pageMod.PageMod({
    include: "*",
    contentScriptFile: [data.url("content-script.js")],
    attachTo: 'top',
    onAttach: function (worker) {
        var tabId = worker.tab.id;
        console.log('OnAttach for tab ' + tabId);
        if (!workersObject[tabId]) {
            workersObject[tabId] = [];
        }
        activeTab = worker.tab;
        workersObject[tabId].push(worker);
        worker.on('detach', detachWorker.bind(null, worker, workersObject[worker.tab.id]));

        function imagesReceived(imagesFromPage) {
            console.log('Received images for tab id ' + tabId);

            if (imagesFromPage) {
                if (!imageStorage[tabId]) {
                    imageStorage[tabId] = [];
                }
                for (var i = 0; i < imagesFromPage.length; i++) {
                    imageStorage[tabId].push(imagesFromPage[i]);
                }

                if (sidebarWorker && tabId === activeTab.id) {
                    console.log('Going to draw for ' + tabId + '  ' + imageStorage[tabId].length + ' images.');
                    sidebarWorker.port.emit('drawItems', imageStorage[tabId]);
                }
            }
        }

        function onBeforeUnloadTopPage(tabId) {
            imageStorage[tabId] = null;
            if (tabId === activeTab.id) {
                sidebarWorker.port.emit("drawItems", null);
            }
        }

        worker.port.on("gotElement", imagesReceived.bind(worker));
        worker.port.on("onBeforeUnload", onBeforeUnloadTopPage.bind(null, tabId));
        worker.port.emit("getElement", limitPixels, wheelUrl);
    }
});
tabs.on('activate', function (tab) {
    activeTab = tab;
    if (sidebarWorker) {
        sidebarWorker.port.emit('drawItems', imageStorage[activeTab.id]);
    }
});

tabs.on('open', function (tab) {
    console.log('Tab On OPEN for tab id = ' + tab.id);
    imageStorage[tab.id] = null;
});

//if tab was closed the we need to remove all workers of this tab
tabs.on('close', function (tab) {
    var index = workersObject.indexOf(tab.id);
    if (index !== -1) {
        workersObject.splice(index, 1);
    }
});