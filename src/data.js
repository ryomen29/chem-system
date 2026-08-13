export const USER = {
  name: 'Christian',
  email: 'christian@chemsystem.edu',
  grade: 'Grade 11',
  subjects: ['Chemistry', 'Biology'],
  streak: 7,
}

export const MODULES = [
  { id:'atomic-structure', title:'Atomic Structure', subject:'Chemistry', description:'Explore the building blocks of matter — protons, neutrons, and electron orbitals.', difficulty:'Beginner', progress:85, lessons:6, hours:3 },
  { id:'chemical-reactions', title:'Chemical Reactions', subject:'Chemistry', description:'Discover how elements interact, transform, and create new substances through bonding.', difficulty:'Intermediate', progress:40, lessons:8, hours:4 },
  { id:'acids-bases', title:'Acids & Bases', subject:'Chemistry', description:'Understand pH scales, neutralization reactions, and everyday acid-base chemistry.', difficulty:'Intermediate', progress:20, lessons:7, hours:3.5 },
  { id:'dna-genetics', title:'DNA & Genetics', subject:'Biology', description:'Explore how DNA stores biological information and genes influence traits.', difficulty:'Intermediate', progress:62, lessons:8, hours:5 },
  { id:'cell-biology', title:'Cell Biology', subject:'Biology', description:'Journey inside the cell to understand organelles and membrane transport.', difficulty:'Beginner', progress:0, lessons:7, hours:4 },
  { id:'forces-motion', title:'Forces & Motion', subject:'Physics', description:"Investigate Newton's laws, friction, and how forces govern movement.", difficulty:'Intermediate', progress:15, lessons:9, hours:5 },
  { id:'energy', title:'Energy', subject:'Physics', description:'Understand kinetic and potential energy, conservation laws, and energy transformation.', difficulty:'Intermediate', progress:0, lessons:8, hours:4.5 },
  { id:'waves', title:'Waves', subject:'Physics', description:'Study wave behavior, sound, light, and the electromagnetic spectrum.', difficulty:'Advanced', progress:0, lessons:7, hours:4 },
]

export const LESSONS = [
 {id:'l1',title:'Introduction to Genetics',type:'reading',duration:15,completed:true},
 {id:'l2',title:'What is DNA?',type:'reading',duration:20,completed:true},
 {id:'l3',title:'Genes & Traits',type:'reading',duration:25,completed:true},
 {id:'l4',title:'Interactive Experiment',type:'simulation',duration:30,completed:false},
 {id:'l5',title:'Practice Problems',type:'reading',duration:20,completed:false},
 {id:'l6',title:'Final Quiz',type:'quiz',duration:25,completed:false},
]

export const QUIZ = [
 {id:1,question:'Which statement best describes a gene?',options:['A type of protein found in cell membranes','A segment of DNA containing biological information','A structure that holds chromosomes together','A molecule that carries oxygen in blood'],correct:1,explanation:'A gene is a segment of DNA that contains the instructions needed to produce a specific protein or carry out a biological function.'},
 {id:2,question:'What is the base pairing rule in DNA?',options:['Adenine pairs with Cytosine; Guanine pairs with Thymine','Adenine pairs with Thymine; Guanine pairs with Cytosine','Adenine pairs with Guanine; Thymine pairs with Cytosine','All bases pair equally with each other'],correct:1,explanation:'Adenine (A) always pairs with Thymine (T), and Guanine (G) always pairs with Cytosine (C). This complementary pairing ensures accurate DNA replication.'},
 {id:3,question:'What is the primary function of DNA?',options:['To produce energy for the cell','To transport oxygen through the body','To store genetic information and direct protein synthesis','To protect the nucleus from damage'],correct:2,explanation:'DNA stores the genetic blueprint and provides instructions for protein synthesis through transcription and translation.'},
 {id:4,question:'Where is DNA primarily found in eukaryotic cells?',options:['In the cell membrane','In the cytoplasm','In the nucleus','In the mitochondria only'],correct:2,explanation:'In eukaryotic cells, DNA is primarily found in the nucleus, organized into chromosomes. Small amounts also exist in mitochondria.'},
 {id:5,question:'What is a chromosome?',options:['A single strand of RNA','A tightly wound structure of DNA and histone proteins','A type of ribosome','An enzyme that replicates DNA'],correct:1,explanation:'A chromosome is tightly coiled DNA wrapped around histone proteins. Humans have 46 chromosomes in most cells.'},
]

export const ACTIVITY = [
 {id:'a1',type:'completed',title:'Atomic Structure',detail:'Lesson 5 completed',time:'20 min ago'},
 {id:'a2',type:'quiz',title:'Chemical Reactions',detail:'Quiz score: 82%',time:'2 hours ago'},
 {id:'a3',type:'simulation',title:'DNA Genetics Simulation',detail:'Completed',time:'Yesterday'},
 {id:'a4',type:'completed',title:'What is DNA?',detail:'Lesson 2 completed',time:'2 days ago'},
]

export const AI_INIT = [
 {id:'i0',role:'ai',content:"Hi! I'm your AI Tutor. I'm here to help you understand the concepts in your lessons. What would you like to know?",time:'10:28 AM'},
 {id:'i1',role:'user',content:'Why are genes important?',time:'10:29 AM'},
 {id:'i2',role:'ai',content:"Think of genes as instructions stored in DNA — like a recipe book for building proteins. They contain the information that determines biological characteristics and how cells function. Without genes, cells wouldn't know how to build proteins or carry out their specific roles.",time:'10:29 AM'},
]

export const AI_RESPONSES = [
 'Think of genes as instructions stored in DNA — like a recipe for building proteins. Each gene contains the blueprint for a specific biological function or trait.',
 'In DNA, Adenine (A) always pairs with Thymine (T), and Guanine (G) always pairs with Cytosine (C). This complementary base pairing ensures accurate DNA replication every time a cell divides.',
 'DNA is like a master blueprint stored in the nucleus. Genes are specific sections of that blueprint — each one containing instructions to build a particular protein.',
 'A mutation is a change in the DNA sequence. Some mutations have no effect, some are beneficial, and others can cause disease. They can be inherited or occur spontaneously during cell division.',
 'The double helix structure of DNA resembles a twisted ladder. The “rungs” are the base pairs (A-T and G-C), while the “sides” are the sugar-phosphate backbone.',
 'Transcription is when DNA is copied into mRNA, and translation is when that mRNA is used to build a protein at the ribosome. Together these make up gene expression.',
]
