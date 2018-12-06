// overlay functions have one argument: ratio, it is a value between 0 and 1, depending on the
// percentage completetd until the next phase of the ekg starts

let config = {
    // General
    speedMultiplicator: 1.2,
    d_I: {
        pWave: {
            amplitude: 7,
            duration: 20,
            overlayFunction: ratio => { return 0; }
        },
        pqSegment: {
            duration: 17.5,
            overlayFunction: ratio => { return 0; }
        },
        qTooth: {
            duration: 4,
            amplitude: -8
        },
        rTooth: {
            duration: 10,
            amplitude: 75
        },
        sTooth: {
            duration: 6,
            amplitude: -18
        },
        stSegment: {
            duration: 20,
            overlayFunction: ratio => { return 0; }
        },
        tWave: {
            amplitude: 14,
            duration: 40,
            overlayFunction: ratio => { return 0; }
        },
        completeOverlay: ratio => { return 0; },
        multiplicator: 1
    },
    d_II: {
        pWave: {
            amplitude: 7,
            duration: 20,
            overlayFunction: ratio => { return 0; }
        },
        pqSegment: {
            duration: 17.5,
            overlayFunction: ratio => { return 0; }
        },
        qTooth: {
            duration: 4,
            amplitude: -8
        },
        rTooth: {
            duration: 10,
            amplitude: 75
        },
        sTooth: {
            duration: 6,
            amplitude: -18
        },
        stSegment: {
            duration: 20,
            overlayFunction: ratio => { return 0; }
        },
        tWave: {
            amplitude: 14,
            duration: 40,
            overlayFunction: ratio => { return 0; }
        },
        completeOverlay: ratio => { return 0; },
        multiplicator: 1
    },
    d_III: {
        pWave: {
            amplitude: 7,
            duration: 20,
            overlayFunction: ratio => { return 0; }
        },
        pqSegment: {
            duration: 17.5,
            overlayFunction: ratio => { return 0; }
        },
        qTooth: {
            duration: 4,
            amplitude: -8
        },
        rTooth: {
            duration: 10,
            amplitude: 75
        },
        sTooth: {
            duration: 6,
            amplitude: -18
        },
        stSegment: {
            duration: 20,
            overlayFunction: ratio => { return 0; }
        },
        tWave: {
            amplitude: 14,
            duration: 40,
            overlayFunction: ratio => { return 0; }
        },
        completeOverlay: ratio => { return 0; },
        multiplicator: -1
    }
};

class RealisticEKG {
/*
Times are in milliseconds (ms)

*/
    constructor() {}

