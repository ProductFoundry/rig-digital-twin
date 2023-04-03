/* Model of the physical EBike */
define('js/mechanics/EBike', [], function () {

    function EBike() {
        this.id = null;
        this.name = null;
        this.primaryGearRatio = null;
        this.crankLength = null;
        this.wheel = null;
        this.supportSetting = null;
        this.rpm = null;
    }

    EBike.prototype.init = function () {
        this.torqueSensor.position = this.torqueSensorPosition;
        this.cadenceSensor.position = this.cadenceSensorPosition;
        this.motor.position = this.motorPosition;
        delete this.torqueSensorPosition;
        delete this.cadenceSensorPosition;
        delete this.motorPosition;
        if (this.frontSprocket && this.rearSprocket) {
            this.primaryGearRatio = this.frontSprocket / this.rearSprocket;
        }
        this.tire.init();
        this.motor.init();
    }

    EBike.prototype.setSelectedGear = function (position, selectedGear) {
        if (position === "front") {
            this.frontShiftingSystem.selectedGear = selectedGear;
            if (this.frontShiftingSystem.type === "derailleur") {
                this.frontSprocket = selectedGear;
                if (this.frontSprocket && this.rearSprocket) {
                    this.primaryGearRatio = selectedGear / this.rearSprocket;
                }
            } else {
                this.secondaryGearRatio = selectedGear;
            }
        } else if (position === "rear") {
            this.rearShiftingSystem.selectedGear = selectedGear;
            if (this.rearShiftingSystem.type === "derailleur") {
                this.rearSprocket = selectedGear;
                this.secondaryGearRatio = 1;
                if (this.frontSprocket && this.rearSprocket) {
                    this.primaryGearRatio = this.frontSprocket / selectedGear;
                }
            } else {
                this.secondaryGearRatio = selectedGear;
            }
        }
        this.getEffectiveGearRatio();
    }

    EBike.prototype.getEffectiveGearRatio = function () {
        if (!this.primaryGearRatio || !this.secondaryGearRatio) {
            console.error("Gear ratio error");
        }
        this.effectiveGearRatio = this.primaryGearRatio * this.secondaryGearRatio;
        return this.effectiveGearRatio;
    }

    EBike.prototype.setTorqueReading = function (reading) {
        this.torqueSensor.reading = reading;
        this.totalTorque = this.getTotalTorque();
        this.riderTorque = this.getRiderTorque();
    }

    EBike.prototype.setCadenceReading = function (reading) {
        this.cadenceSensor.reading = reading;
    }

    EBike.prototype.setMotorCurrent = function (reading) {
        this.motor.setCurrent(reading);
    }

    EBike.prototype.getTotalTorque = function () {
        if (this.motor.position === "crank") {
            if (this.torqueSensor.position === "crank") {
                return this.torqueSensor.reading;
            } else if (this.torqueSensor.position === "rear") {
                const tgt = this.torqueSensor.reading;// total geared torque
                const mt = this.motor.getTorque();
                const ght = tgt - mt;
                const effectiveGear = this.ebike.getEffectiveGearRatio();
                const ht = ght / effectiveGear;
                return ht + mt;
            }
        } else if (this.motor.position === "rear") {
            if (this.torqueSensor.position === "crank") {
                return this.torqueSensor.reading + this.motor.getTorque();
            } else if (this.torqueSensor.position === "rear") {
                const tgt = this.torqueSensor.reading;
                const mt = this.motor.getTorque();
                const ght = tgt - mt;
                const effectiveGear = this.ebike.getEffectiveGearRatio();
                const ht = ght / effectiveGear;
                const tt = ht + mt;
                return tt;
            }
        }
    }

    EBike.prototype.getRiderTorque = function () {
        if (this.motor.position === "crank") {
            if (this.torqueSensor.position === "crank") {
                return this.getTotalTorque() - this.motor.getTorque();
            } else if (this.torqueSensor.position === "rear") {
                // reading is tgt
                const tgt = this.torqueSensor.reading;// total geared torque
                const mt = this.motor.getTorque();
                const ght = tgt - mt;
                const effectiveGear = this.ebike.getEffectiveGearRatio();
                const ht = ght / effectiveGear;
                return ht;
            }
        } else if (this.motor.position === "rear") {
            if (this.torqueSensor.position === "crank") {
                return this.torqueSensor.reading;
            } else if (this.torqueSensor.position === "rear") {
                const tgt = this.torqueSensor.reading;// total geared torque
                const mt = this.motor.getTorque();
                const ght = tgt - mt;
                const effectiveGear = this.ebike.getEffectiveGearRatio();
                const ht = ght / effectiveGear;
                return ht;
            }
        } else {
            console.error("Unknown motor position");
        }

    }

    return EBike;
})