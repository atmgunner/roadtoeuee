
/* ---------- Data ---------- */
export const S = (s) => s.split("|");
export const D = {
  chem: { n: "Chemistry", c: "#22d3ee", g: {
    9: S("U1 Chemistry & Importance|U2 Measurements|U3 Atomic Structure|U4 Periodic Table|U5 Chemical Bonding"),
    10: S("U1 Chemical Reactions & Stoichiometry|U2 Solutions|U3 Important Inorganic Compounds|U4 Energy Changes & Electrochemistry|U5 Metals & Non-Metals|U6 Hydrocarbons"),
    11: S("U1 Atomic Structure & Periodic Properties|U2 Chemical Bonding & Structure|U3 Physical States of Matter|U4 Chemical Kinetics|U5 Chemical Equilibrium|U6 Oxygen-Containing Organic Compounds"),
    12: S("U1 Acid-Base Equilibria|U2 Electrochemistry|U3 Industrial Chemistry|U4 Polymers|U5 Environmental Chemistry") },
    ov: "Grade 9 Atomic Structure, Periodic Table and Bonding feed Grade 11 U1–U2. Grade 10 Energy Changes & Electrochemistry merges into Grade 12 Electrochemistry. Grade 10 Solutions and Reactions support Equilibrium and Acid-Base. Grade 10 Hydrocarbons lead into Grade 11 Oxygen-Containing Organics." },
  phys: { n: "Physics", c: "#a855f7", g: {
    9: S("U1 Physics & Society|U2 Physical Quantities|U3 Motion in Straight Line|U4 Force/Work/Energy/Power|U5 Simple Machines|U6 Sound Waves|U7 Temperature & Thermometry"),
    10: S("U1 Motion in 2D|U2 Electrostatics|U3 Current Electricity|U4 Electromagnetism|U5 Intro to Electronics|U6 EM Waves & Geometrical Optics"),
    11: S("U1 Physics & Human Society|U2 Vectors|U3 Motion in 1D & 2D|U4 Dynamics & Equilibrium|U5 Heat Conduction & Calorimetry|U6 Electrostatics & Electric Circuits|U7 Nuclear Physics"),
    12: S("U1 Application of Physics|U2 Two-Dimensional Motion & Rotational Dynamics|U3 Fluid Mechanics|U4 Electromagnetism|U5 Basics of Electronics") },
    ov: "Grade 9 Motion and Force merge into Grade 11 Motion and Dynamics. Grade 10 Motion in 2D leads to Grade 12 U2. Grade 10 Electrostatics and Current Electricity merge into Grade 11 U6. Grade 10 Electromagnetism and Electronics feed Grade 12 U4–U5. Grade 9 Temperature supports Grade 11 Heat." },
  math: { n: "Mathematics", c: "#f59e0b", g: {
    9: S("U1 Further Sets|U2 The Number System|U3 Linear Equations & Inequalities|U4 Relations and Functions|U5 Geometry & Measurement|U6 Statistics & Probability"),
    10: S("U1 Polynomial Functions|U2 Exponential & Logarithmic Functions|U3 Solving Inequalities|U4 Coordinate Geometry|U5 Trigonometric Functions|U6 Circles|U7 Solid Figures|U8 Statistics & Probability"),
    11: S("U1 Further Sets|U2 Complex Numbers|U3 Vectors in 2D & 3D|U4 Matrices & Determinants|U5 Mathematical Induction & Sequences|U6 Analytic Geometry|U7 Differential Calculus"),
    12: S("U1 Sequences and Series|U2 Limits and Continuity|U3 Introduction to Differential Calculus|U4 Applications of Differential Calculus|U5 Integral Calculus|U6 Three-Dimensional Geometry|U7 Statistics and Probability") },
    ov: "Grade 9 Sets merge into Grade 11 Further Sets. Grade 10 Coordinate Geometry feeds Grade 11 Analytic Geometry. Grade 10 Statistics and Probability merge into Grade 12 U7. Grade 11 Differential Calculus is the base for Grade 12 U2–U5. Grade 11 Sequences lead into Grade 12 U1." },
  bio: { n: "Biology", c: "#22c55e", g: {
    9: S("U1 Intro to Biology|U2 Cells|U3 Human Biology & Health|U4 Environment & Ecology"),
    10: S("U1 Intro to Biology|U2 Conservation of Natural Resources|U3 Biochemical Molecules|U4 Cell Reproduction|U5 Human Biology|U6 Biological Interactions"),
    11: S("U1 Biology & Technology|U2 Animals & Animal Behavior|U3 Enzymes|U4 Genetics|U5 Human Body Systems|U6 Population & Natural Resources"),
    12: S("U1 Application of Biology|U2 Microorganisms|U3 Cellular Respiration & Photosynthesis|U4 Evolution|U5 Human Body Systems|U6 Climate Change") },
    ov: "Grade 9 Cells and Grade 10 Biochemical Molecules and Cell Reproduction support Grade 11 Enzymes and Genetics. Human Biology (G9, G10) merges into Human Body Systems (G11, G12). Ecology and Conservation lead into Population and Climate Change." },
};
export const ORDER = ["chem", "bio", "math", "phys"];
export const TAGS = ["Formula Error", "Misread Question", "Definition Gap", "Calculation Slip", "Concept Confusion"];
export const uid = (s, g, i) => `${s}-${g}-${i}`;
export const units = (s) => Object.entries(D[s].g).flatMap(([g, a]) => a.map((u, i) => ({ id: uid(s, g, i), g, u })));
export const today = () => new Date().toISOString().slice(0, 10);
export const fmt = (d) => d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

