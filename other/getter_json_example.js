class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.area = 120;
  }
  // Getter
  get area() {
    return this.calcArea();
  }
  set area(x) {
    return x
  }
  // Method
  calcArea() {
    return this.height * this.width;
  }
	toJSON()
	{
		var obj = {};
		for(const key of Object.keys(this))
			obj[key] = this[key]	
		//obj.area = this.calcArea();
return obj
	}
}

const square = new Rectangle(10, 10);

console.log(square.area); // 100
console.log(JSON.stringify(square))
console.log(Reflect.get(square,'area'))
