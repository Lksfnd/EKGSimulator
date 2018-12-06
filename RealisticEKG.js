let config = {
    // General
    speedMultiplicator: 1.2,

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
            pitch: 1.5,
            offset: 0,
            elevation: 0
        },

        rWave: {
            pitch: -5,
            offset: 5,
            elevation: 0
        },

        sWave: {
            pitch: 8,
            offset: 2,
            elevation: 0
        },

        stTime: {
            elevation: 0
        },

        tWave: {
            width: -0.12,
            height: 8,
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
        else if( x > 27 && x < 43) {
            return cfg.pqTime.elevation;
        }

        // Q-Wave, duration: 6ms
        else if( x > 43 && x < 49) {
            return (x%43) * cfg.qWave.pitch + cfg.qWave.offset + cfg.qWave.elevation;
        }

        // R-Wave, duration: 9ms
        // UP PART
        else if( x > 49 && x < 58 ) {
            return (x%49) * cfg.rWave.pitch + cfg.rWave.offset + cfg.rWave.elevation;
        }

        // S-Wave, duration: 7ms
        // Downward phase, 3 ms
        else if( x > 58 && x < 61) {
            return (x%58) * cfg.sWave.pitch + cfg.sWave.offset + cfg.sWave.elevation;
        }
        // Upward phase, 4 ms
        else if( x > 61 && x < 66) {
            return (x%61) * (cfg.sWave.pitch*-0.09) + cfg.sWave.offset + cfg.sWave.elevation;
        }

        else if( x > 66 && x < 88) {
            return cfg.stTime.elevation;
        }

        // T wave, duration: 27ms
        else if( x > 88 && x < 115) {
            return (cfg.tWave.elevation + Math.sin( cfg.tWave.width * (x%86) ) * cfg.tWave.height);
        } else {
            return 0;
        }


    }
}
