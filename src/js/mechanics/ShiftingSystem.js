/* Model of the Shifting System */
define('js/mechanics/ShiftingSystem', [], function () {

    function ShiftingSystem() {
        this.id = null;
        this.type = null;
        this.availableGearRatios = null;
        this.selectedGear = null;
    }

    ShiftingSystem.prototype.getSecondaryGearRatio = function () {
        if (this.type === "hub" || this.type === "box") {
            return this.selectedGear;
        } else if (this.type === "derailleur") {
            return 1;
        }
    }

    ShiftingSystem.prototype.setSelectedGear = function (selectedGear) {
        this.selectedGear = selectedGear;
    }


    return ShiftingSystem;

})