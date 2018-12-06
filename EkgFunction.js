function ISO0(...props) { return 0; }

const DERIVATION = {
    I: 0,
    II: 1,
    III: 2,
    aVR: 3,
    aVL: 4,
    aVF: 5,
    V1:6,
    V2:7,
    V3:8,
    V4:9,
    V5:10,
    V6:11
};

class EKGFunction {

    constructor() {
        this.derivationFunctions = {
            d_I: ISO0,
            d_II: x=>Math.sin(x/10)*25,
            d_III: x=>Math.cos(x/10)*25,
            d_aVR: x=>Math.tan(x/10)*0.6,
            d_aVL: x=>Math.sin(x/1)*25*Math.random(),
            d_aVF: x => {
                if( x % 100 === 0) {
                    return 25;
                }
                if( x % 101 === 0) {
                    return -25;
                }
                return 0;
            },
            d_V1: ISO0,
            d_V2: ISO0,
            d_V3: ISO0,
            d_V4: ISO0,
            d_V5: ISO0,
            d_V6: ISO0
        }
    }

    getDerivationValue(derivation, time) {
        switch(derivation) {
            case DERIVATION.I:
                return this.derivationFunctions.d_I(time);
            case DERIVATION.II:
                return this.derivationFunctions.d_II(time);
            case DERIVATION.III:
                return this.derivationFunctions.d_III(time);

            case DERIVATION.aVL:
                return this.derivationFunctions.d_aVL(time);
            case DERIVATION.aVR:
                return this.derivationFunctions.d_aVR(time);
            case DERIVATION.aVF:
                return this.derivationFunctions.d_aVF(time);

            case DERIVATION.V1:
                return this.derivationFunctions.d_V1(time);
            case DERIVATION.V2:
                return this.derivationFunctions.d_V2(time);
            case DERIVATION.V3:
                return this.derivationFunctions.d_V3(time);
            case DERIVATION.V4:
                return this.derivationFunctions.d_V4(time);
            case DERIVATION.V5:
                return this.derivationFunctions.d_V5(time);
            case DERIVATION.V6:
                return this.derivationFunctions.d_V6(time);

            default:
                return 0;
        }
    }

}