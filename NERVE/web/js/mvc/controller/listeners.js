/* global Utility */

class EntityDialogController {
    constructor(model) {
        this.model = model;
        this.entityValues = new EntityValues(null, null, null, null, null);
        this.update = false;

        $("#txtEntity").on("input", () => {
            this.entityValues.entity = $("#txtEntity").val();
            this.update = true;
        });
        $("#txtLemma").on("input", () => {
            this.entityValues.lemma = $("#txtLemma").val();
            this.update = true;
        });
        $("#txtLink").on("input", () => {
            this.entityValues.link = $("#txtLink").val();
            this.update = true;
        });

        $(".entityDialogTB").blur(() => {
            if (this.update) this.model.updateAllSelected(this.entityValues);
            this.update = false;
            this.entityValues = new EntityValues(null, null, null, null, null);
        });

        $(".entityDialogTB").keyup((event) => {
            if (event.keyCode !== 13) return;
            this.model.updateAllSelected(this.entityValues);
            this.entityValues = new EntityValues(null, null, null, null, null);
            event.stopPropagation();
        });
    }
}

class Listeners {
    constructor(model, view, controller) {
        Utility.log(Listeners, "constructor");
//        Utility.enforceTypes(arguments, Model, View, Controller);

        this.model = model;
        this.view = view;
        this.controller = controller;

        new EntityDialogController(model);

        let reader = new FileReader();
        reader.onload = async function (event) {
            await controller.loadDocument(this.filename, event.target.result, this.action);
        }.bind(reader);

        /* file dialog event - related to menu open */
        $("#fileOpenDialog").change(async (event)=>{
            reader.filename = event.currentTarget.files[0].name;
            await reader.readAsText(event.currentTarget.files[0]);
            $("#fileOpenDialog").val("");
        });

        $("#selectTagName").on("input", (event) => {
            let values = new EntityValues("", "", "", $("#selectTagName").val(), "");
            this.controller.updateAllSelected(values);
        });

        $("#goLink").click((event) => this.controller.goLink());

        /* search events */
        $("#searchTextArea").keyup((event) => {
            if (event.keyCode !== 13) return;
            event.stopPropagation();
            this.model.getSearchModel().search($("#searchTextArea").val());
            this.model.getSearchModel().next();
        });

        /* menu events key events fire these events */
        $("#menuSave").click((event) => {
            event.stopPropagation();
            this.controller.saveContents();
        });

        $("#menuOpen").click((event) => {
            event.stopPropagation();
            reader.action = "OPEN";
            $("#fileOpenDialog").click();
        });

        $("#menuNER").click((event) => {
            reader.action = "TAG";
            event.stopPropagation();
            $("#fileOpenDialog").click();
        });

        $("#menuEdit").click((event) => {
            reader.action = "EDIT";
            event.stopPropagation();
            $("#fileOpenDialog").click();
        });

        $("#menuClose").click((event) => {
            event.stopPropagation();
            this.model.close();
        });

        $("#menuTags").click((event) => {
            event.stopPropagation();
            this.view.tagMode();
        });
        $("#menuClear").click((event) => {
            event.stopPropagation();
            this.model.getCollection().clear();
            this.view.clearThrobber();
        });
        $("#menuUndo").click((event) => {
            event.stopPropagation();
            this.model.revertState();
        });
        $("#menuRedo").click((event) => {
            event.stopPropagation();
            this.model.advanceState();
        });
        $("#menuCopy").click((event) => {
            event.stopPropagation();
            this.model.copy();
        });
        $("#menuPaste").click((event) => {
            event.stopPropagation();
            this.model.paste();
            this.model.saveState();
        });
        $("#menuTag").click((event) => {
            event.stopPropagation();
            event.preventDefault();
            this.controller.tagSelectedRange();
        });
        $("#menuUntag").click((event) => {
            event.stopPropagation();
            this.controller.untagAll();
        });
        $("#menuMerge").click(async (event) => {
            event.stopPropagation();
            await this.controller.mergeSelectedEntities();
        });

        $("#menuWiki").click((event) => {
            var win = window.open("https://github.com/cwrc/NERVE/wiki", '_blank');
            win.focus();
        });

        /* control delete and backspace this.events */
        document.addEventListener('keydown', function (event) {
            var d = event.srcElement || event.target;
            if (event.keyCode !== 8 && event.keyCode !== 46) return;
            if (
                    (d.tagName.toUpperCase() === 'INPUT' && d.type.toUpperCase() === 'TEXT') ||
                    (d.tagName.toUpperCase() === 'INPUT' && d.type.toUpperCase() === 'PASSWORD') ||
                    (d.tagName.toUpperCase() === 'INPUT' && d.type.toUpperCase() === 'FILE') ||
                    (d.tagName.toUpperCase() === 'INPUT' && d.type.toUpperCase() === 'SEARCH') ||
                    (d.tagName.toUpperCase() === 'INPUT' && d.type.toUpperCase() === 'EMAIL') ||
                    (d.tagName.toUpperCase() === 'INPUT' && d.type.toUpperCase() === 'NUMBER') ||
                    (d.tagName.toUpperCase() === 'INPUT' && d.type.toUpperCase() === 'DATE') ||
                    (d.tagName.toUpperCase() === 'TEXTAREA') ||
                    (d.hasAttribute("contenteditable") && d.getAttribute("contenteditable") === "true")
                    ) {
                event.stopPropagation();
                return;
            }

            event.preventDefault();
        }, true);

        /* key Press Events */
        $(document).keydown((event) => {
            var d = event.srcElement || event.target;
            if (
                    (d.tagName.toUpperCase() === 'INPUT' && d.type.toUpperCase() === 'TEXT') ||
                    (d.tagName.toUpperCase() === 'INPUT' && d.type.toUpperCase() === 'PASSWORD') ||
                    (d.tagName.toUpperCase() === 'INPUT' && d.type.toUpperCase() === 'FILE') ||
                    (d.tagName.toUpperCase() === 'INPUT' && d.type.toUpperCase() === 'SEARCH') ||
                    (d.tagName.toUpperCase() === 'INPUT' && d.type.toUpperCase() === 'EMAIL') ||
                    (d.tagName.toUpperCase() === 'INPUT' && d.type.toUpperCase() === 'NUMBER') ||
                    (d.tagName.toUpperCase() === 'INPUT' && d.type.toUpperCase() === 'DATE') ||
                    (d.tagName.toUpperCase() === 'TEXTAREA') ||
                    (d.hasAttribute("contenteditable") && d.getAttribute("contenteditable") === "true")
                    ) {
                event.stopPropagation();
                return;
            }

            if (event.ctrlKey || event.metaKey) {
                switch (event.key) {
                    case "a":
                        $("#menuSelectLemma").click();
                        break;
                    case "c":
                        $("#menuCopy").click();
                        break;
                    case "e":
                        $("#menuTag").click();
                        break;
                    case "f":
                        $("#menuFind").click();
                        break;
                    case "m":
                        $("#menuMerge").click();
                        break;
                    case "o":
                        $("#menuOpen").click();
                        break;
                    case "r":
                        $("#menuUntag").click();
                        break;
                    case "s":
                        $("#menuSave").click();
                        break;
                    case "v":
                        $("#menuPaste").click();
                        break;
                    case "y":
                        $("#menuRedo").click();
                        break;
                    case "z":
                        $("#menuUndo").click();
                        break;
                    default:
                        return;
                }
            } else { /* no ctrl/meta */
                switch (event.key) {
                    case "Backspace":
                    case "Delete":
                        $("#menuUntag").click();
                        break;
                    case "Escape":
                        $("#menuClear").click();
                        break;
                    default:
                        return;
                }
            }

            event.preventDefault();
            event.stopPropagation();
        });

        /* Default Document Click Event */
        $("#entityPanel").click((event) => this.documentClick(event));

    }
    documentClick(event) {
        Utility.log(Listeners, "documentClick");
        Utility.enforceTypes(arguments, Object);
        if (!event.ctrlKey && !event.altKey && !event.shiftKey) this.model.getCollection().clear();
    }
    menuShowTags() {
        switch ($("#menuTags").text()) {
            case "Highlight Mode":
                this.view.overlayMode();
                break;
            case "Overlay Mode":
                this.view.tagMode();
                break;
            case "Tag Mode":
                this.view.highlightMode();
                break;
        }
    }
}

module.exports = Listeners;