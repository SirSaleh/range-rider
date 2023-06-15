

class SinRangeInput{
	/**
	 * Base class for sinus range input
	 * @param {String} holderID the ID of HTML element holder of range selector
	 * @param {Number} sinRepeatsCount the number of sin (0-2pi) repeated (float 0-infinity) times
	 * @param {Number} sinSVGWidth Width of the svg element
	 * @param {Number} sinSVGHeight Height of the svg element
	 */

	constructor({holderID, sinRepeatsCount=1} = {}){
		/**
		 * constructor of sinRangeInput
		 * @argument {String} holderID the ID of HTML element holder of range selector
		 * @argument {Number} sinRepeatsCount the number of sin (0-2pi) repeated (float 0-infinity) times
		 * @returns {null}
		 */
		this.segments = 1000;
		this.sinRepeatsCount = sinRepeatsCount
		this.holderElement = document.getElementById(holderID);

		this.strokeWidth = 5
		this.sinSVGWidth = this.holderElement.clientWidth;
		this.sinSVGHeight = this.holderElement.clientHeight;


		this.amplitudeMultiplier = this.getAmplitudeMultiplier()
	}

	getSinYAxis(offsetX){
		return this.amplitudeMultiplier * Math.sin(offsetX) + this.sinSVGHeight /2
	}

	getAmplitudeMultiplier(){
		/**
		 * get amplitude multiplier of the sinWave based on the holderSize
		 */
		return (this.sinSVGHeight - this.strokeWidth) / 2
	}

	getRelativeSinOffset(step){
		return step / this.segments * 2 * Math.PI * this.sinRepeatsCount
	}

	getScreenToCartesianRatio(step){
		return this.sinSVGWidth / ( 2 * Math.PI * this.sinRepeatsCount)
	}

	describeSinPath({percentage=100}={}){
		let path = []
		let currentOffsetX = 0
		let NextOffsetX = 0
		let xAxisRatio = this.getScreenToCartesianRatio();
		for (let i=0; i<this.segments; i++){
			currentOffsetX = this.getRelativeSinOffset(i);
			NextOffsetX = this.getRelativeSinOffset(i+1);
			path.push(
				'M', xAxisRatio * currentOffsetX, this.getSinYAxis(currentOffsetX),
				'L', xAxisRatio * NextOffsetX, this.getSinYAxis(NextOffsetX)
			)
		}

		return path.join(" ")
	}

	generateSVG(){
		let svgHolder = this.holderElement
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		const sinGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

		svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('width', this.sinSVGWidth + "px");
        svg.setAttribute('height', this.sinSVGHeight + "px");
		path.setAttribute('d', this.describeSinPath());
		path.style.stroke = "#000000"
		path.style.strokeWidth = this.strokeWidth
		sinGroup.appendChild(path)
		svgHolder.appendChild(svg);

		svg.appendChild(sinGroup)
	}

	generate(){
		this.generateSVG()
	}
}


window.onload = function() {
	si = new SinRangeInput({
		holderID:"sinus_input",
		sinRepeatsCount: 1
	});
	si.generate()
}



