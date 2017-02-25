
const SelectaDefaults = {
	valueField: 'value',
	onChange: null,
	placeholder: 'Select Something!',
	extraClass: '',
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
			let target = e.path.find(n => n == node);
			if (target.dataset.selecta !== undefined) {
				this.setValue(target.dataset.selecta);
			}
		});
	}

	render() {

		let itemWrap = document.createElement('div');
		let selectedWrap = document.createElement('div');

		this.selectaElement = document.createElement('div');
		this.selectaElement.classList.add('selecta-wrap');

		if (this.settings.extraClass !== '') {
			this.selectaElement.classList.add(this.settings.extraClass);
		}

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

		this.element.parentNode.insertBefore(this.selectaElement, this.element.nextSibling);
		this.element.style.display = "none";
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
		this.selectaElement.addEventListener('click', e => {
			this.selectaElement.classList.toggle('selecta-open');
		});

		this.selectaElement.lastChild.childNodes.forEach(node => {
			this.assignHandlerToOption(node);
		});
	}
};

document.addEventListener('click', SelectaClickHandler);