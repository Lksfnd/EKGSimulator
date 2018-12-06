let config = {
    // General
    speedMultiplicator: 1,

    d_I: {
        // Sections
        pWave: {
            width: -0.12,
            height: 5,
            elevation: 0
        },
        pqTime: {
            elevation: 0
        },
        qWave: {
            pitch: 0.4,
            offset: -27 * 0.4,
            elevation: 0
        },

        // Derivation durations
        duration: 150
    }
};

class RealisticEKG {

/*
Times are in milliseconds (ms)

*/

    constructor() {
    }


    d_I(x) {
        const cfg = config.d_I;
        x %= cfg.duration;
        x *= config.speedMultiplicator;

        // P wave, duration: 27ms
        if( x > 0 && x < 27) {
            return (cfg.pWave.elevation + Math.sin( cfg.pWave.width * x ) * cfg.pWave.height);
        }

        // PQ time, duration: 16ms
        if( x > 27 && x < 43) {
            return cfg.pqTime.elevation;
        }

        // Q-Wave, duration: 6ms
        if( x > 43 && x < 49) {
            return x * cfg.qWave.pitch + cfg.qWave.offset + cfg.qWave.elevation;
        }

    }
}
