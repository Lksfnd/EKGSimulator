const pt = document.getElementById('paneltest');

let f = new EKGFunction();

let rekg = new RealisticEKG();

f.derivationFunctions.d_I = rekg.d_I;
f.derivationFunctions.d_II = rekg.d_II;
f.derivationFunctions.d_III = rekg.d_III;








let p = new EKGPanel( pt, f );