    // duration: 200 ms (20 squares, 1 sq = 1 ms)
    d_I(x) {
        const cfg = config.d_I;
        x %= 200;
        const status = x / 200;

        // P Wave
        // Duration: 20 ms
        if( x < cfg.pWave.duration ) {
            return -(((Math.sin((x/cfg.pWave.duration)*Math.PI)*cfg.pWave.amplitude) + cfg.pWave.overlayFunction(x/cfg.pWave.duration)) - cfg.completeOverlay(status)) * cfg.multiplicator;
        }
        
        // PQ Segment
        // Duration: 17.5ms
        let stepTime = x - cfg.pWave.duration;
        if( stepTime < cfg.pqSegment.duration ) {
            return -(cfg.pqSegment.overlayFunction( stepTime / cfg.pqSegment.duration )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        // Q-Tooth
        stepTime = stepTime - cfg.pqSegment.duration;
        if( stepTime < cfg.qTooth.duration ) {
            return -(( (stepTime / cfg.qTooth.duration) * cfg.qTooth.amplitude )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        // R-Tooth
        stepTime = stepTime - cfg.qTooth.duration;

        // Rising part
        if( stepTime < cfg.rTooth.duration*0.5 ) {
            const amplitudeDifference = Math.abs( cfg.qTooth.amplitude ) + Math.abs( cfg.rTooth.amplitude );
            const pitchPerMillisecond = amplitudeDifference / (cfg.rTooth.duration*0.5);
            return -(( cfg.qTooth.amplitude + ((stepTime+1 / cfg.rTooth.duration*0.5 ) * pitchPerMillisecond) )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        // Falling part  --> from R tooth to S tooth
        stepTime = stepTime - cfg.rTooth.duration*0.5;
        if( stepTime < cfg.rTooth.duration*0.5 ) {
            const amplitudeDifference = Math.abs( cfg.rTooth.amplitude ) + Math.abs( cfg.sTooth.amplitude );
            const pitchPerMillisecond = amplitudeDifference / (cfg.rTooth.duration*0.5);
            return -(( cfg.rTooth.amplitude - ((stepTime+1 / cfg.sTooth.duration ) * pitchPerMillisecond) )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }


        // S-Tooth reset to 0
        stepTime = stepTime - cfg.rTooth.duration*0.5;

        if( stepTime < cfg.sTooth.duration ) {
            const amplitudeDifference = Math.abs( cfg.sTooth.amplitude );
            const pitchPerMillisecond = amplitudeDifference / (cfg.sTooth.duration);
            return -(( cfg.sTooth.amplitude + ((stepTime+1 / cfg.sTooth.duration ) * pitchPerMillisecond) )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        // ST-Segment
        stepTime = stepTime - cfg.sTooth.duration;
        if( stepTime < cfg.stSegment.duration ) {
            return -(cfg.stSegment.overlayFunction( stepTime / cfg.stSegment.duration )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        stepTime = stepTime - cfg.stSegment.duration;
        if (stepTime < cfg.tWave.duration) {
            return -(((Math.sin((stepTime/cfg.tWave.duration)*Math.PI)*cfg.tWave.amplitude) + cfg.tWave.overlayFunction(x/cfg.tWave.duration))- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        stepTime = stepTime - cfg.tWave.duration;
        return - (cfg.completeOverlay(status)) * cfg.multiplicator;

    }

    d_II(x) {
        const cfg = config.d_II;
        x %= 200;
        const status = x / 200;

        // P Wave
        // Duration: 20 ms
        if( x < cfg.pWave.duration ) {
            return -(((Math.sin((x/cfg.pWave.duration)*Math.PI)*cfg.pWave.amplitude) + cfg.pWave.overlayFunction(x/cfg.pWave.duration)) - cfg.completeOverlay(status)) * cfg.multiplicator;
        }
        
        // PQ Segment
        // Duration: 17.5ms
        let stepTime = x - cfg.pWave.duration;
        if( stepTime < cfg.pqSegment.duration ) {
            return -(cfg.pqSegment.overlayFunction( stepTime / cfg.pqSegment.duration )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        // Q-Tooth
        stepTime = stepTime - cfg.pqSegment.duration;
        if( stepTime < cfg.qTooth.duration ) {
            return -(( (stepTime / cfg.qTooth.duration) * cfg.qTooth.amplitude )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        // R-Tooth
        stepTime = stepTime - cfg.qTooth.duration;

        // Rising part
        if( stepTime < cfg.rTooth.duration*0.5 ) {
            const amplitudeDifference = Math.abs( cfg.qTooth.amplitude ) + Math.abs( cfg.rTooth.amplitude );
            const pitchPerMillisecond = amplitudeDifference / (cfg.rTooth.duration*0.5);
            return -(( cfg.qTooth.amplitude + ((stepTime+1 / cfg.rTooth.duration*0.5 ) * pitchPerMillisecond) )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        // Falling part  --> from R tooth to S tooth
        stepTime = stepTime - cfg.rTooth.duration*0.5;
        if( stepTime < cfg.rTooth.duration*0.5 ) {
            const amplitudeDifference = Math.abs( cfg.rTooth.amplitude ) + Math.abs( cfg.sTooth.amplitude );
            const pitchPerMillisecond = amplitudeDifference / (cfg.rTooth.duration*0.5);
            return -(( cfg.rTooth.amplitude - ((stepTime+1 / cfg.sTooth.duration ) * pitchPerMillisecond) )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }


        // S-Tooth reset to 0
        stepTime = stepTime - cfg.rTooth.duration*0.5;

        if( stepTime < cfg.sTooth.duration ) {
            const amplitudeDifference = Math.abs( cfg.sTooth.amplitude );
            const pitchPerMillisecond = amplitudeDifference / (cfg.sTooth.duration);
            return -(( cfg.sTooth.amplitude + ((stepTime+1 / cfg.sTooth.duration ) * pitchPerMillisecond) )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        // ST-Segment
        stepTime = stepTime - cfg.sTooth.duration;
        if( stepTime < cfg.stSegment.duration ) {
            return -(cfg.stSegment.overlayFunction( stepTime / cfg.stSegment.duration )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        stepTime = stepTime - cfg.stSegment.duration;
        if (stepTime < cfg.tWave.duration) {
            return -(((Math.sin((stepTime/cfg.tWave.duration)*Math.PI)*cfg.tWave.amplitude) + cfg.tWave.overlayFunction(x/cfg.tWave.duration))- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        stepTime = stepTime - cfg.tWave.duration;
        return - (cfg.completeOverlay(status)) * cfg.multiplicator;

    }

    d_III(x) {
        const cfg = config.d_III;
        x %= 200;
        const status = x / 200;

        // P Wave
        // Duration: 20 ms
        if( x < cfg.pWave.duration ) {
            return -(((Math.sin((x/cfg.pWave.duration)*Math.PI)*cfg.pWave.amplitude) + cfg.pWave.overlayFunction(x/cfg.pWave.duration)) - cfg.completeOverlay(status)) * cfg.multiplicator;
        }
        
        // PQ Segment
        // Duration: 17.5ms
        let stepTime = x - cfg.pWave.duration;
        if( stepTime < cfg.pqSegment.duration ) {
            return -(cfg.pqSegment.overlayFunction( stepTime / cfg.pqSegment.duration )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        // Q-Tooth
        stepTime = stepTime - cfg.pqSegment.duration;
        if( stepTime < cfg.qTooth.duration ) {
            return -(( (stepTime / cfg.qTooth.duration) * cfg.qTooth.amplitude )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        // R-Tooth
        stepTime = stepTime - cfg.qTooth.duration;

        // Rising part
        if( stepTime < cfg.rTooth.duration*0.5 ) {
            const amplitudeDifference = Math.abs( cfg.qTooth.amplitude ) + Math.abs( cfg.rTooth.amplitude );
            const pitchPerMillisecond = amplitudeDifference / (cfg.rTooth.duration*0.5);
            return -(( cfg.qTooth.amplitude + ((stepTime+1 / cfg.rTooth.duration*0.5 ) * pitchPerMillisecond) )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        // Falling part  --> from R tooth to S tooth
        stepTime = stepTime - cfg.rTooth.duration*0.5;
        if( stepTime < cfg.rTooth.duration*0.5 ) {
            const amplitudeDifference = Math.abs( cfg.rTooth.amplitude ) + Math.abs( cfg.sTooth.amplitude );
            const pitchPerMillisecond = amplitudeDifference / (cfg.rTooth.duration*0.5);
            return -(( cfg.rTooth.amplitude - ((stepTime+1 / cfg.sTooth.duration ) * pitchPerMillisecond) )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }


        // S-Tooth reset to 0
        stepTime = stepTime - cfg.rTooth.duration*0.5;

        if( stepTime < cfg.sTooth.duration ) {
            const amplitudeDifference = Math.abs( cfg.sTooth.amplitude );
            const pitchPerMillisecond = amplitudeDifference / (cfg.sTooth.duration);
            return -(( cfg.sTooth.amplitude + ((stepTime+1 / cfg.sTooth.duration ) * pitchPerMillisecond) )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        // ST-Segment
        stepTime = stepTime - cfg.sTooth.duration;
        if( stepTime < cfg.stSegment.duration ) {
            return -(cfg.stSegment.overlayFunction( stepTime / cfg.stSegment.duration )- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        stepTime = stepTime - cfg.stSegment.duration;
        if (stepTime < cfg.tWave.duration) {
            return -(((Math.sin((stepTime/cfg.tWave.duration)*Math.PI)*cfg.tWave.amplitude) + cfg.tWave.overlayFunction(x/cfg.tWave.duration))- cfg.completeOverlay(status)) * cfg.multiplicator;
        }

        stepTime = stepTime - cfg.tWave.duration;
        return - (cfg.completeOverlay(status)) * cfg.multiplicator;

    }

}
