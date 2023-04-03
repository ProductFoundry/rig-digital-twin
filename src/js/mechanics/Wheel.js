/* EBike Tire */
define('js/mechanics/Wheel', [], function () {

    function Wheel() {
    }

    Wheel.prototype.init = function () {
        if (this.radius && this.rimDiameter) {
            this.tireCircumference = ((2 * this.radius) + this.rimDiameter) * 3.14;
        }
    }

    return Wheel;

})