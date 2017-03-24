/* global Utility, Event, Range */

class IMessageHandler {
    constructor() {}
    message(string) {}
}

IMessageHandler.null = new IMessageHandler();

class MessageHandler extends IMessageHandler {
    constructor(view) {
        super();
        MessageHandler.traceLevel = 0;
        Utility.log(MessageHandler, "constructor");
        Utility.enforceTypes(arguments, View);
        this.view = view;
    }
    message(string) {
        this.view.appendMessage(string);
        console.log(string);
    }
}

class Events {
    constructor(view, model, controller) {
        Events.traceLevel = 2;
        Utility.log(Events, "constructor");
        Utility.enforceTypes(arguments, View, Model, Controller, ["optional", Function]);

        this.clearConsole = false;

        this.view = view;
        this.model = model;
        this.controller = controller;
        this.msgHnd = new MessageHandler(view);
    }
    buttonFind(event) {
        Utility.log(Events, "buttonFind");
        Utility.enforceTypes(arguments, Event);

        if (!event.ctrlKey) {
            this.controller.unselectAll();
            this.controller.clearDialogs();
        }

        this.controller.find();
        event.stopPropagation();
    }
    cbDictionaryClick(event) {
        Utility.log(Events, "cbDictionaryClick");
        Utility.enforceTypes(arguments, Event);
        event.stopPropagation();
    }
    cbDictionaryChange(event) {
        Utility.log(Events, "cbDictionaryChange");
        Utility.enforceTypes(arguments, Event);

        this.controller.updateDictionaryOnSelected();
    }

    copyData(fromEle, toEle){
        let response = this.controller.copyData(fromEle, toEle);
        this.controller.addSelected(fromEle);
        this.controller.addSelected(toEle);
        this.controller.setDialogs(toEle);
        this.model.saveState();
    }

    documentClick(event) {
        Utility.log(Events, "documentClick");
        Utility.enforceTypes(arguments, Event);

        if (event.altKey){
            console.log(event.target);
            return;
        }

        if (event.ctrlKey) return;

        let dialog = jQuery("#cwrcSearchDialog").get(0);

        if (Utility.isDescendent(dialog, event.target)) return;

        this.controller.unselectAll();
        this.controller.clearDialogs();

        event.stopPropagation();
    }
    entityPanelClick(event) {
        Utility.log(Events, "entityPanelClick");
        Utility.enforceTypes(arguments, Event);

        if (!event.ctrlKey) {
            this.controller.unselectAll();
            this.controller.clearDialogs();
        }

        event.stopPropagation();
    }
    menuClearSelection() {
        Utility.log(Events, "menuClearSelection");
        Utility.enforceTypes(arguments);

        this.controller.unselectAll();
        this.controller.clearDialogs();
        window.getSelection().empty();
    }
    menuShowTagsChange(value){
        Utility.log(Events, "menuShowTagsChange");
        Utility.enforceTypes(arguments, Boolean);

        let settings = new Storage();

        if (value === true){
            this.view.attachStyle(this.model.getContext().getTagStyle());
            settings.setValue("tags", "show", "true");
        } else {
            this.view.detachStyle(this.model.getContext().getTagStyle());
            settings.setValue("tags", "show", "false");
        }


    }
    menuClose(){
        Utility.log(Events, "menuClose");
        Utility.enforceTypes(arguments);
        window.alert("This menu item has not yet been implemented");
    }
    menuContextChange(contextName) {
        Utility.log(Events, "menuContextChange");
        if (this.clearConsole) console.clear();
        Utility.enforceTypes(arguments, String);

        let onContextLoadFailure = function (status, text) {
            let msg = "Failed to load context\n";
            msg += "return status : " + status;
            console.log(text);
            window.alert(msg);
            this.view.showThrobber(false);
        }.bind(this);

        let onContextLoadSuccess = function () {
            this.view.showThrobber(false);
            this.view.popThrobberMessage();
        }.bind(this);

        this.view.showThrobber(true);
        this.view.pushThrobberMessage("Loading Context");
        this.controller.loadContext(contextName.toLowerCase(), onContextLoadSuccess, onContextLoadFailure);
    }
    menuDelete() {
        Utility.log(Events, "menuDelete");
        Utility.enforceTypes(arguments);

        this.controller.deleteSelectedEntities();

        event.stopPropagation();
    }
    menuFind() {
        Utility.log(Events, "menuFind");
        Utility.enforceTypes(arguments);
        this.controller.fillFind();
    }

    menuMerge() {
        Utility.log(Events, "menuMerge");
        Utility.enforceTypes(arguments);
        event.stopPropagation();

        let response = this.controller.mergeSelectedEntities();
        if (response.hasMessage()) this.view.showUserMessage(response.message);
    }

    menuOpen() {
        Utility.log(Events, "menuOpen");
        Utility.enforceTypes(arguments);

        this.controller.loadFromFile(
            (filename) => { /* pre load */
                this.view.showThrobber(true);
                this.view.setThrobberMessage("Encoding file\n" + filename);
        },
            () => { /* success */
                this.view.clearThrobber();
        },
            (status, text) => { /* fail */
                let msg = "Failed to encode file\n";
                msg += "return status : " + status;
                console.log(text);
                window.alert(msg);
                this.view.clearThrobber();
            }
        );
    }

