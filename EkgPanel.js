const Color = {
    GREEN: '#00ff00',
    CURSOR: '#00ff00',
    SEPERATOR: '#000000',
    GRID: 'rgba(255,0,0,0.25)',
    GRAPH: 'rgba(0,0,0,0.75)'
};
const Config = {
    SmallBoxScale: 5,
    LargeBoxScale: 5*5,
    PaddingX: 35,
    TextPaddingX: 5,
    TextMarginTop: 25
};

class EKGPanel {

    constructor( target, ekgFunction ) {
        this._target = target;
        this.renderFunc = () => {return 0};
        this.fps = 60;
        this.ekgFunction = ekgFunction;
        
        // Create canvas
        let canvasElement = document.createElement('canvas');
        canvasElement.setAttribute('class', 'ekgpanel');

        this._target.appendChild( canvasElement );
        this.canvas = canvasElement;

        // Create glass canvas
        let glassCanvas = document.createElement('canvas');
        this._target.appendChild( glassCanvas );
        this.glassCanvas = glassCanvas;

        window.onresize = this.updateSize();
        this.updateSize();

        this.graphs = {
            d_I: [0],
            d_II: [0],
            d_III: [0],
            d_aVR: [0],
            d_aVL: [0],
            d_aVF: [0],
            d_V1: [0],
            d_V2: [0],
            d_V3: [0],
            d_V4: [0],
            d_V5: [0],
            d_V6: [0]
        };

        // Cursor
        this.cursor = Config.PaddingX;

        this.rowHeight = 0;

        this.render();
        this.update();
    }

    drawHelperlines() {

    }

    drawGlassGrid() {
        let ctx = this.glassCanvas.getContext('2d');
        ctx.strokeStyle = Color.GRID;

        ctx.lineWidth = 0.5;
        for(let x = 0; x < this.canvas.width; x+= Config.SmallBoxScale) {
            ctx.beginPath();
            ctx.moveTo( x, 0 );
            ctx.lineTo( x, this.canvas.height );
            ctx.stroke();
            ctx.moveTo( 0, x );
            ctx.lineTo( this.canvas.width, x );
            ctx.stroke();
            ctx.closePath();
        }
        for(let x = 0; x < this.canvas.width; x+= Config.LargeBoxScale) {
            ctx.beginPath();
            ctx.lineWidth = 0.75;
            ctx.moveTo( x, 0 );
            ctx.lineTo( x, this.canvas.height );
            ctx.stroke();
            ctx.moveTo( 0, x );
            ctx.lineTo( this.canvas.width, x );
            ctx.stroke();
            ctx.closePath();
        }

    }

    /**
     * Returns the start y coordinate of a row
     * @param {Integer} i Index of the row
     */
    _getRowStartY( i ) {
        if ( this.rowHeight === 0) {
            this.rowHeight = this.canvas.height /6;
        }
        return this.rowHeight * i
    }

    /**
     * Retuns the y coordinate for a row (at 0V)
     * @param {Integer} i The index
     */
    _getLineBaseY(i) {
        if ( this.rowHeight === 0) {
            this.rowHeight = this.canvas.height /6;
        }
        return (this.rowHeight * i) + (0.5*this.rowHeight);
    }

    _getRowStartX() {
        return this.canvas.width*0.5 + Config.PaddingX;
    }

    updateSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.glassCanvas.width = window.innerWidth;
        this.glassCanvas.height = window.innerHeight;
        this.drawGlassGrid();
        this.rowHeight = this.canvas.height / 6;
        
