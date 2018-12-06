const pt = document.getElementById('paneltest');

let f = new EKGFunction();

let rekg = new RealisticEKG();

f.derivationFunctions.d_I = rekg.d_I;









let p = new EKGPanel( pt, f );