    menuRedo() {
        Utility.log(Events, "menuRedo");
        Utility.enforceTypes(arguments);

        this.controller.unselectAll();
        this.model.advanceState();
    }
    menuResetAll() {
        Utility.log(Events, "menuResetAll");
        Utility.enforceTypes(arguments);

        localStorage.clear();
        location.reload(true);
    }
    menuSameSelect(event) {
        Utility.log(Events, "menuSameSelect");
        Utility.enforceTypes(arguments, Event);


        this.controller.selectByEntity();
        event.stopPropagation();
    }
    menuSave() {
        Utility.log(Events, "menuSave");
        Utility.enforceTypes(arguments);

        this.view.showThrobber(true);
        this.controller.saveContents(
            () => this.view.showThrobber(false),
            () => this.view.showThrobber(false)
        );
    }
    menuSettings(event) {
        Utility.log(Events, "menuSettings");
        Utility.enforceTypes(arguments, Event);

        var child = window.open("settings.html", "_blank");
        child.entityPanel = document.getElementById("entityPanel");
    }
    menuSmartSelect(event) {
        Utility.log(Events, "menuSmartSelect");
        Utility.enforceTypes(arguments, Event);

        event.stopPropagation();

        this.controller.smartSelect();

    }
    menuTag() {
        Utility.log(Events, "menuTag");
        Utility.enforceTypes(arguments);

        let copyResult = this.controller.copyDataToSelectedTags();

        if (copyResult.count !== 0) {
            if (copyResult.count === 1) this.view.showUserMessage("'" + copyResult.lemma + "' copied to 1 entity");
            else this.view.showUserMessage("'" + copyResult.lemma + "' copied to " + copyResult.count + " entities");
            return;
        }

        let response = this.controller.tagSelectedRange();
        if (response.hasMessage()) this.view.showUserMessage(response.message);
        if (response.result === true){
            this.model.saveState();
            this.controller.addSelected(response.taggedEntity);
            this.controller.setDialogs(response.taggedEntity, 0);
        }
    }
    menuUndo() {
        Utility.log(Events, "menuUndo");
        Utility.enforceTypes(arguments);

        this.controller.unselectAll();
        this.model.revertState();
    }
    menuUntag() {
        Utility.log(Events, "menuUntag");
        Utility.enforceTypes(arguments);

        let response = this.controller.untagAll();
        this.model.saveState();
        if (response.hasMessage()) this.view.showUserMessage(response.message);
    }

    searchNext(text){
        Utility.log(Events, "searchNext");
        Utility.enforceTypes(arguments, String);
        this.controller.search(text, "next");
    }

    searchPrev(text){
        Utility.log(Events, "searchPrev");
        Utility.enforceTypes(arguments, String);
        console.log(this.controller);
        this.controller.search(text, "prev");
    }

    selDictionaryClick(event) {
        Utility.log(Events, "selDictionaryClick");
        Utility.enforceTypes(arguments, Event);

        event.stopPropagation();
    }
    selDictionaryChange(event, newValue) {
        Utility.log(Events, "selDictionaryChange");
        if (this.clearConsole) console.clear();
        Utility.enforceTypes(arguments, Event, String);

        this.controller.setDictionary(newValue);
    }
    showSearchDialog(event) {
        Utility.log(Events, "showSearchDialog");
        Utility.enforceTypes(arguments, Event);

        this.controller.showSearchDialog();
        event.stopPropagation();
    }
    taggedEntityClick(event, taggedEntity) {
        Utility.log(Events, "taggedEntityClick");
        Utility.enforceTypes(arguments, Event, TaggedEntity);

        if (window.event.altKey) {
            /* strictly for debugging / tests, not part of the test bed */
            window.debug = taggedEntity;
            console.log(taggedEntity.element);
            event.stopPropagation();
        } else {
            if (this.clearConsole)
                console.clear();
            if (!event.ctrlKey && !event.metaKey) {
                this.controller.unselectAll();
                this.controller.addSelected(taggedEntity);
                this.controller.setDialogs(taggedEntity, 0);
            } else {
                this.controller.toggleSelect(taggedEntity);
                this.controller.setDialogs(taggedEntity, 0);
            }

            event.stopPropagation();

        }
    }
    taggedEntityDoubleClick(event, taggedEntity) {
        Utility.log(Events, "taggedEntityDoubleClick");
        Utility.enforceTypes(arguments, Event, TaggedEntity);

        if (window.event.altKey) {
            /* do nothing */
        } else {
            event.preventDefault();
            this.controller.selectSameEntities(taggedEntity);
        }
    }
    textBoxBlur(event) {
        Utility.log(Events, "textBoxBlur");
        Utility.enforceTypes(arguments, Event);

        event.stopPropagation();
        if (this.controller.selected.size() > 0 && this.textBoxValueChange === true) {
            this.model.saveState();
        }
        this.textBoxValueChange = false;
    }
    textBoxClick(event) {
        Utility.log(Events, "textBoxClick");
        Utility.enforceTypes(arguments, Event);
        event.stopPropagation();

    }
    textBoxInput(functionId, value) {
        Utility.log(Events, "textBoxInput");
        Utility.enforceTypes(arguments, String, String);

        this.controller[functionId](value);
        this.controller.selected.forEachInvoke(functionId, value);
        this.controller.pollDictionaryUpdate(250);
    }
    textBoxChange(functionId, value) {
        Utility.log(Events, "textBoxChange");
        Utility.enforceTypes(arguments, String, String);

        this.controller[functionId](value);
        this.model.saveState();
    }
}