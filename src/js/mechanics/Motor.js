/* EBike Motor */
define('js/mechanics/Motor', [], function () {

    function Motor() {
        this.position = null;
        this.current = 21;
        this.timestamp = null;
        this.torque = null;
        this.power = null;
    }

    Motor.prototype.init = function () {
        this.torqueCoefficient = parseInt(this.peakTorque) / parseInt(this.peakCurrent);
    }

    Motor.prototype.getTorque = function () {
        const torque = this.torqueCoefficient * this.current;
        return torque;
    }

    Motor.prototype.setCurrent = function (current) {
        this.current = current;
        this.torque = this.getTorque();
    }
    return Motor;

})