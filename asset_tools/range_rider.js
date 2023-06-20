

class RangeRider{
	/**
	 * Base class for RangeRider
	 * @param {String} holderID the ID of HTML element holder of range selector
	 * @param {Number} funcStart startPoint for the range shape
	 * @param {Number} funcEnd endPoint for the range shape
	 * @param {Number} SVGWidth Width of the svg element
	 * @param {Number} SVGHeight Height of the svg element
	 */

	constructor({holderID, funcStart=0, funcEnd=6.28, percentageValue=0} = {}){
		/**
		 * constructor of RangeRider
		 * @argument {String} holderID the ID of HTML element holder of range selector
		 * @argument {Number} funcStart startPoint for the range shape
		 * @argument {Number} funcEnd endPoint for the range shape
		 * @returns {null}
		 */
		this.segments = 1000;
		this.funcStart = funcStart
		this.funcEnd = funcEnd
		this.holderElement = document.getElementById(holderID);
		this.svgHolder = null
		this.pathGroup = null;

		this.strokeWidth = 15
		this.SVGWidth = this.holderElement.clientWidth;
		this.SVGHeight = this.holderElement.clientHeight;

		this.percentageValue = percentageValue
		this.amplitudeMultiplier = this.getAmplitudeMultiplier()

		this.clickHold = false;
	}

	getFuncYAxis(offsetX){
		return this.amplitudeMultiplier * Math.tan(offsetX) + this.SVGHeight /2
	}

	getAmplitudeMultiplier(){
		/**
		 * get amplitude multiplier of the DrawFunc based on the holderSize
		 */
		return (this.SVGHeight - this.strokeWidth) / 2
	}

	getRelativeFuncOffset(step){
		return step / this.segments * (this.funcEnd - this.funcStart)
	}

	getScreenToCartesianRatio(step){
		return this.SVGWidth / (this.funcEnd - this.funcStart)
	}

	PercentageOffsetX(percentage){
		return this.svgHolder.clientWidth * percentage / 100
	}

	PercentageFuncX(percentage){
		let ratio = percentage/100;
		let step = Math.floor(this.segments * ratio);
		return this.getRelativeFuncOffset(step);
	}

	PercentageFuncY(percentage){
		return this.getFuncYAxis(this.PercentageFuncX(percentage));
	}

	describeFuncPath({percentage=100}={}){
		let path = []
		let currentOffsetX = 0;
		let NextOffsetX = 0;
		let xAxisRatio = this.getScreenToCartesianRatio();

		for (let i=0; i<this.segments; i++){
			currentOffsetX = this.getRelativeFuncOffset(i);
			NextOffsetX = this.getRelativeFuncOffset(i+1);
			path.push(
				'M', xAxisRatio * currentOffsetX + this.strokeWidth/2, this.getFuncYAxis(currentOffsetX),
				'L', xAxisRatio * NextOffsetX + this.strokeWidth/2, this.getFuncYAxis(NextOffsetX)
			)
		}

		return path.join(" ")
	}

	draw(){
		this.svgHolder = this.holderElement
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		this.pathGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

		svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('width', this.SVGWidth + this.strokeWidth  + "px");
        svg.setAttribute('height', this.SVGHeight + this.strokeWidth  + "px");
		path.setAttribute('d', this.describeFuncPath());
		path.style.stroke = "#000000";
		path.style.strokeWidth = this.strokeWidth;
		this.pathGroup.appendChild(path);
		this.svgHolder.replaceChildren(svg);
		svg.appendChild(this.pathGroup);
		this.svg = svg;
		this.svgHolder.style.cursor = "pointer";
		this.drawHandler()

		this.handle.setAttribute('cx', this.PercentageFuncX(0) + this.strokeWidth/2);
        this.handle.setAttribute('cy', this.PercentageFuncY(0));

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
        this.handle.setAttribute('cy', this.PercentageFuncY(this.percentageValue));
	}

	drawHandler(){
		this.handle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.handle.setAttribute('class', 'sliderHandle');
        this.handle.setAttribute('cx', this.PercentageOffsetX(this.percentageValue));
        this.handle.setAttribute('cy', this.PercentageFuncY(this.percentageValue));
        this.handle.setAttribute('r', this.strokeWidth/2);

        this.handle.style.stroke = "#ff0000";
        this.handle.style.strokeWidth = 1;
        this.handle.style.fill = "#ff0000";

        this.pathGroup.appendChild(this.handle);
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
	fi = new RangeRider({
		holderID:"funcInput",
		funcStart: 1,
		funcEnd: 10
	});
	fi.generate()
}


