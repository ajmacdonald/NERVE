const TagInfo = require("./TagInfo");
const NameSource = require("./NameSource");
class Context {
	constructor() {
	}
	static __isTransient() {
		return true;
	}
	static __getClass() {
		return "ca.sharcnet.nerve.context.Context";
	}
	static __isEnum() {
		return false;
	}
	hasTagSourceAttribute() {
		return !this.tagSourceAttribute.isEmpty();
	}
	getTagSourceAttribute() {
		return this.tagSourceAttribute;
	}
	hasScriptFilename() {
		return !this.scriptFilename.isEmpty();
	}
	getScriptFilename() {
		return this.scriptFilename;
	}
	getName() {
		return this.name;
	}
	getSchemaName() {
		return this.schemaName;
	}
	readFromDictionary() {
		return this.dictionaries;
	}
	styles() {
		return this.styleList;
	}
	tags() {
		return this.tagList;
	}
	getTagInfo(tagname, source) {
		for(let tagInfo of this.tagList){
			if (tagInfo.getName(source) === tagname)return tagInfo;
			
		}
		throw new Error(`ContextException taginfo not found for tagname:${tagname}, source:${source}, context:${this.name}`);
	}
	isTagName(tagname, source) {
		for(let tagInfo of this.tagList){
			if (tagInfo.getName(source) === tagname)return true;
			
		}
		return false;
	}
};

if (typeof module !== "undefined") module.exports = Context;