
export default function () {
  class Car {
    constructor() {

    }
    drive () {
      return 'car drive'
    }
  }
  const car = new Car()
  return 'webpack: hello world' + car.drive()
}