        // Draw Descriptions
        this.renderDescriptions();
    }

    /**
     * Renders descriptions for I, II, III, avR, avL, avF, V1-V6
     */
    renderDescriptions() {
        let canvas = this.glassCanvas;
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.font = "bold 18px Old Standard TT";

        ctx.fillText("I", Config.TextPaddingX, this._getLineBaseY(0) + Config.TextMarginTop);
        ctx.fillText("II", Config.TextPaddingX, this._getLineBaseY(1) + Config.TextMarginTop);
        ctx.fillText("III", Config.TextPaddingX, this._getLineBaseY(2) + Config.TextMarginTop);

        ctx.fillText("aVR", Config.TextPaddingX, this._getLineBaseY(3) + Config.TextMarginTop);
        ctx.fillText("aVL", Config.TextPaddingX, this._getLineBaseY(4) + Config.TextMarginTop);
        ctx.fillText("aVF", Config.TextPaddingX, this._getLineBaseY(5) + Config.TextMarginTop);

        ctx.fillText("V1", canvas.width*0.5 + Config.TextPaddingX, this._getLineBaseY(0) + Config.TextMarginTop);
        ctx.fillText("V2", canvas.width*0.5 + Config.TextPaddingX, this._getLineBaseY(1) + Config.TextMarginTop);
        ctx.fillText("V3", canvas.width*0.5 + Config.TextPaddingX, this._getLineBaseY(2) + Config.TextMarginTop);
        ctx.fillText("V4", canvas.width*0.5 + Config.TextPaddingX, this._getLineBaseY(3) + Config.TextMarginTop);
        ctx.fillText("V5", canvas.width*0.5 + Config.TextPaddingX, this._getLineBaseY(4) + Config.TextMarginTop);
        ctx.fillText("V6", canvas.width*0.5 + Config.TextPaddingX, this._getLineBaseY(5) + Config.TextMarginTop);
    }

    render() {
        let ctx = this.canvas.getContext('2d');

        // Clear old
        ctx.clearRect(this.curso1,0, this.canvas.width, this.canvas.height);
        
        /*// Draw cursor 1
        ctx.fillStyle = Color.CURSOR;
        ctx.fillRect( this.cursor, 0, 15, this.canvas.height );
        // Draw cursor 2
        ctx.fillStyle = Color.CURSOR;
        ctx.fillRect( this.canvas.width*0.5 + this.cursor, 0, 15, this.canvas.height );*/

        // Draw seperation line
        ctx.beginPath();
        ctx.moveTo( this.canvas.width * 0.5, 0 );
        ctx.lineTo( this.canvas.width * 0.5, this.canvas.height );
        ctx.strokeStyle = Color.SEPERATOR;
        ctx.stroke();
        ctx.closePath();

        // Clear parts of old graphs
        ctx.clearRect( this.cursor + 1, 0, 25, this.canvas.height);
        ctx.clearRect( this._getRowStartX() + this.cursor + 1, 0, 25, this.canvas.height);

        // Draw graphs
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = Color.GRAPH;
        const time = this.cursor - Config.PaddingX;

        // Derivation I
        ctx.beginPath();
        ctx.moveTo( this.cursor - 2, this._getLineBaseY(0) + this.graphs.d_I[ time-2 ] );
        ctx.lineTo( this.cursor - 1, this._getLineBaseY(0) + this.graphs.d_I[ time-1 ] );
        ctx.lineTo( this.cursor, this._getLineBaseY(0) + this.graphs.d_I[ time ] );
        ctx.stroke();

        // Derivation II
        ctx.beginPath();
        ctx.moveTo( this.cursor - 2, this._getLineBaseY(1) + this.graphs.d_II[ time-2 ] );
        ctx.lineTo( this.cursor - 1, this._getLineBaseY(1) + this.graphs.d_II[ time-1 ] );
        ctx.lineTo( this.cursor, this._getLineBaseY(1) + this.graphs.d_II[ time ] );
        ctx.stroke();

        // Derivation III
        ctx.beginPath();
        ctx.moveTo( this.cursor - 2, this._getLineBaseY(2) + this.graphs.d_III[ time-2 ] );
        ctx.lineTo( this.cursor - 1, this._getLineBaseY(2) + this.graphs.d_III[ time-1 ] );
        ctx.lineTo( this.cursor, this._getLineBaseY(2) + this.graphs.d_III[ time ] );
        ctx.stroke();

        // Derivation aVR
        ctx.beginPath();
        ctx.moveTo( this.cursor - 2, this._getLineBaseY(3) + this.graphs.d_aVR[ time-2 ] );
        ctx.lineTo( this.cursor - 1, this._getLineBaseY(3) + this.graphs.d_aVR[ time-1 ] );
        ctx.lineTo( this.cursor, this._getLineBaseY(3) + this.graphs.d_aVR[ time ] );
        ctx.stroke();

        // Derivation aVL
        ctx.beginPath();
        ctx.moveTo( this.cursor - 2, this._getLineBaseY(4) + this.graphs.d_aVL[ time-2 ] );
        ctx.lineTo( this.cursor - 1, this._getLineBaseY(4) + this.graphs.d_aVL[ time-1 ] );
        ctx.lineTo( this.cursor, this._getLineBaseY(4) + this.graphs.d_aVL[ time ] );
        ctx.stroke();

        // Derivation aVF
        ctx.beginPath();
        ctx.moveTo( this.cursor - 2, this._getLineBaseY(5) + this.graphs.d_aVF[ time-2 ] );
        ctx.lineTo( this.cursor - 1, this._getLineBaseY(5) + this.graphs.d_aVF[ time-1 ] );
        ctx.lineTo( this.cursor, this._getLineBaseY(5) + this.graphs.d_aVF[ time ] );
        ctx.stroke();



        // Derivation v1
        ctx.beginPath();
        ctx.moveTo( this._getRowStartX() + this.cursor - 2, this._getLineBaseY(0) + this.graphs.d_V1[ time-2 ] );
        ctx.lineTo( this._getRowStartX() + this.cursor - 1, this._getLineBaseY(0) + this.graphs.d_V1[ time-1 ] );
        ctx.lineTo( this._getRowStartX() + this.cursor, this._getLineBaseY(0) + this.graphs.d_V1[ time ] );
        ctx.stroke();

        // Derivation v2
        ctx.beginPath();
        ctx.moveTo( this._getRowStartX() + this.cursor - 2, this._getLineBaseY(1) + this.graphs.d_V2[ time-2 ] );
        ctx.lineTo( this._getRowStartX() + this.cursor - 1, this._getLineBaseY(1) + this.graphs.d_V2[ time-1 ] );
        ctx.lineTo( this._getRowStartX() + this.cursor, this._getLineBaseY(1) + this.graphs.d_V2[ time ] );
        ctx.stroke();

        // Derivation v3
        ctx.beginPath();
        ctx.moveTo( this._getRowStartX() + this.cursor - 2, this._getLineBaseY(2) + this.graphs.d_V3[ time-2 ] );
        ctx.lineTo( this._getRowStartX() + this.cursor - 1, this._getLineBaseY(2) + this.graphs.d_V3[ time-1 ] );
        ctx.lineTo( this._getRowStartX() + this.cursor, this._getLineBaseY(2) + this.graphs.d_V3[ time ] );
        ctx.stroke();

        // Derivation v4
        ctx.beginPath();
        ctx.moveTo( this._getRowStartX() + this.cursor - 2, this._getLineBaseY(3) + this.graphs.d_V4[ time-2 ] );
        ctx.lineTo( this._getRowStartX() + this.cursor - 1, this._getLineBaseY(3) + this.graphs.d_V4[ time-1 ] );
        ctx.lineTo( this._getRowStartX() + this.cursor, this._getLineBaseY(3) + this.graphs.d_V4[ time ] );
        ctx.stroke();

        // Derivation v5
        ctx.beginPath();
        ctx.moveTo( this._getRowStartX() + this.cursor - 2, this._getLineBaseY(4) + this.graphs.d_V5[ time-2 ] );
        ctx.lineTo( this._getRowStartX() + this.cursor - 1, this._getLineBaseY(4) + this.graphs.d_V5[ time-1 ] );
        ctx.lineTo( this._getRowStartX() + this.cursor, this._getLineBaseY(4) + this.graphs.d_V5[ time ] );
        ctx.stroke();

        // Derivation v6
        ctx.beginPath();
        ctx.moveTo( this._getRowStartX() + this.cursor - 2, this._getLineBaseY(5) + this.graphs.d_V6[ time-2 ] );
        ctx.lineTo( this._getRowStartX() + this.cursor - 1, this._getLineBaseY(5) + this.graphs.d_V6[ time-1 ] );
        ctx.lineTo( this._getRowStartX() + this.cursor, this._getLineBaseY(5) + this.graphs.d_V6[ time ] );
        ctx.stroke();

        
        ctx.closePath();


        window.requestAnimationFrame( () => {
            this.render();
        });
    }

    _val(x) {
        if( x == undefined || x == null) {
            return 0;
        } else {
            return x;
        }
    }

    update() {
        // Calculate current coordinates
        const time = this.cursor - Config.PaddingX;
        this.graphs.d_I[time+1] = this.ekgFunction.getDerivationValue(DERIVATION.I, time);
        this.graphs.d_II[time+1] = this.ekgFunction.getDerivationValue(DERIVATION.II, time);
        this.graphs.d_III[time+1] = this.ekgFunction.getDerivationValue(DERIVATION.III, time);
        this.graphs.d_aVR[time+1] = this.ekgFunction.getDerivationValue(DERIVATION.aVR, time);
        this.graphs.d_aVL[time+1] = this.ekgFunction.getDerivationValue(DERIVATION.aVL, time);
        this.graphs.d_aVF[time+1] = this.ekgFunction.getDerivationValue(DERIVATION.aVF, time);
        this.graphs.d_V1[time+1] = this.ekgFunction.getDerivationValue(DERIVATION.V1, time);
        this.graphs.d_V2[time+1] = this.ekgFunction.getDerivationValue(DERIVATION.V2, time);
        this.graphs.d_V3[time+1] = this.ekgFunction.getDerivationValue(DERIVATION.V3, time);
        this.graphs.d_V4[time+1] = this.ekgFunction.getDerivationValue(DERIVATION.V4, time);
        this.graphs.d_V5[time+1] = this.ekgFunction.getDerivationValue(DERIVATION.V5, time);
        this.graphs.d_V6[time+1] = this.ekgFunction.getDerivationValue(DERIVATION.V6, time);

        // Update cursor position
        this.cursor = (this.cursor < ((this.canvas.width*0.5) - Config.PaddingX)) ? this.cursor+1 : Config.PaddingX;
        // Call for next update
        setTimeout( ()=>{this.update();}, 1000 / this.fps );
    }

}