
var SelectaDefaults = {
	valueField:'value',
	dataBinding:false,
	onChange:null,
	placeholder:'Select Something!',
	allowSearch:false,
	itemTemplate:function(o){
		return '<div class="selecta-item">' + 
			escape(o.text) +
		'</div>';
	},
	placeholderTemplate:function(placeholder){
		return '<div class="selecta-placeholder">' + 
			escape(placeholder) + 
		'</div>';
	},
	selectedTemplate:function(o){
		return '<div class="selecta-selected">' + 
			escape(o.text) + 
		'</div>';
	},
};

SelectaInstance = function(element,settings,items){
	this.element = element;
	this.selectaElement = document.createElement('div');
	this.selectaElement.classList.add('selecta-wrap');
	this.element.parentNode.insertBefore(this.selectaElement, this.element.nextSibling);
	this.element.style.display = "none";
	this.options = this.assignOptions(items);
	this.settings = settings;
	this.render();
	this.assignHandlers();
};

SelectaInstance.prototype.assignOptions = function(items){
	var options = [];
	if(this.element.children.length){
		for (var i = 0; i < this.element.children.length; i++) {
			var option = this.element.children[i];
			options.push({value:option.value,text:option.text});
		}
	} else {
		options = items;
	}
	return options;

};

SelectaInstance.prototype.addOption = function(option){
	this.options.push(option);
	this.selectaElement.lastChild.appendChild(this.renderOption(option));
	this.assignHandlerToOption(this.selectaElement.lastChild.lastChild);
};

SelectaInstance.prototype.renderOption = function(option){
	var el = document.createElement('div');
	el.innerHTML = this.settings.itemTemplate(option);
	el.firstChild.dataset.selecta = option.value;
	return el.firstChild;
};

SelectaInstance.prototype.assignHandlerToOption = function(node){
	var self = this;
	node.addEventListener('click',function(e){
		if(e.target.dataset.selecta !== undefined){
			self.setValue(e.target.dataset.selecta);
		}
		self.selectaElement.classList.toggle('selecta-open');
	});
};

SelectaInstance.prototype.render = function(){

	var self = this;
	var itemWrap =  document.createElement('div');
	var selectedWrap = document.createElement('div');

	itemWrap.classList.add('selecta-item-wrap');
	selectedWrap.classList.add('selecta-selected-wrap');

	this.options.forEach(function(option){
		itemWrap.appendChild(self.renderOption(option));
	});

	selectedWrap.innerHTML += this.settings.selectedTemplate(this.options[0]);
	this.selectaElement.appendChild(selectedWrap);
	this.selectaElement.appendChild(itemWrap);
};

SelectaInstance.prototype.setValue = function(value) {
	this.element.value = value;
	var selected = this.options.filter(function(option){
		return option.value == value;
	})[0];
	if(selected !== undefined){
		this.selectaElement.firstChild.innerHTML = this.settings.selectedTemplate(selected);
	}
};

SelectaInstance.prototype.assignHandlers = function(){
	var self = this;
	this.selectaElement.children[0].addEventListener('click', function(e){
		self.selectaElement.classList.toggle('selecta-open');
	});

	this.selectaElement.children[1].childNodes.forEach(function(node){
		self.assignHandlerToOption(node);
	});
};

Selecta = function(selector,settings,items){
	var chosenSettings = Object.assign({}, SelectaDefaults, settings);
	//- 
	if(typeof(selector) == 'string'){
		for (var i = 0; i < document.querySelectorAll(selector).length; i++) {
			document.querySelectorAll(selector)[i].select = new SelectaInstance(document.querySelectorAll(selector)[i],chosenSettings,items);
		}
	} else if(selector instanceof Element){
		document.querySelectorAll(selector)[0].select = new SelectaInstance(document.querySelectorAll(selector)[0],chosenSettings,items);
	}
};

var SelectaClickHandler = function(e){
	if(e.target.closest('.selecta-wrap') === null){
		if(document.querySelector('.selecta-open') === null){
			document.querySelector('.selecta-open').classList.toggle('selecta-open');
		}
	}
};

document.addEventListener('click',SelectaClickHandler);


Selecta('#selecta-1',{});


Selecta('#selecta-2',{},[
	{
		text:'One',
		value:1
	}
]);

Selecta('#selecta-3',{
		itemTemplate:function(o){
			return '<div class="selecta-item" style="color:#ffffff;background:'+o.color+'">' +
				escape(o.text) + 
			'</div>';
		},
		selectedTemplate:function(o){
			return '<div class="selecta-selected" style="color:#ffffff;background:'+o.color+'">' +
				escape(o.text) + 
			'</div>';
		}
	},[
	{
		text:'Red',
		value:1,
		color:'#e74c3c'
	},
	{
		text:'Blue',
		value:2,
		color:'#2980b9'
	},
]);

//var colouredSelect = document.querySelectorAll('select')[2];
