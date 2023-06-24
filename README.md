# Range Rider

Range Input in Mathematical functions shape.

Click to see [live demo here](https://sirsaleh.github.io/range-rider-demo/)

![Demo for RangeRider range input](/media/screen_demo.png "Demo")

## Usage

You can use it easily to create a range slide inside a container. Width and Height of the container automatically determines the size of the slider

**HTML**:

```html
<div style="width: 400px; height: 100px;" id="funcInput"></div>
```

**JS**:

```javascript
window.onload = function() {
    const rangeRiderSlider = new RangeRider({
        shapeFunc: (x)=>{
            return Math.sin(x)
        },
        strokeWidth: 10,
        holderID:"funcInput",
        funcStart: 0,
        funcEnd: Math.PI*10,
        strokeColor: "#000000",
        percentageValue: 50,
        progressStrokeWidth: 1,
        progressStrokeColor: "#ff5555",
        sliderChangeCallback: function(newPercentageValue){
            // do whatever you want to do with the slider value
            console.log(newPercentageValue)
        }
    });
    rangeRiderSlider.generate()
}
```

## Definitions

* **CartesianX**: Cartesian position in X Axis;
* **CartesianY** Cartesian position in Y Axis;
* **ClientX** Client position in X Axis;
* **ClientY** Client position in Y Axis