/* Rig wheel */
define('js/mechanics/Wheel', [], function () {

    function Wheel() {
        this.speed = null;
    }

    Wheel.prototype.init = function () {
        if (this.radius && this.rimDiameter) {
            this.tireCircumference = ((2 * this.radius) + this.rimDiameter) * 3.14;
        }
    }

    return Wheel;

})