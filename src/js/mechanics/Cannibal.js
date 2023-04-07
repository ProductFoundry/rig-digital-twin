/* Motor that simulates human pedaling */
define('js/mechanics/Cannibal', [], function () {

    function Cannibal() {
        this.current = null;
        this.voltage = null;
        this.torque = null;
        this.inputPower = null;
    }

    Cannibal.prototype.init = function () {
        // this.torqueCoefficient = parseInt(this.peakTorque) / parseInt(this.peakCurrent);
    }

    Cannibal.prototype.getTorque = function () {
        // const torque = this.torqueCoefficient * this.current;
        // return torque;
    }

    Cannibal.prototype.setCurrent = function (current) {
        this.current = current;
        this.inputPower = current * this.voltage;
        this.torque = this.getTorque();
    }

    Cannibal.prototype.setVoltage = function (voltage) {
        this.voltage = voltage;
        this.inputPower = this.current * this.voltage;
        this.torque = this.getTorque();
    }

    return Cannibal;

})