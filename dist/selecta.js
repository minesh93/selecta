
const SelectaDefaults = {
	valueField: 'value',
	onChange: null,
	placeholder: 'Select Something!',
	showPlaceholder: false,
	initialOption: '0',
	itemTemplate: (object, escape) => {
		return '<div class="selecta-item">' + escape(object.text) + '</div>';
	},
	placeholderTemplate: (placeholder, escape) => {
		return '<div class="selecta-placeholder">' + escape(placeholder) + '</div>';
	},
	selectedTemplate: (object, escape) => {
		return '<div class="selecta-selected">' + escape(object.text) + '</div>';
	}
};

const Selecta = (selector, settings, items) => {
	let chosenSettings = Object.assign({}, SelectaDefaults, settings);
	if (typeof selector == 'string') {
		document.querySelectorAll(selector).forEach(node => {
			node.select = new SelectaInstance(node, chosenSettings, items);
		});
	} else if (selector instanceof Element) {
		selector.select = new SelectaInstance(selector, chosenSettings, items);
	}
};

const SelectaClickHandler = e => {
	console.log(e);
	if (e.target.closest('.selecta-wrap') === null) {
		if (document.querySelector('.selecta-open') !== null) {
			document.querySelector('.selecta-open').classList.toggle('selecta-open');
		}
	} else {
		console.log("SHOULD NOT CLOSE");
	}
};

const SelectaEscape = str => {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

class SelectaInstance {
	constructor(element, settings, items) {
		this.element = element;
		this.settings = settings;
		this.selectaElement = document.createElement('div');
		this.selectaElement.classList.add('selecta-wrap');
		this.element.parentNode.insertBefore(this.selectaElement, this.element.nextSibling);
		this.element.style.display = "none";
		this.options = this.assignOptions(items);
		this.render();
		this.assignHandlers();
	}

	assignOptions(items) {
		let options = [];
		if (this.element.children.length) {
			for (let i = 0; i < this.element.children.length; i++) {
				let option = this.element.children[i];
				options.push({ value: option.value, text: option.text });
			}
		} else {
			options = items;
		}
		return options;
	}

	addOption(option) {
		this.options.push(option);
		this.selectaElement.lastChild.appendChild(this.renderOption(option));
		this.assignHandlerToOption(this.selectaElement.lastChild.lastChild);
	}

	renderOption(option) {
		let el = document.createElement('div');
		el.innerHTML = this.settings.itemTemplate(option, SelectaEscape);
		el.firstChild.dataset.selecta = option[this.settings.valueField];
		return el.firstChild;
	}

	renderSelection(option) {
		let el = document.createElement('div');
		el.innerHTML = this.settings.selectedTemplate(option, SelectaEscape);
		return el.firstChild;
	}

	renderPlaceholder(placeholder) {
		let el = document.createElement('div');
		el.innerHTML = this.settings.placeholderTemplate(placeholder, SelectaEscape);
		return el.firstChild;
	}

	assignHandlerToOption(node) {
		node.addEventListener('click', e => {
			// console.log(e.target.closest(node));
			let target = e.path.find(n => n == node);
			if (target.dataset.selecta !== undefined) {
				this.setValue(target.dataset.selecta);
			}
			this.selectaElement.classList.toggle('selecta-open');
		});
	}

	render() {
		let itemWrap = document.createElement('div');
		let selectedWrap = document.createElement('div');

		itemWrap.classList.add('selecta-item-wrap');
		selectedWrap.classList.add('selecta-selected-wrap');

		this.options.forEach(option => {
			itemWrap.appendChild(this.renderOption(option));
		});

		if (this.settings.showPlaceholder) {
			selectedWrap.appendChild(this.renderPlaceholder(this.settings.placeholder));
		} else {
			selectedWrap.appendChild(this.renderSelection(this.options[0]));
		}

		this.selectaElement.appendChild(selectedWrap);
		this.selectaElement.appendChild(itemWrap);
	}

	setValue(value) {
		let selected = this.options.find(option => {
			return option[this.settings.valueField] == value;
		});
		if (selected !== undefined) {
			this.element.value = value;
			this.selectaElement.firstChild.firstChild.replaceWith(this.renderSelection(selected));
			if (this.settings.onChange instanceof Function) {
				this.settings.onChange(selected);
			}
		}
	}

	assignHandlers() {
		this.selectaElement.firstChild.addEventListener('click', e => {
			this.selectaElement.classList.toggle('selecta-open');
		});

		this.selectaElement.lastChild.childNodes.forEach(node => {
			console.log(node);
			this.assignHandlerToOption(node);
		});
	}
};

document.addEventListener('click', SelectaClickHandler);

Selecta('#selecta-1', {});

Selecta('#selecta-2', {}, [{
	text: 'One Test',
	value: 1
}]);

let colours = [{
	text: 'Green',
	color: '#1abc9c'
}, {
	text: 'Blue',
	color: '#2980b9'
}, {
	text: 'Orange',
	color: '#e67e22'
}];

Selecta('#selecta-3', {
	valueField: 'color',
	itemTemplate: function (o, escape) {
		return '<div class="selecta-item" style="color:#ffffff;background:' + o.color + '">' + escape(o.text) + '</div>';
	},
	selectedTemplate: function (o, escape) {
		return '<div class="selecta-selected" style="color:#ffffff;background:' + o.color + '">' + escape(o.text) + '</div>';
	},
	onChange: function (setting) {
		console.log(setting);
	}
}, colours);

Selecta('#selecta-4', {
	valueField: 'color',
	itemTemplate: function (o, escape) {
		return '<div class="selecta-item" style="color:#ffffff;background:' + o.color + '">' + escape(o.text) + '</div>';
	},
	selectedTemplate: function (o, escape) {
		return '<div class="selecta-selected" style="color:#ffffff;background:' + o.color + '">' + escape(o.text) + '</div>';
	},
	onChange: function (setting) {
		console.log(setting);
	},
	showPlaceholder: true
}, colours);

Selecta('#selecta-5', {
	valueField: 'color',
	itemTemplate: function (o, escape) {
		return '<div class="selecta-person">' + '<div class="background" style="background:' + o.color + '"></div>' + escape(o.text) + '</div>';
	},
	selectedTemplate: function (o, escape) {
		return '<div class="selecta-selected" style="color:#ffffff;background:' + o.color + '">' + escape(o.text) + '</div>';
	},
	onChange: function (setting) {
		console.log(setting);
		console.log("setting value");
	},
	showPlaceholder: true
}, colours);

let colouredSelect = document.querySelectorAll('select')[2];