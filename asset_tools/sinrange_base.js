

class SinRangeInput{
	/**
	 * Base class for sinus range input
	 * @param {String} holderID the ID of HTML element holder of range selector
	 * @param {Number} sinRepeatsCount the number of sin (0-2pi) repeated (float 0-infinity) times
	 * @param {Number} sinSVGWidth Width of the svg element
	 * @param {Number} sinSVGHeight Height of the svg element
	 */

	constructor({holderID, sinRepeatsCount=1, percentageValue=0} = {}){
		/**
		 * constructor of sinRangeInput
		 * @argument {String} holderID the ID of HTML element holder of range selector
		 * @argument {Number} sinRepeatsCount the number of sin (0-2pi) repeated (float 0-infinity) times
		 * @returns {null}
		 */
		this.segments = 1000;
		this.sinRepeatsCount = sinRepeatsCount
		this.holderElement = document.getElementById(holderID);
		this.svgHolder = null
		this.sinGroup = null;

		this.strokeWidth = 15
		this.sinSVGWidth = this.holderElement.clientWidth;
		this.sinSVGHeight = this.holderElement.clientHeight;

		this.percentageValue = percentageValue
		this.amplitudeMultiplier = this.getAmplitudeMultiplier()

		this.clickHold = false;
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

	PercentageOffsetX(percentage){
		return this.svgHolder.clientWidth * percentage / 100
	}

	PercentageSinX(percentage){
		let ratio = percentage/100;
		let step = Math.floor(this.segments * ratio);
		return this.getRelativeSinOffset(step);
	}

	PercentageSinY(percentage){
		return this.getSinYAxis(this.PercentageSinX(percentage));
	}

	describeSinPath({percentage=100}={}){
		let path = []
		let currentOffsetX = 0;
		let NextOffsetX = 0;
		let xAxisRatio = this.getScreenToCartesianRatio();

		for (let i=0; i<this.segments; i++){
			currentOffsetX = this.getRelativeSinOffset(i);
			NextOffsetX = this.getRelativeSinOffset(i+1);
			path.push(
				'M', xAxisRatio * currentOffsetX + this.strokeWidth/2, this.getSinYAxis(currentOffsetX),
				'L', xAxisRatio * NextOffsetX + this.strokeWidth/2, this.getSinYAxis(NextOffsetX)
			)
		}

		return path.join(" ")
	}

	draw(){
		this.svgHolder = this.holderElement
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		this.sinGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

		svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('width', this.sinSVGWidth + this.strokeWidth  + "px");
        svg.setAttribute('height', this.sinSVGHeight + this.strokeWidth  + "px");
		path.setAttribute('d', this.describeSinPath());
		path.style.stroke = "#000000";
		path.style.strokeWidth = this.strokeWidth;
		this.sinGroup.appendChild(path);
		this.svgHolder.replaceChildren(svg);
		svg.appendChild(this.sinGroup);
		this.svg = svg;
		this.svgHolder.style.cursor = "pointer";
		this.drawHandler()

		this.handle.setAttribute('cx', this.PercentageSinX(0) + this.strokeWidth/2);
        this.handle.setAttribute('cy', this.PercentageSinY(0));

		this.svgHolder.addEventListener("mousedown", this.clickDown.bind(this), false);
		this.svgHolder.addEventListener("touchstart", this.clickDown.bind(this), false);
		this.svgHolder.addEventListener('mousemove', this.clickMove.bind(this), false);
        this.svgHolder.addEventListener('touchmove', this.clickMove.bind(this), false);

		window.addEventListener("mouseup", this.clickUp.bind(this), false);
		window.addEventListener('touchend', this.clickUp.bind(this), false);
	}

	clickDown(event){
		this.clickHold = true;
	}

	clickUp(event){
		this.clickHold = false;
	}

	boundValue(value, lowerBound, upperBound){
		if (value > upperBound) value = upperBound;
		if (value < lowerBound)	value = lowerBound;
		return value;
	}

	clickMove(event){
		if (!this.clickHold) return;
		let coords = this.getRatioCoords (event)
		this.percentageValue = this.boundValue(coords[0] * 100, 0 ,100)
		this.handle.setAttribute('cx', this.PercentageOffsetX(this.percentageValue) + this.strokeWidth/2);
        this.handle.setAttribute('cy', this.PercentageSinY(this.percentageValue));
	}

	drawHandler(){
		this.handle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.handle.setAttribute('class', 'sliderHandle');
        this.handle.setAttribute('cx', this.PercentageOffsetX(this.percentageValue));
        this.handle.setAttribute('cy', this.PercentageSinY(this.percentageValue));
        this.handle.setAttribute('r', this.strokeWidth/2);
        this.handle.style.stroke = "#ff0000";
        this.handle.style.strokeWidth = 1;
        this.handle.style.fill = "#ff0000";
        this.sinGroup.appendChild(this.handle);
	}

	getRatioCoords(event){
		let x, y, clientX, clientY;
        if (window.TouchEvent && e instanceof TouchEvent){
			// for touch devices
            clientX = event.touches[0].pageX - window.scrollX;
            clientY = event.touches[0].pageY - window.scrollY;
        }else {
			// for mouse or touchpad devices
            clientX = event.clientX;
            clientY = event.clientY;
        }
		let BoundingWrapper = this.holderElement.getBoundingClientRect()
		let boundingSVGHolder = this.svgHolder.getBoundingClientRect();
		x = clientX - boundingSVGHolder.left;
        y = clientY - boundingSVGHolder.top;

		return [x/boundingSVGHolder.width, y/boundingSVGHolder.height];
	}

	generate(){
		this.draw();
	}
}


window.onload = function() {
	si = new SinRangeInput({
		holderID:"sinus_input",
		sinRepeatsCount: 1
	});
	si.generate()
}



