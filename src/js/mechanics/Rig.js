/* Model of the physical Rig */
define('js/mechanics/Rig', ['js/town/AscClient',
    'js/mechanics/Motor',
    'js/mechanics/Cannibal'
],
    function (AscClient, Motor, Cannibal) {

        function Rig() {
            this.id = null;
            this.name = null;
            this.primaryGearRatio = null;
            this.crankLength = null;
            this.wheel = null;
            this.supportSetting = null;
            this.rpm = null;
            this.isWithinAscZone = false;
            this.asc = new AscClient();
            this.motor = new Motor();
            this.cannibal = new Cannibal();
            this.speed = null;
        }

        Rig.prototype.init = function () {
            this.tire.init();
            this.motor.init();
        }

        Rig.prototype.getEffectiveGearRatio = function () {
            this.effectiveGearRatio;
        }

        Rig.prototype.setTorqueReading = function (reading) {
            this.torqueSensor.reading = reading;
            this.totalTorque = this.getTotalTorque();
            this.cannibalTorque = this.getCannibalTorque();
        }

        Rig.prototype.setCadenceReading = function (reading) {
            this.cadenceSensor.reading = reading;
        }

        Rig.prototype.setMotorCurrent = function (reading) {
            this.motor.setCurrent(reading);
        }

        Rig.prototype.getTotalTorque = function () {
            return this.torqueSensor.reading;
        }

        Rig.prototype.getCannibalTorque = function () {
            return this.torqueSensor.reading - this.motor.getTorque();
        }

        Rig.prototype.setRpmReading = function (rpm) {
            this.rpm = rpm;
            this.speed = this.rpm * this.wheel.tireCircumference;
        }

        Rig.prototype.setState = function (event, callback) {
            this.asc.location = {lat: event.lat, lng: event.lng};
            this.cannibal.current = event.cannibalCurrent;
            const t = new Date().toTimeString().split(' ');
            this.asc.timestamp = t[0];
            this.asc.checkRestrictions(this, callback);
        }

        return Rig;
    })