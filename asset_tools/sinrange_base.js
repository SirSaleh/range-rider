

class SinRangeInput{
	/**
	 * Base class for sinus range input
	 * @param {String} holderID the ID of HTML element holder of range selector
	 * @param {Number} sinRepeatsCount the number of sin (0-2pi) repeated (float 0-infinity) times
	 * @param {Number} sinSVGWidth Width of the svg element
	 * @param {Number} sinSVGHeight Height of the svg element
	 */

	constructor({holderID} = {}){
		/**
		 * constructor of sinRangeInput
		 * @argument {String} holderID the ID of HTML element holder of range selector
		 * @returns {null}
		 */
		this.holderID = holderID;
		this.segments = 1000;

		this.sinSVGWidth = 0
		this.sinSVGHeight = 0
	}

	getInputHolderElement(){
		return document.getElementById(this.holderID);
	}

	getSinYAxis(offsetX){
		return Math.sin(offsetX)+this.sinSVGHeight/2
	}

	describeSinPath({percentage=100}={}){
		let path = []
		let currentOffsetX = 0
		let NextOffsetX = 0
		for (let i=0; i<this.segments; i++){
			currentOffsetX = this.sinSVGWidth/this.segments*i;
			NextOffsetX = this.sinSVGWidth/this.segments*(i+1);
			path.push(
				'M', currentOffsetX, this.getSinYAxis(currentOffsetX),
				'L', NextOffsetX, this.getSinYAxis(NextOffsetX)
			)
		}

		return path.join(" ")
	}

	generateSVG(){
		let svgHolder = this.getInputHolderElement()
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('width', this.sinSVGWidth + "px");
        svg.setAttribute('height', this.sinSVGHeight + "px");
		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		const sinGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		path.setAttribute('d', this.describeSinPath());
		path.style.stroke = "#000000"
		sinGroup.appendChild(path)
		svgHolder.appendChild(svg);

		svg.appendChild(sinGroup)
	}

	generate(){
		let elem = this.getInputHolderElement();
		this.sinSVGWidth = elem.clientWidth;
		this.sinSVGHeight = elem.clientHeight;

		this.generateSVG()
	}
}


window.onload = function() {
	si = new SinRangeInput({
		holderID:"sinus_input",
	});
	si.generate()
}



