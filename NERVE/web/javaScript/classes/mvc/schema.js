/* global Context, Utility, Function */

class Schema {
    constructor(context) {
        Schema.traceLevel = 0;
        Utility.log(Schema, "constructor");
        Utility.enforceTypes(arguments, Context);

        this.context = context;
    }
    load(url, onSuccess = function() {}, onFailure = function() {}) {
        Utility.log(Schema, "load");
        Utility.enforceTypes(arguments, String, ["optional", Function], ["optional", Function]);

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    var domParser = new DOMParser();

                    let srcXML = domParser.parseFromString(xhttp.responseText, "text/xml");
                    this.src = srcXML;
                    this.xml = domParser.parseFromString("<grammar></grammar>", "text/xml");
                    this.fillGrammar(srcXML.getElementsByTagName("grammar")[0], this.xml.getElementsByTagName("grammar")[0]);

                    onSuccess(this);
                } else {
                    onFailure(xhttp.status, xhttp.responseText);
                }
            }
        }.bind(this);

        xhttp.open("POST", url, true);
        xhttp.send(null);
    }
    fillGrammar(source, destination) {
        Utility.log(Schema, "fillGrammar");
        Utility.enforceTypes(arguments, Element, Element);

        let children = Schema.getChildElements(source);
        for (let i in children) {
            if (children[i].tagName === "start" || children[i].tagName === "define" || children[i].tagName === "element" || children[i].tagName === "ref") {
                let newChild = destination.appendChild(children[i].cloneNode());
                this.fillGrammar(children[i], newChild);
            } else {
                this.fillGrammar(children[i], destination);
            }
        }
    }
    isValidPath(queryPath) {
        Utility.log(Schema, "isValidPath");
        Utility.enforceTypes(arguments, Array);

        let current = this.xml.getElementsByTagName("start")[0];
        for (let pathName of queryPath) {
            current = this.nextNode(current, pathName);
            if (current === null) return false;
        }
        return true;
    }
    getPath(element, tagName) {
        Utility.log(Schema, "getPath");
        Utility.enforceTypes(arguments, HTMLElement, String);

        /* build path */
        let path = [];
        let current = element.parentElement;
        while (current.id !== "entityPanel") {
            path.push(current.getAttribute(this.context.getTagNameRule("prefix")));
            current = current.parentElement;
        }

        path.unshift(tagName);
        return path.reverse();
    }
    isValid(element, tagName) {
        Utility.log(Schema, "isValid");
        Utility.enforceTypes(arguments, HTMLElement, String);

        let path = this.getPath(element, tagName);
        return this.isValidPath(path);
    }
    nextNode(schemaNode, name) {
        Utility.log(Schema, "nextNode");
        Utility.enforceTypes(arguments, Element, String);

        let childElements = Schema.getChildElements(schemaNode);

        for (let ele of childElements) {
            let check = this.check(ele, name);
            if (check !== null) return check;
        }
        return null;
    }
    check(eleNode, name) {
        Utility.log(Schema, "check");
        Utility.enforceTypes(arguments, Element, String);
        let rvalue = null;

        if (eleNode.nodeName === "element" && eleNode.getAttribute("name") !== null && eleNode.getAttribute("name") === name) {
            rvalue = eleNode;
        }

        if (eleNode.nodeName === "ref") {
            let selector = "define[name='" + eleNode.getAttribute("name") + "']";
            let refList = this.xml.querySelectorAll(selector);
            if (refList.length !== 0) {
                let reference = refList[0];

                let childElements = Schema.getChildElements(reference);
                for (let ele of childElements) {
                    let check = this.check(ele, name);
                    if (check !== null) {
                        rvalue = check;
                        break;
                    }
                }
            }
        }

        return rvalue;
    }
}

Schema.getChildElements = function (node) {
    let rvalue = [];
    for (let child of node.childNodes) {
        if (child.nodeType === 1) rvalue.push(child);
    }
    return rvalue;
};

class EmptySchema extends Schema {
    constructor(context) {
        super(context);
        EmptySchema.traceLevel = 0;
        Utility.log(EmptySchema, "constructor");

        Utility.verifyArguments(arguments, 1);
        Utility.enforceTypes(arguments, Context);
    }
    isValid(element, tagName) {
        Utility.log(EmptySchema, "isValid");
        Utility.enforceTypes(arguments, HTMLElement, String);
        return true;
    }
}